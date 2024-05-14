import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'

const IMAGE_PLAYER = './assets/characters/player.png'
const PLAYER_STATE = {
  IDLE: {
    frameX: 0,
    frameY: 0,
    startFrame: 4,
    maxFrame: 3,
  },
  RUN: {
    frameX: 0,
    frameY: 0,
    startFrame: 4,
    maxFrame: 3,
  },
  JUMP: {
    frameX: 0,
    frameY: 0,
    startFrame: 8,
    maxFrame: 3,
  },
  ENEMY_COLATION: {
    frameX: 0,
    frameY: 0,
    startFrame: 17,
    maxFrame: 1,
  }
}

const IMAGE_EFFECT = './assets/platform/dust_effect.png'
const EFFECT_STATE = {
  IDLE: {
    frameX: 0,
    frameY: 0,
    startFrame: -99,
    maxFrame: -99,
  },
  RUN: {
    frameX: 0,
    frameY: 0,
    startFrame: 0,
    maxFrame: 3,
  },
}

export class Player {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.gameContext = null
    this.gameWidth = this.canvasContext.width
    this.gameHeight = this.canvasContext.height

    this.player = new Image()
    this.player.src = IMAGE_PLAYER
    this.srcWidth = 22
    this.srcHeight = 25

    this.effect = new Image()
    this.effect.src = IMAGE_EFFECT
    this.effectWidth = 16
    this.effectHeight = 16
    
    this.initialPlayerY = this.canvasContext.height - this.srcHeight + 8 - TILE_HEIGHT - TILE_HEIGHT * TILE_MULTIPLIER
    this.playerWidth = this.srcWidth * 2
    this.playerHeight = this.srcHeight * 2
    this.x = 0
    this.y = this.initialPlayerY
    this.vy = 0

    this.weight = 1
    this.jumpHeight = 20
    this.speed = 0
    this.maxSpeed = 3
    this.state = 'idle'
    this.frameX = PLAYER_STATE.IDLE.frameX
    this.frameY = PLAYER_STATE.IDLE.frameY
    this.startFrame = PLAYER_STATE.IDLE.startFrame  // start number of frames in image sprites, start from 0
    this.maxFrame = PLAYER_STATE.IDLE.maxFrame  // total number of frames in image sprites, start from 0

    this.effectFrameX = EFFECT_STATE.IDLE.frameX
    this.effectStartFrame = EFFECT_STATE.IDLE.startFrame
    this.effectMaxFrame = EFFECT_STATE.IDLE.maxFrame

