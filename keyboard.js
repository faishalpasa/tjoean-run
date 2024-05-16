import { DASH, JUMP, JUMP_HIGH } from "./src/constants/action.js"

export class KeyboardHandler {
  constructor() {
    this.keys = []

    // const jumpTotal = this.keys.filter(key => key === JUMP).length

    window.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowRight') && this.keys.indexOf(DASH) === -1) {
        this.keys.push(DASH)
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') {
        this.keys = this.keys.filter(key => key !== DASH)
      }

      if (e.key === 'ArrowUp') {
        if (!this.keys.includes(JUMP)) {
          this.keys.push(JUMP)
        } 
      }
    })
  }
}