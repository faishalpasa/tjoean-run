export class Game {
  constructor(canvasContext) {
    this.canvasContext = canvasContext
    this.score = 0
    this.isGameOver = false
    this.lastTime = 0
  }

  draw(context) {
    context.fillRect(20, 20, 150, 100)
  }

  update() {}

  restart () {
    this.score = 0
    this.isGameOver = false
    this.lastTime = 0
  }

  saveScore() {
    const getLatestScore = localStorage.getItem('tanisquad_run')
    if (this.score > getLatestScore) {
      localStorage.setItem('tanisquad_run', this.score)
    }
  }
}