var pagenum=15;//每次加载的条数
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
	var $js_list_box=$("#js_list_box");
	$.ajax({
		url: serverUrl,
		dataType: "json",
		data: $.extend(publicOpts, {
			"cmd": "squareinfo", "startrow": startrow, "pagenum": pagenum
		}),
		type: "POST",
		success: function(data) {
			if(data.resCode == 1000){
				var html='';
				$.each(data.shareList, function(index, val) {
					html+='<li>';
					html+='<h3 class="title">'+val.custName+'</h3>';
					if(val.yestodayIncome-0 < 0){
						// html+='<p class="content">不给力！昨天小亏<i class="money">'+val.yestodayIncome+'</i>元</p>';
						html+='<p class="content">市场不给力,昨天小亏<i class="money">'+val.yestodayIncome+'</i>元</p>';
					}else {
						// html+='<p class="content">昨天我来钱赚了<i class="money">'+val.yestodayIncome+'</i>元！</p>';
						html+='<p class="content">昨天来钱帮我赚了<i class="money">'+val.yestodayIncome+'</i>元！</p>';
					}
					html+='<span class="time">'+val.date.replace('-','/')+'</span>';
					html+='</li>';
				});
				if(flag=="start" || flag=="reset") {
					$js_list_box.html(html);
				}else {
					$js_list_box.append(html);
				}
				currentPageNumTemp = data.shareList.length;
				if(callback) {
					callback(data);
				}
				if(flag=="start") {
					setTimeout(function() {
						$("#pullDown,#pullUp").show();
						loaded();
					}, 0);
				}
			}else {
				myAlert(data.errmsg, function(){
					if(data.errcode == "400000") {
						// document.location.href="login_reality.html";
						document.location.href="login_virtual.html";
					}
				});
			}
		}
	});
}
$(function(){

	loadContent(startrow, pagenum, "start");

});