
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
import { handleEnemySpeedMultiplier, handleEnemyInterval, handleShowEnemies } from './src/animations/enemy.js'
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

    
    // Debug Game
    const countTime = Math.round(timestamp % 1000)
    if(countTime < 10) {
      console.log(game)
    }

    game.update()
    game.saveScore()

    if (game.isGameOver) {
      const buttonImage = new Image()
      buttonImage.src = './assets/gui/button-large-round.png'
      ctx.drawImage(buttonImage, startMenuButtonX, startMenuButtonY, startMenuButtonWidth, startMenuButtonHeight)
      ctx.save()
      ctx.textAlign = 'center'
      ctx.font = getFont(8)
      ctx.fillStyle = '#001E5E'
      ctx.fillText(`Game Over`, WIDTH / 2, HEIGHT / 2)
      ctx.fillText(`Score: ${game.score}`, WIDTH / 2, HEIGHT / 2 + getRatioSize(20))
      ctx.font = getFont(12)
      ctx.fillText(`Main Lagi`, WIDTH * 0.5, startMenuButtonY + getRatioSize(32))
      ctx.restore()

      game.isBossAppear = false
      bossAppearTimer = 0
      bossDisapearTimer = 0
    }
    startGameAnimation = requestAnimationFrame(startGame)
  }

  // Start Menu
  const startMenuBoxWidth = isPotrait() ? WIDTH * 0.8 : HEIGHT * 0.8
  const startMenuBoxHeight = startMenuBoxWidth
  const startMenuBoxX = (WIDTH - startMenuBoxWidth) / 2
  const startMenuBoxY = (HEIGHT - startMenuBoxHeight) / 2

  const startMenuButtonWidth = startMenuBoxWidth * 0.5
  const startMenuButtonHeight = startMenuButtonWidth * 0.33
  const startMenuButtonX = (WIDTH - startMenuButtonWidth) * 0.5
  const startMenuButtonY = (HEIGHT - startMenuBoxHeight) / 2 + startMenuBoxHeight - startMenuButtonHeight - getRatioSize(16)

  let startMenuAnimation

  const startMenu = (timestamp) => {
    game.lastTime = timestamp

    if (!game.isPlaying) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
    }

    backgroundStacks.forEach((backgroundStack, idx) => {
      backgroundStack.draw(ctx, game)
      backgroundStack.update(idx, game)
    })

    const boxImage = new Image()
    boxImage.src = './assets/gui/start-menu.png'
    ctx.drawImage(boxImage, startMenuBoxX, startMenuBoxY, startMenuBoxWidth, startMenuBoxHeight)

    const buttonImage = new Image()
    buttonImage.src = './assets/gui/start-button.png'
    ctx.drawImage(buttonImage, startMenuButtonX, startMenuButtonY, startMenuButtonWidth, startMenuButtonHeight)

    startMenuAnimation = requestAnimationFrame(startMenu)
  }

  // Potrait Blocker
  const potraitBlockerBoxWidth = isPotrait() ? WIDTH * 0.8 : HEIGHT * 0.8
  const potraitBlockerBoxHeight = potraitBlockerBoxWidth
  const potraitBlockerBoxX = (WIDTH - potraitBlockerBoxWidth) / 2
  const potraitBlockerBoxY = (HEIGHT - potraitBlockerBoxHeight) / 2

  const potraitBlockerButtonWidth = potraitBlockerBoxWidth * 0.5
  const potraitBlockerButtonHeight = potraitBlockerButtonWidth * 0.33
  const potraitBlockerButtonX = (WIDTH - startMenuButtonWidth) * 0.5
  const potraitBlockerButtonY = (HEIGHT - startMenuBoxHeight) / 2 + startMenuBoxHeight - potraitBlockerButtonHeight - getRatioSize(16)

  let potraitBlockerAnimation

  const potraitBlocker = () => {
    const boxImage = new Image()
    boxImage.src = './assets/gui/potrait-blocker.png'
    ctx.drawImage(boxImage, potraitBlockerBoxX, potraitBlockerBoxY, potraitBlockerBoxWidth, potraitBlockerBoxHeight)

    const buttonImage = new Image()
    buttonImage.src = './assets/gui/continue-button.png'
    ctx.drawImage(buttonImage, potraitBlockerButtonX, potraitBlockerButtonY, potraitBlockerButtonWidth, potraitBlockerButtonHeight)

    potraitBlockerAnimation = requestAnimationFrame(potraitBlocker)
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
    player.restart()
    // startGame(0)
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

    if (!game.isPotraitBlokerShow) {
      if (isInsideRect({x, y}, { x: startMenuButtonX, y: startMenuButtonY, width: startMenuButtonWidth, height: startMenuButtonHeight })) {
        console.log(game)
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
    }

    if (game.isPotraitBlokerShow) {
      if (isInsideRect({x, y}, { x: potraitBlockerButtonX, y: potraitBlockerButtonY, width: potraitBlockerButtonWidth, height: potraitBlockerButtonHeight })) {
        cancelAnimationFrame(potraitBlockerAnimation)
        startMenu(0)
        game.isPotraitBlokerShow = false
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
  
  if (isPotrait()) {
    game.isPotraitBlokerShow = true
    potraitBlocker()
  } else {
    startMenu(0)
  }
})