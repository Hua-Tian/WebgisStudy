	// 企业列表绑定
	function bindCompany(result){
		if(result.isAdmin){
			$("#leftmenu").prepend(result.data);
			
			var company = Enumerable.From($("#company option")).OrderBy("$.innerText").ToArray();
			$("#company").empty();
			Enumerable.From(company).Select("$").TojQuery().appendTo("#company");

			setDefault();
		}else{
			$.data(document,"companyCd",result.companycd);
			$.data(document,"companyName",result.companyname);
			$.data(document,"defaultCircleSize",result.defaultvalue);
			$.data(document,"defaultOption",result.storedefault);
			$.data(document,"defaultCate",result.categorydefault);
			$.data(document,"defaultRange",result.rangedefault);
		}
		$("#area2").selectpicker({size:"7",maxOptions:"5", style:"btn-default btn-sm btn-sel", actionsBox:true,container:"body",noneResultsText: messages["M-041"]});
		$("#area3").selectpicker({size:"7",maxOptions:"5",style:"btn-default btn-sm btn-sel",actionsBox:true,container:"body",noneResultsText: messages["M-042"]});
		$("#area4").selectpicker({size:"7",maxOptions:"5",style:"btn-default btn-sm btn-sel",actionsBox:true,container:"body",noneResultsText: messages["M-043"]});
		$("#area2,#area3,#area4").siblings("button").attr("disabled",true);
		$("#area2,#area3,#area4").attr("disabled",true);
		// 都道府県
		bindArea("area1","00000000000");
		// 绑定时间列表
		get("mdates",{},Month.setData);
	}

	function setDefault(){
		var company = $("#company option:selected");
		$.data(document,"companyCd",company.val());
		$.data(document,"companyName",company.text());
		$.data(document,"defaultCircleSize",company.attr("defaultvalue"));
		$.data(document,"defaultOption",company.attr("storedefault"));
		$.data(document,"defaultCate",company.attr("categorydefault"));
		$.data(document,"defaultRange",company.attr("rangedefault"));
	}

	$("#leftmenu").on("change","#company",function(){
		setDefault();
		$("input[name='monthtype'][value='0']").click();	
		$("#yesterday")[0].checked=false;
		$("#yesterday").removeAttr("disabled");
		$("#compare")[0].checked=false;
		$("#comparemonth").hide();
		$("#month0").find("option:first")[0].selected=true;
		$("#month1").find("option:first")[0].selected=true;
		$("#month2").find("option:first")[0].selected=true;
		$("#area1 option:first")[0].selected=true;
		$("#area1").change();
		storeUploader.options.formData = {"companycd":$.data(document,"companyCd")};
	  //competitorUploader.options.formData = {"companycd":$.data(document,"companyCd")}; 
	});

	$('#age').selectpicker({size:"7",style:"btn-default btn-sm btn-sel"});

	$("#btn-area").click(function(){
		window.location.href="area.html?from=newstore";
	});
//----↓行政界
	function bindArea(obj,areacd){
		var arealevel = "";
		switch(obj){
			case "area1":
			arealevel = "arealevel1";
			break;
			case "area2":
			arealevel = "arealevel2";
			break;
			case "area3":
			arealevel = "arealevel3";
			break;
			case "area4":
			arealevel = "arealevel4";
			break;
		}

		$("#btnquery").attr("disabled","disabled");

		get("mranges",{"arealevel":arealevel,"areacd":areacd},function(results){
			var $obj = $("#"+obj);
			if (obj!="area1" &&  obj!="area4") {
				$obj.html($("<option value='0'>").text("-"));
			}
			if(results.length>0){
				//if(results.length==1 && results[0].a==areacd){

				//}else{
					$("#"+obj).siblings("button").removeAttr("disabled");
					$("#"+obj).removeAttr("disabled");
					Enumerable.From(results).Select(function (x) { return $("<option x='"+x.x+"' y='"+x.y+"' value='"+x.a+"'>").text(x.b)[0] })
				    .TojQuery()
				    .appendTo("#"+obj);
					if (obj!="area1") {
						$obj.selectpicker("refresh");
					}

				//}
			}
		},{stopIfNull:false});
	}
	$("#area1").change(function(){
		var areacd = $(this).val();
		$("#area2,#area3,#area4").empty();
		$("#area2,#area3,#area4").siblings("button").children(".filter-option").text("");
		$("#area2,#area3,#area4").siblings("button").attr("disabled",true);
		$("#area2,#area3,#area4").attr("disabled",true);
		if (areacd!=0) {
			bindArea("area2",areacd);
		}
	});		
	$("#area2").change(function(){
		var areacd = $(this).val();
		$("#area3,#area4").empty();
		$("#area3,#area4").siblings("button").children(".filter-option").text("");
		$("#area3,#area4").siblings("button").attr("disabled",true);
		$("#area3,#area4").attr("disabled",true);
		if (areacd!=0) {
			bindArea("area3",areacd);
		}
	});	
	$("#area3").change(function(){
		var areacd = $(this).val();
		$("#area4").empty();
		$("#area4").siblings("button").children(".filter-option").text("");
		$("#area4").siblings("button").attr("disabled",true);
		$("#area4").attr("disabled",true);
		if (areacd!=0) {
			bindArea("area4",areacd);
			if($("#area4").val()!=0){
				$("#btnquery").removeAttr("disabled");
			}else{
				$("#btnquery").attr("disabled","disabled");
			}
		}
	});
