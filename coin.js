import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'

export class Coin {
  constructor(canvasContext, imageSrc, name, maxFrame = 9, additionalScore = 100, position = 'ground') {
    this.name = name ?? ''
    this.position = position
    this.coinPositionMultiply = 1
    if (this.position === 'ground') {
      this.coinPositionMultiply = 1
    } else if (this.position === 'mid') {
      this.coinPositionMultiply = 5
    } else if (this.position === 'fly') {
      this.coinPositionMultiply = 7
    }

    this.canvasContext = canvasContext
    const image = imageSrc || './assets/coins/coin1.png'
    this.height = 16
    this.width = 16
    this.coinWidth = this.width * 2
    this.coinHeight = this.height * 2
    this.initialCoinY = this.canvasContext.height - (this.coinHeight * this.coinPositionMultiply) - TILE_HEIGHT * TILE_MULTIPLIER
    this.x = this.canvasContext.width
    this.y = this.initialCoinY
    this.image = new Image()
    this.image.src = image
    this.frameX = 0
    this.maxFrame = maxFrame || 16  // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = 2
    this.isOutOufScreen = false
    this.additionalScore = additionalScore
  }

  draw(context) {
    // Start debug
    // context.strokeStyle = 'red'
    // context.strokeRect(this.x, this.y, this.coinWidth, this.coinHeight)
    // context.beginPath()
    // context.arc(this.x + this.coinHeight / 2, this.y + this.coinWidth / 2, this.coinWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // end debug

    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.coinWidth, this.coinHeight)
  }

  update(deltaTime) {
    if (this. frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0
      } else {
        this.frameX += 1
      }
      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }
    
    this.x -= this.speed
    if (this.x < 0 - this.width) {
      this.isOutOufScreen = true
    }
  }
}