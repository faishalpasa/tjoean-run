
import { Background } from './background.js'
import { Enemy } from './enemy.js'
import { Coin } from './coin.js'
import { Game } from './game.js'
import { KeyboardHandler } from './keyboard.js'
import { Something } from './object.js'
import { Player } from './player.js'
import { WIDTH, HEIGHT } from './src/constants/canvas.js'
import { getCanvasCoordinate } from './src/utils/coordinate.js'
import { Tile } from './tile.js'
import { Health } from './health.js'
import { Boss } from './boss.js'
import { Keypad } from './keypad.js'
import { isPotrait, isInsideRect } from './src/utils/canvas.js'

const ENEMY_INTERVAL = 2500
const BOSS_APPEAR_TIMER = 10000
const BOSS_DISAPPEAR_TIMER = 30000 // 60000
const LEVEL_UP_SCORE = 10000

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const CANVAS_WIDTH = canvas.width = WIDTH
  const CANVAS_HEIGHT = canvas.height = HEIGHT

  const highScore = localStorage.getItem('tjoean_run')

  const canvasContext = {
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH
  }
  
  const keyboard = new KeyboardHandler()
  const game = new Game(canvasContext)
  const tile = new Tile(canvasContext, game)
  const backgroundStacks = [
    new Background(canvasContext, './assets/backgrounds/background1.png', 0.025),
    new Background(canvasContext, './assets/backgrounds/background2.png', 0.05),
    new Background(canvasContext, './assets/backgrounds/background3.png', 0.5),
    new Background(canvasContext, './assets/backgrounds/background4.png', 1),
  ]
  const player = new Player(canvasContext) 
  const fullscreenButton = new Something(ctx)
  const health = new Health(canvasContext, game)
  const boss = new Boss(canvasContext, { name: 'boss-1', size: 160, maxFrame: 0, additionalScore: 1000, sizeMultipler: 1.5 })
  const keypad = new Keypad(ctx)

  let coins = []
  let coinTimer = 0
  let coinInterval = 1000
  let coinRandomInterval = Math.random() * 1000 + 1000
  const coinList = [
    { name: 'coin1', maxFrame: 9, additionalScore: 100, type: 'coin' },
    { name: 'coin2', maxFrame: 9, additionalScore: 50, type: 'coin' },
    { name: 'diamond', maxFrame: 4, additionalScore: 300, type: 'coin' }
  ]
  const coinPosition = ['ground', 'mid', 'fly']
  const handleShowCoins = (deltaTime) => {
    if (coinTimer > coinInterval + coinRandomInterval) {
      const randomCoin = coinList[Math.floor(Math.random() * coinList.length)]
      const randomCoinPosition = coinPosition[Math.floor(Math.random() * coinPosition.length)]
      const randomCoinSrc = `./assets/coins/${randomCoin.name}.png`
      coins.push(new Coin(canvasContext, randomCoin, randomCoinSrc, randomCoinPosition))
      coinRandomInterval = Math.random() * 5000
      coinTimer = 0
    } else {
      coinTimer += deltaTime
    }
    coins.forEach(coin => {
      coin.draw(ctx)
      coin.update(deltaTime)
    })
    coins = coins.filter(coin => !coin.isOutOufScreen)
  }

  let powerUps = []
  let powerUpsTimer = 0
  let powerUpsInterval = 20000
  let powerUpsnRandomInterval = Math.random() * 1000 + 1000
  const powerUpsList = [
    { name: 'heart2-shine', maxFrame: 5, additionalScore: 1000, type: 'health' },
  ]
  const powerUpsPosition = ['ground', 'mid', 'fly']
  const handleShowPowerUps = (deltaTime) => {
    if (powerUpsTimer > powerUpsInterval + powerUpsnRandomInterval) {
      const randomPowerUp = powerUpsList[Math.floor(Math.random() * powerUpsList.length)]
      const randomPowerUpPosition = powerUpsPosition[Math.floor(Math.random() * powerUpsPosition.length)]
      const randomPowerUpSrc = `./assets/power_ups/${randomPowerUp.name}.png`
      powerUps.push(new Coin(canvasContext, randomPowerUp, randomPowerUpSrc, randomPowerUpPosition))
      powerUpsInterval = Math.random() * 10000 + 20000
      powerUpsTimer = 0
    } else {
      powerUpsTimer += deltaTime
    }
    powerUps.forEach(powerUp => {
      powerUp.draw(ctx)
      powerUp.update(deltaTime)
    })
    powerUps = powerUps.filter(powerUp => !powerUp.isOutOufScreen)
  }

  let enemies = []
  let enemyTimer = 0
  let enemyInterval = game.enemyInterval
  let enemyRandomInterval = Math.random() * 1000 + 100
  
  const handleShowEnemies = (deltaTime) => {
    const casualEnemy = [
      // { name: 'spikes-1', maxFrame: 1, position: 'ground', speed: 1 },
      { name: 'mushroom-walk', maxFrame: 9, position: 'ground', speed: 3 },
      { name: 'ghost1_fly', maxFrame: 5, position: 'mid', speed: 5 },
      { name: 'ghost1_fly', maxFrame: 5, position: 'fly', speed: 7 },
    ]
    const bossEnemy = [
      { name: 'lele', maxFrame: 5, position: 'ground', speed: 7, size: 48, sizeMultipler: 2 },
      { name: 'lele', maxFrame: 5, position: 'mid', speed: 9, size: 48, sizeMultipler: 2  },
    ]
    const enemyList = game.isBossAppear ? bossEnemy : casualEnemy

    if (enemyTimer > enemyInterval + enemyRandomInterval) {
      const randomEnemy = enemyList[Math.floor(Math.random() * enemyList.length)]
      enemies.push(new Enemy(canvasContext, randomEnemy))

      enemyInterval = game.enemyInterval
      enemyRandomInterval = Math.random() * game.enemyInterval + 100
      enemyTimer = 0
    } else {
      enemyTimer += deltaTime
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx)
      enemy.update(deltaTime)
    })
    enemies = enemies.filter(enemy => !enemy.isOutOufScreen)
  }

  const handleEnemyInterval = () => {
    const bossMultiplier = game.isBossAppear ? 0.5 : 1
    
    if (game.score < ENEMY_INTERVAL * 1) {
      game.enemyInterval = 1000 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 2) {
      game.enemyInterval = 800 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 3) {
      game.enemyInterval = 600 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 4) {
      game.enemyInterval = 400 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 5) {
      game.enemyInterval = 200 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 6) {
      game.enemyInterval = 100 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 7) {
      game.enemyInterval = 50 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 8) {
      game.enemyInterval = 25 * bossMultiplier
    } else if (game.score < ENEMY_INTERVAL * 9) {
      game.enemyInterval = 10 * bossMultiplier
    } else if (game.score > ENEMY_INTERVAL * 10) {
      game.enemyInterval = 5 * bossMultiplier
    }
  }

  const handleLevelUp = () => {
    if (game.score > LEVEL_UP_SCORE * game.level) {
      game.level = game.level + 1
      game.enemyInterval = 1000
    }
  }

  let bossAppearTimer = 0
  let bossDisapearTimer = 0
  const handleBossApear = (deltaTime) => {
    if (bossDisapearTimer > BOSS_DISAPPEAR_TIMER) {
      game.isBossAppear = true
      bossAppearTimer += deltaTime
      if (bossAppearTimer > BOSS_APPEAR_TIMER) {
        game.isBossAppear = false
        bossAppearTimer = 0
        bossDisapearTimer = 0
      }
    } else {
      bossDisapearTimer += deltaTime
    }
  }

  const handleStatus = (context) => {
    game.score = game.score += 1
    
    // context.save()
    context.font = '10px "Press Start 2P"'
    context.fillStyle = '#006E5A'
    context.fillText(`High Score: ${highScore}`, 10, 20)
    context.fillStyle = '#001E5E'
    context.fillText(`Score: ${game.score}`, 10, 35)
    // context.restore()
  }

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(err => {
        console.log(err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Start Game
  let startGameAnimation

  const startGame = (timestamp) => {
    const deltaTime = timestamp - game.lastTime
    
    if (deltaTime < 1) {
      game.restart()
      player.restart()
    }
    
    game.lastTime = timestamp

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    
    backgroundStacks.forEach((backgroundStack, idx) => {
      backgroundStack.draw(ctx, game)
      backgroundStack.update(idx, game)
    })

    // fullscreenButton.draw()

    player.draw(ctx)
    player.update(game, keyboard, deltaTime, coins, enemies, powerUps)

    tile.draw(ctx)
    tile.update()

    health.draw(ctx)
    health.update(deltaTime)
    
    handleShowCoins(deltaTime)
    handleShowEnemies(deltaTime)
    handleShowPowerUps(deltaTime)
    handleStatus(ctx)

    boss.draw(ctx)
    boss.update(game)

    handleLevelUp()
    handleBossApear(deltaTime)
    handleEnemyInterval()

    keypad.draw(ctx)

    game.update()
    game.saveScore()
    if (game.isGameOver) {
      cancelAnimationFrame(startGameAnimation)
      startMenu(0)
    } else {
      startGameAnimation = requestAnimationFrame(startGame)
    }
  }

  // Start Menu
  const boxWidth = isPotrait() ? WIDTH * 0.8 : HEIGHT * 0.8
  const boxHeight = boxWidth
  const boxX = (WIDTH - boxWidth) / 2
  const boxY = (HEIGHT - boxHeight) / 2

  const buttonWidth = boxWidth * 0.5
  const buttonHeight = buttonWidth * 0.33
  const buttonX = (WIDTH - buttonWidth) * 0.5
  const buttonY = (HEIGHT - boxHeight) / 2 + boxHeight - buttonHeight - 16

  let startMenuAnimation

  const startMenu = (timestamp) => {
    const deltaTime = timestamp - game.lastTime
    game.lastTime = timestamp

    if (!game.isPlaying) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
    }

    backgroundStacks.forEach((backgroundStack, idx) => {
      backgroundStack.draw(ctx, game)
      backgroundStack.update(idx, game)
    })

    const boxImage = new Image()

    boxImage.src = './assets/gui/box.png'
    ctx.drawImage(boxImage, boxX, boxY, boxWidth, boxHeight)

    const buttonImage = new Image()
    buttonImage.src = './assets/gui/button-large-round.png'
    ctx.drawImage(buttonImage, buttonX, buttonY, buttonWidth, buttonHeight)

    ctx.save()
    if (game.isGameOver && game.isPlaying) {
      ctx.textAlign = 'center'
      ctx.fillText(`Game Over`, WIDTH / 2, HEIGHT / 2)
      ctx.fillText(`Score: ${game.score}`, WIDTH / 2, HEIGHT / 2 + 20)

      ctx.font = '12px "Press Start 2P"'
      ctx.fillText(`Main Lagi`, WIDTH * 0.5, buttonY + 32)
    } else {
      ctx.fillStyle = '#006E5A'
      ctx.textAlign = 'center'
      ctx.font = '12px "Press Start 2P"'
      ctx.fillText(`Tjoean Run`, WIDTH * 0.5, boxY + 32)
      ctx.font = '8px "Press Start 2P"'
      ctx.fillText(`Gunakan mode landscape`, WIDTH * 0.5, boxY + 64)
      ctx.fillText(`biar lebih enak.`, WIDTH * 0.5, boxY + 64 + 16)
  
      ctx.font = '12px "Press Start 2P"'
      ctx.fillText(`Gas Main`, WIDTH * 0.5, buttonY + 32)
    }
    ctx.restore()

    startMenuAnimation = requestAnimationFrame(startMenu)
  }

  const handleRestartGame = () => {
    // if (game.isGameOver) {
    backgroundStacks.forEach(backgroundStack => {
      backgroundStack.restart()
    })
    coins = []
    coinTimer = 0
    enemies = []
    enemyTimer = 0
    bossAppearTimer = 0
    bossDisapearTimer = 0
    startGame(0)
    // }
  }

  const handleRequestFullScreen = () => {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen()
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen()
    }
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.clientX, e.clientY, rect.left, rect.top)
  
    if (isInsideRect({x, y}, { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight })) {
      handleRequestFullScreen()
      cancelAnimationFrame(startMenuAnimation)
      game.isPlaying = true

      if (game.isGameOver) {
        handleRestartGame()
      } else {
        startGame(0)
      }
    }
  });

  canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.changedTouches[0].clientX, e.changedTouches[0].clientY, rect.left, rect.top)

    if (keypad.clickLeftKeypad(x, y)) {
      if (keyboard.keys.indexOf('ArrowRight') === -1) {
        keyboard.keys.push('ArrowRight')
      }
    }

    if (keypad.clickRightKeypad(x, y)) {
      if (keyboard.keys.indexOf('ArrowUp') === -1) {
        keyboard.keys.push('ArrowUp')
      }
      setTimeout(() => {
        keyboard.keys = keyboard.keys.filter(key => key !== 'ArrowUp')
      }, 100)
    }
  })

  // canvas.addEventListener("touchmove", (e) => {
  //   const rect = canvas.getBoundingClientRect()
  //   const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.changedTouches[0].clientX, e.changedTouches[0].clientY, rect.left, rect.top)

  //   if (keypad.clickLeftKeypad(x, y)) {
  //     if (keyboard.keys.indexOf('ArrowRight') === -1) {
  //       keyboard.keys.push('ArrowRight')
  //     }
  //   } else {
  //     keyboard.keys = keyboard.keys.filter(key => key !== 'ArrowRight')
  //   }
  // })

  canvas.addEventListener("touchend", (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.changedTouches[0].clientX, e.changedTouches[0].clientY, rect.left, rect.top)

    if (keypad.clickLeftKeypad(x, y)) {
      keyboard.keys = keyboard.keys.filter(key => key !== 'ArrowRight')
    }
  })
  
  // startGame(0)
  startMenu(0)
})