//----↑行政界

	// 地图表示
	$("#btnquery").click(function(){

		if($("select.area-select:not(:disabled):last").val()=="0"){
				$.tremaps.showMessage("M-045");
				return;
		}

		enableRight();
		
		setMapPara();
		
		var area = $("select.area-select:not(:disabled):last");
		var areaOption = area.find("option:selected");
		storeArray = [{storetype:1,storecd:area.val(),storename:areaOption.text(),latitude:parseFloat(areaOption.attr("y")),longitude:parseFloat(areaOption.attr("x"))}];

		storesCreate(3,0);

		setTitle();

		$("#pac-input input").val("");
		
		getPlace();
	});

	function setTitle() {
		//$("#title-company").text(decodeURI($.data(document,"companyName")));
		$("#title-month,#print-month").text($("#month"+$("input[name='monthtype']:checked").val()+" option:selected").text());
		var txt = "";
		$("#proportion")[0].checked?txt="(率)":"";
		$("#less")[0].checked?txt="(差)":"";
		$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);
		$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" ","$.text"));
		$("#print-area,#title-company").text(Enumerable.From($(".area-select option:selected")).ToString("  ","$.text"));
		$("#print-circle").text(Enumerable.From($(".maphead-left .label")).ToString(" / ","$.innerHTML"));
	}


	function setMapPara(){
		var companycd = $.data(document,"companyCd");
		$("#hidcompanycd").val(companycd);
		var datetype=$("input:radio[name='monthtype']:checked").val();
		$("#hiddatetype").val(datetype);
		if(datetype==0 && $(".monthcompare:checked").length>0){
			$("#hidmonthcompare").val(1);
		}else{
			$("#hidmonthcompare").val(0);
		}

		Option.defaultValue=$.data(document,"defaultRange");
		if($.data(document,"tempCompanyCd")!=companycd || $.data(document,"tempDateType")!=datetype || $.data(document,"tempMonthCompare")!=$("#hidmonthcompare").val())
		{	
			if($.data(document,"tempCompanyCd")!=companycd){
				class0Array = [],class1Array = [],classCompanyArray = [];
				cc();
			}
			// 绑定表示项目
			$.data(document,"tempDateType",datetype);
			$.data(document,"tempMonthCompare",$("#hidmonthcompare").val());
			get('moptions',{companycd:companycd,datetype:datetype},Option.setData,{async:false});
			$.data(document,"tempCompanyCd",companycd);
		}else{
			// 表示项目恢复默认
			Option.fillData(0)
		}

		var yearmonthcd=$("#month"+$("input:radio[name='monthtype']:checked").val()).val();
		var datecompare=0;
		var datespare="000000";

		if(datetype==0){
			if($("#yesterday")[0].checked){
				datecompare=2;
			}
			if($("#compare")[0].checked){
				datecompare=4;
				datespare = $("#comparemonth").val();
			}
		}
		$("#hidyearmonthcd").val(yearmonthcd);
		$("#hiddatecompare").val(datecompare);
		$("#hidddatespare").val(datespare);	
		$("#hidoption").val($("#option3").val());
		$("#hidoptiontype").val($("#agescale").val());
		$("#hidoptionscales").val($("#age").val()==null?"0000":$("#age").val().join("_"));
		$("#hidarealevel").val($("#arealevel").val());

		$.data(document,"yeaterday",$("#yesterday")[0].checked);
		$.data(document,"compare",$("#compare")[0].checked);

		var lastArea = $("select.area-select:not(:disabled):last option:selected");
		var x = lastArea.attr("x");
		var y = lastArea.attr("y");
		$("#hidlng").val(x);
		$("#hidlat").val(y);
	}

	function getMapPara(){
		var para = {datetype:$("#hiddatetype").val(),
							yearmonthcd:$("#hidyearmonthcd").val(),
							datecompare:$("#hiddatecompare").val(),
							datespare:$("#hidddatespare").val(),
							circletype:1,
							circlevalue:$.data(document,"defaultCircleSize"),
							option:$("#hidoption").val(),
							optiontype:$("#hidoptiontype").val(),
							optionscales:$("#hidoptionscales").val(),
							arealevel:$("#hidarealevel").val(),
							longitude:$("#hidlng").val(),
							latitude:$("#hidlat").val(),
							companycd:$("#hidcompanycd").val()
						};

		if(para.optiontype=="00"){
			para.optionscales="0000";
		}
		return para;
	}
