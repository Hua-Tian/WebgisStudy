var isIE = /msie/.test(navigator.userAgent.toLowerCase());
if(isIE){
 $("head").append('<style>@media print{#map{max-height:24cm!important;}}</style>');
}else{
 $("head").append('<style>@media print{#map{max-height:21cm!important;}}</style>');
}

// 设置高度
	function initPage(flag){
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			var headHeight = $("#top").height();
			var height = windowHeight-headHeight-7;

			var loadingWidth = $("#loading").width();
			var loadingHeight = $("#loading").height();

			var loadingTop = (windowHeight-loadingHeight)/2;
			var loadingLeft = (windowWidth-loadingWidth)/2;

			$("#leftmenu").height(height);
			$("#rightmenu").height(height);

			if(flag){
				$("#map").height(height);
				$("#mask").height(windowHeight);
				$("#mask").width(windowWidth);
				$("#loading").css("top",loadingTop);
				$("#loading").css("left",loadingLeft);
				mapPopWindow();
			}
	}

	// 全局ajax遮罩
	$(document).ajaxStart(function(){
		$("#mask").show();
		$("#loading").show();
		//$("#btnquery,#option-query").attr("disabled",true);
	}).ajaxStop(function(){
		$("#mask").hide();
		$("#loading").hide();
		//$("#btnquery,#option-query").attr("disabled",false);
	}).ajaxError(function(event, jqxhr, settings, thrownError) {
		$("#mask").hide();
		$("#loading").hide();
		//$("#btnquery,#option-query").attr("disabled",false);
		var msg = $.parseJSON(jqxhr.responseText).msg;
		if (jqxhr.status==401) {
			logout();
		}else if(jqxhr.status==400){
			$.tremaps.showMessage(msg);
		}else if(jqxhr.status==401){
			$.tremaps.showMessage(msg);
		}else if(jqxhr.status==500){
			$.tremaps.showMessage(msg);
		}else if(jqxhr.status==502){
			$.tremaps.showMessage(msg);
		}
	}).ajaxComplete(function(XMLHttpRequest,status){
		if(status.statusText=="timeout"){
			$.tremaps.showMessage("请求超时");
		}
	});	

	// ajax get
	function get(mt,data,callback,options){
		var opt = {
			async:true,
			stopIfNull:true
		}

  	options = typeof options == 'object' && options;
		$.extend(opt, options); 

		var tmpurl = "";
		var u = mt.split(",");
		if(u.length>1){
			tmpurl = url+urlpaths[u[0]].format(u[1]);
		}else{
			tmpurl=urlpaths[u[0]]==undefined?u[0]:url+urlpaths[u[0]];
		}
		data.ts=new Date().getTime();

		$.ajax({
			url:tmpurl,
			data:data,
			dataType:"json",
			async:opt.async,
			//timeout:30000,
			success:function(result){
				if(opt.stopIfNull && result.length==0){
					$.tremaps.showMessage("M-049");
					return;
				}

				callback(result);
			}
		});
	}

	// ajax post
	function post(mt,data,callback,options){
		var opt = {
			async:true,
			stopIfNull:true
		}

  	options = typeof options == 'object' && options;
		$.extend(opt, options); 
		$.ajax({
			url:url+urlpaths[mt],
			data:JSON.stringify(data),
			type:"post",
		  contentType:"application/json; charset=utf-8",  
			dataType:"json",
			success:function(result){
				if(opt.stopIfNull && result.length==0){
					$.tremaps.showMessage("M-049");
					return;
				}
				callback(result);
			}
		});
	}	
	// ajax put
	function put(mt,data,callback,options){
		var opt = {
			async:true,
			stopIfNull:true
		}

  	options = typeof options == 'object' && options;
		$.extend(opt, options); 

		var tmpurl = "";
		var u = mt.split(",");
		if(u.length>1){
			tmpurl = url+urlpaths[u[0]].format(u[1]);
		}else{
			tmpurl=urlpaths[u[0]]==undefined?u[0]:url+urlpaths[u[0]];
		}
		$.ajax({
			url:tmpurl,
			data:JSON.stringify(data),
			type:"put",
		  contentType:"application/json; charset=utf-8",  
			dataType:"json",
			success:function(result){
				if(opt.stopIfNull && result.length==0){
					$.tremaps.showMessage("M-049");
					return;
				}
				callback(result);
			},
			error:function(e){
				if (e.status==200) {
					$.tremaps.showMessage("編集成功しました。");
				}
			}
		});
	}

	// 地图数据统计 显示位置控制
	function mapPopWindow(){
		var windowHeight = $(document).height();
		var windowWidth = $(document).width();
		var topHeight = $("#top").height();
		var mapHeadHeight = $("#mapheader").height();
		var mapHeight = windowHeight-topHeight-mapHeadHeight-40;
		var popWindows = $(".businessarea");
		var addedHeight=0;
		var leftWidth = 5;
		var index = 1;
		var top =mapHeadHeight+12;

		if($("#pac-input").length>0){
			top += $("#pac-input").height()+8;
			mapHeight-=35;
		}

		popWindows.each(function(){
			popWindowHeight = $(this).height();
			if((mapHeight-addedHeight)>=popWindowHeight){
				if(addedHeight==0){					
					var style = "top: "+(top)+"px!important; left: "+leftWidth+"px!important;";
					$(this).addClass("popfirst");
				}else{
					var style = "top: "+(top+addedHeight)+"px!important; left: "+leftWidth+"px!important;";
				}
				addedHeight+=popWindowHeight+20;
			}else{
				var leftPopWidth = $(".popfirst").width()+30;
				var style = "top: "+(top)+"px!important; left: "+(leftPopWidth)+"px!important;";
			}
			$("head").append('<style>#businessarea'+index+'{'+style+'}</style>');
			index++;
		});
	}



	$(function(){
		
		// 关闭bootstrap动画
		$.support.transition = false;

		// 右上角公司名 登录名显示
		var cn = decodeURIComponent(getCookie("companyName"));
		$("#companyname").html(cn);
		$("#companyname").attr("title",cn);
		$("#loginuser").html(decodeURIComponent(getCookie("userName").replace("+","%20"))+"様");

		//  初始化页面高度 
		initPage(true);

		$(window).resize(function(){
			$("body").css("overflow","hidden");
			initPage(true)
			$("body").css("overflow","auto");
		});

		$('#rightmenu').on('show.bs.collapse', function () {
	  	$('#rightmenu').fadeIn(500);
	  	$("#storeupdate div:eq(1)").attr("style","position: absolute; top: 0px; left: 0px; width: 210px; height: 43px; overflow: hidden; bottom: auto; right: auto;");
	  	//$("#competitorupdate div:eq(1)").attr("style","position: absolute; top: 0px; left: 0px; width: 210px; height: 43px; overflow: hidden; bottom: auto; right: auto;");
	  	storeUploader.options.formData = {"companycd":$.data(document,"companyCd")};
	  	//competitorUploader.options.formData = {"companycd":$.data(document,"companyCd")};
		})
		$('#rightmenu').on('hide.bs.collapse', function () {
	  	$('#rightmenu').fadeOut(500);
		})


		$('#rightmenu').on('shown.bs.collapse', function () {
	  		initPage(false);
		})

		$("#rightmenu").on("click","a",function(){
			//if($(this).hasClass("disabled"))return false;
			$('#rightmenu').collapse('hide');
		});

		

		// 左菜单显示
		$('#leftmenu').on('shown.bs.collapse', function () {
			initPage(false);
			$(".left-collapse").addClass("glyphicon-menu-left");
			$(".left-collapse").removeClass("glyphicon-menu-right");
			$(".navbar-title").css("background-color","#367FA9");
			$(".navbar-title").css("border-right","none");
			google.maps.event.trigger(map, 'resize');
		});	

		// 左菜单隐藏
		$('#leftmenu').on('hidden.bs.collapse', function () {
			$(".left-collapse").removeClass("glyphicon-menu-left");
			$(".left-collapse").addClass("glyphicon-menu-right");
			$(".navbar-title").css("background-color","#3C8DBC");
			$(".navbar-title").css("border-right","solid 1px #367FA9");
			google.maps.event.trigger(map, 'resize');
		});


		$(".part-collapse").click(function(){
				var target = $(this).attr("target");
				var display = $(this).attr("toggle");

				$(this).removeClass("part-collapse-in");
				$(this).siblings("img").addClass("part-collapse-in");

				if(display=="show"){
					$("#"+target).show();
					$(this).siblings("div").show();
					
					if(!$(this).siblings(".part-title").hasClass("show")){
						$(this).siblings(".part-title").hide();
					}
				}else{
					$("#"+target).hide();
					$(this).siblings("div").hide();
					$(this).siblings(".part-title").show();
				}
		});

		// 选项类别切换
		$("#leftmenu").on("change","input[type='radio']",function(){
			$.each($("#leftmenu input[type='radio']:not(:checked)"),function(){
				$(this).parent().removeClass("btn-primary");
				$(this).parent().removeClass("active");
				$(this).parent().addClass("btn-default");
			});
		
			$.each($("#leftmenu input[type='radio']:checked"),function(){
				$(this).parent().removeClass("btn-default");
				$(this).parent().addClass("btn-primary");
				$(this).parent().addClass("active");
			});

			$(this).parent().siblings(".part-title").text($(this).parent().text());
			$("#"+$(this).attr("target")).siblings(".tab-pane").removeClass("active");
			$("#"+$(this).attr("target")).addClass("active");
		});

		get("rightmenu",{},function(result){
			$.data(document,"auth",result.data==""?false:true);
			$(result.data).insertAfter($("#rightmenu div:first"));

			storeUploader = WebUploader.create({
		    auto: true,
		    swf: '/js/webuploader-0.1.5/Uploader.swf',
		    server: url + "excel/store",
		    pick:{
		    	id:'#storeupdate',
		    	multiple:false
		    },		    
				accept: {
				    title: 'CSV',
				    extensions: 'csv',
				    mimeTypes: 'text/comma-separated-values'
				},
        onError: function() {
          var args = [].slice.call(arguments, 0);
          if (args[0]=="Q_TYPE_DENIED") {
            $.tremaps.showMessage("M-050");
          }
        }
			});
			storeUploader.on( 'uploadProgress', function(file) {
				$("#loading,#mask").show();
			});
			storeUploader.on( 'uploadSuccess', function(file) {
				$.tremaps.showMessage("M-028");
			});
			storeUploader.on( 'uploadError', function(file) {
				$.tremaps.showMessage("M-030");
			});
			storeUploader.on( 'uploadComplete', function(file) {
				$("#loading,#mask").hide();
				storeUploader.removeFile(file);
			});
/*			
			competitorUploader = WebUploader.create({
		    auto: true,
		    swf: '/js/webuploader-0.1.5/Uploader.swf',
		    server: url + "excel/competition",
		    pick:{
		    	id:'#competitorupdate',
		    	multiple:false
		    },
				accept: {
				    title: 'CSV',
				    extensions: 'csv',
				    mimeTypes: 'text/comma-separated-values'
				},
        onError: function() {
          var args = [].slice.call(arguments, 0);
          if (args[0]=="Q_TYPE_DENIED") {
            $.tremaps.showMessage("M-050");
          }
        }
			});
			competitorUploader.on( 'uploadProgress', function() {
				$("#loading,#mask").show();
			});
			competitorUploader.on( 'uploadSuccess', function() {
				$.tremaps.showMessage("M-018");
			});
			competitorUploader.on( 'uploadError', function() {
				$.tremaps.showMessage("M-020");
			});
			competitorUploader.on( 'uploadComplete', function() {
				$("#loading,#mask").hide();
			});
*/			
		});

	});


