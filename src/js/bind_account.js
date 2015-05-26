$(function() {

    //绑定账号
    $("#bind_account").on('click', function() {

        var username = $("#username").val();
        var password = $("#password").val();
        var openId = getUrlParameter("openId");
        var accessToken = getUrlParameter("accessToken");

        // 判断是否输入用户名
        if ($.trim(username) === '') {
            showTips("用户名", "请输入用户名");
            return;
        }
        if (!isUsernameValid(username)) {
            showTips("用户名", "用户名只能包含字母、数字或下划线，并以字母或下划线开头");
            return;
        }

        // 判断是否输入密码
        if ($.trim(password) === '') {
            showTips("密码", "请输入密码");
            return;
        }
        if (!isPasswordValid(password)) {
            showTips("密码", "密码必须为8位以上，并且不能为纯数字");
            return;
        }

        // 向服务器提交请求
        processing("正在绑定");
        var options = {
            ”name“: username,
            "password": password,
            "openId": openId,
            "accessToken": accessToken
        }
        bindAccount(options);
    });

    function bindAccount(options) {
        var defaultOptions = {
            ”name“: "a1234567",
            "password": "a1234567",
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
                    setLocal("username", options.name);
                    setLocal("openId", options.openId);
                    setLocal("accessToken", options.accessToken);
                    document.location.href="./subjects.html";
                } else {
                    showTips("绑定账号", data.message);
                    processed();
                }
            }
        });
    }
});