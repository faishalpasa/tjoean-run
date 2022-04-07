export class KeyboardHandler {
  constructor() {
    this.keys = []
    this.isSpacePressed = false
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp') && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key)
      }
    })
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp') {
        this.keys.splice(this.keys.indexOf(e.key), 1)
      }
    })
  }
}