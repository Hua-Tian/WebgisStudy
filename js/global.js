var fields = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","aa","ab","ac","ad","ae","af","ag","ah","ai","aj","ak","al","am","an","ao","ap","aq","ar","as","at","au","av","aw"];
//var loginurl = "http://10.100.2.138/webgis/login";
var loginurl = "/menu/login";
var url = "/webgis/";
var urlpaths={"mcompanys":"master/companys",
							"mstores":"master/stores",
							"mdates":"master/dates",
							"mproducttitles":"master/producttitles",
							"mproducts":"master/products",
							"moptions":"master/options",
							"mranges":"master/ranges",
							"mcooperation":"master/cooperation",
							"mcompetition":"master/competition",
							"mcompetitiontype":"master/competitiontype",
							"dsareas":"data/store/areas",
							"test":"data/storetest",
							"darea":"data/areas/{0}",
							"dnewstorearea":"data/newstore/areas/{0}",
							"dareas":"data/areas",
							"dareas1":"data/areas/1",
							"danalysis":"data/analysis",
							"dcompetition":"data/competition",
							"dcooperation":"data/cooperation",
							"dcoords":"data/coords",
							"dcircletotals":"data/circletotals",
							"emap":"excel/map",
							"ecompetition":"excel/competition",
							"estore":"excel/store",
							"ageband":"master/options/{0}/ageband",//{0}option3 val
							"rightmenu":"master/rightmenu",
							"newstorearea":"data/newstore/areas",
							"dnewstoretotals":"data/newstore/circletotals",
							"eanalysis":"data/analysis/{0}",//{0}addresscd val
							"A001":"excel/adm/map",
							"A002":"data/adm/circletotals",
							"A003":"data/adm/areas/{0}"

						};
						
var Enumerable = $.Enumerable;

//店舗配列、区域配列、商圏設定
var storeArray=[],regionArray=[],disSikunionArray=[],disRegionArray=[],businessArray=[],storeRegionArray=[];
//drawing フリー:ライン配列、フリー区域
var drawingManager,linePath=[],lineArea;
var freeLinePath=[],freeBusinessArea;
//マップ
var map;
var colorLevel = ["#2892C7","#68A6B3","#95BD9F","#BFD48A","#E7ED72","#FCE45B","#FCB344","#FA8532","#F25622","#E81014"];
var levelArray=[];

var mapStoreArray=[],mapRegionArray={},mapRegionShowArray=[],mapBusinessArray=[];

var mapCooperationArray=[],mapCompetitorArray=[];	var competitordatas = [];	var productLevelNum;//商品阶层数量
var class0Array = [],class1Array = [],classCompanyArray = [];
var storeUploader,competitorUploader;
var bounds=null;
var messages={
	"M-001":"100店以上の表示ができないので、もっと条件の絞りをください。"
	,"M-002":"該当する店舗が見つかりませんでした。"
	,"M-003":"対象店舗を選択してください。"
	,"M-004":" 出力できるものがありません。まず地図表示してください。"
	,"M-005":"印刷できるものがありません。まず地図表示してください。"
	,"M-006":"商圏は最低1つ以上設定してください。"
	,"M-007":"距離は0.1～20.0までの小数を入力してください。"
	,"M-008":"商圏は最大3つまで設定してください。"
	,"M-009":"同じ商圏はすでに設定されています。別の商圏を設定してください。"
	,"M-010":"ドライブタイムは1～60までの整数を入力してください。"
	,"M-011":"ドライブ商圏の時間を入力してください。"
	,"M-012":"円商圏の距離を設定しだくだい。"
	,"M-013":"フリー商圏は描画中です。「完了」ボタンをクリックしてから、追加してください。"
	,"M-014":"フリー商圏を描画してから、追加してください。"
	,"M-015":"店舗名を入力してください。"
	,"M-016":"競合店登録しました。"
	,"M-017":"競合店の登録に失敗しました。"
	,"M-018":"競合店マスタをアップロードしました。"
	,"M-019":"競合店マスタのアップロードに失敗しました。フォーマットを確認してください。"
	,"M-020":"競合店マスタのアップロードに失敗しました。もう一度アップロードしてください。"
	,"M-021":"サーバーに接続できません。"
	,"M-022":"ACTサービスに接続中です。"
	,"M-023":"最大5つ店舗を選択してください。"
	,"M-028":"店舗マスタをアップロードしました。"
	,"M-029":"店舗マスタのアップロードに失敗しました。フォーマットを確認してください。"
	,"M-030":"店舗マスタのアップロードに失敗しました。もう一度アップロードしてください。"
	,"M-034":"行政区域を選択してください。"
	,"M-035":"分析地を登録しました。"
	,"M-036":"分析地の登録が失敗でした。"
	,"M-037":"分析地を修正しました。"
	,"M-038":"分析地の修正に失敗しました。"
	,"M-039":"分析地を削除しました。"
	,"M-040":"分析地の削除に失敗しました。"
	,"M-041":"該当する市区町村が見つかりませんでした。"
	,"M-042":"該当する町・大字が見つかりませんでした。"
	,"M-043":"該当する丁目・字が見つかりませんでした。"
	,"M-044":"サーバの接続には問題がありそうですので、管理者と連絡をしてください。"
	,"M-045":"行政区域を最小地域を選択してください。"
	,"M-046":"分析地名を入力してください。"
	,"M-047":"フリー商圏が一つしか設定できないです。"
	,"M-048":"年代を選択してください。"
	,"M-049":"該当するデータがありません。"
	,"M-050":"CSVファイルを選択してください。"
};
var maxRange = 0,arealevel = "arealevel4";

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

function getCookie(key){
	//获取cookie字符串
	var strCookie=document.cookie;
	//将多cookie切割为多个名/值对
	var arrCookie=strCookie.split("; ");
	//遍历cookie数组，处理每个cookie对
	for(var i=0;i<arrCookie.length;i++){
		var arr=arrCookie[i].split("=");
		//找到名称为userId的cookie，并返回它的值
		if(key==arr[0]){
			return arr[1];
			break;
		}
	}
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function enablePrint(){
	$(".hidden-print").removeClass("hidden-print");
}

function addKannma(number) {  
     var num = number + "";  
     num = num.replace(new RegExp(",","g"),"");   
     // 正负号处理   
     var symble = "";   
     if(/^([-+]).*$/.test(num)) {   
         symble = num.replace(/^([-+]).*$/,"$1");   
         num = num.replace(/^([-+])(.*)$/,"$2");   
     }   
   
     if(/^[0-9]+(\.[0-9]+)?$/.test(num)) {   
         //var num = num.replace(new RegExp("^[0]+","g"),"");   
         if(/^\./.test(num)) {   
         num = "0" + num;   
         }   
   
         var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/,"$1");   
         var integer= num.replace(/^([0-9]+)(\.[0-9]+)?$/,"$1");   
   
         var re=/(\d+)(\d{3})/;  
   
         while(re.test(integer)){   
             integer = integer.replace(re,"$1,$2");  
         }   
         return symble + integer + decimal;   
   
     } else {   
         return number;   
     }   
 }

var Month = {
	data:{},
	setData:function(result){
		Month.data= Enumerable.From(result).OrderByDescending("$.a");
		Month.fillData();
	},
	fillData:function(){
		Month.data
			.Select(function (x) { return $("<option value='"+x.a+"'>").text(x.b)[0] })
	    .TojQuery()
	    .appendTo("#month0");		

    Month.data
			.Select(function (x) { return $("<option value='"+x.a+"'>").text(x.c)[0] })
    	.TojQuery()
    	.appendTo("#month1");

    Month.data
			.Select(function (x) { return $("<option value='"+x.a+"'>").text(x.d)[0] })
    	.TojQuery()
    	.appendTo("#month2");
	},
	fillCompareMonth:function(){
		// 从比较月中删除当前选中月
		$comparemonth = $("#comparemonth");
		$comparemonth.html($("#month0").html());
		$comparemonth.children("option[value='"+$("#month0").val()+"']").remove();
		$comparemonth.show();
	}
}

