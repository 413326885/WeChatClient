
(function() {

  'use strict';

  $.fn.captcha = function() {
    $(this).on('click', function() {
      var $this = $(this);
      $this.attr('src', $this.attr('src') + "?" + Math.random());
    });
  };

  $(function() {
    $('.js-captcha').captcha();
  });
})();