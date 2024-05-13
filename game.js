export class Game {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.score = 0
    this.health = 5
    this.totalHealth = 5
    this.isGameOver = false
    this.lastTime = 0
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
  }

  saveScore() {
    const getLatestScore = localStorage.getItem('tjoean_run')
    if (this.score > getLatestScore) {
      localStorage.setItem('tjoean_run', this.score)
    }
  }
}