var Option = {
	data:{},
	defaultValue:"",
	setData:function(result){
		Option.data = Enumerable.From(result);
		$.data(document,"option",Option.data);
		Option.fillData(0);
	},
	getCondition:function(){
		var condition="1";
		if($(".select-product").length>0){
			condition+=$(".select-product option:selected[value!='0']").length>0?" && $.l==1":" && $.k==1";
		}else if($("#area4").length>0){
			// 分析地
			condition+=" && $.n==1";
		}else{
			// 行政界
			condition+=" && $.m==1";
		}
		condition+=$("#option1").val()==null?"":" && $.b=='"+$("#option1").val()+"'";
		condition+=$("#option2").val()==null?"":" && $.d=='"+$("#option2").val()+"'";
		condition+=$("#hidmonthcompare").val()==1?" && ($.i==1 || $.j==1)":"";
		return condition;
	},
	fillData:function(start){
		var temp = Option.data;
		// 0  初始设置
		if(start==0){
			$("#option1").empty();
			$("#option2").empty();
			$("#option3").empty();
			$("#agescale").val("00");
			$("#showlabel")[0].checked=false;
			$("#arealevel").val("arealevel4");
			$("#less")[0].checked = false;
			$("#proportion")[0].checked=false;
		}
		// 初始2 3层
		if(start==1){
			$("#option2").empty();
			$("#option3").empty();
		}
		// 初始 3 层
		if(start==2){
			$("#option3").empty();
		}

		if(start==0){
			var defaultvalue = Option.defaultValue;// $.data(document,"defaultRange");
			var defaultrow = temp.Where("$.f=='"+defaultvalue+"'")
													.Select("{option1val:$.b,option2val:$.d,option3val:$.f,}")
													.ToArray()[0];
		}

		if(start<1){
			temp = temp.Where(Option.getCondition());
			temp.Distinct("$.b")
			.Select(function (x) { return $("<option value='"+x.b+"'>").text(x.c)[0] })
	    .TojQuery()
	    .appendTo("#option1");
	    defaultrow==undefined?"":$("#option1").val(defaultrow.option1val);
		}

		if(start<2){
			temp = temp.Where(Option.getCondition());
			temp.Distinct("$.d")
			.Select(function (x) { return $("<option value='"+x.d+"'>").text(x.e)[0] })
	    .TojQuery()
	    .appendTo("#option2");
	    defaultrow==undefined?"":$("#option2").val(defaultrow.option2val);
		}

		if(start<3){
			temp = temp.Where(Option.getCondition());
			temp.Distinct("$.f")
			.ForEach(function (x) { 
			//	debugger;
				var op = $("<option value='"+x.f+"'>");
				op.text(x.g);
				$("#option3").append(op);
				$.data(op[0],"ageswitch",x.h);
				$.data(op[0],"lessswitch",x.i);
				$.data(op[0],"proportionswitch",x.j);
				$.data(op[0],"pluseswitch",x.av);
				$.data(op[0],"exchangeswitch",x.aw);
			});
	    if(defaultrow!=undefined){
	    	$("#option3").val(defaultrow.option3val);
	    }
 			$("#option3").change();
		}
	},
	switchOption:	function(){
		var op=$("#option3 option:selected")[0];
		// 重置状态
		//$("#less")[0].checked=false;
		//$("#proportion")[0].checked=false;
		$("#age").empty();
		$("#age").siblings("button").find("span").empty();

		// 取出 年龄代 开关
		var ageswitch = $.data(op,"ageswitch");
		// 取出 差 开关
		var lessswitch = $.data(op,"lessswitch");
		// 取出 率 开关
		var proportionswitch = $.data(op,"proportionswitch");

		if(ageswitch!=1){
			// 关闭年龄代
			$("#agescale").val("00");			
			$("#agescale").attr("disabled","");
			$("#age").siblings("button").attr("disabled","");
			$("#age").attr("disabled","");
		}else{
			// 开启年龄代
			$("#agescale").removeAttr("disabled");
			$("#agescale").val("00");

			// 根据年龄带取年龄刻度
			get("ageband,"+$("#option3").val(),{datetype:$("#hiddatetype").val(),companycd:$("#hidcompanycd").val()},function(result){
				$.data(document,"ageband",Enumerable.From(result));
				$("#agescale").change();
			});
		}

		if($("#hidmonthcompare").val()==1 && $("#hiddatetype").val()==0)	
		{
			// 如果选择了昨对或者比较 
			// 根据数据设置差和率的可用状态
			if(proportionswitch!=1){
				$("#proportion")[0].checked = false;
				$("#proportion").attr("disabled","");			
			}else{
				$("#proportion").removeAttr("disabled");			
			}

			if(lessswitch!=1){
				$("#less")[0].checked = false;
				$("#less").attr("disabled","");
			}else{
				$("#less").removeAttr("disabled");
				if(!$("#proportion")[0].checked){
					$("#less")[0].checked = true;
				}
			}
		}else{
			// 没有选择昨对或比较 禁用差和率 
			$("#less").attr("disabled","");
			$("#proportion").attr("disabled","");			
		}
	},
	showDefaultLevel:	function(){
		var op = $("#option3 option:selected")[0];
		var op3val = $("#option3").val();
		// 百分比转换开关
		var exchangeswitch = $.data(op,"exchangeswitch");

		// 原数据
		var colnmIndex = 14;
		if($("#hidmonthcompare").val()==1){
			if($("#less")[0].checked){
			 	// 差数据
			 	colnmIndex=24;
			}else if($("#proportion")[0].checked){
				// 比率数据
				colnmIndex=34;
			}
		}

		var select="["
		for(var i=colnmIndex;i<colnmIndex+10;i++){
			select+="$."+fields[i];
			if(i<colnmIndex+9){
				select+=",";
			}
		}
		select+="]";
		var arr = $.data(document,"option").Where("$.f=='"+op3val+"'").Select(select).ToArray();
		levelArray=[];
		for(var i =0;i<arr[0].length;i++){
			levelArray.push(arr[0][i]*1);
			if(exchangeswitch==1|| $("#proportion")[0].checked){
				$(".level-text"+(i+1)).text((arr[0][i]*100).toFixed(1)+"%以上");
			}else{
				$(".level-text"+(i+1)).text(addKannma(arr[0][i])+"以上");
			}
		}
	},
	showAgeLevel:function(){
		var vals = $("#age").val();
		var option = $("#option3 option:selected")[0];
		var pluseswitch = $.data(option,"pluseswitch");
		var exchangeswitch = $.data(option,"exchangeswitch");

		if(!$("#proportion")[0].checked && vals!=null){
			var condition = "";
			for(var i=0;i<vals.length;i++){
				condition+="$.a=='"+vals[i]+"'";
				if(i<vals.length-1){
					condition+=" || ";
				}
			}
			levelArray=[];
			for(var i =3;i<13;i++){
				var level = 0;
				$.data(document,"ageband").Where(condition).Select("$."+fields[i]).ForEach(function(x){
					x=x*1;
					if(exchangeswitch==1){
						level = x;
					}else{
						if(pluseswitch ==1){
							level+= x;				
						}else{
							level = x;
						}	
					}
				});
				levelArray.push(level);
				if(exchangeswitch==1|| $("#proportion")[0].checked){
					$(".level-text"+(i-2)).text((level*100).toFixed(1)+"%以上");
				}else{
					$(".level-text"+(i-2)).text(addKannma(level)+"以上");
				}
			}
		}
	}
}

function enableRight(){
	$("#downexcel,#print").removeClass("disabled");
}

function logout(){
	setCookie("key","",-1);
	setCookie("userId","",-1);
	setCookie("userName","",-1);
	setCookie("companyId","",-1);
	setCookie("companyName","",-1);
	location.href=loginurl;
}

