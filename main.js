
import { Background } from './background.js'
import { Game } from './game.js'
import { KeyboardHandler } from './keyboard.js'
import { Player } from './player.js'
import { Tile } from './tile.js'
import { Health } from './health.js'
import { Boss } from './boss.js'
import { Keypad } from './keypad.js'
import { Sprite } from './sprite.js'
import { DASH, JUMP } from "./src/constants/action.js"
import { WIDTH, HEIGHT, TILE_HEIGHT, TILE_MULTIPLIER } from './src/constants/canvas.js'
import { isPotrait, isInsideRect, getFont, getRatioSize } from './src/utils/canvas.js'
import { getCanvasCoordinate, getDYMultiplier } from './src/utils/coordinate.js'

const ENEMY_INTERVAL = 2500
const BOSS_APPEAR_TIMER = 10000
const BOSS_DISAPPEAR_TIMER = 30000 // 60000
const LEVEL_UP_SCORE = 10000
const Y_POSITIONS = [
  { name: 'ground', dyMultipler: 1 },
  { name: 'mid', dyMultipler: 3 },
  { name: 'fly', dyMultipler: 5 }
]

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
  const player = new Player(ctx, game) 
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
  const coinPosition = Y_POSITIONS
  const handleShowCoins = (deltaTime) => {
    if (coinTimer > coinInterval + coinRandomInterval) {
      const randomCoin = coinList[Math.floor(Math.random() * coinList.length)]
      const randomCoinPosition = coinPosition[Math.floor(Math.random() * coinPosition.length)]
      const yPosition = randomCoin.position ? getDYMultiplier(randomCoin.position) : randomCoinPosition.dyMultipler
      const randomCoinSrc = `./assets/coins/${randomCoin.name}.png`
      coins.push(new Sprite(
        canvasContext,
        {
          image: {
            src: randomCoinSrc,
            sx: 0,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
            dx: canvasContext.width,
            dy: canvasContext.height - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER) - getRatioSize(32) * yPosition,
            dWidth: getRatioSize(32),
            dHeight: getRatioSize(32)
          },
          maxFrame: randomCoin.maxFrame,
          additionalScore: randomCoin.additionalScore,
          type: randomCoin.type,
          speed: 2
        }
      ))
      coinRandomInterval = Math.random() * 5000
      coinTimer = 0
    } else {
      coinTimer += deltaTime
    }
    coins.forEach((coin) => {
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
    { 
      name: 'heart2-shine', 
      maxFrame: 5, 
      additionalScore: 500, 
      type: 'health',
      sx: 0,
      sy: 0,
      sWidth: 16,
      sHeight: 16,
      dWidth: 32,
      dHeight: 32
    },
    { 
      name: 'neko', 
      maxFrame: 7, 
      additionalScore: 500, 
      type: 'companion',
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 32,
      dWidth: 64,
      dHeight: 64,
      position: 'ground'
    },
  ]
  const powerUpsPosition = Y_POSITIONS
  const handleShowPowerUps = (deltaTime) => {
    if (powerUpsTimer > powerUpsInterval + powerUpsnRandomInterval) {
      const randomPowerUp = powerUpsList[Math.floor(Math.random() * powerUpsList.length)]
      const randomPowerUpPosition = powerUpsPosition[Math.floor(Math.random() * powerUpsPosition.length)]
      const yPosition = randomPowerUp.position ? getDYMultiplier(randomPowerUp.position) : randomPowerUpPosition.dyMultipler
      const randomPowerUpSrc = `./assets/power_ups/${randomPowerUp.name}.png`
      powerUps.push(new Sprite(
        canvasContext,
        {
          image: {
            src: randomPowerUpSrc,
            sx: randomPowerUp.sx,
            sy: randomPowerUp.sy,
            sWidth: randomPowerUp.sWidth,
            sHeight: randomPowerUp.sHeight,
            dx: canvasContext.width,
            dy: canvasContext.height - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER) - getRatioSize(randomPowerUp.dHeight) * yPosition,
            dWidth: getRatioSize(randomPowerUp.dWidth),
            dHeight: getRatioSize(randomPowerUp.dHeight)
          },
          maxFrame: randomPowerUp.maxFrame,
          additionalScore: randomPowerUp.additionalScore,
          type: randomPowerUp.type,
          name: randomPowerUp.name,
          speed: 2
        }
      ))
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
      { name: 'mushroom-walk', maxFrame: 9, position: 'ground', speed: 3, },
      { name: 'ghost1_fly', maxFrame: 5, position: 'mid', speed: 5 },
      { name: 'ghost1_fly', maxFrame: 5, position: 'fly', speed: 7 },
    ]
    const bossEnemy = [
      { 
        name: 'lele', 
        maxFrame: 5, 
        speed: 7, 
        sWidth: 48, 
        sHeight: 48,
        dWidth: 64, 
        dHeight: 64,
      },
    ]
    const enemyList = game.isBossAppear ? bossEnemy : casualEnemy
    const enemyPosition = Y_POSITIONS
    if (enemyTimer > enemyInterval + enemyRandomInterval) {
      const randomEnemy = enemyList[Math.floor(Math.random() * enemyList.length)]
      const randomEnemyPosition = enemyPosition[Math.floor(Math.random() * enemyPosition.length)]
      const yPosition = randomEnemy.position ? getDYMultiplier(randomEnemy.position) : randomEnemyPosition.dyMultipler
      enemies.push(new Sprite(
        canvasContext,
        {
          image: {
            src: `./assets/enemies/${randomEnemy.name}.png`,
            sx: 0,
            sy: 0,
            sWidth: randomEnemy.sWidth || 16,
            sHeight: randomEnemy.sHeight || 16,
            dx: canvasContext.width,
            dy: canvasContext.height - getRatioSize(TILE_HEIGHT * TILE_MULTIPLIER) - getRatioSize(randomEnemy.dWidth || 32) * yPosition,
            dWidth: getRatioSize(randomEnemy.dWidth || 32),
            dHeight: getRatioSize(randomEnemy.dHeight || 32)
          },
          maxFrame: randomEnemy.maxFrame,
          additionalScore: 0,
          type: 'enemy',
          speed: randomEnemy.speed,
        }
      ))

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
    
    context.save()
    context.font = getFont(10)
    context.fillStyle = '#006E5A'
    context.fillText(`High Score: ${highScore}`, getRatioSize(10), getRatioSize(20))
    context.fillStyle = '#001E5E'
    context.fillText(`Score: ${game.score}`, getRatioSize(10), getRatioSize(35))
    context.restore()
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

    player.draw()
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

    keypad.draw()

    game.update()
    game.saveScore()
    if (game.isGameOver) {
      const buttonImage = new Image()
      buttonImage.src = './assets/gui/button-large-round.png'
      ctx.drawImage(buttonImage, buttonX, buttonY, buttonWidth, buttonHeight)
      ctx.save()
      ctx.textAlign = 'center'
      ctx.font = getFont(8)
      ctx.fillStyle = '#001E5E'
      ctx.fillText(`Game Over`, WIDTH / 2, HEIGHT / 2)
      ctx.fillText(`Score: ${game.score}`, WIDTH / 2, HEIGHT / 2 + getRatioSize(20))
      ctx.font = getFont(12)
      ctx.fillText(`Main Lagi`, WIDTH * 0.5, buttonY + getRatioSize(32))
      ctx.restore()

      setTimeout(() => {
        cancelAnimationFrame(startGameAnimation)
      },  500)
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
  const buttonY = (HEIGHT - boxHeight) / 2 + boxHeight - buttonHeight - getRatioSize(16)

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

    ctx.fillStyle = '#006E5A'
    ctx.textAlign = 'center'
    ctx.font = getFont(12)
    ctx.fillText(`Tjoean Run`, WIDTH * 0.5, boxY + getRatioSize(32))
    ctx.font = getFont(6)
    ctx.fillText(`Lari dan hindari para musuh`, WIDTH * 0.5, boxY + getRatioSize(64))
    ctx.fillText(`lalu kumpulkan koin untuk menambah`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 1))
    ctx.fillText(`poin agar lebih tjoean`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 2))
    ctx.fillText(``, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 3))
    ctx.fillText(`Dash untuk lari`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 4))
    ctx.fillText(`Jump untuk melompat`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 5))
    ctx.fillText(`Tap Jump 2x untuk melompat lebih tinggi 🎤🎼`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 6))
    ctx.fillText(``, WIDTH * 0.5, boxY + 64 + 16 * 7)
    ctx.fillText(`Gunakan mode landscape biar lebih enak`, WIDTH * 0.5, boxY + getRatioSize(64 + 16 * 8))

    ctx.font = getFont(12)
    ctx.fillText(`Gas Main`, WIDTH * 0.5, buttonY + getRatioSize(32))

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
      
      if (!game.isPlaying){
        game.isPlaying = true
        startGame(0)
      }

      if (game.isGameOver) {
        handleRestartGame()
      } 
    }
  });

  canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.changedTouches[0].clientX, e.changedTouches[0].clientY, rect.left, rect.top)

    if (keypad.clickLeftKeypad(x, y)) {
      if (!keyboard.keys.includes(DASH)) {
        keyboard.keys.push(DASH)
      }
    }

    if (keypad.clickRightKeypad(x, y)) {
      if (!keyboard.keys.includes(JUMP)) {
        keyboard.keys.push(JUMP)
      }
    }
  })

  canvas.addEventListener("touchend", (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.changedTouches[0].clientX, e.changedTouches[0].clientY, rect.left, rect.top)

    if (!keypad.clickRightKeypad(x, y)) {
      keyboard.keys = keyboard.keys.filter(key => key !== DASH)
    }
  })
  
  startMenu(0)
})