import { TILE_HEIGHT, TILE_WIDTH, TILE_MULTIPLIER } from './src/constants/canvas.js'

export class Tile {
  constructor(canvasContext, game, tileName = 'grass-tilemap-1') {
    this.canvasContext = canvasContext
    this.gameContext = game
    this.tileName = tileName
    this.imgSrc = `./assets/platform/${this.tileName}.png`
    this.image = new Image()
    this.image.src = this.imgSrc
    this.width = TILE_WIDTH
    this.height = TILE_HEIGHT
    this.tileWidth = this.width * TILE_MULTIPLIER
    this.tileHeight = this.height * TILE_MULTIPLIER
    this.x = 0
    this.y = this.canvasContext.height - this.height * 2
    this.speed = 1
    this.tileList = []
  }


  draw(context) {
    const totalTile = Math.ceil(this.canvasContext.width / this.width)
    for (let i = 0; i < totalTile; i++) {
      context.drawImage(this.image, 8, 0, this.width, this.height, this.x + (this.width * i), this.y, this.tileWidth, this.tileHeight)
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
    if (this.x < 0 - this.width) {
      this.x = 0
    }
  }

  restart() {
    this.x = 0
  }
}