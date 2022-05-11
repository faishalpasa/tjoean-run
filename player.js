export class Player {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.gameContext = null
    this.gameWidth = this.canvasContext.width
    this.gameHeight = this.canvasContext.height

    const image = './assets/characters/Adventurer.png'
    this.image = new Image()
    this.image.src = image
    this.srcWidth = 32
    this.srcHeight = 32
    this.playerWidth = this.srcWidth * 2
    this.playerHeight = this.srcHeight * 2
    this.x = 0
    this.y = this.canvasContext.height - this.playerHeight
    this.vy = 0

    this.weight = 1
    this.jumpHeight = 20
    this.speed = 0
    this.maxSpeed = 3
    this.state = 'idle'
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 12  // total number of frames in image sprites, start from 0
    this.frame = 0
    this.fps = 10
    this.frameTimer = 0
    this.frameInterval = 1000 / this.fps

    this.additionalScores = []
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.additionalScoreShowDuration = 500
  }

  draw(context) {
    this.gameContext = context
    this.gameContext.strokeStyle = 'red'
    this.gameContext.strokeRect(this.x, this.y, this.playerWidth, this.playerHeight)
    this.gameContext.beginPath()
    this.gameContext.arc(this.x + this.playerHeight / 2, this.y + this.playerWidth / 2, this.playerWidth / 2, 0, 2 * Math.PI)
    this.gameContext.stroke()
    this.gameContext.drawImage(this.image, this.frameX * this.srcWidth, this.frameY * this.srcHeight, this.srcWidth, this.srcHeight, this.x, this.y, this.playerWidth, this.playerHeight)
  }

  update(game, keyboards, deltaTime, fruits, enemies) {
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
    fruits.forEach((fruit) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const fruitCoordinateX = fruit.x + fruit.width / 2
      const fruitCoordinateY = fruit.y + fruit.height / 2
      const dx = fruitCoordinateX - playerCoordinateX
      const dy = fruitCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      this.gameContext.beginPath()
      this.gameContext.moveTo(playerCoordinateX, playerCoordinateY)
      this.gameContext.lineTo(fruitCoordinateX, fruitCoordinateY)
      this.gameContext.stroke();
      // end debugging

      if (distance < (this.playerWidth / 2) + (fruit.width / 2)) {
        fruit.isOutOufScreen = true
        this.isShowAdditionalScore = true
        this.additionalScores.push(fruit.additionalScore)
        game.score += fruit.additionalScore
      }
    })

    //collision with enemies
    enemies.forEach((enemy) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const enemyCoordinateX = enemy.x + enemy.width / 2
      const enemyCoordinateY = enemy.y + enemy.height / 2
      const dx = enemyCoordinateX - playerCoordinateX
      const dy = enemyCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      this.gameContext.beginPath()
      this.gameContext.moveTo(playerCoordinateX, playerCoordinateY)
      this.gameContext.lineTo(enemyCoordinateX, enemyCoordinateY)
      this.gameContext.strokeStyle = 'black'
      this.gameContext.stroke();
      // end debugging

      if (distance < (this.playerWidth / 2) + (enemy.width / 2)) {
        game.isGameOver = true
      }
    })


    this.handleAdditionalScore()
  } 

  restart () {
    this.x = 0
    this.y = this.canvasContext.height - this.playerHeight
    this.vy = 0
    this.maxFrame = 12
    this.frame = 0
    this.additionalScores = []
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
  }

  run(keyboards) {
    if (keyboards.includes('ArrowRight')) {
      this.speed = this.maxSpeed
      this.frameY = 1
      this.maxFrame = 7
    } else if (keyboards.includes('ArrowLeft')) {
      this.speed = -this.maxSpeed
      this.frameY = 1
      this.maxFrame = 7
    } else {
      this.speed = 0
      this.frameY = 0
      this.maxFrame = 12
    }

    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > this.gameWidth - this.srcWidth) {
      this.x = this.gameWidth - this.srcWidth
    }
  }

  jump(keyboards) {
    if ((keyboards.includes('ArrowUp')) && this.onGround()) {
      this.vy -= this.jumpHeight
    }
    this.y += this.vy

    if (!this.onGround()){
      this.vy += this.weight
      this.frameY = 5
      this.maxFrame = 5
    } 
    else {
      this.vy = 0
    }
  }

  onGround() {
    return this.y >= this.gameHeight - this.playerHeight
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
        this.gameContext.fillText(`+${score}`, this.x, this.y)
      }
    }
  }

  click(x, y) {
    const dx = x - this.x
    const dy = y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    console.log({ x, y })
    console.log({ playerX: this.x, playerY: this.y })
    console.log({ distance })

    if (distance < (this.srcWidth / 2)) {
      console.log('click player')
    } else {
      console.log('not click player')
    }
  }
}