import { ENEMY_INTERVAL, ENEMY_SPEED_MULTIPLIER } from "./src/constants/enemy.js"

export class Game {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.score = 0
    this.health = 5
    this.totalHealth = 5
    this.isPotraitBlokerShow = false
    this.isPlaying = false
    this.isGameOver = false
    this.enemyInterval = ENEMY_INTERVAL
    this.enemySpeedMultiplier = ENEMY_SPEED_MULTIPLIER
    this.lastTime = 0
    this.level = 1

    // boss
    this.isBossAppear = false
    this.bossAppearTimer = 0
    this.bossDisappearTimer = 0

    // companion
    this.companion = null

    // ability
    this.ability = null
    this.abilityTimer = 0
  }

  draw(context) {
    context.fillRect(20, 20, 150, 100)
  }

  update() {}

  restart () {
    this.score = 0
    this.health = 5
    this.isGameOver = false
    this.lastTime = 0
    this.level = 1
    this.companionName = ''
    this.isBossAppear = false
    this.bossAppearTimer = 0
    this.bossDisappearTimer = 0
  }

  saveScore() {
    const getLatestScore = localStorage.getItem('tjoean_run')
    if (this.score > getLatestScore) {
      localStorage.setItem('tjoean_run', this.score)
    }
  }
}