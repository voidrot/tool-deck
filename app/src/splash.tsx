import {invoke} from '@tauri-apps/api/core'
// import {BaseDirectory, mkdir} from '@tauri-apps/plugin-fs'
// import {warn, debug, trace, info, error, attachConsole, attachLogger} from '@tauri-apps/plugin-log'
function sleep(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
async function setup() {
  // Fake perform some really heavy setup task
  console.log('running setup tasks...')

  sleep(5)
  console.log('setup tasks complete!')
  // Set the frontend task as being completed
  invoke('set_complete', {task: 'frontend'})
}

window.addEventListener('DOMContentLoaded', () => {
  setup()
})
