$(function(){

	processing('请稍后...');
	var isLoginRealityFlag=false;
	var isLoginVirtualFlag=false;
	$.ajax({
		url: serverUrl,
		dataType: "json",
		data: $.extend(publicOpts, {
			"cmd": "isbind"
		}),
		type: "POST",
		success: function(data) {
			processed();
			if(data.resCode == 1000){
				// 虚拟是否绑定 0：未绑定  1：已绑定
				if(data.vismbind == 0 && data.realbind == 0){
					myAlert("请先注册", function(){
						setLocal("callbackUrl", document.location.href);
						document.location.href="register.html";
					});
					return;
				}
				if(data.vismbind == 1){
					isLoginVirtualFlag=true;
					return;
				}
				// 真实是否绑定 0：未绑定  1：已绑定
				if(data.realbind == 1){
					isLoginRealityFlag=true;
					return;
				}
			}
		}
	});
	$("#js_submit_feedback").on('click', function() {
		var js_content=$("#js_content").val();
		if(js_content.indexOf("亲~请留下您的宝贵的意见") > -1) {
			myAlert("请输入反馈内容");
			return;
		}
		if($.trim(js_content) == "") {
			myAlert("请输入反馈内容");
			return;
		}
		processing();
		if(isLoginRealityFlag) {
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "custfeedback",
					"feedbackinfo": js_content,
					"isrealcust": 1
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode==1000){
						myAlert("提交成功", function(){
							document.location.href="about.html";
						});
					}else {
						myAlert(data.errmsg);
					}
				}
			});
		}else {
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "custfeedback",
					"feedbackinfo": js_content,
					"mobile": getLocal("username"),
					"isrealcust": 0
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode==1000){
						myAlert("提交成功",function(){
							document.location.href="about.html";
						});
					}else {
						myAlert(data.errmsg);
					}
				}
			});
		}

	});
	var c_text="亲~请留下您的宝贵的意见\r\n\r\n关注“来钱”微信公众号（LQLaiQian），反馈效率更高！";
	$("#js_content").focus(function() {
		var v=$(this).val();
		if(v.indexOf("亲~请留下您的宝贵的意见") > -1) {
			$(this).val("");
		}
	}).blur(function(){
		var v=$(this).val();
		if($.trim(v) == ""){
			$(this).val(c_text);
		}
	}).val(c_text);
});