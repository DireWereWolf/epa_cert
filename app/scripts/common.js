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
   * Optimizing default event triggers, works after event end.
   */
  waitForFinalEvent(){
    return (function () {
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
  };

  /**
   *  Check viewport size after dragged window (optimize default resize of jQuery)
   * @returns {window_width & window_height}
   * @private {false}
   */
  viewPortAfterResize(){

    let endResizing = this.waitForFinalEvent();

    $(window).resize(() => {
      endResizing(()=>{
          this.window_width  = window.innerWidth;
          this.window_height = window.innerHeight;

          if (this.debug.showViewPort){
            console.log(`viewport width:${this.window_width}px\nviewport height:${this.window_height}px`);
          }

        }, 500, 'some unique string');
    });
  }

  /**
   * Mobile menu functionality
   * @param buttonSelector
   * @param menuWrapper
   */
  mobileMenu(buttonSelector, menuWrapper){

    let button = $(buttonSelector),
        buttonIcon = $(`${buttonSelector} > .fa`),
        icon_up = 'fa-angle-up', //font-awesome class for trigger icon
        icon_down = 'fa-angle-down', //font-awesome class for trigger icon
        list = $(menuWrapper);

    $(document).ready(()=>{

      buttonIcon.addClass(icon_down);

      $(button).unbind().click((e)=>{
        e.preventDefault();
        let w = this.window_width,
            endResizing = this.waitForFinalEvent();

        $(window).on('resize', ()=>{
          endResizing(()=>{
            if (this.window_width > 768){
              list.removeAttr('style');
            }
            return w;
          }, 500, 'some unique string');
          return w;
        });

        if (w < 769){
          list.slideToggle();
          if (buttonIcon.hasClass(icon_up)){
            buttonIcon.removeClass(icon_up);
            buttonIcon.addClass(icon_down);
          }else if(buttonIcon.hasClass(icon_down)){
            buttonIcon.removeClass(icon_down);
            buttonIcon.addClass(icon_up);
          }
        }
      })

    });
  };
/**
  *  Slick slider factory method, plugin doc http://kenwheeler.github.io/slick/
 * @param selector (selector string)
 * @param params (object)
 * @returns {function}
 * @private {false}
 */
  slider(selector, params) {
    return $(selector).slick(params);
  }
/**
 *  Modal jquery factory method, plugin doc http://jquerymodal.com/
 * @param selector (selector string)
 * @param params (object)
 * @returns {function}
 * @private {false}
 */
  modal(selector, params) {
    return $(selector).click(function(event) {
      $(this).modal(params);
      return false;
    });
  }

/**
 *  Date picker factory method, plugin doc https://github.com/dbushell/Pikaday
 * @param id - input unique id (selector string)
 * @param params (object)
 * @returns {function}
 * @private {false}
 */
  datepicker(id, params) {

    let localeSettings = {
      field: document.getElementById(id),
      i18n: {//locale 'ru'
        previousMonth: 'Предыдущий месяц',
        nextMonth: 'Следуюший месяц',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      }
    },
      copy = Object.assign(localeSettings, params);

    return new Pikaday(copy);
  }

  /**
   * set table data-attributes by json
   * @param json
   */
  setTables(json){
    myApp.store.tables = json.tables;

    let tables = document.querySelectorAll(myApp.selectors.table);

    for (let i = 0; i < myApp.store.tables.length; i+=1){
      tables[i].setAttribute('data-num', myApp.store.tables[i].id);
      tables[i].setAttribute('data-spots', myApp.store.tables[i].spots);
      tables[i].setAttribute('data-is-reserved', myApp.store.tables[i].isReserved);
    }
  }

  /**
   * Visualize number and spots of all tables
   * @param selector
   */
  appendTableInfo(selector = myApp.selectors.table){

    let tables = document.querySelectorAll(selector),
        elems_num = document.querySelectorAll('.table__num'),
        elems_spots = document.querySelectorAll('.table__spots-num');

    for (let i=0; i < tables.length; i+=1){
      elems_num[i].innerText = tables[i].getAttribute('data-num');
      elems_spots[i].innerText = tables[i].getAttribute('data-spots');
    }
  }

  chooseTable(selector = myApp.selectors.table){
    $(selector).click(function (e) {

      let elem = e.currentTarget,
          status = elem.getAttribute('data-is-reserved');

      if (status === 'false'){
        $(elem).toggleClass('table_checked');
        elem.setAttribute('data-is-checked', 'true');
      }
    })
  }

  checkReserve(selector = myApp.selectors.table){

    let tables = document.querySelectorAll(selector),
        table_stat,
        table;

    for (let i=0; i < tables.length; i+=1){

      table =  tables[i];
      table_stat = tables[i].getAttribute('data-is-reserved');

      if (table_stat === 'true'){
        $(table).addClass('table_reserved').attr('title', 'Стол заказан на сегодня');
      }

    }

  }

  /*Public methods end*/
}

/**
 * Init App
 * */
const myApp = new App();

/**
 * App store init
 * */
myApp.store = {
  tables : false
};

/**
  * App selectors (functional keys) init
  * Note: typeof selector === string
* */
myApp.selectors = {
  datepicker: '#datepicker',
  table: '.js-table'
};

/**
 * Debug App
 * */
myApp.debug = {
  status:true,
  showViewPort: true
};

// $(window).resize(myApp.mobileMenu('.main-nav__button', '.main-nav__items_lvl-1'));

myApp.mobileMenu('.main-nav__button', '.main-nav__items_lvl-1');

$(document).ready(function () {

  myApp.viewPort();
  myApp.viewPortAfterResize();

  myApp.mobileMenu('.main-nav__button', '.main-nav__items_lvl-1')

  myApp.modal('.js-modal-open', {
    closeExisting: true,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    closeClass: 'modal__close',
    showClose: true,
    modalClass: 'modal modal_order',
    spinnerHtml: null,
    showSpinner: true,
    fadeDuration: null,
    fadeDelay: 1.0
  });

  $(window).on($.modal.BEFORE_BLOCK, function () {

    $.get('data/tables.json')
      .done(function(json) {

        //init date picker
        let picker = myApp.datepicker('datepicker', {
          format: 'DD/MM/YY',
          firstDay: 1,
        });

        //get data from 'server', store init, append data by tables
        myApp.setTables(json);

        //check reserved by store
        myApp.checkReserve();

        //append to each store data from store, and visualize them
        myApp.appendTableInfo();

        //choose some table, add state to table, prepare for send
        myApp.chooseTable();


      })
      .fail(function() {
        console.error('Request wasn\'t send, cannot get json data');
      })

  });


});


