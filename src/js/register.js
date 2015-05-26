$(function() {

    //提交注册
    $("#js_register").on('click', function() {

        var openId = getQueryString("openId");
        myAlert("openId = " + openId);
    });
});
