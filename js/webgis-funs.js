$.tremaps={
	/*
		マップ新規
		マップのdiv対象、中心経緯
	*/
	mapCreate:function(obj,latlng){
		var map = new google.maps.Map(obj[0], {
	    zoom: 6,
	    center: latlng,
	    scaleControl: true,
	    disableDefaultUI:true,
	    zoomControl:true,
	    zoomControlOptions:{
	    	position:google.maps.ControlPosition.LEFT_BOTTOM
	    },
			mapTypeControl:true,
			streetViewControl:true,
			streetViewControlOptions:{
	    	position:google.maps.ControlPosition.LEFT_BOTTOM
	    },
	    mapTypeControlOptions: {
	      mapTypeIds: [
	        google.maps.MapTypeId.ROADMAP,
	        google.maps.MapTypeId.SATELLITE
	      ],
	      position: google.maps.ControlPosition.RIGHT_BOTTOM
	    }
	  });
	  return map;
	},
	jsonPolygonsCreate:function(polygon,flag){
		var paths = Enumerable.From(polygon["points"])
								.Select("{lat:parseFloat($.lat),lng:parseFloat($.lng)}")
								.ToArray();
  	var area = new google.maps.Polygon({
	    paths: paths,
	    strokeColor: "#333",//'#888787',
	    strokeOpacity: 0.8,
	    strokeWeight: 0.5,
	    fillColor: '#FFFFFF',
	    fillOpacity: 0.4,
	    visible:false,
	    areacd:polygon["areacd"],
	    level:-1,
	    lnglat:polygon["lnglat"]
	  });
	  area.setMap(map);

	  area.addListener("click",function(event){
	  	switch(flag){
	  		case 1:
	  		$.tremaps.storeclick(this.areacd,this.lnglat);
	  		break;
	  		case 3:
	  		var store = storeArray[0];
				var latlng = {lat:store["latitude"],lng:store["longitude"]};
				var mapstore = mapStoreArray[0];
				mapstore.setPosition(latlng);
	  		$.tremaps.newstoreclick(this.areacd,this.lnglat);
	  		break;
	  	}
	 		
	  });
	  if (flag==3 && $.data(document,"auth")) {
	  	area.addListener('rightclick',competitorAdd);
		}
		var mapLabel = new MapLabel({
			text: polygon["areaname"],
			position: new google.maps.LatLng(polygon["lnglat"]),
			fontSize: 10,
			zIndex:1000,
			align: 'center'
		});
		area.mapLabel = mapLabel;
		mapRegionArray[polygon["areacd"]]=area;
	},
	/*
		既存店の行政界クリーク
	*/
	storeclick:function(areacd,lnglat){
		var contentString = '<div id="regionShow" class="panel panel-default">'+
			'<div class="panel-title text-left">&nbsp;</div>'+
			'<div class="panel-body">'+
			'<table class="table table-bordered">'+
			'<thead><tr class="info"><th class="item">項目</th></tr></thead>'+
			'<tbody><tr><td>人口(人)</td></tr>'+
			'<tr><td>T会員(人)</td></tr>'+
			'<tr><td>T会員化率</td></tr>'+
			'<tr><td>あしあと利用者数(人)</td></tr>'+
			'<tr><td>全店利用者数(人)</td></tr>'+
			'<tr><td>自店利用者数(人)</td></tr>'+
			'<tr><td>自店利用率_対人口</td></tr>'+
			'<tr><td>自店利用率_対T会員</td></tr>'+
			'<tr><td>利用金額(円)</td></tr>'+
			'<tr><td>利用回数(回)</td></tr>'+
			'<tr><td>来店頻度(回)</td></tr>'+
			'<tr><td>客単価(円)</td></tr>'+
			'<tr><td>月間単価(円)</td></tr>'+
			'<tr><td>自店未利用者数(人)</td></tr>'+
			'<tr><td>全店未利用者数(人)</td></tr></tbody>'+
			'</table></div></div>';

			
		infowindow.setContent(contentString);
		infowindow.setPosition(lnglat);
		infowindow.open(map);

		var condition = getMapPara();
		condition["areacd"] = areacd;
		//----↓↓区域の商圏店舗
		var storecdArray = [];
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var mapRegion = mapRegionShowArray[i];
			if(Enumerable.From(mapRegion["regions"]).Any("$.areacd=='"+areacd+"'")){
				storecdArray.push(mapRegion["storecd"]);
			}
		};
		var storecds = Enumerable.From(storecdArray)
									.Distinct()
									.ToString("_");
		var url = "darea,";
		var paras = {
			"companycd":condition["companycd"],"storecds":storecds,"datetype":condition["datetype"],
			"yearmonthcd":condition["yearmonthcd"],"arealevel":condition["arealevel"],"areacd":condition["areacd"]
		};
		//----↑↑区域の商圏店舗
		get(url+condition["areacd"],paras,function(results){
			var obj = $("#regionShow tbody tr");
			var length = results.length;
			for (var i = 0; i < length; i++) {
				var result = results[i];
				$("#regionShow .panel-title").text(result["d"]);
				$("#regionShow thead tr").append('<th style="min-width:80px;" class="text-right">'+result["b"]+'</th>');
				$("#regionShow tbody tr:eq(0)").append('<td class="text-right">'+result["e"]+'</td>');
				$("#regionShow tbody tr:eq(1)").append('<td class="text-right">'+result["f"]+'</td>');
				$("#regionShow tbody tr:eq(2)").append('<td class="text-right">'+(result["g"]*100).toFixed(1)+'%</td>');
				$("#regionShow tbody tr:eq(3)").append('<td class="text-right">'+result["h"]+'</td>');
				$("#regionShow tbody tr:eq(4)").append('<td class="text-right">'+result["i"]+'</td>');
				$("#regionShow tbody tr:eq(5)").append('<td class="text-right">'+result["j"]+'</td>');
				$("#regionShow tbody tr:eq(6)").append('<td class="text-right">'+(result["k"]*100).toFixed(1)+'%</td>');
				$("#regionShow tbody tr:eq(7)").append('<td class="text-right">'+(result["l"]*100).toFixed(1)+'%</td>');
				$("#regionShow tbody tr:eq(8)").append('<td class="text-right">'+result["m"]+'</td>');
				$("#regionShow tbody tr:eq(9)").append('<td class="text-right">'+result["n"]+'</td>');
				$("#regionShow tbody tr:eq(10)").append('<td class="text-right">'+result["o"]+'</td>');
				$("#regionShow tbody tr:eq(11)").append('<td class="text-right">'+result["p"]+'</td>');
				$("#regionShow tbody tr:eq(12)").append('<td class="text-right">'+result["q"]+'</td>');
				$("#regionShow tbody tr:eq(13)").append('<td class="text-right">'+result["r"]+'</td>');
				$("#regionShow tbody tr:eq(14)").append('<td class="text-right">'+result["s"]+'</td>');
			}

			//infowindow.setOptions({maxWidth:166+80*length});
		});	
	},
	/*
		分析地の行政界クリーク
	*/
	newstoreclick:function(areacd,lnglat){
		var contentString = '<div role="tabpanel" id="pop-area" class="tab-pane active">'+
    	'<div style="border-bottom: 1px solid #CECECE;display:inline-block;word-break:break-all;word-wrap:break-word;height:auto;width:200px;font-weight:bold;">'+
				'<span class="b"></span>'+
			'</div>'+
    	'<p class="form-control-item"><label>人口(人)</label><span class="c"></span></p>'+
    	'<p class="form-control-item"><label>T会員(人)</label><span class="d"></span></p>'+
    	'<p class="form-control-item"><label>T会員化率</label><span class="e"></span></p>'+
    	'<p class="form-control-item"><label>あしあと利用者数(人)</label><span class="f"></span></p>'+
			'<p class="form-control-item"><label>全店利用者数(人)</label><span class="g"></span></p>'+
			'<p class="form-control-item"><label>全店未利用者数(人)</label><span class="h"></span></p>'+
    	'</div>';
		infowindow.setContent(contentString);
  	infowindow.setPosition(lnglat);
  	infowindow.open(map);

		var condition = getMapPara();
		condition["areacd"] = areacd;
		var url = "dnewstorearea,";
		var paras = {
			"companycd":condition["companycd"],"datetype":condition["datetype"],
			"yearmonthcd":condition["yearmonthcd"],"arealevel":condition["arealevel"],
			"areacd":condition["areacd"]
		};
		//----↑↑区域の商圏店舗
		get(url+condition["areacd"],paras,function(result){
			$("#pop-area .b").text(result[0]["b"]);
			$("#pop-area .c").text(result[0]["c"]);
			$("#pop-area .d").text(result[0]["d"]);
			$("#pop-area .e").text((result[0]["e"]*100).toFixed(1)+"%");
			$("#pop-area .f").text(result[0]["f"]);
			$("#pop-area .g").text(result[0]["g"]);
			$("#pop-area .h").text(result[0]["h"]);
		});	
	},
		/*
		円商圏を作成
	*/
	storeCircleAreaCreate:function(storecd,radius){
		var store = Enumerable.From(storeArray)
								.Where("$.storecd=='"+storecd+"'")
								.First();
		//区域の色を判断
		var newLevelArray = Enumerable.From(levelArray)
							.Select("value,index=>{level:index,range:value}")
							.ToArray();
    var regions = [];
    var storeRegions;
    if (store["storetype"]==1) {
    	// 分析地特別対応
    	storeRegions = Enumerable.From(regionArray)
				    									.Where("$.mindistance<="+radius*1000)
				    									.ToArray();
    }else{
    	storeRegions = Enumerable.From(regionArray)
				    									.Where("$.storecd=='"+storecd+"' &&　$.mindistance<="+radius*1000)
				    									.ToArray();
    }
    // 円商圏と交差の行政区域
    for (var j = 0; j < storeRegions.length; j++) {
    	var region = storeRegions[j];
  		var area = mapRegionArray[region["areacd"]];
  		if (area == undefined) {
	    	console.log(region["areacd"]);
	    	continue;
	    }
  		var optionvalue = region["optionvalue"];
  		
  		if (newLevelArray[0].range<=optionvalue) {
  			//console.log(j);
				var level = Enumerable.From(newLevelArray).Where("$.range<="+optionvalue).Last().level;
    		if (area.level<=level) {
					area.level=level;
					area.setOptions({fillColor:colorLevel[level]});
    		}		    		
  		}else{
  			var level = -1;
  			if (area.level<=level) {
  				area.setOptions({fillColor:"#FFFFFF"});
    		}
  		}

  		area.setVisible(true);
  		regions.push(area);
    };
		mapRegionShowArray.push({"storecd":storecd,"areatype":1,"arearange":radius,"mr":radius*1000,"regions":regions});
    // 円商圏
    var circle = this.circleCreate({"lat":store["latitude"],"lng":store["longitude"]},radius,"#F56954");
    //circle.addListener('click',fun);
    //商圏追加
    mapBusinessArray.push(circle);
	  circleTotals(1,radius);
	},
	/*
		売上シェア商圏を作成
	*/
	storeSaleAreaCreate:function(share){
		var store = Enumerable.From(storeArray)
								.Where("$.storecd=='"+storecd+"'")
								.First();
		//区域の色を判断
		var newLevelArray = Enumerable.From(levelArray)
							.Select("value,index=>{level:index,range:value}")
							.ToArray();

		var radius = 0;
    var regions = [];
    var storeRegions;
    if (store["storetype"]==1) {
    	// 分析地特別対応
    	storeRegions = Enumerable.From(regionArray)
				    									.Where("$.sharerate<="+share)
				    									.ToArray();
    }else{
    	storeRegions = Enumerable.From(regionArray)
				    									.Where("$.storecd=='"+storecd+"' && $.sharerate<="+share)
				    									.ToArray();
    }
    
    // 円商圏と交差の行政区域
    for (var j = 0; j < storeRegions.length; j++) {
    	var region = storeRegions[j];
  		// 最大の距離を決める
	    if (j==0||region["mindistance"]>radius) {
	    	radius = region["mindistance"];
	    }
			var area = mapRegionArray[region["areacd"]];
	    if (area == undefined) {
	    	console.log(region["areacd"]);
	    	continue;
	    }
  		var optionvalue = region["optionvalue"];

  		if (newLevelArray[0].range<=optionvalue) {
				var level = Enumerable.From(newLevelArray).Where("$.range<="+optionvalue).Last().level;
    		if (area.level<=level) {
					area.level=level;
					area.setOptions({fillColor:colorLevel[level]});
    		}		    		
  		}else{
  			var level = -1;
  			if (area.level<=level) {
  				area.setOptions({fillColor:"#FFFFFF"});
    		}
  		}

  		area.setVisible(true);
  		regions.push(area);
    };

		mapRegionShowArray.push({"storecd":storecd,"areatype":2,"arearange":share,"mr":radius,"regions":regions});
    // 円商圏
    var circle = this.circleCreate({"lat":store["latitude"],"lng":store["longitude"]},radius/1000,"#00a65a");
    //circle.addListener('click',fun);
    //商圏追加
    mapBusinessArray.push(circle);

	  circleTotals(2,share);
	},
	/*
		円商圏を作成
	*/
	circleAreaCreate:function(radius){
		var length = storeArray.length;
		//区域の色を判断
		var newLevelArray = Enumerable.From(levelArray)
							.Select("value,index=>{level:index,range:value}")
							.ToArray();
		for (var i = 0; i < length; i++) {
			var store = storeArray[i];
			var storelatlng = {"lat":store["latitude"],"lng":store["longitude"]};
	    // 円商圏
	    var circle = this.circleCreate(storelatlng,radius,"#F56954");
	    //circle.addListener('click',fun);
	    //商圏追加
	    mapBusinessArray.push(circle);
	    /*if ($.isEmptyObject(mapRegionArray)) {
				continue;
			}*/
	    var regions = [];
	    var storeRegions;
	    if (store["storetype"]==1) {
				// 分析地特別対応
	    	storeRegions = Enumerable.From(regionArray)
					    									.Where("$.mindistance<="+radius*1000)
					    									.ToArray();
	    }else{
	    	storeRegions = Enumerable.From(regionArray)
					    									.Where("$.storecd=='"+store["storecd"]+"' &&　$.mindistance<="+radius*1000)
					    									.ToArray();
	    }
	    //↓↓商圏は行政界にいるの時、行政界が表示されない　begin
	    var specialAreacd = "0";
	    if (storeRegions.length==0) {
	    	//最小距離の行政界
	    	var min = 0;
	    	if (store["storetype"]==1) {
	    		// 分析地特別対応
	    		if (Enumerable.From(regionArray).Any()) {
	    			min = Enumerable.From(regionArray).Min("$.mindistance");
	    		}
	    		storeRegions = Enumerable.From(regionArray).Where("$.mindistance=="+min).ToArray();
		    }else{
		    	if (Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"'").Any()) {
		    		min = Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"'").Min("$.mindistance");
		    	}
	    		storeRegions = Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"' && $.mindistance=="+min).ToArray();
		    }
	    	for (var j = 0; j < storeRegions.length; j++) {
	    		var region = storeRegions[j];
    			var area = mapRegionArray[region["areacd"]];
    			if (area == undefined) {
			    	console.log(region["areacd"]);
			    	continue;
			    }
			    //点は行政界にいる
			    if(google.maps.geometry.poly.containsLocation( new google.maps.LatLng(storelatlng),area)){
			    	storeRegions = [];
			    	storeRegions[0] = region;
			    	specialAreacd = region["areacd"];
			    	break;
			    }
	    	};
	    }
	    //↑↑end
	    // 円商圏と交差の行政区域
	    for (var j = 0; j < storeRegions.length; j++) {
	    	var region = storeRegions[j];
    		var area = mapRegionArray[region["areacd"]];
    		if (area == undefined) {
		    	console.log(region["areacd"]);
		    	continue;
		    }
    		var optionvalue = region["optionvalue"];
    		
    		if (newLevelArray[0].range<=optionvalue) {
					var level = Enumerable.From(newLevelArray).Where("$.range<="+optionvalue).Last().level;
	    		if (area.level<=level) {
						area.level=level;
						area.setOptions({fillColor:colorLevel[level]});
	    		}		    		
    		}else{
    			var level = -1;
    			if (area.level<=level) {
    				area.setOptions({fillColor:"#FFFFFF"});
	    		}
    		}

    		area.setVisible(true);
    		regions.push(area);
	    };
			mapRegionShowArray.push({"storecd":store["storecd"],"areatype":1,"arearange":radius,"mr":radius*1000,"regions":regions,specialAreacd:specialAreacd});
	  }
	  circleTotals(1,radius);
	},
	/*
		売上シェア商圏を作成
	*/
	saleAreaCreate:function(share){
		var length = storeArray.length;
		//区域の色を判断
		var newLevelArray = Enumerable.From(levelArray)
							.Select("value,index=>{level:index,range:value}")
							.ToArray();
		for (var i = 0; i < length; i++) {
	    var store = storeArray[i];
			var radius = 0;
	    var regions = [];
	    var storeRegions;
	    if (store["storetype"]==1) {
	    	// 分析地特別対応
	    	storeRegions = Enumerable.From(regionArray)
					    									.Where("$.sharerate<="+share)
					    									.ToArray();
	    }else{
	    	storeRegions = Enumerable.From(regionArray)
					    									.Where("$.storecd=='"+store["storecd"]+"' && $.sharerate<="+share)
					    									.ToArray();
	    }
	    
	    // 円商圏と交差の行政区域
	    for (var j = 0; j < storeRegions.length; j++) {
	    	var region = storeRegions[j];
    		// 最大の距離を決める
		    if (j==0||region["mindistance"]>radius) {
		    	radius = region["mindistance"];
		    }
				var area = mapRegionArray[region["areacd"]];
		    if (area == undefined) {
		    	console.log(region["areacd"]);
		    	continue;
		    }
    		var optionvalue = region["optionvalue"];

    		if (newLevelArray[0].range<=optionvalue) {
					var level = Enumerable.From(newLevelArray).Where("$.range<="+optionvalue).Last().level;
	    		if (area.level<=level) {
						area.level=level;
						area.setOptions({fillColor:colorLevel[level]});
	    		}		    		
    		}else{
    			var level = -1;
    			if (area.level<=level) {
    				area.setOptions({fillColor:"#FFFFFF"});
	    		}
    		}

    		area.setVisible(true);
    		regions.push(area);
	    };

			mapRegionShowArray.push({"storecd":store["storecd"],"areatype":2,"arearange":share,"mr":radius,"regions":regions});
	    // 円商圏
	    var circle = this.circleCreate({"lat":store["latitude"],"lng":store["longitude"]},radius/1000,"#00a65a");
	    //商圏追加
	    mapBusinessArray.push(circle);
	  }
	  circleTotals(2,share);
	},
	/*
		ドライブ商圏　と　フリー商圏
	*/
	polygonAreaCreate:function(storecd,areatype,arearange,polygon,dashedPolygon,maxdistance){
		//console.log(new Date());
		//区域の色を判断
		var newLevelArray = Enumerable.From(levelArray)
							.Select("value,index=>{level:index,range:value}")
							.ToArray();
		
		var a = polygon;
		
	  var stores = Enumerable.From(storeArray)
												.Where("$.storecd=='"+storecd+"' || '0'=='"+storecd+"'")
												.ToArray();
		for (var i = 0; i < stores.length; i++) {
			var regions = [];
			var store = stores[i];
			var storelatlng = {"lat":store["latitude"],"lng":store["longitude"]};
			var storeRegions;
	    if (store["storetype"]==1) {
	    	// 分析地特別対応
	    	storeRegions = Enumerable.From(regionArray)
    									.Where("$.mindistance<="+maxdistance)
    									.ToArray();
	    }else{
	    	storeRegions = Enumerable.From(regionArray)
    									.Where("$.storecd=='"+store["storecd"]+"' && $.mindistance<="+maxdistance)
    									.ToArray();
	    }
	    if (storeRegions.length==0) {
	    	//最小距離の行政界
	    	var min = 0;
	    	if (store["storetype"]==1) {
					// 分析地特別対応
					if (Enumerable.From(regionArray).Any()) {
			    	min = Enumerable.From(regionArray).Min("$.mindistance");
			    }
	    		storeRegions = Enumerable.From(regionArray).Where("$.mindistance=="+min).ToArray();
		    }else{
		    	if (Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"'").Any()) {
		    		min = Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"'").Min("$.mindistance");
		    	}
	    		storeRegions = Enumerable.From(regionArray).Where("$.storecd=='"+store["storecd"]+"' && $.mindistance=="+min).ToArray();
		    }
	    	for (var j = 0; j < storeRegions.length; j++) {
	    		var region = storeRegions[j];
    			var area = mapRegionArray[region["areacd"]];
    			if (area == undefined) {
			    	console.log(region["areacd"]);
			    	continue;
			    }
			    //点は行政界にいる
			    if(google.maps.geometry.poly.containsLocation( new google.maps.LatLng(storelatlng),area)){
			    	storeRegions = [];
			    	storeRegions[0] = region;
			    	specialAreacd = region["areacd"];
			    	break;
			    }
	    	};
	    }
			for (var j = 0; j < storeRegions.length ; j++) {
		    var region = storeRegions[j];
				
		    // 交差の行政区域
	    	var b =  mapRegionArray[region["areacd"]];
	    	if (b == undefined) {
		    	console.log(region["areacd"]);
		    	continue;
		    }
	    	// 交差を判断
	    	if (this.polygonsInterect(a,b)) {
	    		
	    		var optionvalue = region["optionvalue"];
	    		
	    		if (newLevelArray[0].range<=optionvalue) {
						var level = Enumerable.From(newLevelArray).Where("$.range<="+optionvalue).Last().level;
		    		if (b.level<=level) {
							b.level=level;
							b.setOptions({fillColor:colorLevel[level]});
		    		}		    		
	    		}else{
	    			b.setOptions({fillColor:"#FFFFFF"});
	    		}
	    		b.setVisible(true);
	    		regions.push(b);
	    	}
		  }
		  mapRegionShowArray.push({"storecd":store["storecd"],"areatype":areatype,"arearange":arearange,"mr":maxdistance,"area":polygon,"dashed":dashedPolygon,"regions":regions});
		};

	  mapBusinessArray.push(dashedPolygon);
	  dashedPolygon.setMap(map);
	  //console.log(new Date());
	  circleTotals(areatype,arearange);
	},
	/*
		drawDashedCircle
	*/
	drawDashedCircle:function(point,radius,dir){
		var d2r = Math.PI / 180;   // degrees to radians 
		var r2d = 180 / Math.PI;   // radians to degrees 
		var earthsradius = 6371.393; // 6371 is the radius of the earth in miles

  	var points = 128; 

		// find the raidus in lat/lon 
		var rlat = (radius / earthsradius) * r2d; 
		var rlng = rlat / Math.cos(point["lat"] * d2r); 

		var extp = new Array(); 
		if (dir==1)	{var start=0;var end=points+1} // one extra here makes sure we connect the
		else		{var start=points+1;var end=0}
		for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)  
		{ 
		  var theta = Math.PI * (i / (points/2)); 
		  ey = point["lng"] + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
		  ex = point["lat"] + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
		  extp.push(new google.maps.LatLng(ex, ey)); 
		  bounds.extend(extp[extp.length-1]);
		} 

		return extp;
	},
	/*
		線でポリゴンを描き①
	*/
	drawPolygon:function (points) {
    var extp = new Array();
    for(var i = 0; i < points.length; i++){
      var point = points[i];
      extp.push(new google.maps.LatLng(point.lat, point.lng))
    }
    var point = points[0];
    extp.push(new google.maps.LatLng(point.lat, point.lng));
    return extp;
	},
	drawDashedPolygon:function(paths,strokeColor){
		var lineSymbol = {
		  path: 'M 0,-1 0,1',
		  strokeOpacity: 1,
		  scale: 3
		};
		var tempPaths = [];
		$.merge(tempPaths,paths);
		tempPaths.push(paths[0]);
		//paths.push(paths[0]);
		var donut = new google.maps.Polyline({
			//path: drawPolygon(coords),
			path:tempPaths,
				strokeOpacity: 0,
				icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: '12px'
				}],
				strokeWeight: 3,
				zIndex:1000,
				strokeColor: strokeColor
			});
		return donut;
	},
	/*
		円を作成
	*/
	circleCreate:function(latlng,radius,strokeColor){
		bounds = new google.maps.LatLngBounds();
		var lineSymbol = {
	    path: 'M 0,-1 0,1',
	    strokeOpacity: 1,
	    scale: 3
	  };
		var businessarea = new google.maps.Polyline({
			path: this.drawDashedCircle(latlng, radius, 1),
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: '12px'
			}],
			strokeWeight: 2,
			strokeColor:strokeColor,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			zIndex:1000,
			map:map
     });
		map.fitBounds(bounds);
		return businessarea;
	},
	/*
		商圏の半径を変更
	*/
	circleSetRadius:function(circles,radius){
		for (var i = 0; i < circles.length; i++) {
			circles[i].setRadius(radius);
		};
	},
	/*
		商圏合計
		flag:0⇒既存店；1⇒新規店
	*/
	businessAreaTotal:function(circletotals,flag){
		$(".businessarea").removeClass("open");
		$(".businessarea").hide();
		//商圏合計
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var $obj = $("#businessarea"+(i+1));
			$obj.addClass("open");
		}
		for (var i = 0; i < circletotals.length; i++) {
  		var circle = circletotals[i];
  		//合計表示
  		$("#businessarea"+(i+1)+" thead th").text(circle["circlename"]);
  		$("#businessarea"+(i+1)+" tbody tr:eq(0) span").html(circle["population"]);
  		$("#businessarea"+(i+1)+" tbody tr:eq(1) span").html(circle["tmember"]);
  		$("#businessarea"+(i+1)+" tbody tr:eq(2) span").html((circle["tmemberrate"]*100).toFixed(1));
  		$("#businessarea"+(i+1)+" tbody tr:eq(3) span").html(circle["footprint"]);
  		$("#businessarea"+(i+1)+" tbody tr:eq(4) span").html(circle["userforallstore"]);
  		if (flag==0) {
  			$("#businessarea"+(i+1)+" tbody tr:eq(5) span").html(circle["userforstore"]);
  		}
  		
  	};
		$(".businessarea.open").show();

		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		var topHeight = $("#top").height();
		var mapHeadHeight = $("#mapheader").height();
		var mapHeight = windowHeight-topHeight-mapHeadHeight;
		var popWindows = $(".businessarea:not(:hidden)");
		var addedHeight=0;

		popWindows.each(function(){
			popWindowHeight = $(this).height()+20;
			if((mapHeight-addedHeight)>popWindowHeight){
				if(addedHeight==0){
					$(this).attr("style","z-index: 0; position: absolute; top: "+(mapHeadHeight+20)+"px; left: 10px; display: block");//top:"++"px!important");
				//$(this).css("left:10px!important");
					$(this).addClass("popfirst");
				}else{
					$(this).attr("style","z-index: 0; position: absolute; top: "+popWindowHeight+"px; left: 10px; display: block");//top:"++"px!important");

			//   $(this).css({"top":popWindowHeight+"px!important","left":"10px!important"});
				}
				addedHeight=popWindowHeight;
			}else{
				var leftPopWidth = $(".popfirst").width()+20;
			//$(this).css({"top":"10px!important","left":leftPopWidth+"px!important"});
				$(this).attr("style","z-index: 0; position: absolute; top: "+(mapHeadHeight+20)+"px; left: "+leftPopWidth+"px; display: block");//top:"++"px!important");
			}
		});
	},
	/*
		店舗を作成
	*/
	storesCreate:function(){
		// 最小の店舗CDで、地図の中心
		var latlng,minstorecd;
		var length = storeArray.length;
		for (var i = 0; i < length; i++) {
	    var store = storeArray[i];
	    // 最小の店舗CDで、地図の中心を決める
	    if (i==0||store["storecd"]<minstorecd) {
	    	minstoreid = store["storecd"];
	    	latlng = {lat:store["latitude"],lng:store["longitude"]};
	    }
	    // 店舗を作成
	    var marker = new google.maps.Marker({
	    	title: store["storename"],
	      position: {lat:store["latitude"],lng:store["longitude"]},
	      map: map
	    });
			// 一つ店舗だけの時、店舗総計
			if (length==1) {
		    marker.addListener("click",function(event){
		    	if (mapRegionShowArray.length==0) {
		    		return;
		    	}
			  	if ($(".businessarea").is(":visible")) {
			  		$(".businessarea").hide();
			  	}else{
			  		$(".businessarea.open").show();
			  	}
		  	});
			}
			mapStoreArray.push(marker);
	  }
	  //マップ中心
    map.setCenter(latlng);
	},
	/*
		分析地を作成 赤い　移動できる
	*/
	redStoreCreate:function(){
		var store = storeArray[0];
		var storename = store["storename"];
		var lat = store["latitude"];
		var lng = store["longitude"];
		var latlng = {lat:lat,lng:lng};

		var marker = new google.maps.Marker({
	    	title: storename,
	      position: latlng,
	      map: map,
	      draggable:true
	    });
		//分析地の商圏合計
    marker.addListener("click",function(event){
    	if (mapRegionShowArray.length==0) {
    		return;
    	}
	  	if ($(".businessarea").is(":visible")) {
	  		$(".businessarea").hide();
	  	}else{
	  		$(".businessarea.open").show();
	  	}
  	});
  	marker.addListener("dragend",function(event){
  		var obj = this;
  		var dragevent = event;
  		var newlatlng = dragevent.latLng;
  		var contentString = '<div role="tabpanel" class="tab-pane active" id="newstoremove" style="width:130px;margin-top:10px;">'+
			'<p class="form-control-item">ここに移動しますか？'+
			'</p>'+
			'<div>'+
				'<button class="btn btn-sm btn-default btncancle">キャンセル</button>'+
				'<button class="btn btn-sm btn-warning btnsure" style="float:right">確定</button>'+
			'</div>'+
    	'</div>';
    	//
    	//google.maps.event.clearListeners(map, 'rightclick');
    	//$.each(mapRegionArray,function(key,value){google.maps.event.clearListeners(value, 'rightclick');})

			infowindow.setContent(contentString);
	  	infowindow.setPosition(newlatlng);
	  	infowindow.open(map);
	  	$("#newstoremove .btnsure").click(function(){
	  		infowindow.open(null);
	  		var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'location': newlatlng},
				function(results, status){
			    if (status === google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			        address = results[1].formatted_address;
			      } else {
			        address = "No results found";
			      }
			    } else {
			      address = "Geocoder failed due to: " + status;
			    }
			    setMapPara();
					storeArray=[{storetype:1,storecd:"0",storename:address,latitude:newlatlng.lat(),longitude:newlatlng.lng()}];
					$("#hidlng").val(newlatlng.lng());
					$("#hidlat").val(newlatlng.lat());

					setTitle();

		      storesCreate(3,0);

		      $("#print-area,#title-company").text(address);
					$("#print-place").text("");
					
		      getPlace();	

			  });

			});
			$("#newstoremove .btncancle").click(function(){
				obj.setPosition(latlng);
				infowindow.open(null);
			});
			infowindow.addListener("closeclick",function(){
				obj.setPosition(latlng);
				infowindow.open(null);
			});
  	});
		mapStoreArray.push(marker);
	  //マップ中心
    map.setCenter(latlng);
	},
	/*
		分析地を作成　青い　移動できない
	*/
	blueStoreCreate:function(){
		var store = storeArray[0];
		var storecd = store["storecd"];
		var storename = store["storename"];
		var comment = store["comment"];
		var lat = store["latitude"];
		var lng = store["longitude"];
		var latlng = {lat:lat,lng:lng};
		var address = store["addr"];

		var marker = new google.maps.Marker({
	    	title: storename,
	      position: latlng,
	      icon:"img/bluedot.png",
	      map: map,
	      storecd:storecd,
	      storename:storename,
	      comment:comment,
	      address:address,
	      lat:lat,
	      lng:lng
	    });
		//分析地の商圏合計
    marker.addListener("click",function(event){
    	if (mapRegionShowArray.length==0) {
    		return;
    	}
	  	if ($(".businessarea").is(":visible")) {
	  		$(".businessarea").hide();
	  	}else{
	  		$(".businessarea.open").show();
	  	}
  	});
  	marker.addListener("rightclick",function(event){
  		var obj = this;
			var contentString = '<div role="tabpanel" class="tab-pane active" cd='+obj.storecd+' id="map-editstore">'+
				'<p style="border-bottom: 1px solid #CECECE;">'+
					'<label>分析地編集</label>'+
				'</p>'+
				'<p class="form-control-item">'+
					'<label>分析地名</label>'+
					'<input type="text" class="form-control input-sm addressnm" maxlength="30"></input>'+
				'</p>'+
				'<p class="form-control-item">'+
					'<label>備考</label>'+
					'<input type="text" class="form-control input-sm mark" maxlength="100"></input>'+
				'</p>'+
				'<p class="form-control-item">'+
					'<div style="width:220px;margin-left:5px;" class="address">'+obj.address+
					'</div>'+
				'</p>'+		
				'<p class="form-control-item" style="border-bottom: 1px solid #CECECE;">'+
					'<span><b>経</b>：<span class="lng">'+obj.lng+
				'</span></span>'+
					'<span style="float:right;"><b>緯</b>：<span class="lat">'+obj.lat+
				'</span></span></p>'+
				'<p class="form-control-item text-right">'+
					'<button class="btn btn-sm btn-default btncancle">キャンセル</button>'+
					'<button class="btn btn-sm btn-default btndelete">削除</button>'+
					'<button class="btn btn-sm btn-warning btnsave">登録</button>'+
				'</p>'+
				'</div>';
			infowindow.setContent(contentString);
			infowindow.setPosition({lat:obj.lat,lng:obj.lng});
			infowindow.open(map);
			
			$("#map-editstore .addressnm").val(obj.storename);
			$("#map-editstore .mark").val(obj.comment);

			$("#map-editstore .btnsave").click(function(){
				var addresscd = 　$("#map-editstore").attr("cd");
				var addressnm = $.trim($("#map-editstore .addressnm").val());
				var comment = $.trim($("#map-editstore .mark").val());
				var address = $("#map-editstore .address").text();
				var lng = $("#map-editstore .lng").text();
				var lat = $("#map-editstore .lat").text();
				if (addressnm=="") {
					$.tremaps.showMessage("M-046");
					return;
				}
				var para = {
					updateflg:"UPDATE",
					addresscd:addresscd,
					companycd:getMapPara().companycd,
					addressnm:addressnm,
					comment:comment,
					address:address,
					longitude:lng,
					latitude:lat
				};
				put("eanalysis,"+addresscd,para,function(response){
					var result = response;
					getPlace();
					$.tremaps.showMessage("M-037");

					obj.setTitle(addressnm);
					obj.storename = addressnm;
					obj.comment = comment;
					$("#print-place,#title-company").text(addressnm);

					infowindow.open(null);
				});
			});
			$("#map-editstore .btndelete").click(function(){
						var addresscd = 　$("#map-editstore").attr("cd");
						var addressnm = $("#map-editstore .addressnm").val();
						var comment = $.trim($("#map-editstore .mark").val());
						var address = $("#map-editstore .address").text();
						var lng = $("#map-editstore .lng").text();
						var lat = $("#map-editstore .lat").text();
						var para = {
							updateflg:"DELETE",
							addresscd:addresscd,
							companycd:getMapPara().companycd,
							addressnm:addressnm,
							comment:comment,
							address:address,
							longitude:lng,
							latitude:lat
						};
						put("eanalysis,"+addresscd,para,function(response){
							var result = response;
							$.tremaps.showMessage("M-039");

							lineArea.setPath([]);
							linePath=[];
							freeBusinessArea.setMap(null);
							//地図をクリアー
							$.tremaps.mapStoreClear();
							$.tremaps.mapBusinessClear();
							// 表示の行政区域をクリアー
							$.tremaps.mapRegionHide();
							mapRegionShowArray = [];
							$("#mapheader,#save-widget,.businessarea").hide();
							$("#pac-input").removeClass("state1");
							$("#pac-input").addClass("state0");
							$(".fxd[cd='"+addresscd+"']").remove();
							if ($(".fxd").length==0) {
								var nodata = '<p class="text-center" style="margin-top:15px;color:#fff;">該当するデータがありません。</p>';
								$("#fxd").append(nodata);
							}
							$("#print-place,#title-month,#title-item,#title-company").text("");
							infowindow.open(null);
						});
					});
			$("#map-editstore .btncancle").click(function(){
				infowindow.open(null);
			});
  	});
		mapStoreArray.push(marker);
	  //マップ中心
    map.setCenter(latlng);
	},
	/*
		提携と競合
	*/
	competitorCreate:function(competitors){

		var image = {
	    url: 'img/bluedot.png',
	    size: new google.maps.Size(27, 27)/*,
	    // This marker is 20 pixels wide by 32 pixels high.
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(0, 49)*/
	  };
	  var markers = [];
		for (var i = 0; i < competitors.length; i++) {
	    var competitor = competitors[i];
	    image["url"] = "logo/" + competitor["e"];
	    // 競合店を作成
	    var marker = new google.maps.Marker({
	    	title: competitor["b"],
	      position: {lat:competitor["y"],lng:competitor["x"]},
	      icon: image,
	      map: map
	    });
	    markers.push(marker);
	  }
	  return markers;
	},
	//----↓交差判断
	/*
		線分関係を判断
		a,b,c,d(google.maps.LatLng class)
	*/
	segmentsIntr:function(a,b,c,d){
		var area_abc=(a.lng()-c.lng())*(b.lat()-c.lat())-(a.lat()-c.lat())*(b.lng()-c.lng());
		var area_abd=(a.lng()-d.lng())*(b.lat()-d.lat())-(a.lat()-d.lat())*(b.lng()-d.lng());
		if(area_abc*area_abd>0){
			return false;
		}
		var area_cda=(c.lng()-a.lng())*(d.lat()-a.lat())-(c.lat()-a.lat())*(d.lng()-a.lng());
		var area_cdb=area_cda+area_abc-area_abd;
		if(area_cda*area_cdb>0){
			return false;
		}
		return true;
	},
	/*

	*/
	pointpolygonInterect:function(polygon1,polygon2){
		var path1 = polygon1.getPath();
		var path2 = polygon2.getPath();
		for (var i = 0; i < path1.length; i++) {
			if(google.maps.geometry.poly.containsLocation(path1.getAt(i),polygon2)){
				return true;
			}
		};
		return false;
	},
	polygonsInterect:function(polygon1,polygon2){
		if(this.pointpolygonInterect(polygon2,polygon1)){
			return true;
		}
		if(this.pointpolygonInterect(polygon1,polygon2)){
			return true;
		}
		var path1 = polygon1.getPath();
		var path2 = polygon2.getPath();
		var pg1 = path1.getLength();
		var pg2 = path2.getLength()
		//var count = 0;
		outerloop:
		for(var i=0;i<pg1;i++){
			for (var j = 0; j < pg2; j++) {
				var a,b,c,d;
				a = path1.getAt(i);
				if(i<pg1-1){
					b = path1.getAt(i+1);
				}else{
					b = path1.getAt(0);
				}
				c = path2.getAt(j);
				if(j<pg2-1){
					d = path2.getAt(j+1);
				}else{
					d = path2.getAt(0);
				}
				//count=count+1;
				if(this.segmentsIntr(a,b,c,d)){
					//console.log("line:"+count);
					break outerloop;
				}
			};
		}
	},
	//----↑交差判断
	clearListeners:function(objects){
		for (var i = 0; i < objects.length; i++) {
			google.maps.event.clearInstanceListeners(objects[i]);
		};
	},
	addListeners:function(objects,func){
		for (var i = 0; i < objects.length; i++) {
			google.maps.event.addListener(objects[i],"click",func);
		};
	},
	/*行政区域を隠す*/
	mapRegionHide:function(){
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var regions = mapRegionShowArray[i]["regions"];
			for (var j = 0; j < regions.length; j++) {
				var region = regions[j];
				if (region.getVisible()) {
					region.setVisible(false);
				}
			};
		};
	},
	mapRegionShow:function(){
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var regions = mapRegionShowArray[i]["regions"];
			for (var j = 0; j < regions.length; j++) {
				var region = regions[j];
				if (!region.getVisible()) {
					region.setVisible(true);
				}
			};
		};
	},
	mapStoreClear:function(){
		$.each(mapStoreArray,function(){
			this.setMap(null);
		});
		mapStoreArray = [];
	},
	mapRegionClear:function(){
		$.each(mapRegionArray,function(key,value){
			value.setMap(null);
		});
		mapRegionArray = {};
	},
	mapRegionInit:function(){
		$.each(mapRegionArray,function(key,value){
		if (value.getVisible()) {}
			value.level = -1;
			value.setVisible(false);
		});
	},
	mapBusinessClear:function(){
		for (var i = 0; i < mapBusinessArray.length; i++) {
			mapBusinessArray[i].setMap(null);
		};
		//
		mapBusinessArray = [];
	},
	showMapLabel:function(){
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var mapRegionShow = mapRegionShowArray[i];
			var storecd = mapRegionShow["storecd"];
			var regionshows = mapRegionShow["regions"];
			var regiontemps;
			if(regionArray[0].stroecd==undefined){
				//分析地
				regiontemps = Enumerable.From(regionArray).Where("$.mindistance<=5000").ToArray();
			}else{
				regiontemps = Enumerable.From(regionArray).Where("$.storecd=="+storecd+" && $.mindistance<=5000").ToArray();
			}
			var regions = Enumerable.From(regionshows).Join(regiontemps,"$.areacd","$.areacd","$").ToArray()
			for (var j = 0; j < regions.length; j++) {
				var maplabel = regions[j].mapLabel;
				if (maplabel) {
					maplabel.setMap(map);
				}
			};
		};
	},
	hideMapLabel:function(){
		for (var i = 0; i < mapRegionShowArray.length; i++) {
			var regions = mapRegionShowArray[i]["regions"];
			for (var j = 0; j < regions.length; j++) {
				var maplabel = regions[j].mapLabel;
				maplabel.setMap(null);
			};
		};
	},
	showMessage:function(msg){
		var text = msg;
		if (messages[msg]!=undefined) {
			text = messages[msg];
		}

		$.MessageBox({
			content: text,
			type: 'information',
			animate: { open : 'top', close : 'top', speed : '500' },
			buttons: { confirm: {title: '確定', style: 'continue'} },
			usekey: true,
			timeout: { second : '5', screen: true }
		});

	},
	mapBusiness:function(){
		//円商圏とシエア商圏

		var areatyperangeArray=[],areatypeArray=[],arearangeArray=[],areaArray=[];

		$("#set").nextAll().each(function(){
			var $label = $(this);
			var areatype = parseInt($label.attr("areatype"));
			var arearange = parseFloat($label.attr("range"));
			areatyperangeArray.push({areatype:areatype,arearange:arearange});
			areatypeArray.push(areatype);
			arearangeArray.push(arearange);
		});

		var circlejyusho = [];
		// 很重要，保持店铺，商圈种类，点阵顺序一致
		storeArray = Enumerable.From(storeArray).OrderBy("$.storecd").ToArray();
		for (var i = 0; i < storeArray.length; i++) {
			var store = storeArray[i];
			var areaArray = [];
			$.each(areatyperangeArray,function(){
				var areatype = this.areatype;
				var arearange = this.arearange;
				var tmpMapRegion = Enumerable.From(mapRegionShowArray)
																		.Where("$.storecd=='"+store["storecd"]+"' && $.areatype=="+areatype+" && $.arearange=="+arearange)
																		.First();
				switch(areatype){
					case 1:
					case 2:
					var specialAreacd = tmpMapRegion["specialAreacd"];
					if (specialAreacd!=undefined && specialAreacd!="0") {
						areaArray.push(specialAreacd);
					}else{
						areaArray.push(0);
					}
					break;
					case 3:
					case 4:
					case 5:
					case 6:
					areaArray.push(Enumerable.From(tmpMapRegion["regions"]).Select("$.areacd").ToString(","));
					break;
				}
			});
			circlejyusho.push(areaArray.join("_"));
		};
		var business = {
			circletype:areatypeArray.join("_"),
			circlevalue:arearangeArray.join("_"),
			circlejyushos:circlejyusho.join("-")
		};
		return business;
	},
	sleep:function(n) { //n表示的毫秒数
		var start = new Date().getTime();
		while (true) if (new Date().getTime() - start > n) break;
	},
	ajaxLoad:function(uri, callback) {
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    request.onreadystatechange = callback;
    request.open("GET", uri);
    request.send(null);
	},
	pointInPolygon:function(point,polygon) {
		var x =point.lng;
		var y =point.lat;
		var paths = polygon.getPath();
		var polySides = paths.length;
	  var j=polySides-1;
	  var oddNodes = false;
	  for (i=0;i<polySides; i++) {
	    if((paths.getAt(i).lat()< y && paths.getAt(j).lat()>=y || paths.getAt(j).lat()<y && paths.getAt(i).lat()>=y) && (paths.getAt(i).lng()<=x || paths.getAt(j).lng()<=x)){
	      if(paths.getAt(i).lng()+(y-paths.getAt(i).lat())/(paths.getAt(j).lat()-paths.getAt(i).lat())*(paths.getAt(j).lng()-paths.getAt(i).lng())<x) {
	        oddNodes=!oddNodes;
	      }
	    }
	    j=i;
	  }
	  return oddNodes;
	},
	ccInit:function(){
		$("#cooperations input").prop("checked",false);
		$.each(mapCooperationArray,function(){this.setMap(null)});
		$("#competitors input").prop("checked",false);
		$.each(mapCompetitorArray,function(){this.setMap(null)});
		class0Array = [],class1Array = [],classCompanyArray = [];
	}
}