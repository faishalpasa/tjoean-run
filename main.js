
import { Background } from './background.js'
import { Game } from './game.js'
import { KeyboardHandler } from './keyboard.js'
import { Player } from './player.js'
import { Tile } from './tile.js'
import { Health } from './health.js'
import { Boss } from './boss.js'
import { Keypad } from './keypad.js'
import { DASH, JUMP } from './src/constants/action.js'
import { WIDTH, HEIGHT } from './src/constants/canvas.js'
import { BOSS_APPEAR_TIMER, BOSS_DISAPPEAR_TIMER, BOSS_MAX_LEVEL } from './src/constants/boss.js'
import { isPotrait, isInsideRect, getFont, getRatioSize } from './src/utils/canvas.js'
import { getCanvasCoordinate } from './src/utils/coordinate.js'
import { handleEnemyInterval, handleShowEnemies } from './src/animations/enemy.js'
import { handleShowCoins } from './src/animations/coin.js'
import { handleShowPowerUps } from './src/animations/powerUps.js'
import { handleShowPoisons } from './src/animations/poison.js'

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const CANVAS_WIDTH = canvas.width = WIDTH
  const CANVAS_HEIGHT = canvas.height = HEIGHT

  const highScore = localStorage.getItem('tjoean_run')

  const canvasContext = { // TODO: Deprecated, move to WIDTH and HEIGHT
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
  const health = new Health(game)
  const keypad = new Keypad(ctx)
  const boss = new Boss(game, { 
    maxFrame: 0,
    image: {
      sx: 0,
      sy: 0,
      sWidth: 72,
      sHeight: 72,
      dx: 0,
      dy: 0,
      dWidth: 160,
      dHeight: 160
    },
  })

  let coins = []
  let powerUps = []
  let poisons = []
  let enemies = []

  const handleLevelUp = () => {
    game.level = game.level + 1
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
        handleLevelUp()
      }
    } else {
      bossDisapearTimer += deltaTime
    }
  }

  const handleStatus = (context) => {
    if (!game.isGameOver) {
      game.score = game.score += 1
    }

    const boxImage = new Image()
    boxImage.src = './assets/gui/box.png'
    ctx.drawImage(boxImage, 0, 0, getRatioSize(200), getRatioSize(60))
    
    context.save()
    context.font = getFont(10)
    context.fillStyle = '#006E5A'
    context.fillText(`High Score: ${highScore}`, getRatioSize(10), getRatioSize(20))
    context.fillStyle = '#001E5E'
    context.fillText(`Level: ${game.level}`, getRatioSize(10), getRatioSize(35))
    context.fillText(`Score: ${game.score}`, getRatioSize(10), getRatioSize(50))
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

    if (!game.isGameOver) {
      player.draw()
      player.update(game, keyboard, deltaTime, { coins, enemies, powerUps, poisons })
    }

    tile.draw(ctx)
    tile.update()

    health.draw(ctx)
    health.update(deltaTime)
    
    coins = handleShowCoins({ canvasContext: ctx, deltaTime, coins })
    enemies = handleShowEnemies({ canvasContext: ctx, game, deltaTime, enemies })
    powerUps = handleShowPowerUps({ canvasContext: ctx, deltaTime, powerUps })
    poisons = handleShowPoisons({ canvasContext: ctx, deltaTime, poisons })


    boss.draw(ctx)
    boss.update(game)
    handleBossApear(deltaTime)

    handleStatus(ctx)
    handleEnemyInterval(game)

    if (!game.isGameOver) {
      keypad.draw()
    }

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

      game.isBossAppear = false
      bossAppearTimer = 0
      bossDisapearTimer = 0
    }
    startGameAnimation = requestAnimationFrame(startGame)
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
    backgroundStacks.forEach(backgroundStack => {
      backgroundStack.restart()
    })
    coins = []
    enemies = []
    powerUps = []
    poisons = []
    game.restart()
    startGame(0)
  }

  const handleRequestFullScreen = () => {
    // if (canvas.requestFullscreen) {
    //   canvas.requestFullscreen()
    // } else if (canvas.webkitRequestFullscreen) {
    //   canvas.webkitRequestFullscreen()
    // } else if (canvas.mozRequestFullScreen) {
    //   canvas.mozRequestFullScreen()
    // } else if (canvas.msRequestFullscreen) {
    //   canvas.msRequestFullscreen()
    // }
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