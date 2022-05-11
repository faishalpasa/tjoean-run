export class Enemy {
  constructor(canvasContext, type) {
    this.canvasContext = canvasContext
    const image = './assets/fruits/Apple.png'
    this.type = type ?? 'ground'
    this.enemyPositionMultiply = 1
    if (this.type === 'ground') {
      this.enemyPositionMultiply = 1
    } else if (this.type === 'mid') {
      this.enemyPositionMultiply = 3
    } else if (this.type === 'fly') {
      this.enemyPositionMultiply = 5
    }

    
    this.height = 32
    this.width = 32
    this.x = this.canvasContext.width
    this.y = this.canvasContext.height - this.height * this.enemyPositionMultiply
    this.image = new Image()
    this.image.src = image
    this.frameX = 0
    this.maxFrame = 16  // total number of frames in image sprites, start from 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = 5
    this.isOutOufScreen = false
  }

  draw(context) {
    context.strokeStyle = 'black'
    context.strokeRect(this.x, this.y, this.width, this.height)
    context.beginPath()
    context.arc(this.x + this.height / 2, this.y + this.width / 2, this.width / 2, 0, 2 * Math.PI)
    context.stroke()
    console.log(this.type)

    // context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
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