$(function(){

	$("#print").click(function(){
		if($(this).hasClass("disabled")){
			$.tremaps.showMessage("M-005");
			return;
		}
		//setTitle();
		window.print();
	});

	$("#logout").click(function(){
		logout();
	});

	$("#option1").change(function(){
		Option.fillData(1);
	});
	$("#option2").change(function(){
		Option.fillData(2);
	});
	$("#option3").change(function(){
		if($(this).val()!=null){
			Option.switchOption();
			Option.showDefaultLevel();
		}
	});

	// 率禁用并且差可用 差不可以取消选择
	// 率可用并且差可用 差取消时选中率
	$("#less").click(function(){
		if($("#hidmonthcompare").val()==1){
			var $proportion = $("#proportion");
			
			$proportion[0].checked=false;//.removeAttr("checked");
			$(this)[0].checked=true;

			// 根据年龄带选择 显示颜色刻度
			//if($("#agescale").val()=="00" && $("#age").val()==null){
			 	Option.showDefaultLevel();
			//}else{
			//	Option.showAgeLevel();
			//}
		}
	});

	// 差禁用并且率可用 率不可以取消选择
	// 率可用并且差可用 率取消时选中差
	$("#proportion").click(function(){
		if($("#hidmonthcompare").val()==1){
			var $less = $("#less");

				$less[0].checked=false;

				$(this)[0].checked=true;
			
			// 根据年龄带选择 显示颜色刻度
			//if($("#agescale").val()=="00" && $("#age").val()==null){
			 	Option.showDefaultLevel();
			//}else{
			//	Option.showAgeLevel();
			//}
		}
	});

	// 年龄带变化时 根据年龄带显示年龄刻度
	$("#agescale").change(function(){
		var $age = $("#age");
		var scale = $(this).val();
		var temp=null;
		$age.removeAttr("disabled","");
		$age.siblings("button").removeAttr("disabled","");
		// 全体时刻度禁用
		if(scale=="00"){
			$age.empty();
			$age.attr("disabled","");
			$age.siblings("button").attr("disabled","");
			Option.showDefaultLevel();
		}else if(scale=="05"){
			// 5岁
			temp = $.data(document,"ageband").Where("$.c=='05'");
		}else{
			// 10岁
			temp = $.data(document,"ageband").Where("$.c=='10'");
		}

		if(temp!=null){
			$age.empty();
			temp.Select(function(x){return $("<option value='"+x.a+"'>").text(x.b)[0]})
			.TojQuery()
			.appendTo(age);
		}
		$age.selectpicker("refresh");
	});

	$("#age").parent().on('hidden.bs.dropdown', function () {
		if($("#hidmonthcompare").val()==1){
			Option.showDefaultLevel();
		}else{
			Option.showAgeLevel();
		}
	});

	//----↓時間
	// 点击昨对时取消对比选中并隐藏比较月列表
	$("#yesterday").click(function(){
		$("#compare")[0].checked=false;
		$comparemonth = $("#comparemonth");
		$comparemonth.hide();
		$comparemonth.empty();
	});

	// 单月选择最新月 昨对可用 否则不可用
	// 如果对比选中 更新对比月列表
	$("#month0").change(function(){
		var $yesterday = $("#yesterday");
		if($(this).children("option:first").is(":selected")){
			$yesterday.removeAttr("disabled");
		}else{
			$yesterday[0].checked=false;
			$yesterday.attr("disabled","");
		}
		if($("#compare")[0].checked)Month.fillCompareMonth();
	});

	// 点击比较时取消昨对选中 
	// 选中是显示比较月列表
	$("#compare").click(function(){
		$("#yesterday")[0].checked=false;
		if($(this).is(':checked')){
			Month.fillCompareMonth();
		}else{
			$comparemonth = $("#comparemonth");
			$comparemonth.hide();
			$comparemonth.empty();
		}
	});
	//----↑時間

	//----↓文件上传下载

	$("#rightmenu").on("click","#storedown",function(){
		$("#downfile").attr("src",url+"excel/store?companycd="+$.data(document,"companyCd"));
	});
	/*$("#rightmenu").on("click","#storeupdate",function(){
		$("#file").attr("updatetype",1);
		//$("#file").click();
		$("#storefile").click();
	});*/
	$("#rightmenu").on("click","#competitordown",function(){
		$("#downfile").attr("src",url+"excel/competition?companycd="+$.data(document,"companyCd"));
	});
	/*$("#rightmenu").on("click","#competitorupdate",function(){
		$("#file").attr("updatetype",2);
		//$("#file").click();
		$("#competitorfile").click();
	});*/
	/*$("#file").change(function(){
		if ($('input[type="file"]').val()=="") {
			return;
		}
		var updatetype = $(this).attr("updatetype");
		var msg = "M-028";
		var posturl = url + "excel/store";
		if (updatetype==2) {
			posturl = url + "excel/competition";
			msg = "M-018";
		}
		UpdateFile({
			url:posturl,
			msg:msg
		});
	});*/
	//----↑文件上传下载
});

function replaceHtml(source){
	return (""+source).replace(new RegExp("&",'gm'),"&amp;").replace(new RegExp("<",'gm'),"&lt;").replace(new RegExp(">",'gm'),"&gt;");
}

