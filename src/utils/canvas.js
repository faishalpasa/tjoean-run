export const isPotrait = () => {
  return window.innerWidth < window.innerHeight
}
export const isInsideRect = (pos = { x: 0, y: 0 }, rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}) => {
  return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}