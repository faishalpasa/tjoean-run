export class Fruit {
  constructor(canvasContext, imageSrc) {
    this.canvasContext = canvasContext
    const image = imageSrc || './assets/fruits/Apple.png'
    this.height = 32
    this.width = 32
    this.x = this.canvasContext.width
    this.y = this.canvasContext.height - this.height
    this.image = new Image()
    this.image.src = image
    this.frameX = 0
    this.maxFrame = 0  // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = 2
    this.isOutOufScreen = false
    this.additionalScore = 100
  }

  draw(context) {
    // context.strokeStyle = 'red'
    // context.strokeRect(this.x, this.y, this.width, this.height)
    // context.beginPath()
    // context.arc(this.x + this.height / 2, this.y + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    // context.stroke()

    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
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