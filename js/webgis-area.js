	// 企业列表绑定
	function bindCompany(result){
		if(result.isAdmin){
			$("#leftmenu").prepend(result.data);

			var company = Enumerable.From($("#company option")).OrderBy("$.innerText").ToArray();
			$("#company").empty();
			Enumerable.From(company).Select("$").TojQuery().appendTo("#company");
			$("#company option:first")[0].selected=true;
			setDefault();
		}else{
			$.data(document,"companyCd",result.companycd);
			$.data(document,"companyName",result.companyname);
			$.data(document,"defaultOption",result.storedefault);
			$.data(document,"defaultCate",result.categorydefault);
			$.data(document,"defaultRange",result.rangedefault);
		}
		$("#area2").selectpicker({size:"7", style:"btn-default btn-sm btn-sel",doneButton:true,container:"body",noneResultsText: messages["M-041"]});
		$("#area3").selectpicker({size:"7", style:"btn-default btn-sm btn-sel",actionsBox:true,container:"body",noneResultsText: messages["M-042"]});
		$("#area2,#area3").siblings("button").attr("disabled",true);
			
		// 都道府県
		bindArea("area1","00000000000");
		
		// 绑定时间列表
		get("mdates",{},Month.setData);

	}

	function setDefault(){
		var company = $("#company option:selected");
		$.data(document,"companyCd",company.val());
		$.data(document,"companyName",company.text());
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

	$("#btn-store").click(function(){
		window.location.href="store.html";
	});
	$("#btn-newstore").click(function(){
		window.location.href="newstore.html";
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
		}
		get("mranges",{"arealevel":arealevel,"areacd":areacd},function(results){
			var $obj = $("#"+obj);
			if (obj=="area3") {
				$obj.html($("<option value='0'>").text("すべて"));
			}
			Enumerable.From(results).Select(function (x) { return $("<option x='"+x.x+"' y='"+x.y+"' value='"+x.a+"'>").text(x.b)[0] })
				    .TojQuery()
				    .appendTo("#"+obj);
			if (obj!="area1") {
				$obj.selectpicker("refresh");
			}
		});
	}
	$("#area1").change(function(){
		var areacd = $(this).val();
		$("#area2,#area3").empty();
		$("#area2,#area3").siblings("button").children(".filter-option").text("");
		$("#area2,#area3").siblings("button").attr("disabled",true);
		if (areacd!=0) {
			$("#area2").siblings("button").removeAttr("disabled");
			bindArea("area2",areacd);
			$("#btnquery").removeAttr("disabled");
		}else{
			$("#btnquery").attr("disabled","disabled");
		}
	});		
	
	//$("#area2").change(function(){	
	$("#area2").parent().on('hidden.bs.dropdown', function () {
		var areacd = $("#area2").val();
		$("#area3").selectpicker("val","");
		$("#area3").empty();
		$("#area3").siblings("button").children(".filter-option").text("");
		$("#area3").siblings("button").attr("disabled",true);
		if (areacd.length==1) {	
			$("#area3").siblings("button").removeAttr("disabled");
			bindArea("area3",areacd[0]);
		}
	});
//----↑行政界

	// 地图表示
	$("#btnquery").click(function(){
		var arealvl=1,arealvl1cd="0",arealvl2cd="0",arealvl3cd="0";
		var arealvl1cd=$("#area1").val();
		if(arealvl1cd=="0"){
			$.tremaps.showMessage("M-034");
			return;
		}

		enableRight();

		$("#showlabel").attr("disabled","disabled");
		if($("#area2").val()!=null && $("#area2").val().length==1){
			$("#showlabel").removeAttr("disabled");
		}

		if ($("#area2").val()!="0" && $("#area2").val()!=null) {
			arealvl=2;
			arealvl2cd = $("#area2").val().join("_");
		}
		if ($("#area3").val()!="0" && $("#area3").val()!=null) {
			arealvl=3;
			arealvl3cd = $("#area3").val();
		}

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
		// 提携店 竟合店
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

		$("#hidarealvl").val(arealvl);
		$("#hidarealvl1cd").val(arealvl1cd);
		$("#hidarealvl2cd").val(arealvl2cd);
		$("#hidarealvl3cd").val(arealvl3cd);
		$("#hidyearmonthcd").val(yearmonthcd);
		$("#hiddatecompare").val(datecompare);
		$("#hidddatespare").val(datespare);	
		$("#hidoption").val($("#option3").val());
		$("#hidoptiontype").val($("#agescale").val());
		$("#hidoptionscales").val($("#age").val()==null?"0000":$("#age").val().join("_"));
		$("#hidarealevel").val($("#arealevel").val());

		$.data(document,"yeaterday",$("#yesterday")[0].checked);
		$.data(document,"compare",$("#compare")[0].checked);

		var para = getMapPara();
		para.arealevel = "arealevel4";
		getMapData(para);
		setTitle();
	});

	function setTitle () {

		if($("#area2").val()!=null && $("#area2").val().length==1){
			var area = Enumerable.From($(".select-area option:selected[value!='0']"));
			$("#title-company").text(area.ToString(" / ","$.text"));
		}else {
			if($("#area2").val()==null){
				$("#title-company").text($("#area1 option:selected").text());
			}else{
				$("#title-company").text($("#area1 option:selected").text()+" / "+Enumerable.From($("#area2 option:selected[value!='0']")).ToString(" ","$.text"));
			}
		}

		//$(".areatotal").text(area.ToString("","$.text"));
		$("#print-area").text($(".select-area option:selected[value!='0']").text());
		$("#title-month,#print-month").text($("#month"+$("input[name='monthtype']:checked").val()+" option:selected").text());
		var txt = "";
		$("#proportion")[0].checked?txt="(率)":"";
		$("#less")[0].checked?txt="(差)":"";
		$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);
		$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" ","$.text"));
	}

	function getMapPara(){
		var para = {arealvl:$("#hidarealvl").val(),
							arealvl1:$("#hidarealvl1cd").val(),
							arealvl2:$("#hidarealvl2cd").val(),
							arealvl3:$("#hidarealvl3cd").val(),
							datetype:$("#hiddatetype").val(),
							yearmonthcd:$("#hidyearmonthcd").val(),
							datecompare:$("#hiddatecompare").val(),
							datespare:$("#hidddatespare").val(),
							option:$("#hidoption").val(),
							optiontype:$("#hidoptiontype").val(),
							optionscales:$("#hidoptionscales").val(),
							arealevel:$("#hidarealevel").val(),
							companycd:$("#hidcompanycd").val()
						};

		if(para.optiontype=="00"){
			para.optionscales="0000";
		}
		return para;
	}
