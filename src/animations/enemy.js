import CANVAS from "../constants/canvas.js"
import { 
  ENEMY_INTERVAL,
  CASUAL_ENEMIES,
} from "../constants/enemy.js"
import { BOSS_ENEMIES } from "../constants/boss.js"
import { Y_POSITIONS } from "../constants/game.js"
import { getRatioSize } from "../utils/canvas.js"
import { getDYMultiplier } from "../utils/coordinate.js"
import { Sprite } from "../../sprite.js"
import { getCurrentBossLevel } from "../utils/game.js"

let enemyTimer = 0
let enemyRandomInterval = Math.random() * 1000 + 100
let enemyInterval = ENEMY_INTERVAL

export const handleShowEnemies = ({ canvasContext, game, deltaTime, enemies }) => {
  const casualEnemy = CASUAL_ENEMIES
  const bossEnemy = [BOSS_ENEMIES[getCurrentBossLevel(game.level) - 1]]
  const enemyList = game.isBossAppear ? bossEnemy : casualEnemy

  const enemyPosition = Y_POSITIONS
  if (enemyTimer > enemyInterval + enemyRandomInterval) {
    const randomEnemy = enemyList[Math.floor(Math.random() * enemyList.length)]
    console.log(randomEnemy, game.level, getCurrentBossLevel(game.level) - 1)
    const randomEnemyPosition = enemyPosition[Math.floor(Math.random() * enemyPosition.length)]
    const yPosition = randomEnemy.position ? getDYMultiplier(randomEnemy.position) : randomEnemyPosition.dyMultipler
    enemies.push(new Sprite(
      {
        image: {
          src: `./assets/enemies/${randomEnemy.name}.png`,
          sx: 0,
          sy: 0,
          sWidth: randomEnemy.sWidth || 16,
          sHeight: randomEnemy.sHeight || 16,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomEnemy.dWidth || 32) * yPosition,
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
    enemyRandomInterval = Math.random() * ENEMY_INTERVAL + 100
    enemyTimer = 0
  } else {
    enemyTimer += deltaTime
  }

  enemies.forEach((enemy) => {
    enemy.draw(canvasContext)
    enemy.update(deltaTime)
  })

  enemies = enemies.filter((enemy) => !enemy.isOutOufScreen)

  return enemies
}

export const handleEnemyInterval = (game) => {
  const bossMultiplier = game.isBossAppear ? 0.5 : 1
  
  if (game.level === 1) {
    game.enemyInterval = 1000 * bossMultiplier
  } else if (game.level === 2) {
    game.enemyInterval = 800 * bossMultiplier
  } else if (game.level === 3) {
    game.enemyInterval = 600 * bossMultiplier
  } else if (game.level === 4) {
    game.enemyInterval = 400 * bossMultiplier
  } else if (game.level === 4) {
    game.enemyInterval = 200 * bossMultiplier
  } else if (game.level === 5) {
    game.enemyInterval = 100 * bossMultiplier
  } else if (game.level === 5) {
    game.enemyInterval = 80 * bossMultiplier
  } else if (game.level === 7) {
    game.enemyInterval = 50 * bossMultiplier
  } else if (game.level === 8) {
    game.enemyInterval = 25 * bossMultiplier
  } else if (game.level === 9) {
    game.enemyInterval = 10 * bossMultiplier
  } else if (game.level >= 10) {
    game.enemyInterval = 5 * bossMultiplier
  }

  return game
}