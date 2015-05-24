var qType = 4; //默认全部查询
var $currentBox=null; //内容盒子
var pagenum=20;//每次加载的条数
var startrow=1;//从哪开始加载内容
var currentPageNumTemp=0;
var scrollSquare=null;
var pullDownEl, pullDownL;
var pullUpEl, pullUpL;
var Downcount = 0,Upcount = 0;
var loadingStep = 0; //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新  

function pullDownAction() { //下拉事件  
	startrow=1;
	loadContent(startrow, pagenum , "reset" , function(data){
		pullUpEl.removeClass('loading');
		pullDownL.html('下拉刷新...');
		pullDownEl['class'] = pullDownEl.attr('class');
		pullDownEl.attr('class', '').hide();
		scrollSquare.refresh();
		loadingStep = 0;
	});
}

function pullUpAction() { //上拉事件  
	loadContent(startrow++ * pagenum , pagenum , "append" , function(data){
		pullUpEl.removeClass('loading');
		if(currentPageNumTemp<pagenum) {
			pullUpL.html('没内容啦');
		}else {
			pullUpL.html('上拉显示更多...');
		}
		pullUpEl['class'] = pullUpEl.attr('class');
		pullUpEl.attr('class', '').hide();
		scrollSquare.refresh();
		loadingStep = 0;
	});
}

function loaded() {
	pullDownEl = $('#pullDown');
	pullDownL = pullDownEl.find('.pullDownLabel');
	pullDownEl['class'] = pullDownEl.attr('class');
	pullDownEl.attr('class', '').hide();

	pullUpEl = $('#pullUp');
	pullUpL = pullUpEl.find('.pullUpLabel');
	pullUpEl['class'] = pullUpEl.attr('class');
	pullUpEl.attr('class', '').hide();

	scrollSquare = new IScroll('#wrapper_probe', {
		probeType: 2, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。  
		scrollbars: 'custom', //有滚动条  
		mouseWheel: true, //允许滑轮滚动  
		fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果  
		bounce: true, //边界反弹  
		interactiveScrollbars: true, //滚动条可以拖动  
		shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.  
		click: true, // 允许点击事件  
		keyBindings: true, //允许使用按键控制  
		momentum: true // 允许有惯性滑动  
	});
	//滚动时  
	scrollSquare.on('scroll', function() {
		if(qType == 4) {
			return;
		}
		if (loadingStep == 0 && !pullDownEl.attr('class').match('flip|loading') && !pullUpEl.attr('class').match('flip|loading')) {
			if (this.y > 5) {
				//下拉刷新效果  
				pullDownEl.attr('class', pullUpEl['class'])
				pullDownEl.show();
				scrollSquare.refresh();
				pullDownEl.addClass('flip');
				pullDownL.html('准备刷新...');
				loadingStep = 1;
			} else if (this.y < (this.maxScrollY - 5)) {
				//上拉刷新效果  
				pullUpEl.attr('class', pullUpEl['class'])
				pullUpEl.show();
				scrollSquare.refresh();
				pullUpEl.addClass('flip');
				if(currentPageNumTemp<pagenum) {
					pullUpL.html('没内容啦');
				}else {
					pullUpL.html('准备加载...');
				}
				loadingStep = 1;
			}
		}
	});
	//滚动完毕  
	scrollSquare.on('scrollEnd', function() {
		if(qType == 4) {
			return;
		}
		if (loadingStep == 1) {
			if (pullUpEl.attr('class').match('flip|loading')) {
				pullUpEl.removeClass('flip').addClass('loading');
				if(currentPageNumTemp<pagenum) {
					pullUpL.html('没内容啦');
					pullUpEl['class'] = pullUpEl.attr('class');
					pullUpEl.attr('class', '').hide();
					scrollSquare.refresh();
					loadingStep = 0;
					return;
				}else {
					pullUpL.html('加载中...');
				}
				loadingStep = 2;
				pullUpAction();
			} else if (pullDownEl.attr('class').match('flip|loading')) {
				pullDownEl.removeClass('flip').addClass('loading');
				pullDownL.html('加载中...');
				loadingStep = 2;
				pullDownAction();
			}
		}
	});
}


document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);

function loadContent(startrow, pagenum, flag, callback){
	var $js_list_box=$(".list_box",$currentBox);
	if($js_list_box.data("isload") == "true" && flag=="start") {
		return;
	}
	$.ajax({
		url: serverUrl,
		dataType: "json",
		data: $.extend(publicOpts, {
			"cmd": "capitaldetailshare",
			"pagenum":pagenum,
			"startrow":startrow,
			// "begindate": "20140901",
			// "enddate": "20140931",
			"querytype": qType,
			"custtype": 1
		}),
		type: "POST",
		success: function(data) {
			if(data.resCode == 1000){
				var html='';
				$.each(data.optionHisList, function(index, val) {
					html+='<li> <div class="item_box"><span class="m"><strong>'+val.businname+'</strong><i>'+val.d_date+'</i></span><h5 class="d" style="color:'+val.color+'">'+val.incomesum+'</h5><span class="s">'+(val.status || "")+'</span></div> </li>';
				});
				if(flag=="start" || flag=="reset") {
					$js_list_box.html(html);
				}else {
					$js_list_box.append(html);
				}
				currentPageNumTemp = data.optionHisList.length;
				if(callback) {
					callback(data);
				}
				scrollSquare.refresh();
				$js_list_box.data("isload", "true");
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
$(function(){

	loaded();



	$("#js_select_btn").on('click', function() {
		$(".detail_mask").toggle();
	});

	$(".pop_list").on('click', ".item", function(e) {
		$(".detail_mask").hide();
		qType = $(".detail_radio",this).val();
		var box = $(this).data('box');
		$(".js_content_box").hide();
		$currentBox = $(box).show();
		loadContent(startrow, pagenum, "start");
		$("#js_select_btn").text($('label',this).text());
	});






	// 全部查询

	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=currentDate.getMonth()+1;
	var $list=$("#all_content .list").each(function(index, el) {
		if(index==0){
			loadContentAll(this, currentYear + isMonth(currentMonth) +'01', currentYear + isMonth(currentMonth) +'31');
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

	function loadContentAll(node, starttime, endtime){
		var $js_list_box=$(".list_box",node);
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "capitaldetailshare",
				"pagenum": pagenum,
				"startrow": startrow,
				"begindate": starttime,
				"enddate": endtime,
				"querytype": qType,
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
						html+='<li> <div class="item_box"><span class="m"><strong>'+val.businname+'</strong><i>'+val.d_date+'</i></span><h5 class="d" style="color:'+val.color+'">'+val.incomesum+'</h5><span class="s">'+(val.status || "")+'</span></div> </li>';
					});
					$js_list_box.html(html);
					scrollSquare.refresh();
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

	$list.on('click', ".list_title", function(e) {
		var $this=$(this).closest('.list');
		$list.removeClass('select');
		$this.addClass('select');
		if(!$this.data('isLoad')){
			var start = $this.data("starttime");
			var end = $this.data("endtime");
			loadContentAll( $this, start, end);
		}
		scrollSquare.refresh();
	});
});