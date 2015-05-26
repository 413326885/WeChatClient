(function() {
  'use strict';
  $.fn.countdown = function() {
    var $this = $(this);
    var originText = $this.text();
    var interval = $this.data('countdown') || 120;
    var deferred = $.Deferred();
    var timer = $.timer(function() {
      if(interval)
        $this.text('重新发送(' + interval-- + ')');
      else {
        timer.reset();
        timer.stop();
        $this.text(originText);
        $this.removeAttr('disabled');
        deferred.resolve();
      }
    });
    timer.set({time: 1000});
    $this.attr('disabled', 'disabled');
    timer.play();
    return deferred.promise();
  };
})();
