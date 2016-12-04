if (!window.jQuery){
  throw new Error('install jQuery latest version');
}

class App{

constructor(){
  this.window_width;
  this.window_height;
  this.debug = {
    status: false,
    showViewPort: false
  };
}

/*Public methods*/

  /**
   *  Check viewport size on your need
   * @returns {window_width & window_height}
   * @private {false}
   */
  viewPort() {
    this.window_width  = $(window).innerWidth();
    this.window_height = $(window).innerHeight();

    if (this.debug.showViewPort){
      console.log(`viewport width:${this.window_width}px\nviewport height:${this.window_height}px`);
    }
  }

  /**
   *  Check viewport size after dragged window (optimize default resize of jQuery)
   * @returns {window_width & window_height}
   * @private {false}
   */
  viewPortAfterResize(){
    let waitForFinalEvent = (function () {
      let timers = {};
      return function (callback, ms, uniqueId) {
        if (!uniqueId) {
          uniqueId = 'Don\'t call this twice without a uniqueId';
        }
        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })();

    $(window).resize(() => {
        waitForFinalEvent(()=>{
          this.window_width  = $(window).innerWidth();
          this.window_height = $(window).innerHeight();

          if (this.debug.showViewPort){
            console.log(`viewport width:${this.window_width}px\nviewport height:${this.window_height}px`);
          }
        }, 500, 'some unique string');
    });
  }

/**
  *  Slick slider decorator
 * @param selector (selector string)
 * @param params (object)
 * @returns {function}
 * @private {false}
 */
  slider(selector, params) {
    return $(selector).slick(params);
  }

  /*Public methods end*/
}

/*Init App*/
const myApp = new App();

/*Debug App*/
myApp.debug = {
  status:true,
  showViewPort: false
};

myApp.viewPortAfterResize();
