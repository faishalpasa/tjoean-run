import { isPotrait } from "../utils/canvas.js"

export const isMobile = !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

const tabletWidth = isPotrait() && window.innerWidth >= 800 ? 800 : window.innerWidth
const tabletHeight = isPotrait() && window.innerWidth >= 800 ? 400 : window.innerHeight
export const WIDTH = isMobile ? tabletWidth : 800
export const HEIGHT = isMobile ? tabletHeight : 400

export const TILE_MULTIPLIER = 3
export const TILE_HEIGHT = 32
export const TILE_WIDTH = 32