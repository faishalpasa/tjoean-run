export const BOSS_APPEAR_TIMER = 10000 // 10000
export const BOSS_DISAPPEAR_TIMER = 60000 // 60000

export const BOSS_ENEMIES = [
  { 
    name: 'lele', 
    maxFrame: 5, 
    sWidth: 48, 
    sHeight: 48,
    dWidth: 64, 
    dHeight: 64,
    speed: 7,
  },
  {
    name: 'fire-bolt',
    maxFrame: 3,
    sWidth: 16, 
    sHeight: 16,
    dWidth: 40, 
    dHeight: 40,
    speed: 7,
  }
]

export const BOSS_MAX_LEVEL = BOSS_ENEMIES.length