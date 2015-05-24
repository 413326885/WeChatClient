$(function(){

	processing('请稍后...');
	isBind({
		bind: function(){
			processed();
			/*var userSessionReality = JSON.parse(getLocal("userSessionReality"));
			var html = '';
			$.each(userSessionReality.userinfo.tradeaccolist, function(index, val) {
				if(val.mainflag == 1){
					$("#js_main_card_box").html(val.bankname + '<i class="num">*** *** **** '+val.bankacco+'</i>')
					.parent().css("background-image","url(./images/common/"+hex_md5(val.bankname)+".png)")
					.attr('data-tradeacco', val.tradeacco);
				}
				html += '<li> \
						<input type="radio" class="card_list" name="card_list" id="card_list'+index+'"> \
						<label for="card_list'+index+'" class="'+(val.mainflag == 1 ? "checked" : '')+'"> \
							<div class="card_name" data-tradeacco="'+val.tradeacco+'" style="background-image:url(./images/common/'+hex_md5(val.bankname)+'.png)"> \
								<span class="name"> \
									'+val.bankname+' <i class="num">*** *** **** '+val.bankacco+'</i> \
								</span> \
							</div> \
						</label> \
					</li>';
			});
			$("#js_select_list_box").html(html);*/
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "tradelist",
					"custtype": 1
				}),
				type: "POST",
				success: function(data) {
					if(data.resCode == 1000) {
						var html = '';
						$.each(data.tradeaccolist, function(index, val) {
							if(val.mainflag == 1){
								$("#js_main_card_box").html(val.bankname + '<i class="num">*** *** **** '+val.bankacco+'</i>')
								.parent().css("background-image","url(./images/common/"+hex_md5(val.bankname)+".png)")
								.attr('data-tradeacco', val.tradeacco);
							}
							if(val.ispayable == 1){
								html += '<li> \
										<input type="radio" class="card_list" name="card_list" id="card_list'+index+'"> \
										<label for="card_list'+index+'" class="'+(val.mainflag == 1 ? "checked" : '')+'"> \
											<div class="card_name" data-tradeacco="'+val.tradeacco+'" style="background-image:url(./images/common/'+hex_md5(val.bankname)+'.png)"> \
												<span class="name"> \
													'+val.bankname+' <i class="num">*** *** **** '+val.bankacco+'</i> \
												</span> \
											</div> \
										</label> \
									</li>';
							}
						});
						$("#js_select_list_box").html(html);
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								document.location.href="login_reality.html";
								// document.location.href="login_virtual.html";
							}
						});
					}
				}
			});

			// 列举支持开户的银行卡
			if($("#js_bank_list").length>0) {
				$.ajax({
					url: serverUrl,
					dataType: "json",
					data: $.extend(publicOpts, {
						"cmd": "banksinfo",
						"custtype": 1
					}),
					type: "POST",
					success: function(data) {
						if(data.resCode == 1000) {
							var html='<option value="0">选择银行</option>';
							$.each(data.openbanks, function(index, val) {
								if(val.isopen == 1) {
									if(val.bankserial == getSession("bankserial")){
										html+='<option value="'+val.bankserial+'" selected="selected">'+val.bankname+'</option>';
									}else {
										html+='<option value="'+val.bankserial+'">'+val.bankname+'</option>';
									}
								}
							});
							$("#js_bank_list").html(html);
						}else {
							myAlert(data.errmsg, function(){
								if(data.errcode == "400000") {
									document.location.href="login_reality.html";
									// document.location.href="login_virtual.html";
								}
							});
						}
					}
				});
			}
		},
		unbind: function(){
			processed();
			myAlert("请先登录", function(){
				setLocal("callbackUrlR", document.location.href);
				document.location.href="login_reality.html";
			});
		}
	});

	$("#js_show_select").on('click', function() {
		if($("#js_select_list_box li").length>1){
			$("#js_select_list_box").show();
		}
	});
	$("#js_select_list_box").on('click', 'li', function() {
		$("#js_show_select").html($("label",this).html());
		$("#js_select_list_box li label").removeClass('checked');
		$("label",this).addClass('checked');
		$("#js_select_list_box").hide();
	});


	$("#js_get_code").sendCode({
		"input": "#tel_num"
	});


	if(!!getSession("telnum")){
		$("#tel_num").val(getSession("telnum"));
	}
	if(!!getSession("accountcard")){
		$("#card_num").val(getSession("accountcard"));
	}
	if(!!getSession("riskanswer")){
		$("input:radio").val(getSession("riskanswer"));
	}
	$("body").on('click', function() {
		// 保存临时数据
		var cardNum = $("#card_num").val();
		var telNum = $("#tel_num").val();
		var riskanswer = $("input:radio:checked").val();
		var bankserial = $("#js_bank_list option:selected").val();
		setSession("accountcard", cardNum);
		setSession("telnum", telNum);
		setSession("bankserial", bankserial);
		setSession("riskanswer", riskanswer);
	});

	$("#js_info_submit").on('click', function() {
		if(!isUdid()){
			myAlert("非法访问！");
			return false;
		}
		var riskanswer = $("input[name='like']:checked").val();
		var cardFlag = $("input[name='card']:checked").val();
		if(!$("#agree").prop('checked')){
			myAlert("请阅读并同意用户协议！");
			return;
		}
		// 新增银行卡
		if(cardFlag == 2){
			var cardNum = $("#card_num").val();
			var telNum = $("#tel_num").val();
			var codeNum = $("#code_num").val();
			var bankserial = $("#js_bank_list option:selected").val();
			if(bankserial == 0) {
				myAlert("银行选择有误！");
				return;
			}
			// 判断手机号码
			if(!isMobile(telNum)){
				myAlert("请输入正确的手机号码！");
				return;
			}
			// 判断验证码是否为空
			if($.trim(codeNum) === ''){
				myAlert("请输入验证码！");
				return;
			}
			processing();
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "bindcardvalidate",
					"bankserial": bankserial, //银行编号
					"bankacco": cardNum, //银行账号
					"mobile": telNum, //手机号码
					"riskanswer": riskanswer, //风险问卷等级
					"validatecode": codeNum, //短信验证码
					"custtype": 1
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode == 1000){
						if(typeof data.opentype == 'string' && data.opentype.toLowerCase() == "c"){
							// 保存临时数据
							setSession("accountcard", cardNum);
							setSession("telnum", telNum);
							setSession("bankserial", bankserial);
							setSession("riskanswer", riskanswer);


							setLocal("custtype", 1);
							setLocal("errorUrl", document.location.href);

							myAlert("将跳转至银行卡安全验证页面", function(){
								document.location.href=data.url;
							});
							/*myConfirm({
								"content":"该银行卡需要您验证，是否立即验证？",
								"okFn":function(){
									document.location.href=data.url;
								}
							});*/
						}else {
							myAlert("操作成功", function(){
								document.location.href="trader.html";
							});
						}
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								document.location.href="login_reality.html";
								// document.location.href="login_virtual.html";
							}
						});
					}
				}
			});
		}else if(cardFlag == 1){
			var tradeacco = $("#js_show_select .card_name").data('tradeacco');
			processing();
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "openhiswe",
					"riskanswer": riskanswer, //风险问卷等级
					"tradeacco": tradeacco, //风险问卷等级
					"custtype": 1
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode == 1000){
						// "操作成功。<br>合同号："+data.cotractId+"<br>来钱账户交易账号："+data.hisTradeAcco
						myAlert("操作成功。", function(){
							document.location.href="trader.html";
						});
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								document.location.href="login_reality.html";
								// document.location.href="login_virtual.html";
							}
						});
					}
				}
			});
		}
		return false;
	});
});