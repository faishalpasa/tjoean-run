import { TILE_HEIGHT, TILE_WIDTH, TILE_MULTIPLIER } from './src/constants/canvas.js'
import { getRatioSize } from "./src/utils/canvas.js"

export class Tile {
  constructor(canvasContext, game, tileName = 'grass-tilemap-1') {
    this.canvasContext = canvasContext
    this.gameContext = game

    // Position
    this.x = 0
    this.sx = 8
    this.sy = 0
    this.sWidth = TILE_WIDTH
    this.sHeight = TILE_HEIGHT
    this.dWidth = getRatioSize(this.sWidth * TILE_MULTIPLIER)
    this.dHeight = getRatioSize(this.sHeight * TILE_MULTIPLIER)
    this.dy = this.canvasContext.height - this.dHeight
    this.speed = 1
    this.tileList = []

    // Image
    this.tileName = tileName
    this.imgSrc = `./assets/platform/${this.tileName}.png`
    this.image = new Image()
    this.image.src = this.imgSrc
  }


  draw(context) {
    const totalTile = Math.ceil(this.canvasContext.width / this.dWidth) + 1
    
    for (let i = 0; i < totalTile; i++) {
      const dx = this.x + (this.dWidth * i)
      context.drawImage(this.image, this.sx, this.sy, this.sWidth, this.sHeight, dx, this.dy, this.dWidth, this.dHeight)
    }
  }

  update () { 
    if (this.gameContext.level === 2) {
      this.tileName = 'grass-tilemap-2'
      this.imgSrc = `./assets/platform/${this.tileName}.png`
      this.image = new Image()
      this.image.src = this.imgSrc
    } else if (this.gameContext.level >= 3) {
      this.tileName = 'grass-tilemap-3'
      this.imgSrc = `./assets/platform/${this.tileName}.png`
      this.image = new Image()
      this.image.src = this.imgSrc
    }


    this.x -= this.speed
    if (this.x < 0 - this.dWidth) {
      this.x = 0
    }
  }

  restart() {
    this.x = 0
  }
}