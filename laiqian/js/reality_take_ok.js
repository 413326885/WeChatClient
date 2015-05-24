
$(function(){
	$.ajax({
		url: serverUrl,
		dataType: "json",
		data: $.extend(publicOpts, {
			"cmd": "custominfo",
			"custtype": 1
		}),
		type: "POST",
		success: function(data) {
			if(data.resCode == 1000) {
				$("#js_title").html(data.custinfo.bankname + '<i class="num">**** **** **** '+data.custinfo.bankacco+'</i>').css("background-image","url(./images/common/"+hex_md5(data.custinfo.bankname)+".png)");
			}else {
				myAlert(data.errmsg, function(){
					if(data.errcode == "400000") {
						document.location.href="login_reality.html";
						// document.location.href="login_virtual.html";
					}
					if(data.errcode == "500000") {
						document.location.href="perfect_info.html";
						// document.location.href="login_virtual.html";
					}
				});
			}
		}
	});
	var takeAmount = 0;
	if(getLocal("takeAmount")) {
		takeAmount = getLocal("takeAmount");
	}
	$("#js_money").text(takeAmount);
	$("#js_know").on('click', function() {
		document.location.href="reality_profit_query.html";
	});
});