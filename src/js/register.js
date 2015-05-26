$(function() {

    //获取手机验证码
    $("#send_phone_code").on('click', function() {

        //showTips("手机验证码", "获取手机验证码");
        var captcha = $("#image_code").val();
        var phonenum = $("#phonenum").val();

        // 判断是否输入图形验证码
        if ($.trim(captcha) === '') {
            showTips("图形验证码", "请输入图形验证码");
            return;
        }
        if (!isCaptchaValid(captcha)) {
            showTips("图形验证码", "图形验证码为5位");
            return;
        }
        // 判断是否输入手机号码
        if ($.trim(phonenum) === '') {
            showTips("手机号码", "请输入手机号码");
            return;
        }
        if (!isPhoneValid(phonenum)) {
            showTips("手机号码", "手机号格式不正确");
            return;
        }

        $("#send_phone_code").countdown();
        $("#send_phone_code").sendPhoneCode();
    });

    //提交注册
    $("#register_btn").on('click', function() {

        //showTips("注册", "提交注册");
        var username = $("#username").val();
        var password = $("#password").val();
        var captcha = $("#image_code").val();
        var phonenum = $("#phonenum").val();
        var phonecode = $("#phone_code").val();

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

        // 判断是否输入图形验证码
        if ($.trim(captcha) === '') {
            showTips("图形验证码", "请输入图形验证码");
            return;
        }
        if (!isCaptchaValid(captcha)) {
            showTips("图形验证码", "图形验证码为5位");
            return;
        }

        // 判断是否输入手机号码
        if ($.trim(phonenum) === '') {
            showTips("手机号码", "请输入手机号码");
            return;
        }
        if (!isPhoneValid(phonenum)) {
            showTips("手机号码", "手机号格式不正确");
            return;
        }

        // 判断是否输入手机验证码
        if ($.trim(phonenum) === '') {
            showTips("手机验证码", "请输入手机验证码");
            return;
        }
        if (!isSmsVerifyCodeValid(phonenum)) {
            showTips("手机验证码", "手机验证码为6位");
            return;
        }

        // 判断是否勾选网站协议
        if (!$("#agreement").prop('checked')) {
            showTips("网站服务协议", "请阅读并同意网站服务协议！");
            return;
        }

        // 向服务器提交请求
        processing("正在注册");
        var options = {
            ”name“: username,
            "password": password,
            "phone": phonenum,
            "smsVerifyCode": phonecode
        }
        register(options);

    });

    function register(options) {
        var defaultOptions = {
            ”name“: "a1234567",
            "password": "a1234567",
            "phone": "18817627117",
            "smsVerifyCode": "123456"
        }
        options = $.extend(defaultOptions, options);
        $.ajax({
            url: serverUrl,
            dataType: "json",
            data: options,
            type: "POST",
            success: function(data) {
                if(data.code == 200){
                    document.location.href="./register_success.html";
                } else {
                    showTips("注册新用户", data.message);
                    processed();
                }
            }
        });
    }

});

