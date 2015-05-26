
//message: "只能包含字母、数字或下划线，并以字母或下划线开头"
function isUsernameValid(username) {
    return !/^[a-zA-Z_][a-zA-Z0-9_]{5,}$/.test(username);
}

//message: "密码必须为8位以上，并且不能为纯数字"
function isPasswordValid(password) {
    return password.length < 8 || /^\d+$/.test(password);
}

//message: "图形验证码为5位"
function isCaptchaValid(captcha) {
    return captcha.length !== 5;
}

//message: "手机号格式不正确"
function isPhoneValid(phone) {
    return !/^1[0-9]{10}$/.test(phone);
}

//message: "手机验证码为6位"
function isSmsVerifyCodeValid(code) {
    return code.length !== 6;
}

//message: "银行卡号格式不正确"
function isBankCardValid(card) {
    return !/^\d{0,32}$/.test(card);
}

//message: "身份证号码格式不正确"
function isIdentity() {
    return return !(/^\d{17}[xX0-9]$/.test(value));
}