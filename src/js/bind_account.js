$(function() {

    //绑定账号
    $("#bind_account").on('click', function() {
//
//        var username = $("#username").val();
//        var password = $("#password").val();
//        var openId = getUrlParameter("openId");
//        var accessToken = getUrlParameter("accessToken");

//        // 判断是否输入用户名
//        if ($.trim(username) === '') {
//            showTips("用户名", "请输入用户名");
//            return;
//        }
//        if (!isUsernameValid(username)) {
//            showTips("用户名", "用户名只能包含字母、数字或下划线，并以字母或下划线开头");
//            return;
//        }
//
//        // 判断是否输入密码
//        if ($.trim(password) === '') {
//            showTips("密码", "请输入密码");
//            return;
//        }
//        if (!isPasswordValid(password)) {
//            showTips("密码", "密码必须为8位以上，并且不能为纯数字");
//            return;
//        }

        // 向服务器提交请求
        processing("正在绑定，请稍后...");
//        var options = {
//            "name": username,
//            "password": password,
//            "openid": openId,
//            "access_token": accessToken
//        }
        bindAccount();
    });

});


function bindAccount(options) {
    var defaultOptions = {
        "name": "a1234567",
        "password": "a1234567",
        "openid": "1234567",
        "access_token": "123456"
    }
//    options = $.extend(defaultOptions, options);
    $.ajax({
        type: "POST",
        url: "http://192.168.1.119:8088/ums/users/wechat",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(defaultOptions),
        success: function(data) {
              processed();
//            if(data.code == 200){
//                setLocal("username", options.name);
//                setLocal("openId", options.openId);
//                setLocal("accessToken", options.accessToken);
//                window.open("./subjects.html");
//            } else {
//                showTips("绑定账号", data.message);
//                processed();
//            }
        }
    });
}