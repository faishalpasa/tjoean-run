import { WIDTH, HEIGHT } from './src/constants/canvas.js'

export class Keypad {
  constructor(context) {
    this.context = context
    this.width = 50
    this.height = 50

    this.keypadRightX = WIDTH - this.width - 10
    this.keypadRightY = HEIGHT - this.height - 10

    this.keypadLeftX = WIDTH - this.width * 2 - this.width / 2 - 10
    this.keypadLeftY = HEIGHT - this.height - 10

    this.keypadUpX = WIDTH - this.width - this.width / 2  - 22
    this.keypadUpY = HEIGHT - this.height * 2 - 10
  }

  draw() {
    this.context.strokeRect(this.keypadRightX, this.keypadRightY, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.keypadRightX + this.height / 2, this.keypadRightY + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()

    this.context.strokeRect(this.keypadLeftX, this.keypadLeftY, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.keypadLeftX + this.height / 2, this.keypadLeftY + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()

    this.context.strokeRect(this.keypadUpX, this.keypadUpY, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.keypadUpX + this.height / 2, this.keypadUpY + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()
  }

  update() {
  }

  clickRight(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.keypadRightX + this.width / 2) // square
    const dy = y - (this.keypadRightY + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      return true
    } else {
      return false
    }
  }

  clickLeft(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.keypadLeftX + this.width / 2) // square
    const dy = y - (this.keypadLeftY + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      return true
    } else {
      return false
    }
  }

  clickUp(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.keypadUpX + this.width / 2) // square
    const dy = y - (this.keypadUpY + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      return true
    } else {
      return false
    }
  }
}