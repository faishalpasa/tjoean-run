import { WIDTH, HEIGHT } from './src/constants/canvas.js'
import { isPotrait } from './src/utils/canvas.js'

export class Keypad {
  constructor(context) {
    this.context = context
    this.width = isPotrait() ? 0.2 * WIDTH : 0.2 * HEIGHT
    this.height = this.width

    // this.width = 50
    // this.height = 50

    this.keypadRightX = WIDTH - this.width
    this.keypadRightY = HEIGHT - this.height

    this.keypadLeftX = 0
    this.keypadLeftY = HEIGHT - this.height
  }

  draw() {
    // Left Keypad
    this.context.save()
    this.context.strokeRect(this.keypadRightX, this.keypadRightY, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.keypadRightX + this.height / 2, this.keypadRightY + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()
    this.context.font = '8px "Press Start 2P"'
    this.context.fillText(`Dash`, WIDTH / 32, HEIGHT - this.height / 2 + 4)
    this.context.restore()

    // Right Keypad
    this.context.save()
    this.context.strokeRect(this.keypadLeftX, this.keypadLeftY, this.width, this.height)
    this.context.beginPath()
    this.context.arc(this.keypadLeftX + this.height / 2, this.keypadLeftY + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    this.context.stroke()
    this.context.font = '8px "Press Start 2P"'
    this.context.fillText(`Jump`, WIDTH - this.width + 8, HEIGHT - this.height / 2 + 4)
    this.context.restore()
  }

  update() {
  }

  clickRightKeypad(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.keypadRightX + this.width / 2) // square
    const dy = y - (this.keypadRightY + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      console.log('click right')
      return true
    } else {
      return false
    }
  }

  clickLeftKeypad(x, y) {
    // const dx = x - this.x // circle
    // const dy = y - this.y // circle
    const dx = x - (this.keypadLeftX + this.width / 2) // square
    const dy = y - (this.keypadLeftY + this.height / 2) // square
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < (this.width / 2)) { // if circle, remove 2
      console.log('click left')
      return true
    } else {
      return false
    }
  }
}