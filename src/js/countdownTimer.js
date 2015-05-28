$(function() {
    $.fn.countdown = function() {
        var $this = $(this);
        var originText = $this.text();
        var interval = $this.data('countdown') || 120;
        var deferred = $.Deferred();
        var timer = $.timer(function() {
        if(interval) {
             $this.text('重新发送(' + interval-- + ')');
        } else {
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

    $.fn.sendPhoneCode = function(options){
        var defaultOptions = {
            "captcha": "12345",
            "phone": "18817627117"
        }
        options = $.extend(defaultOptions, options);
        $.ajax({
            url: serverUrl,
            dataType: "json",
            data: options,
            type: "POST",
            success: function(data) {
                if(data.code == 200){
                    showTips("获取手机验证码", "验证码发送成功！");
                } else {
                    showTips("获取手机验证码", data.message);
                }
            }
        });

    };
});

