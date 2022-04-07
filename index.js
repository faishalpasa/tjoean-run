const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 800
const CANVAS_HEIGHT = canvas.height = 400
const SPRITE_WIDTH = 48
const SPRITE_HEIGTH = 49
const CHARACTER_WIDTH = SPRITE_WIDTH * 2
const CHARACTER_HEIGHT = SPRITE_HEIGTH * 2
const STAGGER_FRAME = 10

const characterImage = new Image()
characterImage.src = './assets/characters/man.png'

const keys = []
const characterAnimations = []
const characterImageStates = [
  {
    name: 'idle',
    maxFrames: 4,
  },
  {
    name: 'walk',
    maxFrames: 6,
  },
  {
    name: 'hit',
    maxFrames: 4,
  }
]

characterImageStates.map((state, index) => {
  let frames = {
    loc: []
  }
  for (let j = 0; j < state.maxFrames; j++) {
    frames.loc.push({
      x: j * SPRITE_WIDTH,
      y: index * SPRITE_HEIGTH
    })
  }
  characterAnimations[state.name] = frames
})

const player = {
  x: 100,
  y: CANVAS_HEIGHT / 3,
  width: CHARACTER_WIDTH,
  height: CHARACTER_HEIGHT,
  speed: 3,
  jumpHeight: 48,
  frame: 0,
  frameX: 0,
  frameY: 0,
  moving: false,
  jumping: false,
  state: 'idle'
}

const drawSprite = (imageSrc, sX, sY, sW, sH, dX, dY, dW, dH) => {
  ctx.drawImage(imageSrc, sX, sY, sW, sH, dX, dY, dW, dH)
}

const setCharacter = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  let position = Math.floor(player.frame / STAGGER_FRAME) % (characterAnimations[player.state].loc.length)
  player.frameX = position * SPRITE_WIDTH
  player.frameY = characterAnimations[player.state].loc[position].y
  player.frame += 1

  drawSprite(characterImage, player.frameX, player.frameY, SPRITE_WIDTH, SPRITE_HEIGTH, player.x, player.y, player.width, player.height)
}

const moveCharacter = () => {
  if (keys['ArrowUp'] && player.y > 0) {
    player.y -= player.speed
    player.state = 'walk'
  }
  if (keys['ArrowDown'] && player.y < CANVAS_HEIGHT - player.height) {
    player.y += player.speed
    player.state = 'walk'
  }
  if (keys['ArrowRight'] && player.x < CANVAS_WIDTH - SPRITE_WIDTH) {
    player.x += player.speed
    player.state = 'walk'
  }
  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed
    player.state = 'walk'
  }
}

window.addEventListener('keydown', (event) => {
  keys[event.code] = true
  player.moving = true
})

window.addEventListener('keyup', (event) => {
  delete keys[event.code]
  player.moving = false
  player.state = 'idle'
})

const startGame = () => {
  setCharacter()
  moveCharacter()

  requestAnimationFrame(startGame)
}

startGame()