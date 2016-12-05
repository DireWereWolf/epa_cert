/* Main page js */

$(document).ready(function () {
  myApp.slider('.js-hero-slider', {

    accessibility: true,
    dots: true,
    adaptiveHeight: false,
    arrows: true,
    prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
    nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
    autoplay: false,
    autoplaySpeed: 3000,
    zIndex:10,

  });
});


