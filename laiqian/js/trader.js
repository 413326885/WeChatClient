$(function() {
	if($("#js_canvas_box").length == 0 ) return;


	processing('请稍后...');
	isBind({
		bind: function(){
			processed();
			bindQuery();
			$(".login_btn").hide();
		},
		unbind: function(){
			processed();
			myAlert("请先登录", function() {
				setLocal("callbackUrlR", document.location.href);
				document.location.href = "login_reality.html";
			});
		}
	});


	// 绘制圆盘
	var $js_canvas_box = $("#js_canvas_box");
	var c = document.getElementById("myCanvas");
	if (!c) return;
	c.width = $js_canvas_box.width();
	c.height = $js_canvas_box.height();
	var ctx = c.getContext("2d");
	window.onresize = resizeCanvas;
	//var i=100;
	var stockperColor = "#f94138"; //股票基金颜色 (红)
	var bondperColor = "#ffd321"; //债券基金颜色 (黄)
	var moneyperColor = "#63cd33"; //货币基金颜色 (绿)
	var bgColor = "#bceafd";

	var traderBack = getSession("traderBack");
	setSession("traderBack", "false");

	var circleWidth = 0; //基数
	var radius = 0; // 整圆半径
	var arcWidth = 0; //弧形宽度

	//圆心坐标
	var centerX;
	var centerY;

	var PI = Math.PI;
	// 分割线
	var oangle = 3 / 2 * PI; //34%
	// 股票基金（红色）
	var sangle = 3 / 2 * PI + 0.33 * 2 * PI; //33%
	// 债券基金（黄色）
	var eangle = 3 / 2 * PI - 0.33 * 2 * PI; //33%

	if (getLocal('stockPer')) {
		sangle = 3 / 2 * PI + getLocal('stockPer') / 100 * 2 * PI;
	}
	if (getLocal('bondPer')) {
		eangle = 3 / 2 * PI - getLocal('bondPer') / 100 * 2 * PI;
	}

	var dragflag = false;
	var flag = 1;
	var EpointFlag = false;
	var SpointFlag = false;
	var beforeAngle;
	var beforeSangle;
	var beforeEangle;
	var beforeOangle;
	var img = new Image();
	img.src = "./images/common/point.png";
	img.onload = function() {
		resizeCanvas();
	}

	// 绘制拖拽图位置
	var ex;
	var ey;
	var sx;
	var sy;


	var $js_totalamt = $("#js_totalamt");
	var $js_moneyper = $("#js_moneyper");
	var $js_bondper = $("#js_bondper");
	var $js_stockper = $("#js_stockper");
	var $js_moneyper_num = $("#js_moneyper_num");
	var $js_bondper_num = $("#js_bondper_num");
	var $js_stockper_num = $("#js_stockper_num");

	var totalamt = 0; //总资产
	if (getLocal("totalamt")) {
		totalamt = getLocal("totalamt");
	}

	function setText(totalamt, moneyper, bondper, stockper) {
		$js_totalamt.text(totalamt);
		$js_moneyper.text(parseInt(moneyper * 100) + '%');
		$js_bondper.text(parseInt(bondper * 100) + '%');
		$js_stockper.text(parseInt(stockper * 100) + '%');
		$js_moneyper_num.text((moneyper * totalamt).toFixed(2));
		$js_bondper_num.text((bondper * totalamt).toFixed(2));
		$js_stockper_num.text((stockper * totalamt).toFixed(2));
	}

	function changePre(stockPer, bondPer, moneyPer) {
		setLocal('stockPer', stockPer);
		setLocal('bondPer', bondPer);
		setLocal('moneyPer', moneyPer);
		setText(totalamt, moneyPer / 100, bondPer / 100, stockPer / 100)
	}

	function bindQuery(){
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "currentconfigquery",
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				if (data.resCode == 1000) {
					totalamt = data.assetinfo.totalamt;
					setLocal("totalamt", totalamt);
					setLocal("risklevel", data.assetinfo.risklevel);
					if (traderBack != "true") {
						// 分割线
						oangle = 3 / 2 * PI;
						// 股票基金（红色）
						sangle = 3 / 2 * PI + data.assetinfo.stockper * 2 * PI;
						// 债券基金（黄色）
						eangle = 3 / 2 * PI - (data.assetinfo.bondper * 2) * PI;
						
						if(data.assetinfo.stockper-0 == 0 && data.assetinfo.bondper-0 ==0 && data.assetinfo.moneyper-0 ==0){
							// 分割线
							oangle = 3 / 2 * PI; //34%
							// 股票基金（红色）
							sangle = 3 / 2 * PI + 0.33 * 2 * PI; //33%
							// 债券基金（黄色）
							eangle = 3 / 2 * PI - 0.33 * 2 * PI; //33%
						}

						if(data.assetinfo.stockper * 100 == 100){
							clockwiseS = false;
							clockwiseE = false;
						}
						if(data.assetinfo.bondper * 100 == 100){
							counterclockwiseS = false;
							counterclockwiseE = false;
						}
						if(data.assetinfo.moneyper * 100 == 100){
							clockwiseE = false;
							counterclockwiseS = false;
						}
						resizeCanvas();
						// setText(totalamt, data.assetinfo.moneyper, data.assetinfo.bondper, data.assetinfo.stockper);
					} else {
						resizeCanvas();
					}
				} else {
					myAlert(data.errmsg, function() {
						if (data.errcode == "400000") {
							document.location.href = "login_reality.html";
							// document.location.href="login_virtual.html";
						}
						if (data.errcode == "500000") {
							document.location.href = "perfect_info.html";
						}
					});
				}
			}
		});
	}

	function draw() {
		ctx.clearRect(0, 0, c.width, c.height);

		// 绘制圆边框
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius + arcWidth / 2 + 5, 0, 2 * PI);
		ctx.fillStyle = "#FFF";
		ctx.fill();

		ctx.beginPath();
		ctx.lineWidth = 20;
		ctx.strokeStyle = bgColor;
		ctx.arc(centerX, centerY, radius - arcWidth / 2, 0, 2 * PI);
		ctx.stroke();

		// 设置宽度
		ctx.lineWidth = arcWidth;

		// 债券基金 (黄)
		drawBond(eangle, oangle);
		// 股票基金 (红)
		drawStock(oangle, sangle);
		// 货币基金 (绿)
		if(eangle !=sangle) {
			drawMoney(sangle, eangle);
		}

		var preFlag = false;
		if (!counterclockwiseS && !counterclockwiseE) {
			// console.log("黄色：100");
			preFlag = true;
			ctx.strokeStyle = bondperColor;
			changePre(0, 100, 0);
		}
		if (!clockwiseS && !clockwiseE) {
			// console.log("红色：100");
			preFlag = true;
			ctx.strokeStyle = stockperColor;
			changePre(100, 0, 0);
		}
		if (!clockwiseE && !counterclockwiseS) {
			// console.log("绿色：100");
			preFlag = true;
			ctx.strokeStyle = moneyperColor;
			changePre(0, 0, 100);
		}

		if(preFlag == true){
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * PI);
			ctx.stroke();
		}
		if (eangle == oangle && sangle == oangle) {
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * PI);
			ctx.stroke();
		}
		// 绘制图片
		ex = centerX + (radius + arcWidth / 2) * Math.cos(eangle) - img.width / 2;
		ey = centerY + (radius + arcWidth / 2) * Math.sin(eangle) - img.height / 2;
		sx = centerX + (radius + arcWidth / 2) * Math.cos(sangle) - img.width / 2;
		sy = centerY + (radius + arcWidth / 2) * Math.sin(sangle) - img.height / 2;
		ctx.drawImage(img, ex, ey);
		ctx.drawImage(img, sx, sy);

		var stockPer; //股票基金
		var bondPer; // 债券基金
		var moneyPer; // 货币基金

		//------------------------------------------------------------
		// 算出债券基金所占有的角度
		var oAngle = (oangle - eangle) * (180 / PI);
		if (oAngle < 0) {
			// 角度小于0时候
			oAngle = oAngle + 180 + 180;
		}
		// 债券基金所占百分比
		bondPer = Math.round(oAngle / 360 * 100);
		//------------------------------------------------------------


		//------------------------------------------------------------
		// 算出股票基金所占有的角度
		var rAngle = (sangle - oangle) * (180 / PI);
		if (rAngle < 0) {
			// 角度小于0时候
			rAngle = rAngle + 180 + 180;
		}
		// 股票基金所占百分比
		stockPer = Math.round(rAngle / 360 * 100);
		//------------------------------------------------------------

		// 货币基金所占百分比
		moneyPer = 100 - bondPer - stockPer;

		// 改变值
		if(!preFlag){
			changePre(stockPer, bondPer, moneyPer);
		}

		// 红色为零
		if(stockPer==0 && traderBack == "true"){
			counterclockwiseS=false;
		}
		// 黄色为零 
		if(bondPer==0 && traderBack == "true"){
			clockwiseE=false;
		}

		beforeSangle = sangle;
		beforeEangle = eangle;
		ctx.lineWidth = arcWidth;
	}

	function changePre(stockPer, bondPer, moneyPer) {
		setLocal('stockPer', stockPer);
		setLocal('bondPer', bondPer);
		setLocal('moneyPer', moneyPer);
		setText(totalamt, moneyPer / 100, bondPer / 100, stockPer / 100)
	}

	function getAngel(num) {
		return num * (180 / PI);
	}


	// 债券基金 (黄)

	function drawBond(eangle, oangle) {
		ctx.strokeStyle = bondperColor;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, eangle, oangle);
		ctx.stroke();
	}
	// 股票基金 (红)

	function drawStock(oangle, sangle) {
		ctx.strokeStyle = stockperColor;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, oangle, sangle);
		ctx.stroke();
	}
	// 货币基金 (绿)

	function drawMoney(sangle, eangle) {
		ctx.strokeStyle = moneyperColor;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, sangle, eangle);
		ctx.stroke();
	}


	function calAngle(x, y) {
		return Math.atan2(centerY - y, x - centerX);
	}

	function resizeCanvas() {
		c.width = $js_canvas_box.width();
		c.height = $js_canvas_box.height();
		centerX = c.width / 2;
		centerY = c.height / 2;
		if (c.width < c.height) {
			circleWidth = c.width - img.width;
		} else {
			circleWidth = c.height - img.height;
		}
		radius = circleWidth / 10 * 4; // 整圆半径
		arcWidth = circleWidth / 3; //弧形宽度
		ctx.lineWidth = arcWidth;


		if(getSettingFlag && traderBack == "true") {
			if(getLocal('stockPer') == 100){
				clockwiseS = false;
				clockwiseE = false;
			}
			if(getLocal('bondPer') == 100){
				counterclockwiseS = false;
				counterclockwiseE = false;
			}
			if(getLocal('moneyPer') == 100){
				clockwiseE = false;
				counterclockwiseS = false;
			}
		}else {
			if(stock_per == 100){
				clockwiseS = false;
				clockwiseE = false;
			}
			if(bond_per == 100){
				counterclockwiseS = false;
				counterclockwiseE = false;
			}
			if(money_per == 100){
				clockwiseE = false;
				counterclockwiseS = false;
			}
		}
		draw();
	}

	var prevX = 0;
	var prevY = 0;
	c.addEventListener('touchstart', function(event) {
		dragflag = true;
		var x = event.targetTouches[0].pageX - $(this).offset().left;
		var y = event.targetTouches[0].pageY - $(this).offset().top;
		prevX = x;
		prevY = y;
		beforeAngle = calAngle(x, y);
		var distanceEX = Math.abs(x - ex - img.width / 2);
		var distanceEY = Math.abs(y - ey - img.height / 2);
		var distanceSX = Math.abs(x - sx - img.width / 2);
		var distanceSY = Math.abs(y - sy - img.height / 2);
		var distancesquaS = distanceSX * distanceSX + distanceSY * distanceSY;
		var distancesquaE = distanceEX * distanceEX + distanceEY * distanceEY;
		if (distanceEX < img.width / 2 && distanceEY < img.height / 2) {
			EpointFlag = true;
		}
		if (distanceSX < img.width / 2 && distanceSY < img.height / 2) {
			SpointFlag = true;
		}
		if (distanceEX < img.width / 2 && distanceEY < img.height / 2 &&
			distanceSX < img.width / 2 && distanceSY < img.height / 2) {
			if (distancesquaS < distancesquaE) {
				SpointFlag = true;
				EpointFlag = false;
			} else if (distancesquaS > distancesquaE) {
				SpointFlag = false;
				EpointFlag = true;
			}

		}
		if (!clockwiseE && !counterclockwiseS) {
			startFlag = true;
		} else {
			startFlag = false;
		}
	});
	var startFlag = false;



	// 顺时针判断
	var clockwiseS = true;
	var clockwiseE = true;
	// 逆时针判断
	var counterclockwiseS = true;
	var counterclockwiseE = true;
	c.addEventListener('touchmove', function(event) {
		setSession("traderBack", "false");
		event.preventDefault();
		if (dragflag) {
			var x = event.targetTouches[0].pageX - $(this).offset().left;
			var y = event.targetTouches[0].pageY - $(this).offset().top;
			var prevAngle = calAngle(prevX, prevY) + 3 / 2 * PI;
			var currentAngle = calAngle(x, y) + 3 / 2 * PI;
			prevX = x;
			prevY = y;
			if (currentAngle > 2 * PI) {
				currentAngle = currentAngle - 2 * PI;
			}
			if (prevAngle > 2 * PI) {
				prevAngle = prevAngle - 2 * PI;
			}
			var diffAngle = calAngle(x, y) - beforeAngle;
			if (EpointFlag && SpointFlag) {
				if (diffAngle == 0) {
					return;
				} else if (diffAngle > 0) {
					EpointFlag = false;
				} else {
					SpointFlag = false;
				}
			}

			if (!clockwiseE && !counterclockwiseS && startFlag) {
				if (currentAngle - prevAngle > 0) {
					EpointFlag = true;
					SpointFlag = false;
				} else {
					EpointFlag = false;
					SpointFlag = true;
				}
				startFlag = false;
			}
			if (calAngle(x, y) > 0) {
				if (EpointFlag) {
					eangle = 2 * PI - calAngle(x, y);
				} else if (SpointFlag) {
					sangle = 2 * PI - calAngle(x, y);
				}
			} else if (calAngle(x, y) < 0) {
				if (EpointFlag) {
					eangle = -calAngle(x, y);
				}
				if (SpointFlag) {
					sangle = -calAngle(x, y);
				}
			}



			if (!counterclockwiseS && !counterclockwiseE) {
				// console.log("黄色：100");
				// drawBond (eangle, oangle);
			}
			if (!clockwiseS && !clockwiseE) {
				// console.log("红色：100");
				// drawStock (oangle, sangle);
			}
			if (!clockwiseE && !counterclockwiseS) {
				// console.log("绿色：100");
				// drawMoney (sangle, eangle)
			}

			// 判断是否是逆时针旋转
			if (SpointFlag && counterclockwiseS == false) {
				sangle = oangle;
				if (currentAngle - prevAngle < 0 && getAngel(currentAngle) > 270 && getAngel(currentAngle) < 360) {
					counterclockwiseS = true;
				}
				return;
			}
			if (EpointFlag && counterclockwiseE == false) {
				eangle = oangle;
				if (currentAngle - prevAngle < 0 && getAngel(currentAngle) > 90 && getAngel(currentAngle) < 360) {
					counterclockwiseE = true;
				}
				return;
			}
			// 逆时针重叠
			if ((getAngel(currentAngle) < 90 || getAngel(currentAngle) == 360) && getAngel(prevAngle) > 270) {
				if (SpointFlag && clockwiseS) {
					sangle = oangle;
					counterclockwiseS = false;
				}
				if (EpointFlag && clockwiseE) {
					eangle = oangle;
					sangle = eangle;
					counterclockwiseS = false;
					counterclockwiseE = false;
				}
			}


			// 判断是否是逆时针旋转
			if (SpointFlag && clockwiseS == false) {
				sangle = oangle;
				if (currentAngle - prevAngle > 0 && getAngel(currentAngle) > 0 && getAngel(currentAngle) < 270) {
					clockwiseS = true;
				}
				return;
			}
			if (EpointFlag && clockwiseE == false) {
				eangle = oangle;
				if (currentAngle - prevAngle > 0 && getAngel(currentAngle) > 0 && getAngel(currentAngle) < 90) {
					clockwiseE = true;
				}
				return;
			}

			// 顺时针重叠
			if ((getAngel(currentAngle) > 270 || getAngel(currentAngle) == 360) && getAngel(prevAngle) < 90) {
				if (SpointFlag && counterclockwiseS) {
					sangle = oangle;
					eangle = sangle;
					clockwiseS = false;
					clockwiseE = false;
				}
				if (EpointFlag && counterclockwiseE) {
					eangle = oangle;
					clockwiseE = false;
				}
			}

			var oA = getAngel(oangle);
			var sA = getAngel(sangle);
			var eA = getAngel(eangle);
			if (eA < oA) {
				var tempE = oA - eA;
			} else {
				var tempE = 360 - (eA - oA);
			}
			tempE = 360 - tempE;

			if (sA > oA) {
				var tempS = sA - oA;
			} else {
				var tempS = 360 - (oA - sA);
			}
			if (clockwiseS && clockwiseE && counterclockwiseS && counterclockwiseE) {
				if (EpointFlag && currentAngle - prevAngle > 0 && tempE < tempS && tempS != 360) {
					sangle = eangle;
				}
				if (SpointFlag && currentAngle - prevAngle < 0 && tempE < tempS && tempE != 0) {
					eangle = sangle;
				}
			}
			if(counterclockwiseS && !counterclockwiseE) {
				eangle = sangle ;
				counterclockwiseS = true;
				counterclockwiseE = true;
			}
			if(!clockwiseS && clockwiseE) {
				sangle = eangle ;
				clockwiseS = true;
				clockwiseE = true;
			}

			draw();


		}
	});

	c.addEventListener('touchend', function(event) {
		EpointFlag = false;
		SpointFlag = false;
		dragflag = false;
	});

	// 点击隐藏
	var $js_trader_pop = $("#js_trader_pop").on('click', function() {
		$(this).hide();
	}).hide().css("z-index", 9999);
	$("#js_strategy_btn").on('click', function() {
		$("#js_trader_pop").show();
	});

	// 点我试试
	var bond_per = 0;
	var money_per = 0;
	var stock_per = 0;
	var getSettingFlag = true;
	$("#js_get_setting").on('click', function() {
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "adviceper"
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode==1000){
					getSettingFlag = false;
					bond_per=data.adviseper.BOND_PER;
					money_per=data.adviseper.MONEY_PER;
					stock_per=data.adviseper.STOCK_PER;
					var html=data.adviseper.MEM.replace(/\r|\n|\r\n/, "<br>");
					$("#js_content").html(html);
					$("#js_get_setting_box").show();
				}else {
					myAlert(data.errmsg);
				}
			}
		});
	});
	// 取消按钮
	$("#js_cancel_btn").on('click', function() {
		getSettingFlag = true;
		$("#js_get_setting_box").hide();
	});
	// 试试按钮
	$("#js_ok_btn").on('click', function() {
		oangle = 3 / 2 * PI;
		// 股票基金（红色）
		sangle = 3 / 2 * PI + stock_per / 100 * 2 * PI;
		// 债券基金（黄色）
		eangle = 3 / 2 * PI - bond_per / 100 * 2 * PI;
		resizeCanvas();
		$("#js_get_setting_box").hide();
		getSettingFlag = true;
		document.location.href="trader_ok.html";
	});
});

