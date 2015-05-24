
$(function(){
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=currentDate.getMonth()+1;
	var $list=$(".everyday .list").each(function(index, el) {
		if(index==0){
			loadContent(this, currentYear + isMonth(currentMonth) +'01', currentYear + isMonth(currentMonth) +'31');
			$(".m",this).text("本月");
		}else {
			$(".m",this).text(currentMonth + "月");
		}
		$(this).attr({
			'data-starttime': currentYear + isMonth(currentMonth) +'01',
			'data-endtime': currentYear + isMonth(currentMonth) +'31',
		});
		getiTime(currentMonth);
	});

	function loadContent(node, starttime, endtime){
		var $js_list_box=$(".list_box",node);
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "historyquery",
				"begindate": starttime,
				"enddate": endtime,
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				if(data.resCode == 1000){
					var html='';
					if(!data.optionHisList || data.optionHisList.length == 0 ){
						html+='<li>无数据</li>';
					}
					$.each(data.optionHisList, function(index, val) {
						html+='<li><div class="item_box"><span class="m"><strong>'+val.d_date+'</strong></span><span class="s green" style="color:'+val.color+';">'+val.incomesum+'</span></div></li>';
					});
					$js_list_box.html(html);
					myScroll.refresh();
					$(node).data('isLoad', 'true');
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
	}

	function getiTime(m){
		if(--m <= 0){
			currentYear -- ;
			currentMonth =12;
		}else {
			currentMonth = m;
		}
	}
	function isMonth(m){
		if(m.toString().length<2){
			return m = '0'+m;
		}
		return m+'';
	}

/*	$list.on('click', function(e) {
		var $this=$(this);
		if($(e.target).closest('.list_title').length>0){
			$this.toggleClass('select').siblings('.list').removeClass('select');
			if(!$this.data('isLoad')){
				var start = $this.data("starttime");
				var end = $this.data("endtime");
				loadContent(this, start, end);
			}
		}
	});*/
	$list.on('click', ".list_title", function(e) {
		var $this=$(this).closest('.list');
		$list.removeClass('select');
		$this.addClass('select');
		if(!$this.data('isLoad')){
			var start = $this.data("starttime");
			var end = $this.data("endtime");
			loadContent($this, start, end);
		}
		myScroll.refresh();
	});
});