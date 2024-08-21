import {invoke} from '@tauri-apps/api/core'

function sleep(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

async function setup() {
  // Fake perform some really heavy setup task
  console.log('Performing really heavy frontend setup task...')
  await sleep(3)
  console.log('Frontend setup task complete!')
  // Set the frontend task as being completed
  invoke('set_complete', {task: 'frontend'})
}

window.addEventListener('DOMContentLoaded', () => {
  setup()
})
