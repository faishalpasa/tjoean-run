import { WIDTH, HEIGHT } from "../../src/constants/canvas.js"

export const getCanvasCoordinate = (clientWidth, clientHeight, clientX, clientY, rectLeft, rectTop) => {
  const canvasWidth = clientWidth - (2 * rectLeft)
  const canvasHeight = clientHeight - (2 * rectTop)
  const x = (clientX - rectLeft) * (WIDTH / canvasWidth)
  const y = (clientY - rectTop) * (HEIGHT / canvasHeight)
  return { x, y }
}

export const getDYMultiplier = (position = 'ground') => {
  let dYMultiplier = 1
  if (position === 'ground') {
    dYMultiplier = 1
  } else if (position === 'mid') {
    dYMultiplier = 3
  } else if (position === 'fly') {
    dYMultiplier = 5
  }
  return dYMultiplier
}
