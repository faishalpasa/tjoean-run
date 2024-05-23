import { WIDTH, HEIGHT, TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'
import { getRatioSize } from './src/utils/canvas.js'
import { getCurrentBossLevel } from './src/utils/game.js'

export class Boss {
  constructor(gameContext, data = { 
    maxFrame: 0, 
    maxFrameX: 0,
    frameX: 0,
    frameY: 0,
    image: {
      src: '',
      sx: 0,
      sy: 0,
      sWidth: 16,
      sHeight: 16,
      dx: 0,
      dy: 0,
      dWidth: 16,
      dHeight: 16
    },
  }) {
    this.gameContext = gameContext
    
    // Position
    this.sx = data.image.sx
    this.sy = data.image.sy
    this.sHeight = data.image.sHeight
    this.sWidth = data.image.sWidth
    this.dHeight = getRatioSize(data.image.dHeight)
    this.dWidth = getRatioSize(data.image.dWidth)
    this.dx = WIDTH
    this.dy = HEIGHT - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER) - this.dHeight
    this.frameX = data.frameX
    this.maxFrameX = data.maxFrameX // total number of frames in image sprites, start from 0
    this.speed = 2
    this.move = 'left'

    // FPS
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    
    // Image
    this.imageBoss = `./assets/bosses/boss-${this.gameContext.level}.png`
    this.bossImage = new Image()
    this.bossImage.src = this.imageBoss
  }

  draw(context) {
    // start debugging
    // context.save()
    // context.strokeStyle = 'red'
    // context.strokeRect(this.dx, this.dy, this.dWidth, this.dHeight)
    // context.beginPath()
    // context.arc(this.dx + this.dHeight / 2, this.dy + this.dWidth / 2, this.dWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // context.restore()
    // end debugging
    // Image

    context.drawImage(this.bossImage, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)
  }

  update(game) {
    if (game.lastTime < 1) {
      this.dx = WIDTH
    }
    
    if (game.isBossAppear) {
      if (this.dx <= WIDTH - this.dWidth && this.move === 'left') {
        this.move = 'right'
      } 
      if (this.dx >= WIDTH - this.dWidth / 2 && this.move === 'right') {
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
      if (this.dx >= WIDTH) {
        this.dx = WIDTH
        this.bossImage.src = `./assets/bosses/boss-${getCurrentBossLevel(game.level)}.png`
      }
    }
  }
}