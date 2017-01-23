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
 * @param selector - input class (selector string)
 * @param params (object)
 * @returns {function}
 * @private {false}
 */
  datepicker(selector, params) {

    let localeSettings = {
      field: document.querySelector(selector),
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
   * Time picker factory method, plugin doc https://github.com/jonthornton/jquery-timepicker
   * @param selector
   * @param params (object)
   * @returns {jQuery}
   */
  timepicker(selector, params){

    let defaultSettings = {
      am: 'am',
      pm: 'pm',
      AM: 'AM',
      PM: 'PM',
      decimal: '.',
      mins: 'минуты',
      hr: 'час',
      hrs: 'часы',
      minTime: '11:00am',
      maxTime: '10:00pm',
      timeFormat: 'H:i'
    },
      copy = Object.assign(defaultSettings, params);

    return $(selector).timepicker(copy);
  }

  /*Public methods end*/
}

class Tables extends App {

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
  appendTableInfo(selector = this.selectors.table){

    let tables = document.querySelectorAll(selector),
      elems_num = document.querySelectorAll('.table__num'),
      elems_spots = document.querySelectorAll('.table__spots-num');

    for (let i=0; i < tables.length; i+=1){
      elems_num[i].innerText = tables[i].getAttribute('data-num');
      elems_spots[i].innerText = tables[i].getAttribute('data-spots');
    }
  }

  startReserve(selector = this.selectors.table){

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

  chooseTable(selector = this.selectors.table){

    $(selector).click(function (e) {

      let elem = e.currentTarget,
        load_status = $(elem).attr('data-is-reserved'),
        current_status = $(elem).attr('data-is-checked');

      if (load_status === 'false'){

        console.log("load_status === 'false'");
        console.log(current_status);

        if (current_status === 'false' || !current_status){

          $(elem).addClass('table_checked');
          $(elem).attr('data-is-checked', 'true');

        }else if(current_status === 'true'){

          $(elem).removeClass('table_checked');
          $(elem).attr('data-is-checked', 'false');

        }

      }

    })

  }

  sendReserve(button){

    let combineData = (selector = this.selectors.table) => {

      let table_collection = $(selector),
          date = $(this.selectors.date).val(),
          time = $(this.selectors.time).val(),
          tables = [];

      //filter tables by checked
      for (let i = 0; i< table_collection.length; i++){
        if ($(table_collection[i]).attr('data-is-checked') === 'true'){
          tables.push(table_collection[i]);
        }
      }

      //transform collection items to table numbers array
      let filteredTablesData = tables.map(function (item, i, arr) {
        return arr[i] = $(item).attr('data-num');
      });

      return {
        date: date,
        time: time,
        tables: filteredTablesData
      }
    };

    $(button).click(function (e) {
      $.ajax({
        url: myApp.uris.reserveCreate,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(combineData())
      })
        .done(function (data) {
          console.log('Резерв успешен', data);
        })
        .fail(function (data) {
          console.log(data);
          console.error('Данные не были отправлены');
        })
    })

  }

}

/**
 * Init App
 * */
const myApp = new Tables();

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
  table: '.js-table',
  date: '.js-datepicker',
  time: '.js-timepicker'
};

/**
 * App API url's
 */
myApp.uris = {
  tables_url: 'data/tables.json',
  reserveCreate: '/' //url for create reserve
};

/**
 * Debug App
 * */
myApp.debug = {
  status:true,
  showViewPort: true
};

myApp.mobileMenu('.main-nav__button', '.main-nav__items_lvl-1');

$(document).ready(function () {

  myApp.viewPort();
  myApp.viewPortAfterResize();

  myApp.mobileMenu('.main-nav__button', '.main-nav__items_lvl-1');

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

  //Before initialize modal event
  $(window).on($.modal.BEFORE_BLOCK, function () {

    $.ajax({
      url: myApp.uris.tables_url,
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    })
      .done(function (data) {

      //init date picker
      let datepicker = myApp.datepicker('.js-datepicker', {
        format: 'DD/MM/YY',
        firstDay: 1,
      });

      //init time picker
      myApp.timepicker('.js-timepicker',{});

      //get data from 'server', store init, append data by tables
      myApp.setTables(data);

      //check reserved by store
      myApp.startReserve();

      //append to each store data from store, and visualize them
      myApp.appendTableInfo();

      //choose some table, add state to table, prepare for send
      myApp.chooseTable();

      //register listener for send data event
      myApp.sendReserve('.js-send-data');
    })
      .fail(function() {
        console.error('Request wasn\'t send, cannot get json data');
      });

  });


});


