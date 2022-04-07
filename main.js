
import { Background } from './background.js'
import { Fruit } from './fruit.js'
import { Game } from './game.js'
import { KeyboardHandler } from './keyboard.js'
import { Player } from './player.js'

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas') 
  const ctx = canvas.getContext('2d')
  const CANVAS_WIDTH = canvas.width = 800
  const CANVAS_HEIGHT = canvas.height = 400

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

  let fruits = []
  let fruitTimer = 0
  let fruitInterval = 1000
  let randomInterval = Math.random() * 1000 + 1000

  const handleShowFruits = (deltaTime) => {
    if (fruitTimer > fruitInterval + randomInterval) {
      fruits.push(new Fruit(canvasContext))
      randomInterval = Math.random() * 1000 + 1000
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

  const handleStatus = (context) => {
    context.font = '10px "Press Start 2P"'
    context.fillStyle = '#006E5A'
    context.fillText(`High Score: ${highScore}`, 10, 20)
    context.fillStyle = '#001E5E'
    context.fillText(`Score: ${game.score}`, 10, 35)
    game.score = Math.ceil(game.lastTime / 100) + player.totalAdditionalScores
  }

  const animate = (timestamp) => {
    const deltaTime = timestamp - game.lastTime
    game.lastTime = timestamp

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    backgroundStacks.forEach(backgroundStack => {
      backgroundStack.draw(ctx)
      backgroundStack.update()
    })
    
    player.draw(ctx)
    player.update(game, keyboard, deltaTime, fruits)
    
    handleShowFruits(deltaTime)
    handleStatus(ctx)

    game.saveScore()
    if (!game.isGameOver) {
      requestAnimationFrame(animate)
    }
  }

  animate(0)
})