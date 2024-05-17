import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'
import { getRatioSize } from './src/utils/canvas.js'

export class Boss {
  constructor(canvasContext, data = { 
    name: '', 
    size: 16, 
    maxFrame: 5, 
    additionalScore: 1000, 
    sizeMultipler: 1
  }) {
    this.canvasContext = canvasContext
    
    // Position
    this.sHeight = data.size
    this.sWidth = data.size
    this.sx = 0
    this.sy = 0
    this.dHeight = getRatioSize(this.sHeight * data.sizeMultipler)
    this.dWidth = getRatioSize(this.sWidth * data.sizeMultipler)
    this.dx = this.canvasContext.width
    this.dy = this.canvasContext.height - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER) - this.dHeight
    this.frameX = 0
    this.maxFrameX = 0 // total number of frames in image sprites, start from 0
    this.speed = 2
    this.move = 'left'

    // FPS
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    
    // Image
    const imageBoss = `./assets/bosses/${data.name}.png`
    this.bossImage = new Image()
    this.bossImage.src = imageBoss
  }

  draw(context) {
    // start debugging
    // context.strokeStyle = 'red'
    // context.strokeRect(this.dx, this.dy, this.dWidth, this.dHeight)
    // context.beginPath()
    // context.arc(this.dx + this.dHeight / 2, this.dy + this.dWidth / 2, this.dWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // end debugging
    context.drawImage(this.bossImage, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)
  }

  update(game) {
    if (game.lastTime < 1) {
      this.dx = this.canvasContext.width
    }
    
    if (game.isBossAppear) {
      if (this.dx <= this.canvasContext.width - this.dWidth && this.move === 'left') {
        this.move = 'right'
      } 
      if (this.dx >= this.canvasContext.width - this.dWidth / 2 && this.move === 'right') {
        this.move = 'left'
      }

      if (this.move === 'left') {
        this.dx -= this.speed
      } 
      if (this.move === 'right'){
        this.dx += this.speed
      }
    } else {
      this.move = 'left'
      this.dx += this.speed
      if (this.dx >= this.canvasContext.width) {
        this.dx = this.canvasContext.width
      }
    }
  }
}