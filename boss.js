import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'

export class Boss {
  constructor(canvasContext, boss = { name: '', size: 16, maxFrame: 5, additionalScore: 1000, sizeMultipler: 1 }) {
    const imageBoss = `./assets/bosses/${boss.name}.png`
    this.canvasContext = canvasContext
    this.height = boss.size
    this.width = boss.size
    this.bossHeight = this.height * boss.sizeMultipler
    this.bossWidth = this.width * boss.sizeMultipler
    this.x = this.canvasContext.width
    this.y = this.canvasContext.height - TILE_HEIGHT * TILE_MULTIPLIER - this.bossHeight
    this.bossImage = new Image()
    this.bossImage.src = imageBoss
    this.frameX = 0
    this.maxFrame = 0 // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = 2
    this.move = 'left'
  }

  draw(context) {
    // start debugging
    // context.strokeStyle = 'red'
    // context.strokeRect(this.x, this.y, this.bossWidth, this.bossHeight)
    // context.beginPath()
    // context.arc(this.x + this.bossHeight / 2, this.y + this.bossWidth / 2, this.bossWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // end debugging
    context.drawImage(this.bossImage, 0, 0, this.width, this.height, this.x, this.y, this.bossWidth, this.bossHeight)
  }

  update(game) {
    if (game.lastTime < 1) {
      this.x = this.canvasContext.width
    }
    
    if (game.isBossAppear) {
      if (this.x === this.canvasContext.width - this.bossWidth && this.move === 'left') {
        this.move = 'right'
      } 
      if (this.x === this.canvasContext.width - this.bossWidth / 2 && this.move === 'right') {
        this.move = 'left'
      }

      if (this.move === 'left') {
        this.x -= this.speed
      } 
      if (this.move === 'right'){
        this.x += this.speed
      }
    } else {
      this.move = 'left'
      this.x += this.speed
      if (this.x >= this.canvasContext.width) {
        this.x = this.canvasContext.width
      }
    }
  }
}