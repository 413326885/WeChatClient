
$(function(){
	if(isMobile(getLocal("username"))){
		$("#js_v_box").show();
		$("#js_v_box .user a").text(getLocal("username"));
	}
	$("#js_unbindinfo_v").on('click', function() {
		if($(this).hasClass('disable')){
			return false;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "unbindinfo"
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000) {
					clearLocal("userSessionVirtual");
					clearLocal("username");
					myAlert("成功！", function(){
						document.location.href="login_virtual.html";
					});
				}else {
					myAlert(data.errmsg);
				}
			}
		});
	});
	$("#js_unbindinfo").on('click', function() {
		if($(this).hasClass('disable')){
			return false;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "unbindinfo",
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000) {
					clearLocal("userSessionReality");
					myAlert("成功！", function(){
						document.location.href="login_reality.html";
					});
				}else {
					myAlert(data.errmsg);
				}
			}
		});
	});

	$(".unbindinfo_btn a").on('click', function() {
		if($(this).parent().hasClass('disable')){
			return false;
		}
	});
	// 判断是否绑定
	isBind({
		vbind: function(){
			$("#js_unbindinfo_v").removeClass('disable');
		},
		vunbind: function(){
			$("#js_login_v").removeClass('disable');
		},
		bind: function(){
			$("#js_unbindinfo").removeClass('disable');
		},
		unbind: function(){
			$("#js_login_r").removeClass('disable');
		}
	});
});