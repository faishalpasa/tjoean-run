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
        speed: randomEnemy.speed * game.enemySpeedMultiplier,
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
    game.enemyInterval = 1024 * bossMultiplier
  } else if (game.level === 2) {
    game.enemyInterval = 512 * bossMultiplier
  } else if (game.level === 3) {
    game.enemyInterval = 256 * bossMultiplier
  } else if (game.level === 4) {
    game.enemyInterval = 128 * bossMultiplier
  } else if (game.level === 5) {
    game.enemyInterval = 64 * bossMultiplier
  } else if (game.level === 6) {
    game.enemyInterval = 32 * bossMultiplier
  } else if (game.level === 7) {
    game.enemyInterval = 16 * bossMultiplier
  } else if (game.level === 8) {
    game.enemyInterval = 8 * bossMultiplier
  } else if (game.level === 9) {
    game.enemyInterval = 4 * bossMultiplier
  } else if (game.level >= 10) {
    game.enemyInterval = 2 * bossMultiplier
  }

  return game
}

export const handleEnemySpeedMultiplier = (game) => {
  const bossMultiplier = game.isBossAppear ? 0.5 : 1

  if (game.level === 1) {
    game.enemySpeedMultiplier = 1 * bossMultiplier
  } else if (game.level === 2) {
    game.enemySpeedMultiplier = 1.5 * bossMultiplier
  } else if (game.level === 3) {
    game.enemySpeedMultiplier = 2 * bossMultiplier
  } else if (game.level === 4) {
    game.enemySpeedMultiplier = 2.5 * bossMultiplier
  } else if (game.level === 5) {
    game.enemySpeedMultiplier = 3 * bossMultiplier
  } else if (game.level === 6) {
    game.enemySpeedMultiplier = 3.5 * bossMultiplier
  } else if (game.level === 7) {
    game.enemySpeedMultiplier = 4 * bossMultiplier
  } else if (game.level === 8) {
    game.enemySpeedMultiplier = 4.5 * bossMultiplier
  } else if (game.level === 9) {
    game.enemySpeedMultiplier = 5 * bossMultiplier
  } else if (game.level >= 10) {
    game.enemySpeedMultiplier = 5.5 * bossMultiplier
  }

  return game
}