export class Sprite {
  constructor(canvasContext, data = { 
    name: '',
    type: 'coin',
    maxFrame: 0,
    additionalScore: 100,
    speed: 1,
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
    this.name = data.name
    this.type = data.type
    this.canvasContext = canvasContext
    this.type = data.type
    this.image = new Image()
    this.image.src = data.image.src
    this.sx = data.image.sx
    this.sy = data.image.sy
    this.sWidth = data.image.sWidth 
    this.sHeight = data.image.sHeight 
    this.dx = data.image.dx
    this.dy = data.image.dy
    this.dWidth = data.image.dWidth
    this.dHeight = data.image.dHeight

    this.maxFrame = data.maxFrame
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps
    this.speed = data.speed
    this.isOutOufScreen = false
    this.additionalScore = data.additionalScore
  }

  draw(context) {
    // Start debug
    // context.save()
    // context.strokeStyle = 'black'
    // context.strokeRect(this.dx, this.dy, this.dWidth, this.dHeight)
    // context.beginPath()
    // context.arc(this.dx + this.dHeight / 2, this.dy + this.dWidth / 2, this.dWidth / 2, 0, 2 * Math.PI)
    // context.stroke()
    // context.restore()
    // end debug    

    context.drawImage(this.image, this.sx * this.sWidth, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)
  }

  update(deltaTime) {
    if (this. frameTimer > this.frameInterval) {
      if (this.sx >= this.maxFrame) {
        this.sx = 0
      } else {
        this.sx += 1
      }

      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }
    
    this.dx -= this.speed
    if (this.dx < 0 - this.dWidth) {
      this.isOutOufScreen = true
    }
  }
}