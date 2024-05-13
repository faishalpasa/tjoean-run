export class KeyboardHandler {
  constructor() {
    this.keys = []
    this.isSpacePressed = false
    this.touchY = ''
    this.touchThreshold = 300
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'Enter') && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key)
      }
    })
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'Enter') {
        this.keys.splice(this.keys.indexOf(e.key), 1)
      }
    })
    window.addEventListener('touchstart', (e) => {
      const swipeDistance = e.changedTouches[0].pageY - this.touchY
      if (swipeDistance > this.touchThreshold && this.keys.indexOf('TouchStart') === -1) {
        this.keys.push('TouchStart')
      }
    })
    window.addEventListener('touchmove', (e) => {
      // const swipeDistance = e.changedTouches[0].pageY - this.touchY
      // if (swipeDistance < -this.touchThreshold && this.keys.indexOf('SwipeUp') === -1) {
      //   this.keys.push('SwipeUp')
      // }
      // else if (swipeDistance > this.touchThreshold && this.keys.indexOf('SwipeDown') === -1) {
      //   this.keys.push('SwipeDown')
      // }
    })
    window.addEventListener('touchend', (e) => {
      // console.log(this.keys)
      this.keys.splice(this.keys.indexOf('TouchMove'), 1)
    })
  }
}