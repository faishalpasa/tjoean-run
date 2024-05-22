import CANVAS from "../constants/canvas.js"
import { 
  POWER_UP_CONSUMABLES,
  POWER_UP_CONSUMABLE_INTERVAL,
  POWER_UP_COMPANIONS,
  POWER_UP_COMPANION_INTERVAL,
  POWER_UP_ABILITIES,
  POWER_UP_ABILITY_INTERVAL,
  POWER_UP_ABILITY_DURATION
} from "../constants/powerUps.js"
import { Y_POSITIONS } from "../constants/game.js"
import { getRatioSize } from "../utils/canvas.js"
import { getDYMultiplier } from "../utils/coordinate.js"
import { Sprite } from "../../sprite.js"

let powerUpConsumableTimer = 0
let powerUpConsumableInterval = POWER_UP_CONSUMABLE_INTERVAL

let powerUpCompanionTimer = 0
let powerUpCompanionInterval = POWER_UP_COMPANION_INTERVAL

let powerUpAbilityTimer = 0
let powerUpAbilityInterval = POWER_UP_ABILITY_INTERVAL

export const handleShowPowerUps = ({ canvasContext, deltaTime, powerUps }) => {
  // Consumable Power Up
  if (powerUpConsumableTimer > powerUpConsumableInterval) {
    const randomPowerUp = POWER_UP_CONSUMABLES[Math.floor(Math.random() * POWER_UP_CONSUMABLES.length)]
    const randomPowerUpPosition = Y_POSITIONS[Math.floor(Math.random() * Y_POSITIONS.length)]
    const yPosition = randomPowerUp.position ? getDYMultiplier(randomPowerUp.position) : randomPowerUpPosition.dyMultipler
    const randomPowerUpSrc = `./assets/power_ups/${randomPowerUp.name}.png`
    powerUps.push(new Sprite(
      {
        image: {
          src: randomPowerUpSrc,
          sx: randomPowerUp.sx,
          sy: randomPowerUp.sy,
          sWidth: randomPowerUp.sWidth,
          sHeight: randomPowerUp.sHeight,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomPowerUp.dHeight) * yPosition,
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
    powerUpConsumableInterval = Math.random() * (POWER_UP_CONSUMABLE_INTERVAL / 2) + POWER_UP_CONSUMABLE_INTERVAL
    powerUpConsumableTimer = 0
  } else {
    powerUpConsumableTimer += deltaTime
  }

  // Companion Power Up
  if (powerUpCompanionTimer > powerUpCompanionInterval) {
    const randomPowerUp = POWER_UP_COMPANIONS[Math.floor(Math.random() * POWER_UP_COMPANIONS.length)]
    const randomPowerUpPosition = Y_POSITIONS[Math.floor(Math.random() * Y_POSITIONS.length)]
    const yPosition = randomPowerUp.position ? getDYMultiplier(randomPowerUp.position) : randomPowerUpPosition.dyMultipler
    const randomPowerUpSrc = `./assets/power_ups/${randomPowerUp.name}.png`
    powerUps.push(new Sprite(
      {
        image: {
          src: randomPowerUpSrc,
          sx: randomPowerUp.sx,
          sy: randomPowerUp.sy,
          sWidth: randomPowerUp.sWidth,
          sHeight: randomPowerUp.sHeight,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomPowerUp.dHeight) * yPosition,
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
    powerUpCompanionInterval = Math.random() * (POWER_UP_COMPANION_INTERVAL / 2) + POWER_UP_COMPANION_INTERVAL
    powerUpCompanionTimer = 0
  } else {
    powerUpCompanionTimer += deltaTime
  }

  // Ability Power Up
  if (powerUpAbilityTimer > powerUpAbilityInterval) {
    const randomPowerUp = POWER_UP_ABILITIES[Math.floor(Math.random() * POWER_UP_ABILITIES.length)]
    const randomPowerUpPosition = Y_POSITIONS[Math.floor(Math.random() * Y_POSITIONS.length)]
    const yPosition = randomPowerUp.position ? getDYMultiplier(randomPowerUp.position) : randomPowerUpPosition.dyMultipler
    const randomPowerUpSrc = `./assets/power_ups/${randomPowerUp.name}.png`
    powerUps.push(new Sprite(
      {
        image: {
          src: randomPowerUpSrc,
          sx: randomPowerUp.sx,
          sy: randomPowerUp.sy,
          sWidth: randomPowerUp.sWidth,
          sHeight: randomPowerUp.sHeight,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomPowerUp.dHeight) * yPosition,
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
    powerUpAbilityInterval = Math.random() * (POWER_UP_ABILITY_INTERVAL / 2) + POWER_UP_ABILITY_INTERVAL
    powerUpAbilityTimer = 0
  } else {
    powerUpAbilityTimer += deltaTime
  }
  

  powerUps.forEach((powerUp) => {
    powerUp.draw(canvasContext)
    powerUp.update(deltaTime)
  })
  powerUps = powerUps.filter((powerUp) => !powerUp.isOutOufScreen)
  
  return powerUps
}

export const handlePowerUpAbilityDuration = ({ game, deltaTime }) => {
  if (game.ability) {
    if (game.abilityTimer > POWER_UP_ABILITY_DURATION) {
      game.ability = null
      game.abilityTimer = 0
    } else {
      game.abilityTimer += deltaTime
    }
  } else {
    game.abilityTimer += deltaTime
  }
}

export const handleShowAbility = ({ canvasContext, game }) => {
  if (game.ability) {
    const abilityImage = game.ability.image
    const sx = game.ability.sx
    const sy = game.ability.sy
    const sWidth = game.ability.sWidth
    const sHeight = game.ability.sHeight
    const dx = CANVAS.WIDTH - getRatioSize(40)
    const dy = getRatioSize(40)
    const dWidth = getRatioSize(32)
    const dHeight = getRatioSize(32)
    
    canvasContext.drawImage(abilityImage, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  }
}