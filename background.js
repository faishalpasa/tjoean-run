export class Background {
  constructor(canvasContext, backgroundSrc, backgroundSpeed) {
    this.canvasContext = canvasContext
    const speed = backgroundSpeed || 1
    const imgSrc = backgroundSrc || './assets/backgrounds/background1.png'
    this.gameWidth = this.canvasContext.width
    this.gameHeight = this.canvasContext.height
    this.image = new Image()
    this.image.src = imgSrc
    this.x = 0
    this.y = 0
    this.isLandscape = this.canvasContext.width > this.canvasContext.height
    this.width = this.canvasContext.width
    this.height = this.canvasContext.height
    this.speed = speed
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
    context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
  }

  update (backgroundStackIndex, game) { 
    if (backgroundStackIndex === 0) {
      if (game.isBossAppear) {
        this.speed = 1
        this.image.src = './assets/backgrounds/background1-boss.png'
      } else {
        this.speed = 0.025
        this.image.src = './assets/backgrounds/background1.png'
      }
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