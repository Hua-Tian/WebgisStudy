
$("#area").click(function(){
	location.href="area.html?from=store";
});

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
		
		// 绑定店铺列表
		var cd = $.data(document,"companyCd");

		get("mstores",{companycd:cd},bindStore);

		// 绑定时间列表
		get("mdates",{},Month.setData);

		// 绑定商品阶层
		get('mproducttitles',{companycd:cd},bindProduct);

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
			var cd = $(this).val();
			get("mstores",{companycd:cd},bindStore);
			get('mproducttitles',{companycd:cd},bindProduct);
			
			$("input[name='monthtype'][value='0']").click();	
			$("#yesterday")[0].checked=false;			
			$("#yesterday").removeAttr("disabled");
			$("#compare")[0].checked=false;
			$("#comparemonth").hide();
			$("#month0").find("option:first")[0].selected=true;
			$("#month1").find("option:first")[0].selected=true;
			$("#month2").find("option:first")[0].selected=true;
			storeUploader.options.formData = {"companycd":$.data(document,"companyCd")};
	  	//competitorUploader.options.formData = {"companycd":$.data(document,"companyCd")}; 
	});


	// 店铺列表
	$('#store6').selectpicker({size:"7",maxOptions:"5",style:"btn-default btn-sm btn-sel",doneButton:true,container:"body"});

	$("#store6").parent().on('hidden.bs.dropdown', function () {
		$.data(document,"tempSearch","");

		// 控制确定按钮
		if($("#store6").val()==null){
			$("#btnquery").attr("disabled","disabled");
		}else{
			$("#btnquery").removeAttr("disabled");
		}

	});

	$('#age').selectpicker({size:"7",style:"btn-default btn-sm btn-sel"});

	function bindStore(result){
		//enumStoreResult= Enumerable.From(result);
		$.data(document,"store",Enumerable.From(result));
		setStoreData(0);
	}
	
	// 拼接搜索条件
	function storeSearchCondition(){
			var condition="1";
			condition+=$("#store1").val()=="すべて"?"":" && $.c=='"+$("#store1").val()+"' ";
			condition+=$("#store2").val()=="すべて"?"":" && $.e=='"+$("#store2").val()+"' ";
			condition+=$("#store3").val()=="すべて"?"":" && $.f=='"+$("#store3").val()+"' ";
			condition+=$("#store4").val()=="すべて"?"":" && $.g=='"+$("#store4").val()+"' ";
			condition+=($("#store5").val()=="" || $("#store5").val().indexOf(',')>=0)?"":" && $.h=='"+$("#store5").val()+"' ";
			return condition;
	}

	// 设置数据
	function setStoreData(start){
		if(start<1){
			$("#store1").html($("<option>").text("すべて"));
		}
		if(start<2){
			$("#store2").html($("<option>").text("すべて"));
		}
		if(start<3){
			$("#store3").html($("<option>").text("すべて"));
		}
		if(start<4){
			$("#store4").html($("<option>").text("すべて"));				
		}
		if(start<5){		
			$("#store5").val("");	
		}

		$("#store6").empty();		

		var temp = $.data(document,"store").Where(storeSearchCondition());

		if(start < 1){
			temp.Distinct("$.c").OrderBy("$.c")
			.Select(function (x) { return $("<option value='"+x.c+"'>").text(x.d)[0] })
	    .TojQuery()
	    .appendTo("#store1");
		}

		if(start < 2){
			temp.Distinct("$.e").OrderBy("$.j")
			.Select(function (x) { return $("<option value='"+x.e+"'>").text(x.e)[0] })
	    .TojQuery()
	    .appendTo("#store2");			
		}

		if(start < 3){
	    temp.Distinct("$.f").OrderBy("$.f")
			.Select(function (x) { return $("<option value='"+x.f+"'>").text(x.f)[0] })
	    .TojQuery()
	    .appendTo("#store3");    
		}

		if(start < 4){
	    temp.Distinct("$.g").OrderBy("$.g")
			.Select(function (x) { return $("<option value='"+x.g+"'>").text(x.g)[0]})
	    .TojQuery()
	    .appendTo("#store4");
		}

		if(start <= 5){
	    temp.Distinct("$.h").OrderBy("$.h*1")
			.ForEach(function (x) { 
				var op = $("<option value='"+x.h+"'>");
				op.text(x.i);
				$("#store6").append(op);
				$.data(op[0],"longitude",x.x);
				$.data(op[0],"latitude",x.y);
			});

			$('#store6').selectpicker("refresh");
			if(temp.Count()==1){
				var val =	temp.Select("$.h").Single();
 				$('#store6').selectpicker("val",val);
			}
		}
	}

	$("#store1").change(function(){
		setStoreData(1);
	});		

	$("#store2").change(function(){
		setStoreData(2);
	});

	$("#store3").change(function(){
		setStoreData(3);
	});

	$("#store4").change(function(){
		setStoreData(4);
	});

	$("#store5").blur(function(){
		if($(this).val()==""){
			var val = $("#store6").val();
			setStoreData(5);
			$("#store6").selectpicker("val",val);
		}else{
			setStoreData(5);
		}

		// 设置确定按钮
		// 控制确定按钮
		if($("#store6").val()==null){
			$("#btnquery").attr("disabled","disabled");
		}else{
			$("#btnquery").removeAttr("disabled");
		}
	}).keyup(function(e){
		 if(e.keyCode == 13){
		 		$(this).blur();
		 }
	});

	// 商品阶层
	function bindProduct(result){

		var enumData = Enumerable.From(result);

		productLevelNum = enumData.Select("$.j").FirstOrDefault();
		$(".product-p").hide();
		for (var i = 1; i <=productLevelNum; i++) {
			$("#product-p"+i).show();
			var title = "$."+fields[i+1];
			$("#product-label"+i).text(enumData.Select(title).ToString());
			$("#product"+i).html('<option value="0">すべて</option>');
		}	
		/*
		for (var i = 1; i <=productLevelNum; i++) {
			$("#part3").empty();
			var $p = $("<p class='form-control-item'>");

			var title = "$."+fields[i+1];
			enumData.Select(title)
			.Select(function(x){ return $("<label>").text(x)[0]})
			.TojQuery()
			.appendTo($p);

			var $s = $("<select class='form-control input-sm select-product' productindex='"+i+"' id='product"+i+"'>");
			$s.append($("<option value='すべて'>").text("すべて"));
			$p.append($s);
			$("#part3").append($p);
		}
		*/
		get('mproducts',{companycd:$.data(document,"companyCd")},bindProductSelect);
	}

	// 商品阶层select
	function bindProductSelect(result){
			$.data(document,"product",Enumerable.From(result));
			var name = "$.c";
			$.data(document,"product").Distinct(name)
			.Select(name).OrderBy(name)
			.Select(function(x){ return $("<option value='"+x+"'>").text(x)[0]})
			.TojQuery()
			.appendTo("#product1");
	}

	// 拼接商品条件
	function productSearchCondition(start){
		var condition = "1";
		for(var i = 1;i<=start;i++){
			var ctrl = $("#product"+i);
			condition+=ctrl.val()=="0"?"":" && $."+fields[i+1]+"=='"+ctrl.val()+"' ";
		}
		return condition;
	}

	// 设置商品数据
	function setProductData(start){
		for (var i = start; i <= productLevelNum; i++) {
			var ctrl = $("#product"+(i+1));
			ctrl.html("<option value='0'>すべて</option>");
		};

		if($("#product"+start).val()=='0'){return;}
		var temp = $.data(document,"product").Where(productSearchCondition(start));
		var name = "$."+fields[start+2];

		temp.Distinct(name)
			.Select(name).OrderBy(name)
			.Select(function(x){ return $("<option value='"+x+"'>").text(x)[0]})
			.TojQuery()
			.appendTo($("#product"+(start+1)));


	}

	$("#part3").on('change',".select-product", function () {
		var start = $(".select-product").index($(this))+1;
		setProductData(start);
	});

	// 地图表示
	$("#btnquery").click(function(){

		if($("#store6").val()==null){
				$.tremaps.showMessage("M-003");
				return;
		}
		
		$('#leftmenu').collapse("hide");

		enableRight();

		setMapPara();

		var para = getMapPara();
		para.arealevel="arealevel4";

		storeArray = Enumerable.From($("#store6 option:selected")).Select("{storecd:$.value,storename:$.text,longitude:$.longitude,latitude:$.latitude}").ToArray();
		/*
			順番①
		*/
		Enumerable.From(storeArray).ForEach(function(x){
			var storeOp = $("#store6 option[value='"+x.storecd+"']")[0];
			x.longitude = $.data(storeOp,"longitude");
			x.latitude = $.data(storeOp,"latitude");
		});

		/*
			順番②
			店舗CDの前に「0」を追加されたら、区域のInfoに店舗CDの前「0」がない
			対応方法
		*/
		var reg = /0*(.*)/;
		$.each(storeArray,function(){
			this.storecd = this.storecd.replace(reg,"$1");
		});

		setTitle();
		storesCreate(1,0);

		//setTitle();

	});

	function setTitle () {
		if($("#store1 option:selected").text()!="すべて"){
			$("#title-company").text($("#store1 option:selected").text());
		}else{
			$("#title-company").text("");
		}
		$("#title-store,#print-store").text(Enumerable.From($("#store6 option:selected")).ToString(" ","$.value+'/'+$.text"));//.Select("$.value+'/'+$.text")
		$("#title-month,#print-month").text($("#month"+$("input[name='monthtype']:checked").val()+" option:selected").text());
		var txt = "";
		$("#proportion")[0].checked?txt="(率)":"";
		$("#less")[0].checked?txt="(差)":"";
		$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);

		if($("#store3 option:selected").text()!="すべて" && $("#store4 option:selected").text()!="すべて"){
			$("#title-product,#print-product").text(Enumerable.From($("#store3 option:selected,#store4 option:selected")).ToString(" / ","$.text"));//Select("$.text").
		}else if($("#store3 option:selected").text()!="すべて" && $("#store4 option:selected").text()=="すべて"){
			$("#title-product,#print-product").text($("#store3 option:selected").text());			
		}else if($("#store3 option:selected").text()=="すべて" && $("#store4 option:selected").text()!="すべて"){
			$("#title-product,#print-product").text($("#store4 option:selected").text());		
		}else{
			$("#title-product,#print-product").text("");
		}
	
		if($("#age").val()!=null){
			$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" / ","$.text"));
		}

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

		Option.defaultValue = $(".select-product option:selected[value!='0']").length!=0?$.data(document,"defaultCate"):$.data(document,"defaultOption");
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
		var storecds=Enumerable.From($("#store6").selectpicker("val")).OrderBy().ToArray().join("_");//$("#store6").selectpicker("val").join("_");
		var yearmonthcd=$("#month"+$("input:radio[name='monthtype']:checked").val()).val();
		var datecompare=0;
		var datespare="000000";
		var prodlevel=null;
		var prodlevelnm=null;

		if(datetype==0){
			if($("#yesterday")[0].checked){
					datecompare=2;
			}
			if($("#compare")[0].checked){
				datecompare=4;
				datespare = $("#comparemonth").val();	
			}
		}

		var product = $(".select-product option:selected[value!='0']").parent().last();
		if(product!=null){
			prodlevelnm = Enumerable.From($(".select-product option:selected[value!='0']")).ToString("_","$.value");//product.val();
			prodlevel = product.attr("productindex");
		}

		$("#hidstorecds").val(storecds);
		$("#hidyearmonthcd").val(yearmonthcd);
		$("#hiddatecompare").val(datecompare);
		$("#hidddatespare").val(datespare);
		$("#hidprodlevel").val(prodlevel);
		$("#hidprodlevelnm").val(prodlevelnm);		
		$("#hidoption").val($("#option3").val());
		$("#hidoptiontype").val($("#agescale").val());
		$("#hidoptionscales").val($("#age").val()==null?"0000":$("#age").val().join("_"));
		$("#hidarealevel").val($("#arealevel").val());

		$.data(document,"yeaterday",$("#yesterday")[0].checked);
		$.data(document,"compare",$("#compare")[0].checked);
	}
	function getMapPara(){
		var para = {
							companycd:$("#hidcompanycd").val(),
							storecds:$("#hidstorecds").val(),
							datetype:$("#hiddatetype").val(),
							yearmonthcd:$("#hidyearmonthcd").val(),
							datecompare:$("#hiddatecompare").val(),
							datespare:$("#hidddatespare").val(),
							circletype:1,
							circlevalue:$.data(document,"defaultCircleSize"),//("#hiddftsize").val(),
							option:$("#hidoption").val(),
							optiontype:$("#hidoptiontype").val(),
							optionscales:$("#hidoptionscales").val(),
							arealevel:$("#hidarealevel").val(),
							prodlevel:$("#hidprodlevel").val(),
							prodlevelnm:$("#hidprodlevelnm").val()
						};

		if(para.optiontype=="00"){
			para.optionscales="0000";
		}
		return para;
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
	reShow(1);

	var txt = "";
	$("#proportion")[0].checked?txt="(率)":"";
	$("#less")[0].checked?txt="(差)":"";
	$("#title-item,#print-item").text($("#option3 option:selected").text()+txt);

	//$("#title-product,#print-product").text(Enumerable.From($("#store3 option:selected,#store4 option:selected")).ToString(" / ","$.text"));//Select("$.text").


	if($("#store3 option:selected").text()!="すべて" && $("#store4 option:selected").text()!="すべて"){
		$("#title-product,#print-product").text(Enumerable.From($("#store3 option:selected,#store4 option:selected")).ToString(" / ","$.text"));//Select("$.text").
	}else if($("#store3 option:selected").text()!="すべて" && $("#store4 option:selected").text()=="すべて"){
		$("#title-product,#print-product").text($("#store3 option:selected").text());			
	}else if($("#store3 option:selected").text()=="すべて" && $("#store4 option:selected").text()!="すべて"){
		$("#title-product,#print-product").text($("#store4 option:selected").text());		
	}else{
		$("#title-product,#print-product").text("");
	}


	if($("#age").val()!=null){
		$("#print-age").text(Enumerable.From($("#age option:selected")).ToString(" / ","$.text"));
	}
	$("#print-circle").text(Enumerable.From($(".maphead-left .label")).ToString(" / ","$.innerHTML"));

	if($("#showlabel")[0].checked){
		$.tremaps.showMapLabel();
	}
});

$("#downexcel").click(function(){
	if($(this).hasClass("disabled")){
		$.tremaps.showMessage("M-004");
		return;
	}//return false;

	var para = getMapPara();
	var map = $.tremaps.mapBusiness();
	para.circletype = map.circletype;
	para.circlevalue =map.circlevalue;
	para["circlejyushos"]=map.circlejyushos;

	DownLoadFile({
		url:url+"excel/map",
		data:para
	});
 // $("#downfile")[0].src=url+"excel/map?"+JSON.stringify(para).replace("{","").replace(/\:/g,"=").replace(/\,/g,"&").replace(/\"/g,"").replace("}","");
});
// 町丁木紫表示
$("#showlabel").click(function(){
	if($(this)[0].checked){
		$.tremaps.showMapLabel();
	}else{
		$.tremaps.hideMapLabel();
	}
});