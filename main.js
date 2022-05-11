
import { Background } from './background.js'
import { Enemy } from './enemy.js'
import { Fruit } from './fruit.js'
import { Game } from './game.js'
import { KeyboardHandler } from './keyboard.js'
import { Something } from './object.js'
import { Player } from './player.js'
import { WIDTH, HEIGHT } from './src/constants/canvas.js'
import { getCanvasCoordinate } from './src/utils/coordinate.js'

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const CANVAS_WIDTH = canvas.width = WIDTH
  const CANVAS_HEIGHT = canvas.height = HEIGHT

  const highScore = localStorage.getItem('tanisquad_run')

  const canvasContext = {
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH
  }
  
  const keyboard = new KeyboardHandler()
  const game = new Game(canvasContext)
  const backgroundStacks = [
    new Background(canvasContext, './assets/backgrounds/background1.png', 0.025),
    new Background(canvasContext, './assets/backgrounds/background2.png', 0.05),
    new Background(canvasContext, './assets/backgrounds/background3.png', 0.5),
    new Background(canvasContext, './assets/backgrounds/background4.png', 1),
  ]
  const player = new Player(canvasContext) 
  const fullscreenButton = new Something(ctx)

  let fruits = []
  let fruitTimer = 0
  let fruitInterval = 1000
  let fruitRandomInterval = Math.random() * 1000 + 1000
  const fruitList = ['Apple', 'Bananas', 'Cherries', 'Kiwi', 'Melon', 'Orange', 'Pineapple', 'Strawberry']
  const handleShowFruits = (deltaTime) => {
    if (fruitTimer > fruitInterval + fruitRandomInterval) {
      const randomFruit = fruitList[Math.floor(Math.random() * fruitList.length)]
      const randomFruitSrc = `./assets/fruits/${randomFruit}.png`
      fruits.push(new Fruit(canvasContext, randomFruitSrc, randomFruit))
      fruitRandomInterval = Math.random() * 1000 + 1000
      fruitTimer = 0
    } else {
      fruitTimer += deltaTime
    }
    fruits.forEach(fruit => {
      fruit.draw(ctx)
      fruit.update(deltaTime)
    })
    fruits = fruits.filter(fruit => !fruit.isOutOufScreen)
  }

  let enemies = []
  let enemyTimer = 0
  let enemyInterval = 1000
  let enemyRandomInterval = Math.random() * 1000 + 100
  const enemyList = ['ground', 'mid', 'fly']
  const handleShowEnemies = (deltaTime) => {
    if (enemyTimer > enemyInterval + enemyRandomInterval) {
      const randomEnemy = enemyList[Math.floor(Math.random() * enemyList.length)]
      enemies.push(new Enemy(canvasContext, randomEnemy))
      enemyRandomInterval = Math.random() * 1000 + 100
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

    backgroundStacks.forEach(backgroundStack => {
      backgroundStack.draw(ctx)
      backgroundStack.update()
    })
    fullscreenButton.draw()
    player.draw(ctx)
    player.update(game, keyboard, deltaTime, fruits, enemies)
    
    handleShowFruits(deltaTime)
    handleShowEnemies(deltaTime)
    handleStatus(ctx)

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
      fruits = []
      fruitTimer = 0
      enemies = []
      enemyTimer = 0
      animate(0) 
    }
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect()
    const { x, y } = getCanvasCoordinate(e.view.innerWidth, e.view.innerHeight, e.clientX, e.clientY, rect.left, rect.top)

    if (fullscreenButton.checkClick(x, y)) {
      // handleFullScreen()
      handleRestartGame()
    }
  })

  animate(0)
})