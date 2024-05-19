import { WIDTH, HEIGHT } from './src/constants/canvas.js'
import { isPotrait, getFont, getRatioSize } from './src/utils/canvas.js'

export class Keypad {
  constructor(context) {
    this.context = context
    this.width = isPotrait() ? 0.25 * WIDTH : 0.25 * HEIGHT
    this.height = this.width

    this.keypadRightX = WIDTH - this.width
    this.keypadRightY = HEIGHT - this.height
    this.imageRight = new Image()
    this.imageRight.src = './assets/gui/jump-button.png'

    this.keypadLeftX = 0
    this.keypadLeftY = HEIGHT - this.height
    this.imageLeft = new Image()
    this.imageLeft.src = './assets/gui/dash-button.png'
  }

  draw() {
    // Left Keypad
    this.context.save()
    this.context.globalAlpha = 0.8
    this.context.drawImage(this.imageLeft, 0, HEIGHT - this.height * 0.8, this.width * 0.8, this.height * 0.8)
    this.context.restore()


    // Right Keypad
    this.context.save()
    this.context.globalAlpha = 0.8
    this.context.drawImage(this.imageRight, WIDTH - this.width * 0.8, HEIGHT - this.height * 0.8, this.width * 0.8, this.height * 0.8)
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
      return true
    } else {
      return false
    }
  }
}