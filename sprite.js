export class Sprite {
  constructor(canvasContext, data = { 
    name: '',
    type: 'coin',
    maxFrame: 0,
    frameX: 0,
    frameY: 0,
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

    // Effect
    this.effectImage = new Image()
    this.effectImage.src = './assets/effects/water.png'
    this.effect = {
      maxFrameX: 0,
      initialFrameX: 0, // ToDo: implement this on Sprite
      frameX: 0, // ToDo: implement this on Sprite
      frameY: 0, // ToDo: implement this on Sprite
      sx: 0, // ToDo: deprecated
      sy: 0, // ToDo: deprecated
      sWidth: 16,
      sHeight: 16,
      dx: 0,
      dy: 0,
      dWidth: this.dWidth,
      dHeight: this.dHeight,
    }

    if (this.type === 'coin') {
      this.effectImage.src = './assets/effects/green.png'
      this.effect.initialFrameX = 30
      this.effect.maxFrameX = 35
      this.effect.frameX = 30
      this.effect.frameY = 10
    } 
    if (this.type === 'health') {
      this.effectImage.src = './assets/effects/fire.png'
      this.effect.initialFrameX = 30
      this.effect.maxFrameX = 35
      this.effect.frameX = 30
      this.effect.frameY = 10
    }
    if (this.type === 'companion') {
      this.effectImage.src = './assets/effects/water.png'
      this.effect.initialFrameX = 30
      this.effect.maxFrameX = 35
      this.effect.frameX = 30
      this.effect.frameY = 10
    }
    if (this.type === 'poison') {
      this.effectImage.src = './assets/effects/green.png'
      this.effect.initialFrameX = 14
      this.effect.maxFrameX = 18
    }

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
    
    // Effect
    if (this.type !== 'enemy') {
      context.drawImage(this.effectImage, this.effect.frameX * this.effect.sWidth, this.effect.frameY * this.effect.sWidth, this.effect.sWidth, this.effect.sHeight, this.dx, this.dy, this.effect.dWidth, this.effect.dHeight)
    }

    // Sprite
    context.drawImage(this.image, this.sx * this.sWidth, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)
  }

  update(deltaTime) {
    if (this. frameTimer > this.frameInterval) {
      // Sprite
      if (this.sx >= this.maxFrame) {
        this.sx = 0
      } else {
        this.sx += 1
      }

      // Effect
      if (this.effect.frameX >= this.effect.maxFrameX ) {
        this.effect.frameX = this.effect.initialFrameX
      } else {
        this.effect.frameX += 1
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