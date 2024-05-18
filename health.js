import { WIDTH, HEIGHT } from "./src/constants/canvas.js"
import { getRatioSize } from "./src/utils/canvas.js"

export class Health {
  constructor(game) {
    this.gameContext = game

    // Position
    this.x = WIDTH - getRatioSize(40)
    this.sWidth = 16
    this.sHeight = 16
    this.dy = 0
    this.dHeight = getRatioSize(this.sHeight * 2)
    this.dWidth = getRatioSize(this.sWidth * 2)
    this.initialFrameX = 0
    this.frameX = 0
    this.frameY = 0
    this.maxFrameX = 5  // total number of frames in image sprites, start from 0

    // Image
    const imageShine = './assets/coins/heart1-shine.png'
    const imageEmpty = './assets/coins/heart1-empty.png'
    const imageExtra = './assets/coins/heart2-shine.png'
    this.heartImageShine = new Image()
    this.heartImageShine.src = imageShine
    this.heartImageEmpty = new Image()
    this.heartImageEmpty.src = imageEmpty
    this.heartImageExtra = new Image()
    this.heartImageExtra.src = imageExtra

    // FPS
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
  }

  draw(context) {
    const totalHealth = this.gameContext.totalHealth
    const currentHealth = this.gameContext.health
    const extraHealth = currentHealth - totalHealth

    for (let i = 0; i < totalHealth; i++) {
      const imageHeart = i < currentHealth ? this.heartImageShine : this.heartImageEmpty
      const sx = i < currentHealth ? this.frameX * this.sWidth : 0
      const sy = this.frameY * this.sHeight
      const dx = this.x - (this.dWidth - getRatioSize(8)) * i
      context.drawImage(imageHeart, sx, sy, this.sWidth, this.sHeight, dx, this.dy, this.dWidth, this.dHeight)
    }

    if (extraHealth) {
      for (let i = 0; i < extraHealth; i++) {
        const sx = i < currentHealth ? this.frameX * this.sWidth : 0
        const sy = this.frameY * this.sHeight
        const dx = this.x - (totalHealth * (this.dWidth - getRatioSize(8))) - getRatioSize(4) - (this.dWidth - getRatioSize(2)) * i
        context.drawImage(this.heartImageExtra, sx, sy, this.sWidth, this.sHeight, dx, this.dy, this.dWidth, this.dHeight)
      }
    }
  }

  update(deltaTime) {
    if (this. frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrameX) {
        this.frameX = this.initialFrameX
      } else {
        this.frameX += 1
      }
      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }
  }
}