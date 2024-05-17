import { HEIGHT, WIDTH } from './src/constants/canvas.js'
import { TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'
import { DASH, JUMP } from './src/constants/action.js'
import { getFont, getRatioSize } from './src/utils/canvas.js'

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
  constructor(context, game) {
    this.context = context
    this.gameContext = game
    this.gameWidth = WIDTH
    this.gameHeight = HEIGHT

    this.playerImage = new Image()
    this.playerImage.src = IMAGE_PLAYER
    this.srcWidth = 22
    this.srcHeight = 25

    this.effect = new Image()
    this.effect.src = IMAGE_EFFECT
    this.effectWidth = 16
    this.effectHeight = 16
    
    this.initialPlayerY = this.gameHeight - getRatioSize(this.srcHeight) + getRatioSize(8) - getRatioSize(TILE_HEIGHT) - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER)
    this.playerWidth = getRatioSize(this.srcWidth * 2)
    this.playerHeight = getRatioSize(this.srcHeight * 2)
    this.x = 0
    this.y = this.initialPlayerY
    this.vy = 0
    this.jumpCount = 0

    this.weight = 1
    this.jumpHeight = 13
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
    this.invincibleTimer = 0
    this.frameInterval = 1000 / this.fps

    this.additionalScores = 0
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.additionalScoreShowDuration = 500

    // Companion
    this.companion = null

    // PowerUp
    this.pointMultipler = 1
  }

  draw() {
    // start debugging
    // this.context.strokeStyle = 'red'
    // this.context.strokeRect(this.x, this.y, this.playerWidth, this.playerHeight)
    // this.context.beginPath()
    // this.context.arc(this.x + this.playerHeight / 2, this.y + this.playerWidth / 2, this.playerWidth / 2, 0, 2 * Math.PI)
    // this.context.stroke()
    // end debugging
    this.context.drawImage(this.playerImage, (this.startFrame + this.frameX) * this.srcWidth, this.frameY * this.srcHeight, this.srcWidth, this.srcHeight, this.x, this.y, this.playerWidth, this.playerHeight)

    // Run Effect
    this.context.drawImage(this.effect, (this.effectStartFrame + this.effectFrameX) * 16, 0, 16, 16, this.x - this.srcWidth / 2, this.y + this.playerHeight / 2, 16, 16)
    this.context.drawImage(this.effect, (this.effectStartFrame + 3 + this.effectFrameX) * 16, 0, 16, 16, this.x - this.srcWidth, this.y + this.playerHeight / 2, 16, 16)

    //  Companion
    if (this.gameContext.companion) {
      this.companion = this.gameContext.companion
      const frameYDiff = getRatioSize(0.5)
      if (this.companion.name === 'neko') {
        this.companion.sy = 6
        this.companion.maxFrame = 3
        this.pointMultipler = 2

        this.context.drawImage(this.companion.image, this.companion.sx * this.companion.sWidth, this.companion.sy * this.companion.sHeight - frameYDiff, this.companion.sWidth, this.companion.sHeight, this.x - this.playerWidth * 0.8, this.companion.dy, this.companion.dWidth, this.companion.dHeight)
      }
      

    }
  }

  // Action event

  animationIdle() {
    this.frameY = PLAYER_STATE.IDLE.frameY
    this.startFrame = PLAYER_STATE.IDLE.startFrame
    this.maxFrame = PLAYER_STATE.IDLE.maxFrame
    this.effectStartFrame = EFFECT_STATE.IDLE.startFrame
    this.effectMaxFrame = EFFECT_STATE.IDLE.maxFrame
  }

  animationRunRight() {
    this.frameY = PLAYER_STATE.RUN.frameY
    this.startFrame = PLAYER_STATE.RUN.startFrame
    this.maxFrame = PLAYER_STATE.RUN.maxFrame
    this.effectStartFrame = EFFECT_STATE.RUN.startFrame
    this.effectMaxFrame = EFFECT_STATE.RUN.maxFrame
  }

  animationRunLeft() {
    this.frameY = PLAYER_STATE.RUN.frameY
    this.startFrame = PLAYER_STATE.RUN.startFrame
    this.maxFrame = PLAYER_STATE.RUN.maxFrame
  }

  animationJump() {
    this.frameY = PLAYER_STATE.JUMP.frameY
    this.startFrame = PLAYER_STATE.JUMP.startFrame
    this.maxFrame = PLAYER_STATE.JUMP.maxFrame
  }

  animationColationWithEnemy() {
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

  update(game, keyboards, deltaTime, coins, enemies, powerUps) {
    this.x += this.speed
    this.run(keyboards)
    this.jump(keyboards)

    // animate
    if (this.frameTimer > this.frameInterval) {
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

      // companion
      if (this.companion) {
        if (this.companion.sx >= this.companion.maxFrame) {
          this.companion.sx = 0
        } else {
          this.companion.sx += 1
        }
      }

      this.frameTimer = 0
    } else {
      this.frameTimer += deltaTime
    }

    //collision with coin
    coins.forEach((coin) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const coinCoordinateX = coin.dx + coin.dWidth / 2
      const coinCoordinateY = coin.dy + coin.dHeight / 2
      const dx = coinCoordinateX - playerCoordinateX
      const dy = coinCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      // this.context.save()
      // this.context.beginPath()
      // this.context.moveTo(playerCoordinateX, playerCoordinateY)
      // this.context.lineTo(coinCoordinateX, coinCoordinateY)
      // this.context.stroke()
      // this.context.restore()
      // end debugging

      if (distance < (this.playerWidth / 2) + (coin.sWidth / 2)) {
        coin.isOutOufScreen = true
        this.isShowAdditionalScore = true
        this.additionalScores = coin.additionalScore

        console.log(this.pointMultipler)

        game.score += coin.additionalScore * this.pointMultipler
      }
    })

    //collision with powerUp
    powerUps.forEach((powerUp) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const coinCoordinateX = powerUp.dx + powerUp.dWidth / 2
      const coinCoordinateY = powerUp.dy + powerUp.dHeight / 2
      const dx = coinCoordinateX - playerCoordinateX
      const dy = coinCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      // this.context.beginPath()
      // this.context.moveTo(playerCoordinateX, playerCoordinateY)
      // this.context.lineTo(coinCoordinateX, coinCoordinateY)
      // this.context.stroke()
      // end debugging

      if (distance < (this.playerWidth / 2) + (powerUp.sWidth / 2)) {
        powerUp.isOutOufScreen = true
        this.isShowAdditionalScore = true
        this.additionalScores = powerUp.additionalScore
        game.score += powerUp.additionalScore
        
        if (powerUp.type === 'health') {
          game.health += 1
        }

        if (powerUp.type === 'companion') {
          game.companion = powerUp
        }
      }
    })

    this.invincibleTimer += deltaTime

    //collision with enemies
    enemies.forEach((enemy) => {
      const playerCoordinateX = this.x + this.playerWidth / 2
      const playerCoordinateY = this.y + this.playerHeight / 2
      const enemyCoordinateX = enemy.dx + enemy.dWidth / 2
      const enemyCoordinateY = enemy.dy + enemy.dHeight / 2
      const dx = enemyCoordinateX - playerCoordinateX
      const dy = enemyCoordinateY - playerCoordinateY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // start debugging
      // this.context.beginPath()
      // this.context.moveTo(playerCoordinateX, playerCoordinateY)
      // this.context.lineTo(enemyCoordinateX, enemyCoordinateY)
      // this.context.strokeStyle = 'black'
      // this.context.stroke()
      // end debugging

      if (distance < (this.playerWidth / 2) + (enemy.sWidth / 2)) {
        if (this.state !== 'enemy-colation') {
          this.state = 'enemy-colation'

          if (this.invincibleTimer > 500) {
            if (this.companion && this.companion.name === 'neko') {
              this.gameContext.companion = null
              this.companion = null
              this.pointMultipler = 1
              this.invincibleTimer = 0
            } else {
              game.health -= 1
              this.invincibleTimer = 0
            }
          }

          if (game.health < 1) {
            setTimeout(() => {
              game.isGameOver = true
            }, 100)
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
    this.xy = 0
    this.frame = 0
    this.additionalScores = 0
    this.isShowAdditionalScore = false
    this.additionalScoreTimeStamp = 0
    this.maxFrame = PLAYER_STATE.IDLE.maxFrame
  }

  run(action) {
    if (action.keys.includes(DASH)) {
      this.speed = this.maxSpeed

      if (this.state === 'enemy-colation') {
        this.animationColationWithEnemy()
      } else {
        this.animationRunRight()
      }
    }  else {
      this.speed = -this.maxSpeed

      if (this.state === 'enemy-colation') {
        this.animationColationWithEnemy()
      } else {
        this.animationIdle()
      }
    }

    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > this.gameWidth - this.srcWidth) {
      this.x = this.gameWidth - this.srcWidth
    }
  }

  jump(action) {
    if ((action.keys.includes(JUMP)) && this.jumpCount < 2) {
      action.keys = action.keys.filter(key => key !== JUMP)
      this.vy -= this.jumpHeight
      this.jumpCount += 1
    }
    
    this.y += this.vy
      
    if (!this.onGround()) {
      this.vy += this.weight

      if (this.state === 'enemy-colation') {
        this.animationColationWithEnemy()
      } else {
        this.animationJump()
      }
    } else {
      this.vy = 0
      this.jumpCount = 0
      this.y = this.initialPlayerY

      if (this.state === 'enemy-colation') {
        this.animationColationWithEnemy()
      } else {
        this.maxFrame = 3
      }
    }
  }

  onGround() {
    return this.y >= this.initialPlayerY
  }

  handleAdditionalScore = () => {
    this.context.save()
    this.context.font = getFont(10)
    this.context.fillStyle = this.pointMultipler > 1 ? '#E18608' : 'grey'
    if (this.isShowAdditionalScore) {
      if (this.additionalScoreTimeStamp > this.additionalScoreShowDuration) {
        this.additionalScores = 0
        this.isShowAdditionalScore = false
        this.additionalScoreTimeStamp = 0
      } else {
        this.additionalScoreTimeStamp += 10

        console.log(this.additionalScores)

        const score = this.additionalScores * this.pointMultipler
        const scoreText = score > 0 ? `+${score}` : `${score}`
        this.context.fillStyle = score > 0 ? this.context.fillStyle : 'red'
        this.context.fillText(`${scoreText}`, this.x, this.y)
      }
    }
    this.context.restore()
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