import { ENEMY_INTERVAL, ENEMY_SPEED_MULTIPLIER } from "./src/constants/enemy.js"

export class Game {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.score = 0
    this.health = 5
    this.totalHealth = 5
    this.isPlaying = false
    this.isGameOver = false
    this.isBossAppear = false
    this.enemyInterval = ENEMY_INTERVAL
    this.enemySpeedMultiplier = ENEMY_SPEED_MULTIPLIER
    this.lastTime = 0
    this.level = 1

    // companion
    this.companion = null
  }

  draw(context) {
    context.fillRect(20, 20, 150, 100)
  }

  update() {}

  restart () {
    this.score = 0
    this.health = 5
    this.isGameOver = false
    this.isBossAppear = false
    this.lastTime = 0
    this.level = 1
    this.companionName = ''
  }

  saveScore() {
    const getLatestScore = localStorage.getItem('tjoean_run')
    if (this.score > getLatestScore) {
      localStorage.setItem('tjoean_run', this.score)
    }
  }
}