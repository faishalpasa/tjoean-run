export class Player {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.gameWidth = this.canvasContext.width
    this.gameHeight = this.canvasContext.height
    this.width = 48
    this.height = 48
    this.x = 0
    this.y = this.canvasContext.height - this.height * 2
    this.vy = 0
    this.weight = 1
    this.jumpHeight = 13
    this.image = document.getElementById('character')
    this.speed = 0
    this.maxSpeed = 3
    this.state = 'idle'
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 3  // total number of frames in image sprites, start from 0
    this.frame = 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps

    this.additionalScores = []
    this.totalAdditionalScores = 0
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.additionalScoreShowDuration = 500
  }

  draw(context) {
    // context.strokeStyle = 'red'
    // context.strokeRect(this.x, this.y, this.width, this.height * 2)
    // context.beginPath()
    // context.arc(this.x + this.width / 2, this.y + this.height + this.height / 2, this.width / 2, 0, 2 * Math.PI)
    // context.stroke()
    this.gameContext = context
    this.gameContext.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width * 2, this.height * 2)
  }

  update(game, keyboards, deltaTime, fruits) {
    this.x += this.speed
    this.run(keyboards.keys)
    this.jump(keyboards.keys)

    // animate
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

    //collision with fruit
    fruits.forEach(fruit => {
      const dx = fruit.x - this.x
      const dy = fruit.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < fruit.width + this.width) {
        fruit.isOutOufScreen = true
        // game.isGameOver = true
        this.isShowAdditionalScore = true
        this.additionalScores.push(fruit.additionalScore)
        this.totalAdditionalScores += fruit.additionalScore
      }
    })

    this.handleAdditionalScore()
  } 

  run(keyboards) {
    if (keyboards.includes('ArrowRight')) {
      this.speed = this.maxSpeed
      this.frameY = 1
    } else if (keyboards.includes('ArrowLeft')) {
      this.speed = -this.maxSpeed
      this.frameY = 1
    } else {
      this.speed = 0
      this.frameY = 0 
    }

    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width
    }
  }

  jump(keyboards) {
    if (keyboards.includes('ArrowUp') && this.landing()) {
      this.vy -= this.jumpHeight
    }
    this.y += this.vy

    if (!this.landing()){
      this.vy += this.weight
    } 
    else {
      this.vy = 0
    }
  }

  landing() {
    return this.y >= this.gameHeight - this.height * 2
  }

  handleAdditionalScore = () => {
    this.gameContext.font = '10px "Press Start 2P"'
    this.gameContext.fillStyle = '#E18608'
    if (this.isShowAdditionalScore) {
      if (this.additionalScoreTimeStamp > this.additionalScoreShowDuration) {
        this.additionalScores.splice(0, 1)
        this.isShowAdditionalScore = false
        this.additionalScoreTimeStamp = 0
      } else {
        this.additionalScoreTimeStamp += 10

        const score = this.additionalScores[0]
        this.gameContext.fillText(`+${score}`, this.x + this.width / 3, this.y + this.height / 3)
      }
    }
  }
}