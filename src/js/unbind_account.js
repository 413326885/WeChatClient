$(function() {

    var username = getLocal("username");
    if(!username) {
        $("#username").text(username);
    }

    //获取解除绑定
    $("#unbind_account").on('click', function() {

        var openId = getUrlParameter("openId");
        var accessToken = getUrlParameter("accessToken");
        if(!openId) {
            openId = getLocal("openId");
        }
        if(!accessToken) {
            accessToken = getLocal("accessToken");
        }

        // 向服务器提交请求
        processing("正在解除绑定，请稍后...");
        var options = {
            "openId": openId,
            "accessToken": accessToken
        }
        unbind_account(options);
    });

});

function unbind_account(options) {
    var defaultOptions = {
        "openId": "1234567",
        "accessToken": "123456"
    }
    options = $.extend(defaultOptions, options);
    $.ajax({
        url: serverUrl,
        dataType: "json",
        data: options,
        type: "POST",
        success: function(data) {
            if(data.code == 200){
                clearLocal("username", options.name);
                clearLocal("openId", options.openId);
                clearLocal("accessToken", options.accessToken);
                window.open("./subjects.html");
            } else {
                showTips("解绑账号", data.message);
                processed();
            }
        }
    });
}