export class KeyboardHandler {
  constructor() {
    this.keys = []
    this.isSpacePressed = false
    this.touchY = ''
    this.touchUpThreshold = 50

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


    // window.addEventListener('touchstart', (e) => {
    //   const swipeDistance = e.changedTouches[0].pageY - this.touchY
    //   if (swipeDistance > this.touchThreshold && this.keys.indexOf('TouchStart') === -1) {
    //     this.keys.push('TouchStart')
    //   }
    // })
    // window.addEventListener('touchmove', (e) => {
    //   const swipeDistance = e.changedTouches[0].pageY - window.innerHeight

      // console.log(swipeDistance, this.touchUpThreshold)
      // if (swipeDistance < -this.touchUpThreshold && this.keys.indexOf('SwipeUp') === -1) {
      //   this.keys.push('SwipeUp')
      // }
      // else if (swipeDistance > this.touchThreshold && this.keys.indexOf('SwipeDown') === -1) {
      //   this.keys.push('SwipeDown')
      // }
    // })
    // window.addEventListener('touchend', (e) => {
      // console.log(this.keys)
      // this.keys.splice(this.keys.indexOf('TouchMove'), 1)
    // })

    this.swipedir = ''
    this.startX = ''
    this.startY = ''
    this.distX = ''
    this.distY = ''
    this.thresholdHorizontal = 1 //required min distance traveled to be considered swipe
    this.thresholdVertical = -50 //required min distance traveled to be considered swipe
    this.restraint = 100 // maximum distance allowed at the same time in perpendicular direction
    this.allowedTime = 300 // maximum time allowed to travel that distance
    this.elapsedTime = ''
    this.startTime = ''
    this.currentDistY = 0
    // handleswipe = callback || function(swipedir){}

    window.addEventListener('touchstart', (e) => {
      const touchobj = e.changedTouches[0]
      this.swipedir = 'none'
      this.dist = 0
      this.startX = touchobj.pageX
      this.startY = touchobj.pageY
      this.startTime = new Date().getTime() // record time when finger first makes contact with surface
    })

    window.addEventListener('touchmove', (e) => {
      const touchobj = e.changedTouches[0]
      this.distX = touchobj.pageX - this.startX // get horizontal dist traveled by finger while in contact with surface
      this.distY = touchobj.pageY - this.startY // get vertical dist traveled by finger while in contact with surface
      this.elapsedTime = new Date().getTime() - this.startTime // get time elapsed

      if (this.distY < this.thresholdVertical) {
        if (this.keys.indexOf('SwipeUp') === -1) {
          this.startY = touchobj.pageY
          this.keys.push('SwipeUp')
          setTimeout(() => {
            this.keys = this.keys.filter(key => key !== 'SwipeUp')
          }, 250)
        }
      }

      if (this.distX > this.thresholdHorizontal) {
        if (this.keys.indexOf('ArrowRight') === -1) {
          this.keys.push('ArrowRight')
        }
      }

      // if (this.distX < this.thresholdHorizontal) {
      //   if (this.keys.indexOf('ArrowLeft') === -1) {
      //     this.keys.push('ArrowLeft')
      //   }
      // }
    })

    window.addEventListener('touchend', (e) => {
      this.keys = this.keys.filter(key => key !== 'SwipeUp')
      this.keys = this.keys.filter(key => key !== 'ArrowLeft')
      this.keys = this.keys.filter(key => key !== 'ArrowRight')
    })
  }
}