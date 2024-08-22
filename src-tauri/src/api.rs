use std::{net::SocketAddr, path::PathBuf};
use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use axum_extra::TypedHeader;
use std::borrow::Cow;
use std::ops::ControlFlow;

//allows extracting the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use axum::extract::ws::CloseFrame;
//allows splitting the websocket stream into separate TX and RX branches
use futures::{sink::SinkExt, stream::StreamExt};
use log::info;

pub async fn start_api_server() {
    let server = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/ws", get(ws_handler));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:35400").await.unwrap();
    axum::serve(
        listener,
        server.into_make_service_with_connect_info::<SocketAddr>()
    )
        .await
        .unwrap();
}

/// The handler for the HTTP request (this gets called when the HTTP GET lands at the start
/// of websocket negotiation). After this completes, the actual switching from HTTP to
/// websocket protocol will occur.
/// This is the last point where we can extract TCP/IP metadata such as IP address of the client
/// as well as things from HTTP headers such as user-agent of the browser, etc.
async fn ws_handler(
    ws: WebSocketUpgrade,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    let user_agent = if let Some(TypedHeader(user_agent)) = user_agent {
        user_agent.to_string()
    } else {
        String::from("Unknown browser")
    };
    println!("`{user_agent}` at {addr} connected.");
    // finalize the upgrade process by returning upgrade callback.
    // we can customize the callback by sending additional info such as address.
    ws.on_upgrade(move |socket| handle_socket(socket, addr))
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr) {
    // send a ping (unsupported by some browsers) just to kick things off and get a response
    if socket.send(Message::Ping(vec![1, 2, 3])).await.is_ok() {
        println!("Pinged {who}...");
    } else {
        println!("Could not send ping {who}!");
        // no Error here since the only thing we can do is to close the connection.
        // If we cannot send messages, there is no way to salvage the state machine anyway.
        return;
    }

    // By splitting socket we can send and receive at the same time. In this example, we will send
    // unsolicited messages to a client based on some sort of server's internal event (i.e .timer).
    let (mut sender, mut receiver) = socket.split();

    let mut send_task = tokio::spawn(async move {
        // let n_msg = 20;
        // for i in 0..n_msg {
        //     // In case of any websocket error, we exit.
        //     if sender
        //         .send(Message::Text(format!("Server message {i} ...")))
        //         .await
        //         .is_err()
        //     {
        //         return i;
        //     }
        //
        //     tokio::time::sleep(std::time::Duration::from_millis(300)).await;
        // }
        //
        // println!("Sending close to {who}...");
        // if let Err(e) = sender
        //     .send(Message::Close(Some(CloseFrame {
        //         code: axum::extract::ws::close_code::NORMAL,
        //         reason: Cow::from("Goodbye"),
        //     })))
        //     .await
        // {
        //     println!("Could not send Close due to {e}, probably it is ok?");
        // }
        // n_msg
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            // print message and break if instructed to do so
            match msg {
                Message::Text(t) => {
                    println!(">>> {who} sent str: {t:?}");
                    sender.send(Message::Text(t)).await.expect("TODO: panic message");
                }
                Message::Binary(d) => {
                    println!(">>> {} sent {} bytes: {:?}", who, d.len(), d);
                    sender.send(Message::Binary(d)).await.expect("TODO: panic message");
                }
                Message::Close(c) => {
                    if let Some(cf) = c {
                        println!(
                            ">>> {} sent close with code {} and reason `{}`",
                            who, cf.code, cf.reason
                        );
                        sender.close().await.expect("TODO: panic message");
                    } else {
                        println!(">>> {who} somehow sent close message without CloseFrame");
                    }
                }

                Message::Pong(v) => {
                    println!(">>> {who} sent pong with {v:?}");
                }
                // You should never need to manually handle Message::Ping, as axum's websocket library
                // will do so for you automagically by replying with Pong and copying the v according to
                // spec. But if you need the contents of the pings you can see them here.
                Message::Ping(v) => {
                    println!(">>> {who} sent ping with {v:?}");
                    sender.send(Message::Pong(v)).await.expect("TODO: panic message");
                }
            }
        }
    });

    tokio::select! {
        rv_b = (&mut recv_task) => {
            match rv_b {
                Ok(b) => println!("Received {b:?} messages"),
                Err(b) => println!("Error receiving messages {b:?}")
            }
            send_task.abort();
        }
    }

    // returning from the handler closes the websocket connection
    println!("Websocket context {who} destroyed");
}
