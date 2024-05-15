export const isMobile = !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

export const WIDTH = isMobile ? window.innerWidth : 800
export const HEIGHT = isMobile ? window.innerHeight : 400

export const TILE_MULTIPLIER = 2
export const TILE_HEIGHT = 32
export const TILE_WIDTH = 32