    this.frame = 0 // Not Used
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
    // start debugging
    // this.gameContext.strokeStyle = 'red'
    // this.gameContext.strokeRect(this.x, this.y, this.playerWidth, this.playerHeight)
    // this.gameContext.beginPath()
    // this.gameContext.arc(this.x + this.playerHeight / 2, this.y + this.playerWidth / 2, this.playerWidth / 2, 0, 2 * Math.PI)
    // this.gameContext.stroke()
    // end debugging
    this.gameContext.drawImage(this.player, (this.startFrame + this.frameX) * this.srcWidth, this.frameY * this.srcHeight, this.srcWidth, this.srcHeight, this.x, this.y, this.playerWidth, this.playerHeight)
    // Run Effect
    this.gameContext.drawImage(this.effect, (this.effectStartFrame + this.effectFrameX) * 16, 0, 16, 16, this.x - this.srcWidth / 2, this.y + this.playerHeight / 2, 16, 16)
    this.gameContext.drawImage(this.effect, (this.effectStartFrame + 3 + this.effectFrameX) * 16, 0, 16, 16, this.x - this.srcWidth, this.y + this.playerHeight / 2, 16, 16)
  }

  // Action event

  actionIdle() {
    this.frameY = PLAYER_STATE.IDLE.frameY
    this.startFrame = PLAYER_STATE.IDLE.startFrame
    this.maxFrame = PLAYER_STATE.IDLE.maxFrame
    this.effectStartFrame = EFFECT_STATE.IDLE.startFrame
    this.effectMaxFrame = EFFECT_STATE.IDLE.maxFrame
  }

  actionRunRight() {
    this.frameY = PLAYER_STATE.RUN.frameY
    this.startFrame = PLAYER_STATE.RUN.startFrame
    this.maxFrame = PLAYER_STATE.RUN.maxFrame
    this.effectStartFrame = EFFECT_STATE.RUN.startFrame
    this.effectMaxFrame = EFFECT_STATE.RUN.maxFrame
  }

  actionRunLeft() {
    this.frameY = PLAYER_STATE.RUN.frameY
    this.startFrame = PLAYER_STATE.RUN.startFrame
    this.maxFrame = PLAYER_STATE.RUN.maxFrame
  }

  actionJump() {
    this.frameY = PLAYER_STATE.JUMP.frameY
    this.startFrame = PLAYER_STATE.JUMP.startFrame
    this.maxFrame = PLAYER_STATE.JUMP.maxFrame
  }

  actionColationWithEnemy() {
    if (this.state === 'enemy-colation') {
      // game.health -= 1
      this.startFrame = 17
      this.maxFrame = 1

      setTimeout(() => {
        this.state = 'idle'
      }, 500)
    }
  }
  
  // End action event


  update(game, keyboards, deltaTime, coins, enemies) {
    this.x += this.speed
    this.run(keyboards.keys)
    this.jump(keyboards.keys)

    // animate
    if (this. frameTimer > this.frameInterval) {
      // player
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0
      } else {
        this.frameX += 1
      }

      // effect
      if (this.effectFrameX >= this.effectMaxFrame) {
        this.effectFrameX = 0
      } else {
        this.effectFrameX += 1
      }

      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }

    //collision with coin
    coins.forEach((coin) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const coinCoordinateX = coin.x + coin.coinWidth / 2
      const coinCoordinateY = coin.y + coin.coinHeight / 2
      const dx = coinCoordinateX - playerCoordinateX
      const dy = coinCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      // this.gameContext.beginPath()
      // this.gameContext.moveTo(playerCoordinateX, playerCoordinateY)
      // this.gameContext.lineTo(coinCoordinateX, coinCoordinateY)
      // this.gameContext.stroke()
      // end debugging

      if (distance < (this.playerWidth / 2) + (coin.width / 2)) {
        coin.isOutOufScreen = true
        this.isShowAdditionalScore = true
        this.additionalScores.push(coin.additionalScore)
        game.score += coin.additionalScore
      }
    })

    //collision with enemies
    enemies.forEach((enemy) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const enemyCoordinateX = enemy.x + enemy.enemyWidth / 2
      const enemyCoordinateY = enemy.y + enemy.enemyHeight / 2
      const dx = enemyCoordinateX - playerCoordinateX
      const dy = enemyCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      // this.gameContext.beginPath()
      // this.gameContext.moveTo(playerCoordinateX, playerCoordinateY)
      // this.gameContext.lineTo(enemyCoordinateX, enemyCoordinateY)
      // this.gameContext.strokeStyle = 'black'
      // this.gameContext.stroke()
      // end debugging

      if (distance < (this.playerWidth / 2) + (enemy.width / 2)) {
        if (this.state !== 'enemy-colation') {
          this.state = 'enemy-colation'
          game.health -= 1

          if (game.health < 1) {
            setTimeout(() => {
              game.isGameOver = true
            }, 250)
          }
        }
      }
    })

    this.handleAdditionalScore()
  } 

  restart () {
    this.x = 0
    this.y = this.initialPlayerY
    this.vy = 0
    this.frame = 0
    this.additionalScores = []
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.maxFrame = PLAYER_STATE.IDLE.maxFrame
  }

  run(keyboards) {
    if (keyboards.includes('ArrowRight')) {
      this.speed = this.maxSpeed

      if (this.state === 'enemy-colation') {
        this.actionColationWithEnemy()
      } else {
        this.actionRunRight()
      }
    } else if (keyboards.includes('ArrowLeft')) {
      this.speed = -this.maxSpeed

      if (this.state === 'enemy-colation') {
        this.actionColationWithEnemy()
      } else {
        this.actionRunLeft()
      }
    } else {
      this.speed = 0

      if (this.state === 'enemy-colation') {
        this.actionColationWithEnemy()
      } else {
        this.actionIdle()
      }
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
    if ((keyboards.includes('SwipeUp')) && this.onGround()) {
      this.vy -= this.jumpHeight
    }
    
    this.y += this.vy

    if (!this.onGround()){
      this.vy += this.weight
      if (this.state === 'enemy-colation') {
        this.actionColationWithEnemy()
      } else {
        this.actionJump()
      }
    } else {
      this.vy = 0
      if (this.state === 'enemy-colation') {
        this.actionColationWithEnemy()
      } else {
        this.maxFrame = 3
      }
    }
  }

  onGround() {
    return this.y >= this.initialPlayerY
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