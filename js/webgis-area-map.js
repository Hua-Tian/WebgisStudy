	var infowindow = new google.maps.InfoWindow({maxWidth:500});

	function initMap() {
	//----↓マップを作成
	var mapobj=$('#map');
	var latlng={lat: 38.352256, lng: 137.447687};
	map = $.tremaps.mapCreate(mapobj,latlng);

	var mapheader = $('#mapheader')[0];
	map.controls[google.maps.ControlPosition.TOP].push(mapheader);

	var widgetDiv = $('#save-widget')[0];
	map.controls[google.maps.ControlPosition.RIGHT].push(widgetDiv);

	var businessarea = $('#businessarea1')[0];
	map.controls[google.maps.ControlPosition.LEFT].push(businessarea);

	}
	//----↓競合店追加
	function competitorGroup(competitordatas,type){
	switch(type){
		case 0:
			Enumerable.From(competitordatas)
								.Distinct("$.d")
								.OrderBy("$.e")
								.Select(function(x){return $("<option value='"+x.d+"'>").text(x.e)[0]})
								.TojQuery()
								.appendTo("#map-addstore .company");      		
		break;
		case 1:
			var c_companycd = $("#map-addstore .company").val();
			$("#map-addstore .subsidiary").empty();
			Enumerable.From(competitordatas)
								.Where("$.d=='"+c_companycd+"'")
								.Distinct("$.f")
								.OrderBy("$.g")
								.Select(function(x){return $("<option value='"+x.f+"'>").text(x.g)[0]})
								.TojQuery()
								.appendTo("#map-addstore .subsidiary");      		
		break;
		case 2:
			Enumerable.From(competitordatas)
								.Distinct("$.b")
								.OrderBy("$.c")
								.Select(function(x){return $("<option value='"+x.b+"'>").text(x.c)[0]})
								.TojQuery()
								.appendTo("#map-addstore .cla");      		
		break;
	}
	}
	function competitorAdd(event){

		var contentString = '<div role="tabpanel" class="tab-pane active" id="map-addstore">'+
	  	'<p style="border-bottom: 1px solid #CECECE;">'+
				'<label>競合店登録</label>'+
			'</p>'+
	  	'<p class="form-control-item">'+
				'<label>企業名</label>'+
				'<select class="form-control input-sm company" ></select>'+
			'</p>'+
	  	'<p class="form-control-item">'+
				'<label>業態名</label>'+
				'<select class="form-control input-sm subsidiary" ></select>'+
			'</p>'+
	  	'<p class="form-control-item">'+
				'<label>中分類</label>'+
				'<select class="form-control input-sm cla" ></select>'+
			'</p>'+
	  	'<p class="form-control-item">'+
				'<label>店舗名</label>'+
				'<input type="text" class="form-control input-sm store" maxlength="30"></input>'+
			'</p>'+
			'<p class="form-control-item">'+
				'<label>備考</label>'+
				'<input type="text" class="form-control input-sm mark" maxlength="100"></input>'+
			'</p>'+
			'<p class="form-control-item">'+
				'<div style="width:220px;margin-left:5px;" class="address">'+
					'<div id="loadingID">'+
						'<div id="fountainTextG">'+
							'<div id="fountainTextG_1" class="fountainTextG">'+
							'L</div>'+
							'<div id="fountainTextG_2" class="fountainTextG">'+
							'o</div>'+
							'<div id="fountainTextG_3" class="fountainTextG">'+
							'a</div>'+
							'<div id="fountainTextG_4" class="fountainTextG">'+
							'd</div>'+
							'<div id="fountainTextG_5" class="fountainTextG">'+
							'i</div>'+
							'<div id="fountainTextG_6" class="fountainTextG">'+
							'n</div>'+
							'<div id="fountainTextG_7" class="fountainTextG">'+
							'g</div>'+
							'<div id="fountainTextG_8" class="fountainTextG">'+
							'.</div>'+
							'<div id="fountainTextG_9" class="fountainTextG">'+
							'.</div>'+
							'<div id="fountainTextG_10" class="fountainTextG">'+
							'.</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</p>'+			    	
			'<p class="form-control-item" style="border-bottom: 1px solid #CECECE;">'+
				'<span><b>経</b>：<span class="lng">'+event.latLng.lng().toFixed(7)+
			'</span></span>'+
				'<span style="float:right;"><b>緯</b>：<span class="lat">'+event.latLng.lat().toFixed(7)+
			'</span></span></p>'+
			'<p class="form-control-item">'+
				'<button class="btn btn-sm btn-default btncancle">キャンセル</button>'+
				'<button class="btn btn-sm btn-warning btnsave">登録</button>'+
			'</p>'+
	  	'</div>';


		infowindow.setContent(contentString);
		infowindow.setPosition(event.latLng);
		infowindow.open(map);


		competitorGroup(competitordatas,0);
		competitorGroup(competitordatas,1);
		competitorGroup(competitordatas,2);

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'location': event.latLng},
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

	  	$("#map-addstore .address").html(address);
	
			$company=$("#map-addstore .company");
			$subsidiary=$("#map-addstore .subsidiary");
			$cla=$("#map-addstore .cla");
			$company.change(function(){
				competitorGroup(competitordatas,1);
			});
			
			$('#map-addstore .btnsave,#map-addstore .btncancle').unbind("click");

			$("#map-addstore .btnsave").click(function(){
				var kygcompany = $("#map-addstore .company").val();
				var kygcompanyname = $("#map-addstore .company option:selected").text();
				var subsidiary = $("#map-addstore .subsidiary").val();
				var subsidiaryname = $("#map-addstore .subsidiary option:selected").text();
				var classcd = $("#map-addstore .cla").val();
				var classname = $("#map-addstore .cla option:selected").text();
				var storename = $.trim($("#map-addstore .store").val());
				var comment = $.trim($("#map-addstore .mark").val());
				var address = $("#map-addstore .address").text();
				var lng = $("#map-addstore .lng").text();
				var lat = $("#map-addstore .lat").text();
				if (storename=="") {
					$.tremaps.showMessage("M-015");
					return;
				}
				var para = {
					company:getMapPara().companycd,
					classcd:classcd,
					classname:classname,
					kygcompany:kygcompany,
					kygcompanyname:kygcompanyname,
					subsidiary:subsidiary,
					subsidiaryname:subsidiaryname,
					storename:storename,
					comment:comment,
					address:address,
					longitude:lng,
					latitude:lat
				};
				post("dcompetition",para,function(response){
					var result = response;
					$.tremaps.showMessage("M-016");
					infowindow.open(null);
					cc();
					//recheckedcc();
					var classCompany = classcd+"_"+kygcompany;
					if ($.inArray(classCompany,classCompanyArray)!=-1) {
						showCooperations(class0Array,class1Array);
						showCompetitors(classCompanyArray);
					}
				});
			});
			$("#map-addstore .btncancle").click(function(){
				infowindow.open(null);
			});
		});
	}
	//----↑競合店追加	

	var blockArr=[];
	var markerArr=[];
	var arrLength,download = 0;
	var areaArr;
	function drawMap(latlng,polygons){
		infowindow.setMap(null);
		clearMap();
		//添加右键事件，点击右键结束绘制并输出所有的路径点
/*		if ($.data(document,"auth")) {
	  	google.maps.event.addListener(map, 'rightclick',competitorAdd);					
		}*/
		//	areaArr = Enumerable.From(polygons);
		var enumLevel = Enumerable.From(levelArray);
		// 最小刻度
		var minLevel = levelArray[0];

		bounds = new google.maps.LatLngBounds();
			
		var lvl = "";
		var areacd=[];
		var arealvl1 = $("#hidarealvl1cd").val();
		var arealvl2 = $("#hidarealvl2cd").val();
		var arealvl3 = $("#hidarealvl3cd").val();
		if (arealvl3!=0 && arealvl3!=null) {
			for(var i = 0;i<polygons.length;i++){
				areacd.push(polygons[i].a);
			}
			lvl = $("#arealevel").val().replace("area","");
		}else if (arealvl2!=0 && arealvl2!=null) {
			var arealvl2cds = arealvl2.split("_");
			for(var i =0;i<arealvl2cds.length;i++){
				areacd.push(arealvl2cds[i]);
			}
			lvl = $("#arealevel").val().replace("area","")+"_sikunion";
		}else if(arealvl1!=0 && arealvl1!=null){
			areacd.push(arealvl1);
			lvl = $("#arealevel").val().replace("area","")+"_kenunion";
		}

		var opVals={};
		for(var i = 0;i<polygons.length;i++){
			var row = polygons[i];
			if(row.b>=minLevel){
				var lastLevel =  enumLevel.Last("$<="+row.b);
				var colorIndex =levelArray.indexOf(lastLevel);
				opVals[row.a]=colorLevel[colorIndex];
			}else{
				opVals[row.a]="#FFFFFF";
			}
		}

		for(var i = 0;i<areacd.length;i++){
			// 取出块坐标
			$.getJSON("/"+lvl+"/"+areacd[i]+".json?v=1.0.0.0",function(data){
				//var areaRenderb = new Date();
				var results = [];
				if(data.length==undefined){
					results.push(data);
				}else{
					results = data;
				}

				// 经度 lng   纬度 lat

				var minLng=0,maxLng=0,minLat=0,maxLat=0;
				
				for(var i = 0;i<results.length;i++){
					var result = results[i];

					for(var j=0;j<result.points.length;j++){
						var point = result.points[j];

						var lng = point.lng;
						var lat = point.lat;

						if(minLng==0){
							minLng=lng;
							maxLng=lng;
							maxLat=lat;
							minLat=lat;
						}

						if(lng>maxLng){
							maxLng = lng;
						}else if(lng<minLng){
							minLng = lng;
						}

						if(lat>maxLat){
							maxLat=lat;
						}else if(lat<minLat){
							minLat=lat;
						}
					}
					//  丁子木层
					var mapLabel = new MapLabel({
						text: result.areaname,
						position: new google.maps.LatLng(result.lnglat.lat,result.lnglat.lng),
						fontSize: 10,
						zIndex:1000,
						align: 'center'
					});

					// 绘制块
					var block = new google.maps.Polygon({
						paths: result.points,
						strokeColor: '#888787',
						strokeOpacity: 0.8,
						strokeWeight: 1,
						fillColor: opVals[result.areacd],
						fillOpacity: 0.4,
						map:map,
						mapLabel:mapLabel
					});
					blockArr.push(block);
					// 设置属性
					block.cd  = result.areacd;
					block.lnglat = result.lnglat;

					// 设置事件
					block.addListener("click",function(e){areaPop(this.cd,this.lnglat);});
/*					if ($.data(document,"auth")) {
				  	block.addListener('rightclick',competitorAdd);
					}*/
				}
				//console.log("areaRenderb end:"+(new Date()-areaRenderb));

				bounds.extend(new google.maps.LatLng(maxLat,maxLng));
				bounds.extend(new google.maps.LatLng(minLat,minLng));
				map.fitBounds(bounds);
				map.setCenter(latlng);
				if($("#showlabel")[0].checked){
					showLabel();
				}
			});
		}	
		areaTotal();
	}

	function areaPop(cd,lnglat){
		var para = getMapPara();
		var position = lnglat;
		var contentString = '<div role="tabpanel" id="pop-area" class="tab-pane active">'+
	    	'<div style="border-bottom: 1px solid #CECECE;display:inline-block;word-break:break-all;word-wrap:break-word;height:auto;min-width:200px;font-weight:bold;"><span>f0</span>&nbsp;'+
				'</div>'+
	    	'<p class="form-control-item">'+
					'<label>人口(人)</label><span>f1'+
				'</span></p>'+
	    	'<p class="form-control-item">'+
					'<label>T会員(人)</label><span>f2'+
				'</span></p>'+
	    	'<p class="form-control-item">'+
					'<label>T会員化率</label><span>f3'+
				'%</span></p>'+
	    	'<p class="form-control-item">'+
					'<label>あしあと利用者数(人)</label><span>f4'+
				'</span></p>'+
				'<p class="form-control-item">'+
					'<label>全店利用者数(人)</label><span>f5'+
				'</span></p>'+
				'<p class="form-control-item">'+
					'<label>全店未利用者数(人)</label><span>f6'+							
				'</span></p>'+
	    	'</div>';

		infowindow.setContent(contentString);
  	infowindow.setPosition(position);
  	infowindow.open(map);
		$("#pop-area span").hide();

		get("A003,0",{	arealevel:para.arealevel,
									areacd:cd,
									datetype:para.datetype,
									yearmonthcd:para.yearmonthcd,
									companycd:para.companycd
								},function(result){

			contentString = contentString.replace("f0",result[0]["b"]);
			contentString = contentString.replace("f1",result[0]["c"]);
			contentString = contentString.replace("f2",result[0]["d"]);
			contentString = contentString.replace("f3",(result[0]["e"]*100).toFixed(1));
			contentString = contentString.replace("f4",result[0]["f"]);
			contentString = contentString.replace("f5",result[0]["g"]);
			contentString = contentString.replace("f6",result[0]["h"]);
			infowindow.setContent(contentString);
		});
	}

	function areaTotal(){
		post("A002",getMapPara(),function(result){
			$("#businessarea1 .areatotal").text(result[0]["b"]);
			$("#businessarea1 .lbl1").text(result[0]["c"]);
			$("#businessarea1 .lbl2").text(result[0]["d"]);
			$("#businessarea1 .lbl3").text((result[0]["e"]*100).toFixed(1));
			$("#businessarea1 .lbl4").text(result[0]["f"]);
			$("#businessarea1 .lbl5").text(result[0]["g"]);
			$("#businessarea1").show();
		});
	}

	function clearMap(){
		for(var i=0;i<blockArr.length;i++){
			blockArr[i].mapLabel.setMap(null);
			blockArr[i].setMap(null);
		}
		blockArr=[];

		for(var i =0;i<markerArr.length;i++){
			markerArr[i].setMap(null);
		}
		markerArr=[];
		$.tremaps.ccInit();
	}

	function showLabel(){
		for(var i=0;i<blockArr.length;i++){
			if(blockArr[i].mapLabel.getMap()==null){
				blockArr[i].mapLabel.setMap(map);
			}
		}
	}

	function hideLabel(){
		for(var i=0;i<blockArr.length;i++){
			blockArr[i].mapLabel.setMap(null);
		}
	}