function getLatlng(){
	var mapPara = getMapPara();
	var $obj;
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
	}
	storeArray=[];
	for(var i = 0;i<$obj.length;i++){
		$o = $($obj[i]);
		var lat = parseFloat($o.attr("y"));
		var lng = parseFloat($o.attr("x"));
		var latlng={lat:lat,lng:lng};
		storeArray.push({storecd:$o.val(),storename:$o.text(),longitude:lng,latitude:lat});
	}
	return latlng;
}
function getMapData(mapPara){
	get("dareas",mapPara,function(result){
		enablePrint();
		$('#leftmenu').collapse("hide");
		var latlng = getLatlng();
		$("#mapheader").show();
		$("#save-widget").show();
		drawMap(latlng,result);
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

	getMapData(para);
	var txt = "";
	$("#proportion")[0].checked?txt="(率)":"";
	$("#less")[0].checked?txt="(差)":"";
	$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);
	$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" ","$.text"));
});

$("#downexcel").click(function(){
	//if($(this).hasClass("disabled"))return false;
	var para = getMapPara();
	if (para.arealvl=="" ||$(this).hasClass("disabled")) {
		$.tremaps.showMessage("M-004");
		return;
	}
	DownLoadFile({
		url:url+urlpaths["A001"],
		data:para
	});
});
// 町丁目名表示
$("#showlabel").click(function(){
	if($(this)[0].checked){
		showLabel();
	}else{
		hideLabel();
	}
});