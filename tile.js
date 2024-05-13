import { TILE_HEIGHT, TILE_WIDTH, TILE_MULTIPLIER } from './src/constants/canvas.js'

export class Tile {
  constructor(canvasContext, tileName = 'grass-tilemap-1') {
    this.canvasContext = canvasContext
    const imgSrc = `./assets/platform/${tileName}.png`
    this.image = new Image()
    this.image.src = imgSrc
    this.width = TILE_WIDTH
    this.height = TILE_HEIGHT
    this.tileWidth = this.width * TILE_MULTIPLIER
    this.tileHeight = this.height * TILE_MULTIPLIER
    this.x = 0
    this.y = this.canvasContext.height - this.height * 2
    this.speed = 1
  }

  draw(context) {
    const totalTile = Math.ceil(this.canvasContext.width / this.width)
    
    for (let i = 0; i < totalTile; i++) {
      context.drawImage(this.image, 8, 0, this.width, this.height, this.x + (this.width * i), this.y, this.tileWidth, this.tileHeight)
    }
  }

  update () { 
    this.x -= this.speed
    if (this.x < 0 - this.width) {
      this.x = 0
    }
  }

  restart() {
    this.x = 0
  }
}