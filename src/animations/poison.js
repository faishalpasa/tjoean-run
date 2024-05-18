import CANVAS from "../constants/canvas.js"
import { POISONS, POISON_INTERVAL } from "../constants/poison.js"
import { Y_POSITIONS } from "../constants/game.js"
import { getRatioSize } from "../utils/canvas.js"
import { getDYMultiplier } from "../utils/coordinate.js"
import { Sprite } from "../../sprite.js"

let poisonTimer = 0
let poisonInterval = POISON_INTERVAL
let poisonRandomInterval = 0
const poisonsList = POISONS
const poisonPosition = Y_POSITIONS

export const handleShowPoisons = ({ canvasContext, deltaTime, poisons }) => {
  if (poisonTimer > poisonInterval + poisonRandomInterval) {
    const randomPoison = poisonsList[Math.floor(Math.random() * poisonsList.length)]
    const randomPoisonPosition = poisonPosition[Math.floor(Math.random() * poisonPosition.length)]
    const yPosition = randomPoison.position ? getDYMultiplier(randomPoison.position) : randomPoisonPosition.dyMultipler
    const randomPowerUpSrc = `./assets/poisons/${randomPoison.name}.png`
    poisons.push(new Sprite(
      {
        image: {
          src: randomPowerUpSrc,
          sx: randomPoison.sx,
          sy: randomPoison.sy,
          sWidth: randomPoison.sWidth,
          sHeight: randomPoison.sHeight,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomPoison.dHeight) * yPosition,
          dWidth: getRatioSize(randomPoison.dWidth),
          dHeight: getRatioSize(randomPoison.dHeight)
        },
        maxFrame: randomPoison.maxFrame,
        additionalScore: randomPoison.additionalScore,
        type: randomPoison.type,
        name: randomPoison.name,
        speed: 1
      }
    ))
    poisonInterval = Math.random() * (POISON_INTERVAL / 2) + POISON_INTERVAL
    poisonTimer = 0
  } else {
    poisonTimer += deltaTime
  }

  poisons.forEach((item) => {
    item.draw(canvasContext)
    item.update(deltaTime)
  })
  poisons = poisons.filter((item) => !item.isOutOufScreen)

  return poisons
}