import { WIDTH, HEIGHT } from './src/constants/canvas.js'

export class Something {
  constructor(context) {
    this.context = context
    this.width = 50
    this.height = 50
    this.x = WIDTH - this.width - 10
    this.y = 10
  }

  draw() {
    this.context.strokeRect(this.x, this.y, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.x + this.height / 2, this.y + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()
  }

  update() {
  }

  checkClick(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.x + this.width / 2) // square
    const dy = y - (this.y + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      return true
    } else {
      return false
    }
  }
}