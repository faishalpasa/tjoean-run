
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
    // if (game.score % BOSS_APPEAR_SCORE > BOSS_APPEAR_SCORE - 500) {
    //   console.log(game.isBossAppear, game.score % BOSS_APPEAR_SCORE, BOSS_APPEAR_SCORE - 500)
    //   game.isBossAppear = true
    // }

    if (bossDisapearTimer > BOSS_DISAPPEAR_TIMER) {
      game.isBossAppear = true
      // bossDisapearTimer = 0
      bossAppearTimer += deltaTime
      if (bossAppearTimer > BOSS_APPEAR_TIMER) {
        game.isBossAppear = false
        bossAppearTimer = 0
        bossDisapearTimer = 0
      }
    } else {
      bossDisapearTimer += deltaTime
    }
    console.log(bossDisapearTimer, bossAppearTimer)
  }

  const handleStatus = (context) => {
    game.score = game.score += 1
    context.font = '10px "Press Start 2P"'
    context.fillStyle = '#006E5A'
    context.fillText(`High Score: ${highScore}`, 10, 20)
    context.fillStyle = '#001E5E'
    context.fillText(`Score: ${game.score}`, 10, 35)

    if (game.isGameOver) {
      context.textAlign = 'center'
      context.fillText(`Game Over`, WIDTH / 2, HEIGHT / 2)
    }
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

  const animate = (timestamp) => {
    const deltaTime = timestamp - game.lastTime
    game.lastTime = timestamp

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
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

    game.update()
    game.saveScore()
    if (!game.isGameOver) {
      requestAnimationFrame(animate)
    }
  }

  const handleRestartGame = () => {
    game.score = 0
    console.log(game)
    if (game.isGameOver) {
      game.restart()
      player.restart()
      backgroundStacks.forEach(backgroundStack => {
        backgroundStack.restart()
      })
      coins = []
      coinTimer = 0
      enemies = []
      enemyTimer = 0
      animate(0) 
    }
  }

  // canvas.addEventListener('click', (e) => {
  //   const rect = canvas.getBoundingClientRect()
  //   const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.clientX, e.clientY, rect.left, rect.top)

  //   if (fullscreenButton.checkClick(x, y)) {
  //     // handleFullScreen()
  //     handleRestartGame()
  //   }
  // })

  animate(0)
})