function getLatlng(){
	var mapPara = getMapPara();
	var $obj = $("#area4 option:selected");
	switch(mapPara.arealvl)
	{
		case "1":
		$obj = $("#area1 option:selected");
		break;
		case "2":
		$obj = $("#area2 option:selected");
		break;
		case "3":
		$obj = $("#area3 option:selected");
		break;
		case "4":
		$obj = $("#area4 option:selected");
		break;
	}
	var latlng={lat:parseFloat($obj.attr("y")),lng:parseFloat($obj.attr("x"))};
	return latlng;
}

function getPlace(){
	var mapPara = getMapPara();
	get("danalysis",{companycd:mapPara.companycd,longitude:mapPara.longitude,latitude:mapPara.latitude},function(result){
		var html="";
		if(result.length==0){
			$("#fxd").html("<p class='text-center' style='margin-top:15px;color:#fff;'>該当するデータがありません。</p>");
			$("#place-list").show();
			return;
		}
		
		for(var i=0;i<result.length;i++){
			var row= result[i];
			html+='<div class="form-control-item fxd" comment="'+replaceHtml(row.g)+'" cd="'+row.a+'" x="'+row.d+'" y="'+row.e+'">';
      	html+='<div class="fxd-title">';
      		html+='<span class="fxd-name">'+replaceHtml(row.b)+'</span>';
      		html+='<span class="fxd-user">'+replaceHtml(row.f)+'</span>';
    		html+='</div>';
      	html+='<p class="fxd-addr">'+replaceHtml(row.c)+'</p>';
    	html+='</div>';
		}
		$("#fxd").html(html);
		$("#place-list").show();
	},{stopIfNull:false});
}

$("#option-query").click(function() {

	if($("#agescale").val()!=00 && $("#age").val()==null){
		$.tremaps.showMessage("M-048");
		return;
	}

	$("#hidoption").val($("#option3").val());
	$("#hidoptiontype").val($("#agescale").val());
	$("#hidoptionscales").val($("#age").val()==null?"0000":$("#age").val().join("_"));
	$("#hidarealevel").val($("#arealevel").val());

	var para = getMapPara();
	para.option=$("#option3").val();
	if($("#proportion")[0].checked){
		if($.data(document,"yeaterday")){
			para.datecompare=1;
		}
		if($.data(document,"compare")){
			para.datecompare=3;
		}
	}	

	$("#hiddatecompare").val(para.datecompare);

	reShow(3);

	var txt = "";
	$("#proportion")[0].checked?txt="(率)":"";
	$("#less")[0].checked?txt="(差)":"";
	$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);
	$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" ","$.text"));
});

$("#downexcel").click(function(){
	var para = getMapPara();
	if (para.arealvl=="" ||$(this).hasClass("disabled")) {
		$.tremaps.showMessage("M-004");
		return;
	}
	var map = $.tremaps.mapBusiness();
	para.circletype = map.circletype;
	para.circlevalue =map.circlevalue;
	para["circlejyushos"]=map.circlejyushos;

	DownLoadFile({
		url:url+"excel/newstoremap",
		data:para
	});
});
// 町丁目名表示
$("#showlabel").click(function(){
	if($(this)[0].checked){
		$.tremaps.showMapLabel();
	}else{
		$.tremaps.hideMapLabel();
	}
});

$("#fxd").on("click",".fxd",function(){
	var x = parseFloat($(this).attr("x"));
	var y = parseFloat($(this).attr("y"));
	storeArray = [{
		storetype:1,//分析地特別対応
		storecd:$(this).attr("cd"),
		storename:$(this).find(".fxd-name").text(),
		latitude:y,
		longitude:x,
		addr:$(this).find(".fxd-addr").text(),
		comment:$(this).attr("comment")
	}];
	setTitle();	
	setMapPara();
	$("#hidlng").val(x);
	$("#hidlat").val(y);
	storesCreate(3,1);
	$("#print-area,#title-company").text($(this).find(".fxd-name").text());
});

