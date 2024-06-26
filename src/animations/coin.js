import CANVAS from "../constants/canvas.js"
import { COINS, COIN_INTERVAL } from "../constants/coin.js"
import { Y_POSITIONS } from "../constants/game.js"
import { getRatioSize } from "../utils/canvas.js"
import { getDYMultiplier } from "../utils/coordinate.js"
import { Sprite } from "../../sprite.js"

let coinTimer = 0
let coinInterval = COIN_INTERVAL
let coinRandomInterval = 0
const coinList = COINS
const coinPosition = Y_POSITIONS

export const handleShowCoins = ({ canvasContext, deltaTime, coins, game }) => {
  if (game.ability?.name === 'power-up-r') {
    console.log('ada')
    coinInterval = COIN_INTERVAL * 0.1
    console.log(coinInterval)
  } else {
    coinInterval = COIN_INTERVAL
  }

  if (coinTimer > coinInterval + coinRandomInterval) {
    const randomDecimal = Math.random()
    const randomCoin = coinList.find((coin) => randomDecimal < coin.chanceMax && randomDecimal >= coin.chanceMin)
    const randomCoinPosition = coinPosition[Math.floor(Math.random() * coinPosition.length)]
    const yPosition = randomCoin.position ? getDYMultiplier(randomCoin.position) : randomCoinPosition.dyMultipler
    const randomCoinSrc = `./assets/coins/${randomCoin.name}.png`
    coins.push(new Sprite(
      {
        image: {
          src: randomCoinSrc,
          sx: randomCoin.sx,
          sy: randomCoin.sy,
          sWidth: randomCoin.sWidth,
          sHeight: randomCoin.sHeight,
          dx: CANVAS.WIDTH,
          dy: CANVAS.HEIGHT - getRatioSize(CANVAS.TILE_HEIGHT * CANVAS.TILE_MULTIPLIER) - getRatioSize(randomCoin.dHeight) * yPosition,
          dWidth: getRatioSize(randomCoin.dWidth),
          dHeight: getRatioSize(randomCoin.dHeight)
        },
        maxFrame: randomCoin.maxFrame,
        additionalScore: randomCoin.additionalScore,
        type: randomCoin.type,
        speed: 2
      }
    ))
    coinRandomInterval = Math.random() * (coinInterval / 2) + coinInterval
    coinTimer = 0
  } else {
    coinTimer += deltaTime
  }

  coins.forEach((coin) => {
    coin.draw(canvasContext)
    coin.update(deltaTime)
  })
  coins = coins.filter((coin) => !coin.isOutOufScreen)

  return coins
}
