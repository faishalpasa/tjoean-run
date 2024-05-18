import CANVAS from "../constants/canvas.js"
import { POWER_UPS, POWER_UP_INTERVAL } from "../constants/powerUps.js"
import { Y_POSITIONS } from "../constants/game.js"
import { getRatioSize } from "../utils/canvas.js"
import { getDYMultiplier } from "../utils/coordinate.js"
import { Sprite } from "../../sprite.js"

let powerUpsTimer = 0
let powerUpsInterval = POWER_UP_INTERVAL
let powerUpsRandomInterval = 0
const powerUpsList = POWER_UPS
const powerUpsPosition = Y_POSITIONS

export const handleShowPowerUps = ({ canvasContext, deltaTime, powerUps }) => {
  if (powerUpsTimer > powerUpsInterval + powerUpsRandomInterval) {
    
    const randomPowerUp = powerUpsList[Math.floor(Math.random() * powerUpsList.length)]
    const randomPowerUpPosition = powerUpsPosition[Math.floor(Math.random() * powerUpsPosition.length)]
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
    powerUpsInterval = Math.random() * (POWER_UP_INTERVAL / 2) + POWER_UP_INTERVAL
    powerUpsTimer = 0
  } else {
    powerUpsTimer += deltaTime
  }

  powerUps.forEach((powerUp) => {
    powerUp.draw(canvasContext)
    powerUp.update(deltaTime)
  })
  powerUps = powerUps.filter((powerUp) => !powerUp.isOutOufScreen)
  
  return powerUps
}
