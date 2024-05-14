export class Health {
  constructor(canvasContext, game) {
    this.gameContext = game
    this.canvasContext = canvasContext
    const imageShine = './assets/coins/heart1-shine.png'
    const imageEmpty = './assets/coins/heart1-empty.png'
    this.height = 16
    this.width = 16
    this.x = this.canvasContext.width - 40
    this.y = 0
    this.heartHeight = this.height * 2
    this.heartWidth = this.width * 2
    this.heartImageShine = new Image()
    this.heartImageShine.src = imageShine
    this.heartImageEmpty = new Image()
    this.heartImageEmpty.src = imageEmpty
    this.frameX = 0
    this.maxFrame = 5  // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
  }

  draw(context) {
    const totalHealth = this.gameContext.totalHealth
    const currentHealth = this.gameContext.health

    for (let i = 0; i < totalHealth; i++) {
      const imageHeart = i < currentHealth ? this.heartImageShine : this.heartImageEmpty
      const imageFrameX = i < currentHealth  ? this.frameX * this.width : 0
      context.drawImage(imageHeart, imageFrameX, 0, this.width, this.height, this.x - (this.heartWidth - 8) * i, this.y, this.heartWidth, this.heartHeight)
    }
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
  }
}