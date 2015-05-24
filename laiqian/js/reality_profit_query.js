
$(function(){

	// 判断是否绑定
	processing('请稍后...');
	isBind({
		bind: function(){
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "latestquery",
					"custtype": "1"
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode==1000){
						$("#js_yestincome").text(data.incomeinfo.yestincome);
						$("#js_stockincome").text(data.incomeinfo.stockincome);
						$("#js_bondincome").text(data.incomeinfo.bondincome);
						$("#js_moneyincome").text(data.incomeinfo.moneyincome);
						$("#js_currentasset").text(data.incomeinfo.currentasset);
						setLocal("currentasset", data.incomeinfo.currentasset);
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								document.location.href="login_reality.html";
								// document.location.href="login_virtual.html";
							}
							if(data.errcode == "500000") {
								document.location.href="perfect_info.html";
							}
						});
					}
				}
			});
		},
		unbind: function(){
			processed();
			myAlert("请先登录", function(){
				setLocal("callbackUrlR", document.location.href);
				document.location.href="login_reality.html";
			});
		}
	});
});