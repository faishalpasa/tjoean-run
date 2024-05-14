import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'

export class Enemy {
  constructor(canvasContext, enemy) {
    this.canvasContext = canvasContext
    const image = `./assets/enemies/${enemy.name}.png`
    this.enemy = enemy.position ?? 'ground'
    this.enemyPositionMultiply = 1
    if (this.enemy === 'ground') {
      this.enemyPositionMultiply = 1
    } else if (this.enemy === 'mid') {
      this.enemyPositionMultiply = 3
    } else if (this.enemy === 'fly') {
      this.enemyPositionMultiply = 5
    }

    
    this.height = enemy.size ?? 16
    this.width = enemy.size ?? 16
    this.enemyHeight = this.height * 2
    this.enemyWidth = this.width * 2
    this.x = this.canvasContext.width
    this.y = this.canvasContext.height - (this.enemyHeight * this.enemyPositionMultiply) - TILE_HEIGHT * TILE_MULTIPLIER
    this.image = new Image()
    this.image.src = image
    this.frameX = 0
    this.maxFrame = enemy.maxFrame  // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = enemy.speed ?? 2
    this.isOutOufScreen = false
  }

  draw(context) {
    // start debug
    // context.strokeStyle = 'black'
    // context.strokeRect(this.x, this.y, this.enemyWidth, this.enemyHeight)
    // context.beginPath()
    // context.arc(this.x + this.enemyHeight / 2, this.y + this.enemyWidth / 2, this.enemyWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // end debug

    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.enemyWidth, this.enemyHeight)
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