// 提交配置 pic_div
$(function() {
	if ($("#pic_div").length == 0) return;
	var stockPer = getLocal('stockPer');
	var moneyPer = getLocal('moneyPer');
	var bondPer = getLocal('bondPer');
	var totalamt = 0; //总资产
	if (getLocal("totalamt")) {
		totalamt = getLocal("totalamt");
	}
	var risklevel = 1; //总资产
	if (getLocal("risklevel")) {
		risklevel = getLocal("risklevel");
	}
	var data = [{
		name: '股票基金',
		value: stockPer,
		color: '#f94138'
	}, {
		name: '货币基金',
		value: moneyPer,
		color: '#63cd33'
	}, {
		name: '债券基金',
		value: bondPer,
		color: '#ffd321'
	}];

	var chart = new iChart.Donut2D({
		render: 'pic_div',
		border: false,
		// center: {
		// 	text: '本次配置',
		// 	font: '微软雅黑',
		// 	fontweight: '100',
		// 	fontsize: 16,
		// 	color: '#0696d3'
		// },
		data: data,
		background_color: '#f1f1f1',
		separate_angle: 0, //分离角度
		sub_option: {
			label: false
		},
		offset_angle: -90,
		donutwidth: 0,
		decimalsnum: 2,
		bound_event: false,
		width: 140,
		height: 140,
		radius: '100%'
	});
	chart.on('click', function() {});
	chart.draw();

	$("#stockper").text(stockPer + "%");
	$("#bondper").text(bondPer + "%");
	$("#moneyper").text(moneyPer + "%");

	$("#js_back").on('click', function() {
		setSession("traderBack", "true");
		history.back();
	});
	$(".back_icon").on('click', function() {
		setSession("traderBack", "true");
	});
	// 提交按钮
	$("#js_trader_ok_btn").on('click', function() {
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "regaddremap",
				"positionstr": "0," + moneyPer / 100 + "|1," + bondPer / 100 + "|2," + stockPer / 100,
				"totalmount": totalamt,
				"risklevel": risklevel,
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				processed();
				if (data.resCode == 1000) {
					setSession("traderBack", "false");
					myAlert("提交成功", function() {
						document.location.href = "trader.html";
					});

				} else {
					myAlert(data.errmsg, function() {
						if (data.errcode == "500000") {
							document.location.href = "perfect_info.html";
						}
					});
				}
			}
		});
	});
});