/* 文件上传 */
var UpdateFile = function (options) { 
	$("#updatefile input[name='companycd']").val($.data(document,"companyCd"));
	var formData = new FormData($("#updatefile")[0]);
	$.ajax({  
	    url: options.url,  
	    type: 'POST',  
	    data: formData,  
	    async: true,  
	    cache: false,  
	    contentType: false,  
	    processData: false,  
	    success: function (returndata) {
	    	$.tremaps.showMessage(options.msg);
	    },
	    complete:function(){
	    	$('input[type="file"]').val(null);
	    }
	});  
}
/* Excel出力 */
var DownLoadFile = function (options) {
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('#downfile');
    var $form = $('<form target="downfile" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $form.submit();
    $form.remove();
}
function areatypeDelete(obj){
	var areatype = $(obj).prev().attr("areatype");
	var arearange = $(obj).prev().attr("range");
	$(obj).closest("div").remove();
	var num = 1;
	$("#businessarea .num").each(function(){
		$(this).text("商圏"+num+":");
		num++;
	});

	var delBusinessArray = Enumerable.From(businessArray)
																	.Where("$.areatype=="+areatype+" && $.arearange=="+arearange)
																	.ToArray();
	$.each(delBusinessArray,function(){
		this.del=1;
	});					
}
function businessSetInit(){
	$("#businessareatype").val(1);
	$(".areatype").addClass("hidden");
	$(".areatype:eq(0)").removeClass("hidden");
	$(".areatype input.range").val("");
	$(".areatype select").val(0.5);
}
/*
businessArray.push({areatype:type,arearange:range,storecd:0,mr:mr,polygon:{},del:0,state:0});
del:是否删除  1删除
state:是否已经被设为商圈 1设为商圈
*/
function businessArraySet(type,range,label){
	if (type!=6) {
		var status = Enumerable.From(businessArray)
											.Where("$.areatype=="+type+" && $.arearange=="+range)
											.Any();
		if (status) {
			var delBusinessArray = Enumerable.From(businessArray)
																			.Where("$.areatype=="+type+" && $.arearange=="+range)
																			.ToArray();
			$.each(delBusinessArray,function(){
				this.del=0;
			});
			$("#businessarea").append(label);
			return;
		}			
	}	
	switch(type){
		case 1:
		businessArray.push({areatype:type,arearange:range,storecd:"0",mr:range*1000,polygon:{},del:0,state:0});
		$("#businessarea").append(label);
		break;
		case 2:
		var mr = 0;
		if (regionArray.length!=0) {
			mr = Enumerable.From(regionArray)
								.Where("$.sharerate<="+range)
								.Max("$.mindistance");						
		}
		businessArray.push({areatype:type,arearange:range,storecd:"0",mr:mr,polygon:{},del:0,state:0});
		$("#businessarea").append(label);
		break;
		case 3:
		case 4:
		case 5:
		var storeNums = storeArray.length;
		var storeCount = 0;
		var transportation = 0;
		switch(type){
			case 3:
			transportation = 3;
			break;
			case 4:
			transportation = 2;
			break;
			case 5:
			transportation = 1;
			break;
		}
		$.each(storeArray,function(){
			var store = this;
			get("dcoords",{longitude:store["longitude"],latitude:store["latitude"],transportation:transportation,minute:range},function(result){
				var paths = Enumerable.From(result).Select("{lng:$.x,lat:$.y}").ToArray();
				var drive = new google.maps.Polygon({
			    paths: paths,
			    strokeColor: '#FF0000',
			    strokeOpacity: 0.8,
			    strokeWeight: 1,
			    fillColor: '#FF0000',
			    fillOpacity: 0.35,
			    visible:false
			  });
			  drive.setMap(map);
			  var mr=0;
				var storeLatLng = new google.maps.LatLng({lat: store["latitude"], lng: store["longitude"]});
				var polygonlength = drive.getPath().getLength();
				var distances=[];
				for (var j = 0; j < polygonlength; j++) {
					var pointLatlng = drive.getPath().getAt(j);
					var distance = google.maps.geometry.spherical.computeDistanceBetween(storeLatLng,pointLatlng); 
					distances.push(distance);
				};
				var max = Math.max.apply(null,distances);
				if (max>mr&&max<=20000) {
					mr = max;
				}else if(max>20000){
					mr = 20000;
				}
			  businessArray.push({areatype:type,arearange:range,storecd:store["storecd"],mr:mr,polygon:drive,del:0,state:0});
			  storeCount++;
			  if (storeNums==storeCount) {
			  	$("#businessarea").append(label);
			  }
			});
		});
		break;
		case 6:
		var mr = 0;
		for (var i = 0; i < storeArray.length; i++) {
			var store = storeArray[i];
			var storeLatLng = new google.maps.LatLng({lat: store["latitude"], lng: store["longitude"]});
			var polygonlength = freeBusinessArea.getPath().getLength();
			var distances = [];
			for (var j = 0; j < polygonlength; j++) {
				var pointLatlng = freeBusinessArea.getPath().getAt(j);
				var distance = google.maps.geometry.spherical.computeDistanceBetween(storeLatLng,pointLatlng); 
				distances.push(distance);
			};
			var min = Math.min.apply(null,distances);
			var max = Math.max.apply(null,distances);
			if (max>mr&&max<=20000) {
				mr = max;
			}else if(max>20000&&min<20000){
				mr = 20000;
			}else if(min>=20000){
				if(google.maps.geometry.poly.containsLocation(storeLatLng,freeBusinessArea)){
					mr = 20000;
				}
			}
		}
		var tempPolygon=new google.maps.Polygon({
			    strokeColor: "#605ca8",
			    strokeOpacity: 1.0,
			    strokeWeight: 3, 
			    fillOpacity: 0
			  });
		tempPolygon.setPath(freeLinePath);
		businessArray.push({areatype:type,arearange:range,storecd:"0",mr:mr,polygon:tempPolygon,del:0,state:0});
		$("#businessarea").append(label);
		break;
	}
}
function initEle(){

	//----↓設定
	//設定show hide
	$("#set").click(function(){
		$('#settings').toggle();
		if ($('#settings').is(":visible")) {
			$("#businessarea div").remove();
			var num = 1;
			var $obj = $("#businessarea");
			$.each(businessArray,function(){
				this.del=1;
			});
			var delBusinessArray = Enumerable.From(businessArray)
																.Where("$.state==1")
																.ToArray();
			$.each(delBusinessArray,function(){
				this.del=0;
			});
			$("#set").nextAll().each(function(){
				var html = '<div><span class="num">商圏'+num+':</span>'+
				'<span class="glyphicon glyphicon-remove-sign" onclick="areatypeDelete(this);"></span></div>';
				num++;
				$obj.append(html);
				$obj.find(".num").last().after($(this).clone());
			});
		}else{
			businessSetInit();
			lineArea.setPath([]);
			//linePath=[];
			freeBusinessArea.setPath([]);
			//google.maps.event.clearListeners(map,"click");
			drawingManager.setMap(null);
			$.tremaps.mapRegionShow();
		}
	});

	//商圏種類
	$("#businessareatype").change(function(){
		$(".areatype input.range").val("");
		$(".areatype select").val(0.5);
		$(".areatype").addClass("hidden");
		var val = $(this).val();

		switch(val){
			case "1":
			$(".areatype:eq(0)").removeClass("hidden");
			break;
			case "2":
			$(".areatype:eq(1)").removeClass("hidden");
			break;
			case "3":
			case "4":
			case "5":
			$(".areatype:eq(2)").removeClass("hidden");
			break;
			case "6":
			$(".areatype:eq(3)").removeClass("hidden");
			break;
		}

		if (val=="6") {
			lineArea.setPath([]);
			//linePath=[];
			if (!$("#businessarea .label").is("[areatype='6']")) {
				//freeBusinessArea.setMap(null);
				freeBusinessArea.setPath([]);
			}
			//フリー商圏で、行政区域を隠す
			$.tremaps.mapRegionHide();

			//----↓フリー商圏で、クリークを追加
			//地図に
			//google.maps.event.addListener(map, "click",drawPoly);
			drawingManager.setMap(map);
			//商圏に
			//$.tremaps.addListeners(mapBusinessArray,drawPoly);
			//----↑フリー商圏で、クリークを追加
		}else{
			//ほかの商圏、クリークを削除
			drawingManager.setMap(null);
			//google.maps.event.clearListeners(map,"click");
			//$.tremaps.clearListeners(mapBusinessArray);
		}

		$(".areatype:visible .range").focus();
		
	});

	//フリー商圏
	//クリア
	$("#btnCancle").click(function(){
		/*if ($("#businessarea .label").is("[areatype='6']")) {
			return;
		}*/
		lineArea.setPath([]);
		//linePath=[];
		freeBusinessArea.setPath([]);
		//フリー商圏で、クリークを追加
		//google.maps.event.clearListeners(map,"click");
		//google.maps.event.addListener(map, "click",drawPoly);

		drawingManager.setMap(map);
	});
	//完了
	$("#btnOk").click(function(){
		if (lineArea.getPath().length<=2) {
			$.tremaps.showMessage("M-014");
			return;
		}
		lineArea.setMap(null);
		//freeLinePath=linePath;
		freeLinePath = lineArea.getPath().getArray();
		freeBusinessArea.setPath(freeLinePath);
		freeBusinessArea.setMap(map);
		//google.maps.event.clearListeners(map,"click");
		drawingManager.setMap(null);
	});
	//追加
	$("#btnAdd").click(function(){
		var array = Enumerable.From(businessArray).Where("$.del==0").Select("{areatype:$.areatype,arearange:$.arearange}").ToArray();
		var tmp = [];
		$.each(array,function(){
			tmp.push(this.areatype+"_"+this.arearange);
		});
		var areaCount = Enumerable.From(tmp).Distinct().Count();
		if (areaCount>=3) {
			$.tremaps.showMessage("M-008");
			return;
		}
		var type,range,value;
		type = parseInt($("#businessareatype").val());
		value = $(".areatype:visible .range").val();
		range = value*1;
		//フリー商圏、①完了しない、②一つがある
		if (type != 6 && $("#businessarea .label[areatype='"+type+"']").is("[range='"+range+"']")) {
			$.tremaps.showMessage("M-009");
			return;
		}
		var areatype = "";
		var label = "";
		switch(type){
			case 1:
				if (value=="") {
					$.tremaps.showMessage("M-012");
					return;
				}
				var reg = /^\d+(\.\d{1})?$/;
				if (range>=0.1&&range<=20&&reg.test(range)) {
					areatype = "円商圏:"+range+"km";
					label = "label-danger";
				}else{
					$.tremaps.showMessage("M-007");
					return;
				}
				break;
			case 2:
				areatype = "売上シェア商圏:"+range*10+"割";
				label = "label-success";
				break;
			case 3:
			case 4:
			case 5:
				if (value=="") {
					$.tremaps.showMessage("M-011");
					return;
				}
				if (range>0&&range<=60) {
					switch(type){
						case 3:
						areatype = "ドライブ商圏(徒歩):"+range+"分";
						break;
						case 4:
						areatype = "ドライブ商圏(自動車):"+range+"分";
						break;
						case 5:
						areatype = "ドライブ商圏(自動車-高速):"+range+"分";
						break;
					}
					label = "label-info";
				}else{
					$.tremaps.showMessage("M-010");
					return;
				}
				break;
			case 6:
				if ($("#businessarea .label").is("[areatype='6']")) {
					$.tremaps.showMessage("M-047");
					return;
				}
				if (lineArea.getPath().length == 0 ) {
					$.tremaps.showMessage("M-014");
					return;
				}
				if (lineArea.getPath().length>0 && freeBusinessArea.getPath().length==0) {
					$.tremaps.showMessage("M-013");
					return;
				}
				if ($("#businessarea .label").is("[areatype='6']")) {
					$.tremaps.showMessage("M-047");
					return;
				}
				range = 0;
				areatype = "フリー商圏";
				label = "label-primary";
				break;
		}
		if (areatype=="") {
			return;
		}
		var label = '<div><span class="num">商圏'+(areaCount+1)+':</span><span areatype="'+type+'" range="'+range+'" class="label '+label+'">'+areatype+'</span><span class="glyphicon glyphicon-remove-sign" onclick="areatypeDelete(this);"></span></div>';
		//商圏設定値
		businessArraySet(type,range,label);

		businessSetInit();
		
	});
	//設定
	$("#btndetermine").click(function(){
		var array = Enumerable.From(businessArray).Where("$.del==0").Select("{areatype:$.areatype,arearange:$.arearange}").ToArray();
		var tmp = [];
		$.each(array,function(){
			tmp.push(this.areatype+"_"+this.arearange);
		});
		var businesslength = Enumerable.From(tmp).Distinct().Count();
		if (businesslength==0) {
			$.tremaps.showMessage("M-006");
			return;
		}
		infowindow.open(null);
		var store = storeArray[0];
		var latlng = {lat:store["latitude"],lng:store["longitude"]};
		var mapstore = mapStoreArray[0];
		mapstore.setPosition(latlng);
		
		lineArea.setPath([]);
		//linePath=[];
		//google.maps.event.clearListeners(map,"click");
		drawingManager.setMap(null);
		//freeBusinessArea.setVisible(false);
		//freeBusinessArea.setMap(null);
		freeBusinessArea.setPath([]);
		//地図をクリア
		$.tremaps.mapBusinessClear();
		// 表示の行政区域をクリア
		$.tremaps.hideMapLabel();
		$.tremaps.mapRegionHide();
		mapRegionShowArray = [];
		//商圏を作成
		var flag = parseInt($(this).attr("flag"));
		/*if (regionArray.length==0) {
			$.tremaps.showMessage("M-049");
			return;
		}	*/	
		//設定条件を表示
		$("#set").nextAll().remove();
		$("#set").after($("#businessarea .label").clone());

		getSikunion(flag);

		//設定初期化
		$('#settings').toggle();
		businessSetInit();
	});

	//----↑設定

  //提携店
  $("#cooperations").on('hidden.bs.dropdown',function(){
		class0Array = [],class1Array = [];
		var company0 = $("#cooperations .menul2[companyflg=0]");
		var company1 = $("#cooperations .menul2[companyflg=1]");
		//自社
		company0.each(function(){
			if ($(this).find("input").is(":checked")) {
				class0Array.push($(this).closest("li").attr("classcd"));
			}
		});
		//他社
		company1.each(function(){
			if ($(this).find("input").is(":checked")) {
				class1Array.push($(this).closest("li").attr("classcd"));
			}
		});
		showCooperations(class0Array,class1Array);
  });
  //競合店
  $("#competitors").on('hidden.bs.dropdown',function(){
  	classCompanyArray = [];
  	$("#competitors .menul2").each(function(){
			if ($(this).find("input").is(":checked")) {
				var classCompany = $(this).closest("li").attr("c_companycd");
				var array = classCompany.split("_");
				classCompanyArray.push(classCompany);
			}
		});
  	showCompetitors(classCompanyArray);
  });
	//----↑提携店と競合店

}
// ↓競合店と提携店処理
function checkmenu(obj){
	if (obj.is(".selectall")) {
		var $menul1s = $("#competitors .menul1 input");
		var $menul2s = $("#competitors .menul2 input");
		var checkbool = true;
		if (obj.find("input").is(":checked")) {
			checkbool = true;
		}else{
			checkbool = false;
		}
		$.each($menul1s,function(){
			this.checked = checkbool;
		});
		$.each($menul2s,function(){
			this.checked = checkbool;
		});
	}else if (obj.is(".menul1")) {
		var $nextinput = obj.next().find("input");
		var checkbool = true;
		if (obj.find("input").is(":checked")) {
			checkbool = true;
		}else{
			checkbool = false;
		}
		$.each($nextinput,function(){
			this.checked = checkbool;
		});

		if ($("#competitors .menul1 input:checkbox:not(:checked)").length==0) {
			$("#competitors .selectall input")[0].checked = true;
		}else{
			$("#competitors .selectall input")[0].checked = false;
		}
	}else{
		var $menul1 = obj.closest(".dropdown-submenu").find(".menul1 input");
		var $menul2s = obj.closest(".dropdown-menu").find(".menul2 input");
		var checkbool = true;

		$menul2s.each(function(){
			if (!$(this).is(":checked")) {
				checkbool = false;
				return;
			}
		});
		$menul1[0].checked = checkbool;

		if ($("#competitors .menul1 input:checkbox:not(:checked)").length==0) {
			$("#competitors .selectall input")[0].checked = true;
		}else{
			$("#competitors .selectall input")[0].checked = false;
		}
	}
}
function menuClick(event){
	var $a = $(event.target).closest("a");
	if ($(event.target).is("input")) {
		checkmenu($a);
		return;
	}
	var $target = $( event.currentTarget ),
	   $inp = $target.find( 'input' );

	if ($inp.is(":checked")) {
		//$inp.prop( 'checked', false );
		$inp[0].checked = false;
	  //setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
	} else {
		//$inp.prop( 'checked', true );
		$inp[0].checked = true;
	  //setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
	}
	checkmenu($a);
	$( event.target ).blur();

	return false;
}
/*function recheckedcc(){
	$.each(class0Array,function(){
		$("#cooperations li[classcd='"+this+"'] a[companyflg='0'] input")[0].checked = true;
	});
	$.each(class1Array,function(){
		$("#cooperations li[classcd='"+this+"'] a[companyflg='1'] input")[0].checked = true;
	});
	$.each(classCompanyArray,function(){
		$("#competitors li[c_companycd='"+this+"'] input")[0].checked = true;
	});

	var cooperationMenul1 = $("#cooperations .menul1");
	$.each(cooperationMenul1,function(){
		var count = $(this).next().find("input").length;
		var checkedcount = $(this).next().find("input:checked").length;
		if (checkedcount==count) {
			$(this).find("input")[0].checked = true;
		}
	});
	var competitorMenul1 = $("#competitors .menul1");
	$.each(competitorMenul1,function(){
		var count = $(this).next().find("input").length;
		var checkedcount = $(this).next().find("input:checked").length;
		if (checkedcount==count) {
			$(this).find("input")[0].checked = true;
		}
	});
}*/
function cc(){
	//----↓提携店と競合店
	var cooperationObj = $("#cooperations .dropdown-submenu>.dropdown-menu");
	cooperationObj.empty();
	var competitorObj = $("#competitors>.dropdown-menu");
	competitorObj.empty();
	var menul1 = $("#cooperations .menul1 input");
	$.each(menul1,function(){
		this.checked = false;
	});
	//提携店
	get("mcooperation",{},function(result){
		var companycd =$("#hidcompanycd").val();
		//自社
		Enumerable.From(result)
			.Where("$.c=='"+companycd+"'")
			.Distinct("$.a")
			.OrderBy("$.a")
			.Select(function(x){return $("<li classcd='"+x.a+"''><a companyflg='0' class='menul2' href='javascript:;'><input type='checkbox'/>"+x.b+"</a></li>")[0]})
			.TojQuery()
			.appendTo("#cooperations>.dropdown-menu>li:eq(0)>.dropdown-menu"); 
		//他社
		Enumerable.From(result)
			.Where("$.c!='"+companycd+"'")
			.Distinct("$.a")
			.OrderBy("$.a")
			.Select(function(x){return $("<li classcd='"+x.a+"''><a companyflg='1' class='menul2' href='javascript:;'><input type='checkbox'/>"+x.b+"</a></li>")[0]})
			.TojQuery()
			.appendTo("#cooperations>.dropdown-menu>li:eq(1)>.dropdown-menu"); 
		$('#cooperations .dropdown-menu a').unbind("click");
		$('#cooperations .dropdown-menu a').on( 'click', function( event ) {
			return menuClick(event);
		});

		/*競合店登録のため*/
		if (class0Array.length==0 && class1Array.length==0) {
			return;
		}
		$.each(class0Array,function(){
			$("#cooperations li[classcd='"+this+"'] a[companyflg='0'] input")[0].checked = true;
		});
		$.each(class1Array,function(){
			$("#cooperations li[classcd='"+this+"'] a[companyflg='1'] input")[0].checked = true;
		});
		var cooperationMenul1 = $("#cooperations .menul1");
		$.each(cooperationMenul1,function(){
			var count = $(this).next().find("input").length;
			var checkedcount = $(this).next().find("input:checked").length;
			if (checkedcount==count) {
				$(this).find("input")[0].checked = true;
			}
		});
	});
	//競合店
	get("mcompetition",{companycd:$("#hidcompanycd").val()},function(result){
		competitordatas = result;
		var html="<li class='nc'><a class='selectall' href='javascript:;'><input type='checkbox'/>すべて</a></li>";
		var classes = Enumerable.From(result)
									.Distinct("$.b")
									.OrderBy("$.b")
									.Select("{c_classcd:$.b,c_classname:$.c}")
									.ToArray();

		for (var i = 0; i < classes.length; i++) {
			var cla = classes[i];
			var companys =Enumerable.From(result)
											.Where("$.b=='"+cla["c_classcd"]+"'")
											.Distinct("$.d")
											.OrderBy("$.e")
											.Select("{c_classcd:$.b,c_companycd:$.d,c_companyname:$.e}")
											.ToArray();
			if (companys.length>0) {
				html = html + "<li class='dropdown-submenu'><a class='menul1' href='javascript:;'><input type='checkbox'/>"+cla["c_classname"]+"</a><ul class='dropdown-menu'>";
				for (var j = 0; j < companys.length; j++) {
					html = html + "<li c_companycd='"+companys[j]["c_classcd"]+"_"+companys[j]["c_companycd"]+"''><a class='menul2' href='javascript:;'><input type='checkbox'/>"+companys[j]["c_companyname"]+"</a></li>";
				};
				html = html + "</ul></li>";
			}else{
				html = html + "<li><a class='menul1' href='javascript:;'><input type='checkbox'/>"+cla["c_classname"]+"</a></li>";
			}
		};
		competitorObj.append(html);
		$('#competitors .dropdown-menu a').unbind("click");
		$('#competitors .dropdown-menu a').on( 'click', function( event ) {
			return menuClick(event);
		});

		/*競合店登録のため*/
		if (classCompanyArray.length==0) {
			return;
		}
		$.each(classCompanyArray,function(){
			$("#competitors li[c_companycd='"+this+"'] input")[0].checked = true;
		});
		var competitorMenul1 = $("#competitors .menul1");
		$.each(competitorMenul1,function(){
			var count = $(this).next().find("input").length;
			var checkedcount = $(this).next().find("input:checked").length;
			if (checkedcount==count) {
				$(this).find("input")[0].checked = true;
			}
		});
	});
	//----↑提携店と競合店
}
function showCooperations(class0Arr,class1Arr){
	var companyflg = "",classArray = [],storecdArray=[],latArray=[],lngArray=[];
	//自社
	if (class0Arr.length>0) {
		companyflg = companyflg + "0";
		classArray.push(class0Arr.join("_"));
	}
	//他社
	if (class1Arr.length>0) {
		companyflg = companyflg + "1";
		classArray.push(class1Arr.join("_"));
	}

	for (var i = 0; i < mapCooperationArray.length; i++) {
		mapCooperationArray[i].setMap(null);
	};

	if (classArray.length==0) {
		return;
	}

	for (var i = 0; i < storeArray.length; i++) {
		var store = storeArray[i];
		storecdArray.push(store["storecd"]);
		latArray.push(store["latitude"]);
		lngArray.push(store["longitude"]);
	};
	//----↓提携店を作成
	get("dcooperation",{
		companycd:$("#hidcompanycd").val(),
		companyflg:companyflg,
		classcd:classArray.join(","),
		storecd:storecdArray.join("_"),
		longitude:lngArray.join("_"),
		latitude:latArray.join("_")
	},function(result){
		var competitors = result;
		mapCooperationArray=$.tremaps.competitorCreate(competitors);
	});
	//----↑提携店を作成
}
function showCompetitors(classCompanyAr){
	var classArray = [],companyArray=[],storecdArray=[],latArray=[],lngArray=[];
	$.each(classCompanyAr,function(){
		var array = this.split("_");
		classArray.push(array[0]);
		companyArray.push(array[1]);
	});
	for (var i = 0; i < mapCompetitorArray.length; i++) {
		mapCompetitorArray[i].setMap(null);
	};

	if (classArray.length==0) {
		return;
	}

	for (var i = 0; i < storeArray.length; i++) {
		var store = storeArray[i];
		storecdArray.push(store["storecd"]);
		latArray.push(store["latitude"]);
		lngArray.push(store["longitude"]);
	};

	get("dcompetition",{
		companycd:$("#hidcompanycd").val(),
		classcd:classArray.join("_"),
		kygcompany:companyArray.join("_"),
		storecd:storecdArray.join("_"),
		longitude:lngArray.join("_"),
		latitude:latArray.join("_")
	},function(result){
		var competitors = result;
		mapCompetitorArray=$.tremaps.competitorCreate(competitors);
	});
}
// ↑競合店と提携店処理

/*地図表示 商圈绘制*/
function businessCircleCreate(){
	var tempBusinessArray = Enumerable.From(businessArray).Where("$.del==0").ToArray();
	$.each(tempBusinessArray,function(){
		var business = this;
		var type = business["areatype"];
		var range = business["arearange"];
		var storecd = business["storecd"];
		var drive = business["polygon"];
		var mr = business["mr"];
		switch(type){
			//円商圏
			case 1:
			$.tremaps.circleAreaCreate(range);
			break;
			//売上シェア商圏　分析地利用しない
			case 2:
			$.tremaps.saleAreaCreate(range);
			break;
			//ドライブ商圏 フリー商圏
			case 3:
			case 4:
			case 5:
			case 6:
			var driveDashed ;
			if (type==6) {
				driveDashed = $.tremaps.drawDashedPolygon(drive.getPath().getArray(),"#605ca8");
			}else{
				driveDashed = $.tremaps.drawDashedPolygon(drive.getPath().getArray(),"#00c0ef");
			} 
			$.tremaps.polygonAreaCreate(storecd,type,range,drive,driveDashed,mr);
			break;
		}
	});
	if ($("#showlabel").is(":checked")) {
  	$.tremaps.showMapLabel();
  }
}
/*項目表示⇒確定 商圈绘制*/
function businessCircleReCreate(){
	arealevel=getMapPara().arealevel;
	var tempRegionShowArray = [];
	for (var i = 0; i < mapRegionShowArray.length; i++) {
		tempRegionShowArray.push(mapRegionShowArray[i]);
	};
	mapRegionShowArray = [];
	$.tremaps.mapBusinessClear();
	var tempRegionShowArray12 = Enumerable.From(tempRegionShowArray).Where("$.areatype==1 || $.areatype==2").ToArray();
	var tempRegionShowArray3456 = Enumerable.From(tempRegionShowArray).Where("$.areatype!=1 && $.areatype!=2").ToArray();

	var typeRangeArray = Enumerable.From(tempRegionShowArray12)
																.Select("{areatype:$.areatype,arearange:$.arearange}")
																.ToArray();
	var tmp = [];
	$.each(typeRangeArray,function(){
		tmp.push(this.areatype+"_"+this.arearange);
	});
	var tmpTypeRange = Enumerable.From(tmp).Distinct().ToArray();
	var tmpTypeRangeArray = [];
	$.each(tmpTypeRange,function(){
		var tr = this.split("_");
		tmpTypeRangeArray.push({"areatype":parseInt(tr[0]),"arearange":parseFloat(tr[1])});
	});
	for (var i = 0; i < tmpTypeRangeArray.length; i++) {
		var mapRegionShow = tmpTypeRangeArray[i];
		var type = mapRegionShow["areatype"];
		var range = mapRegionShow["arearange"];
		switch(type){
			//円商圏
			case 1:
			$.tremaps.circleAreaCreate(range);
			break;
			//売上シェア商圏　分析地利用しない
			case 2:
			$.tremaps.saleAreaCreate(range);
			break;
		}
	};
	for (var i = 0; i < tempRegionShowArray3456.length; i++) {
		var mapRegionShow = tempRegionShowArray3456[i];
		var storecd = mapRegionShow["storecd"];
		var type = mapRegionShow["areatype"];
		var range = mapRegionShow["arearange"];
		var area = mapRegionShow["area"];
		var dashed = mapRegionShow["dashed"];
		var mr = mapRegionShow["mr"];
		switch(type){
			//ドライブ商圏
			case 3:
			case 4:
			case 5:
			$.tremaps.polygonAreaCreate(storecd,type,range,area,dashed,mr);
			break;
			//フリー商圏
			case 6:
			$.tremaps.polygonAreaCreate(0,type,0,area,dashed,mr);
			break;
		}
	};
	if ($("#showlabel").is(":checked")) {
		$.tremaps.showMapLabel();
	}
}
/*
	flag:1既存店、3分析地
*/
function reShow(flag){
	//行政区域レベルを初期化処理
	$.tremaps.mapRegionInit();
	infowindow.open(null);

	var paras = getMapPara();

	var url,regionStr;
	switch(flag){
		case 1:
		url = "dsareas";
		regionStr = "{sikunioncd:$.b.substring(0,5)+'000000',storecd:$.a,areacd:$.b,mindistance:parseFloat($.d),sharerate:$.f,optionvalue:$.c}";
		break;
		/*case 2:
		url = "";
		regionStr = "";
		break;*/
		case 3:
		url = "newstorearea";
		regionStr = "{sikunioncd:$.a.substring(0,5)+'000000',areacd:$.a,optionvalue:$.c,mindistance:parseFloat($.d)}";
		var store = storeArray[0];
		var latlng = {lat:store["latitude"],lng:store["longitude"]};
		var mapstore = mapStoreArray[0];
		mapstore.setPosition(latlng);
		break;
	}

	get(url,paras,function(results){
		regionArray = Enumerable.From(results)
											.Select(regionStr)
											.ToArray();
		disSikunionArray = Enumerable.From(regionArray).GroupBy("$.sikunioncd",null,function(key,g){
			var result={
				sikunioncd:key,
				mindistance:g.Min("$.mindistance")
			}
			return result;
		}).ToArray();

		disRegionArray = Enumerable.From(regionArray).Distinct("$.areacd").ToArray();

		if (arealevel!=getMapPara().arealevel) {
			$.tremaps.hideMapLabel();
			$.tremaps.mapRegionClear();
			var mr = Enumerable.From(businessArray).Where("$.del==0").Max("$.mr");
			var disSikunion = Enumerable.From(disSikunionArray)
													.Where("$.mindistance<="+mr)
													.Select("{sikunioncd:$.sikunioncd,mindistance:$.mindistance}")
													.ToArray();
			if (disSikunion.length==0) {
				if (disSikunionArray.length>0) {
					var min = Enumerable.From(disSikunionArray).Min("$.mindistance");
					disSikunion = [];
					disSikunion[0] = Enumerable.From(disSikunionArray).Where("$.mindistance=="+min).First();
					maxRange = min;
				}

			}else{
				maxRange = mr;						
			}
			//市区町村
			var sikunionNum = disSikunion.length;
			var jsonCount = 0;
			if (sikunionNum==0) {
				businessCircleReCreate();
			}else{
				var jsonlevel = "/level4_sikunion/";
				if (getMapPara().arealevel=="arealevel3") {
					jsonlevel = "/level3_sikunion/";
				}
				for (var i = 0; i < disSikunion.length; i++) {
					$.getJSON(jsonlevel+disSikunion[i]["sikunioncd"]+".json?v=1.0.0.0",function(results){
						//行政区域の中に今回の行政を選択す
						var result = Enumerable.From(results).Join(disRegionArray,"$.areacd","$.areacd","$").ToArray();
						//var result = Enumerable.From(results).Join(disRegionArray,"$.areacd","$.areacd","outer,inner=>{areacd:outer.areacd,areaname:outer.areaname,lnglat:outer.lnglat,points:outer.points,mindistance:inner.mindistance}").ToArray();
						var resultlength = result.length;
						jsonCount++;
						for (var j = 0; j < resultlength; j++) {
							$.tremaps.jsonPolygonsCreate(result[j],flag);
							if (sikunionNum == jsonCount) {
								if (j==resultlength-1) {
									businessCircleReCreate();
								}
							}
						}
					});
				};							
			}
		}else{
			businessCircleReCreate();
		}
	},{stopIfNull:false});
}
function getSikunion(flag){
	$("#print-circle").text(Enumerable.From($(".maphead-left .label")).ToString(" / ","$.innerHTML"));
	var jsonlevel = "/level4_sikunion/";
	if (getMapPara().arealevel=="arealevel3") {
		jsonlevel = "/level3_sikunion/";
	}
	$.each(businessArray,function(){
		this.state = 0;
	});
	var setBusinessArray = Enumerable.From(businessArray)
																	.Where("$.del==0")
																	.ToArray();
	$.each(setBusinessArray,function(){
		this.state = 1;
	});													
	var tempRange = Enumerable.From(businessArray)
								.Where("$.del==0")
								.Max("$.mr");
	if (tempRange>maxRange) {
		var disSikunion = Enumerable.From(disSikunionArray)
										.Where("$.mindistance>"+maxRange+" && $.mindistance<="+tempRange)
										.Select("{sikunioncd:$.sikunioncd,mindistance:$.mindistance}")
										.ToArray();

		if (disSikunion.length==0) {
			if (disSikunionArray.length>0) {
				var min = Enumerable.From(disSikunionArray).Min("$.mindistance");
				disSikunion = [];
				disSikunion[0] = Enumerable.From(disSikunionArray).Where("$.mindistance=="+min).First();
			}

			if (min>tempRange) {
				maxRange = min;
			}else{
				maxRange = tempRange;
			}
		}else{
			maxRange = tempRange;						
		}
		//市区町村
		var sikunionNum = disSikunion.length;
		var jsonCount = 0;
		if (sikunionNum==0) {
			businessCircleCreate();
		}else{
			for (var i = 0; i < disSikunion.length; i++) {
				$.getJSON(jsonlevel+disSikunion[i]["sikunioncd"]+".json?v=1.0.0.0",function(results){
					//行政区域の中に今回の行政を選択す
					var result = Enumerable.From(results).Join(disRegionArray,"$.areacd","$.areacd","$").ToArray();
					//var result = Enumerable.From(results).Join(disRegionArray,"$.areacd","$.areacd","outer,inner=>{areacd:outer.areacd,areaname:outer.areaname,lnglat:outer.lnglat,points:outer.points,mindistance:inner.mindistance}").ToArray();
					var resultlength = result.length;
					jsonCount++;
					for (var j = 0; j < resultlength; j++) {
						$.tremaps.jsonPolygonsCreate(result[j],flag);
						if (sikunionNum == jsonCount) {
							if (j == resultlength-1) {
								businessCircleCreate();
							}
						}
					}
				});
			};								
		}
	}else{
		businessCircleCreate();
	}
}
function storesCreate(flag,colflag){
	maxRange = 0;
	arealevel = "arealevel4";
	var paras = getMapPara();
	//競合店を追加
  if (flag==3 && $.data(document,"auth")) {
  	google.maps.event.addListener(map, 'rightclick',competitorAdd);					
	}
	//地図をクリアー
	$.tremaps.ccInit();
	$.tremaps.mapStoreClear();
	$.tremaps.mapRegionClear();
	$.tremaps.mapBusinessClear();
	$.tremaps.hideMapLabel();
	regionArray = [],disSikunionArray = [],disRegionArray = [],mapRegionShowArray = [],businessArray = [];

	infowindow.open(null);
	$("#settings").hide();
	$(".businessarea").removeClass("open");
	$(".businessarea").hide();
	$("#mapheader,#save-widget").show();


	//デフォルト範囲
	$("#businessarea div").remove();
	$("#set").nextAll().remove();
	var range = parseFloat(paras.circlevalue);
	var label = '<div><span class="num">商圏1:</span><span areatype="1" range="'+range+'" class="label label-danger">円商圏:'+range+'km</span><span class="glyphicon glyphicon-remove-sign" onclick="areatypeDelete(this);"></span></div>';
	
	var url,regionStr;
	switch(flag){
		case 1:
		$.tremaps.storesCreate();
		url = "dsareas";
		regionStr = "{sikunioncd:$.b.substring(0,5)+'000000',storecd:$.a,areacd:$.b,mindistance:parseFloat($.d),sharerate:$.f,optionvalue:$.c}";
		break;
		/*case 2:
		url = "";
		regionStr = "";
		break;*/
		case 3:
		if (colflag==0) {
			//位置赤い点
			$.tremaps.redStoreCreate();
		}else{
			//分析地青い点
			$.tremaps.blueStoreCreate();
		}				
		url = "newstorearea";
		regionStr = "{sikunioncd:$.a.substring(0,5)+'000000',areacd:$.a,optionvalue:$.c,mindistance:parseFloat($.d)}";
		$("#pac-input").removeClass("state0");
		$("#pac-input").addClass("state1");
		$("#pac-input").show();
		break;
	}
	get(url,paras,function(results){
		regionArray = Enumerable.From(results)
											.Select(regionStr)
											.ToArray();
		disSikunionArray = Enumerable.From(regionArray).GroupBy("$.sikunioncd",null,function(key,g){
			var result={
				sikunioncd:key,
				mindistance:g.Min("$.mindistance")
			}
			return result;
		}).ToArray();

		disRegionArray = Enumerable.From(regionArray).Distinct("$.areacd").ToArray();


		
		//商圏設定値
		businessArraySet(1,range,label);
		$("#set").after($("#businessarea .label").clone());

		getSikunion(flag);

		enablePrint();

	},{stopIfNull:false});
}
//只允许输入数字与小数点    
function checkKeyForFloat(value, e) {  
    var isOK = false;  
    var key = window.event ? e.keyCode : e.which;  
    if ((key > 95 && key < 106) ||                  //小键盘上的0到9  
    (key > 47 && key < 60) ||                   //大键盘上的0到9  
    (key == 110 && value.indexOf(".") < 0) ||   //小键盘上的.而且以前没有输入.  
    (key == 190 && value.indexOf(".") < 0) ||   //大键盘上的.而且以前没有输入.  
    key == 8 || key == 9 || key == 46 || key == 37 || key == 39     //不影响正常编辑键的使用(8:BackSpace;9:Tab;46:Delete;37:Left;39:Right)  
) {  
        isOK = true;  
    } else {  
        if (window.event) //IE    
        {  
            e.returnValue = false;   //event.returnValue=false 效果相同.    
        }  
        else //Firefox    
        {  
            e.preventDefault();  
        }  
    }  
    return isOK;  
}  

//只允许输入数字    
function checkKeyForInt(value, e) {  
    var isOK = false;  
    var key = window.event ? e.keyCode : e.which;  
    if ((key > 95 && key < 106) ||                  //小键盘上的0到9  
    (key > 47 && key < 60) ||                   //大键盘上的0到9  
    key == 8 || key == 9 || key == 46 || key == 37 || key == 39     //不影响正常编辑键的使用(8:BackSpace;9:Tab;46:Delete;37:Left;39:Right)  
) {  
        isOK = true;  
    } else {  
        if (window.event) //IE    
        {  
            e.returnValue = false;   //event.returnValue=false 效果相同.    
        }  
        else //Firefox    
        {  
            e.preventDefault();  
        }  
    }  
    return isOK;  
}  
function InputLimit()
{
	var me = this;
	this.type=0;
	this.ua = {};
	this.ua.name = window.navigator.userAgent.toLowerCase();
	this.ua.appv = window.navigator.appVersion.toLowerCase();
	this.ua.isIE = (this.ua.name.indexOf('msie') >= 0 || this.ua.name.indexOf('trident') >= 0);
	this.ua.isIE6 = this.ua.isIE && (this.ua.appv.indexOf('msie 6.') >= 0);
	this.ua.isIE7 = this.ua.isIE && (this.ua.appv.indexOf('msie 7.') >= 0);
	this.ua.isIE8 = this.ua.isIE && (this.ua.appv.indexOf('msie 8.') >= 0);
	this.ua.isIE9 = this.ua.isIE && (this.ua.appv.indexOf('msie 9.') >= 0);
	this.ua.isIE10 = this.ua.isIE && (this.ua.appv.indexOf('msie 10.') >= 0);
	this.ua.isIE11 = this.ua.name.indexOf('trident') >= 0;
	this.ua.isFirefox = this.ua.name.indexOf('firefox') >= 0;
	this.ua.isOpera = this.ua.name.indexOf('opera') >= 0;
	this.ua.isChrome = this.ua.name.indexOf('chrome') >= 0;
	this.ua.isSafari = (this.ua.name.indexOf('safari') >= 0) && !this.ua.isChrome;
	this.ua.isiPhone = this.ua.name.indexOf('iphone') >= 0;
	this.ua.isiPod = this.ua.name.indexOf('ipod') >= 0;
	this.ua.isiPad = this.ua.name.indexOf('ipad') >= 0;
	this.ua.isiOS = (this.ua.isiPhone || this.ua.isiPod || this.ua.isiPad);
	this.ua.isAndroid = this.ua.name.indexOf('android') >= 0;
	this.ua.isTablet = (this.ua.isiPad || (this.ua.isAndroid && this.ua.name.indexOf('mobile') < 0));

	function getMapByKeysAndValues(keys,values){
		var map = {};
		for(var i=0;i<keys.length && i<values.length;i++) {
			map[keys.charCodeAt(i)] = values.charAt(i);
		}
		return map;
	};
	this.zenkaku2alphabet=false;
	this.map_zenkaku2alphabet=getMapByKeysAndValues(
		'１２３４５６７８９０あいうえおあｂｃｄえｆｇｈいｊｋｌｍｎおｐｑｒｓｔうｖｗｘｙｚ　！”＃＄％＆’（）ー＾￥＠「；：」、。・￥＝～｜‘｛＋＊｝＜＞？＿',
		'1234567890aiueoabcdefghijklmnopqrstuvwxyz !"#$%&\'()-^\@[;:],./\=~|`{+*}<>?_'
	);
	this.z2h=false;
	this.map_z2h=getMapByKeysAndValues(
		'１２３４５６７８９０。',
		'1234567890.'
	);
	this.zenkakuNumber2hankakuNumber=false;
	this.map_zenkakuNumber2hankakuNumber=getMapByKeysAndValues(
		'１２３４５６７８９０',
		'1234567890'
	);
}
InputLimit.prototype.getMapString = function(str,map,log){
	var w='';
	var c;
	for(var i=0;i<str.length;i++){
		c=str.charCodeAt(i);
		if(map[c]){
			c = map[c];
			w+=c;
			if(log){
				log.push(c);
			}
		}else{
			w+=str.charAt(i);
		}
	}
	return w;
};
InputLimit.prototype.exeMap=function(str,opt,log){
	return this.getMapString(str,this['map_'+opt.map],log);
};
InputLimit.prototype.getInfoString = function(m){
	var str='';
	for(var key in m){
		str+=key+' : '+m[key]+"<br/>\n";
	}
	return str;
};
InputLimit.prototype.addEvent=function(elem, type, listener, flg)
{
    if (!elem || typeof(elem) == "undefined") {
        return;
    }
    if (elem.addEventListener) {
        elem.addEventListener(type, listener, flg);
    } else {
        elem.attachEvent('on' + type, function() {
            listener.call(elem, window.event);
        });
    }
};
InputLimit.prototype.getCaretPosition=function(elem)
{
	if('selectionStart' in elem){
		return elem.selectionStart;
	}else if('selection' in elem){
		elem.focus();
		var range = elem.selection.createRange();
		range.moveStart("character", - elem.value.length);
		return range.text.length;
	}
	return 0;
};
InputLimit.prototype.setCaretPosition=function(elem,caretPosition)
{
	if('setSelectionRange' in elem){
		elem.setSelectionRange(caretPosition,caretPosition);
		return;
	}else if('createTextRange' in elem){
		var range = elem.createTextRange();
		range.collapse(true);
		range.moveEnd('character', caretPosition);
		range.moveStart('character', caretPosition);
		range.select();
		return;
	}
	var range = document.selection.createRange();
	range.collapse();
	range.moveEnd("character", caretPosition);
	range.moveStart("character", caretPosition);
	range.select();
};
InputLimit.prototype.exeReplace = function(inputElement,patternExp,searchPosition,opt,doNotBlurFocus)
{
	var me = this;
	var ws = inputElement.value;
	if(!doNotBlurFocus)inputElement.blur();
	if(opt && opt.map){
		var tmp = [];
		var w = me.exeMap(ws,opt,tmp);
		inputElement.value = w.replace(patternExp,'');
		searchPosition+=tmp.length;
	}else{
		inputElement.value = inputElement.value.replace(patternExp,'');
	}
	if(!doNotBlurFocus)inputElement.focus();
	me.setCaretPosition(inputElement ,searchPosition);
	//enableEvent=true;
};
InputLimit.prototype.initWithExclusionPattern = function(inputElement,patternExp,opt)
{
	//not support Safari
	if(!this.ua.isiOS && this.ua.isSafari){
		return;
	}
	var me = this;
	var enableEvent=true;
	var eventName = ('oninput' in window) ? 'input':'propertychange';
	this.addEvent(inputElement, eventName, function(e){
		if(!enableEvent){
			return;
		}
		var s = inputElement.value.search(patternExp);
		if( -1 < s ){
			enableEvent=false;
			if(me.ua.isIE6 || me.ua.isIE7 || me.ua.isIE9){
				setTimeout(function(){
					me.exeReplace(inputElement,patternExp,s,opt);
					enableEvent=true;
				},1);
			}else if(me.ua.isiOS || me.ua.isAndroid){
				me.exeReplace(inputElement,patternExp,s,null,true);
				enableEvent=true;
			}else{
				me.exeReplace(inputElement,patternExp,s,opt);
				enableEvent=true;
			}
		}
	}, true);
};
InputLimit.prototype.initOnlyHankaku = function(inputElement,opt)
{
	this.type=1;
	this.initWithExclusionPattern(inputElement, new RegExp("[^ -~]","g"), opt);
};
InputLimit.prototype.initOnlyZenkaku = function(inputElement,opt)
{
	this.type=2;
	this.initWithExclusionPattern(inputElement, new RegExp("[ -~]","g"), opt);
};
InputLimit.prototype.initOnlyz2h = function(inputElement,opt)
{
	this.type=3;
	this.initWithExclusionPattern(inputElement, new RegExp("[^0-9.]","g"), opt);
};
InputLimit.prototype.initOnlyHankakuNumber = function(inputElement,opt)
{
	this.type=3;
	this.initWithExclusionPattern(inputElement, new RegExp("[^0-9]","g"), opt);
};



(function(){
	function addEvent(elem, type, listener, flg){
		if (!elem || typeof(elem) == "undefined") {
	        return
	    }
		if (elem.addEventListener) {
	        elem.addEventListener(type, listener, flg);
	    } else {
	        elem.attachEvent('on' + type, function() {
	            listener.call(elem, window.event);
	        });
	    }
	}
	addEvent(window,'load',function(){
		var il = new InputLimit();
		/*il.initOnlyHankaku(document.sampleForm.ps1);
		il.initOnlyHankaku(document.sampleForm.ps1a,{'map':'zenkaku2alphabet'});
		il.initOnlyZenkaku(document.sampleForm.ps2);
		il.initOnlyHankakuNumber(document.sampleForm.ps3);*/
		il.initOnlyz2h($("input.range")[0],{'map':'z2h'});
		il.initOnlyHankakuNumber($("input.range")[1],{'map':'zenkakuNumber2hankakuNumber'});
	},true);
})();