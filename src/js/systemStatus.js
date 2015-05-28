
// 判断是否绑定了账号
function isAccountBinded() {
    $.ajax({
        url: serverUrl,
        dataType: "json",
        type: "GET",
        success: function(data) {
            if(data.code == 200 && data.isBinded)
               return true
            return false;
        }
    });
}

//refresh sessionid，防止session过期
function refreshSessionId(options) {
    var defaultOptions = {
        "openid": "1234567"
    }
    options = $.extend(defaultOptions, options);
    $.ajax({
        url: serverUrl,
        dataType: "json",
        data: options,
        type: "POST",
        success: function(data) {
            if(data.code == 200)
                return true;
            return false;
        }
    });
}
