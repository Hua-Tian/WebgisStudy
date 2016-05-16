			var infowindow = new google.maps.InfoWindow({maxWidth:700});
      function initMap() {
        //----↓マップを作成
				var mapobj=$('#map');
				var latlng={lat: 38.352256, lng: 137.447687};
				map = $.tremaps.mapCreate(mapobj,latlng);
				//----↑マップを作成

				//----↓店舗を作成
				//ポリゴン
        
				//----↑店舗を作成


				var mapheader = $('#mapheader')[0];
        map.controls[google.maps.ControlPosition.TOP].push(mapheader);

        var widgetDiv = $('#save-widget')[0];
        map.controls[google.maps.ControlPosition.RIGHT].push(widgetDiv);
				
				var settings = $('#settings')[0];
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(settings);

        var businessarea = $('#businessarea1')[0];
      	map.controls[google.maps.ControlPosition.LEFT].push(businessarea);
      	var businessarea = $('#businessarea2')[0];
      	map.controls[google.maps.ControlPosition.LEFT].push(businessarea);
      	var businessarea = $('#businessarea3')[0];
      	map.controls[google.maps.ControlPosition.LEFT].push(businessarea);

	      drawingManager = new google.maps.drawing.DrawingManager({
			    drawingMode: google.maps.drawing.OverlayType.POLYGON,
			    drawingControl: false,
			    polygonOptions:{
			    	clickable:false,
				    strokeColor: "#605ca8",
				    strokeOpacity: 1.0,
				    strokeWeight: 3, //粗细
				    fillOpacity: 0.2//透明度
			    }
			  });
			  //drawingManager.setMap(map);
			  google.maps.event.addListener(drawingManager, "polygoncomplete",function(arg){
			  	lineArea = arg;
			  	drawingManager.setMap(null);
			  });
				lineArea=new google.maps.Polygon({
				    clickable:false,
				    strokeColor: "#605ca8",
				    strokeOpacity: 1.0,
				    strokeWeight: 3, //粗细
				    fillOpacity: 0.2//透明度
				  });
				freeBusinessArea=new google.maps.Polygon({
			    strokeColor: "#605ca8",
			    strokeOpacity: 1.0,
			    strokeWeight: 3, 
			    fillOpacity: 0
			  });
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
						'<span><b>経</b>：<span class="lng">'+event.latLng.lng().toFixed(7)+'</span></span>'+
						'<span style="float:right;"><b>緯</b>：<span class="lat">'+event.latLng.lat().toFixed(7)+'</span></span>'+
					'</p>'+
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

      //----↓フリー商圏
			function drawPoly(event){
				if ($("#businessarea .label").is("[areatype='6']")) {
					$.tremaps.showMessage("M-047");
					return;
				}
			  linePath.unshift(event.latLng);
			  //画多边形
			  if (lineArea != null) {
			    lineArea.setMap(null);
			  }
			  lineArea.setPath(linePath);
			  lineArea.setMap(map);
			}
			//----↑フリー商圏

			//商圏合計
			function circleTotals(areatype,arearange){
				if (storeArray.length!=1) {
					return;
				}
				var setNum = $("#businessarea .label").length;
				var showNum = mapRegionShowArray.length;
				if (setNum!=showNum) {
					return;
				}
				var para = getMapPara();
				var business = $.tremaps.mapBusiness();
				para.circletype = business.circletype;
				para.circlevalue = business.circlevalue;
				para.circlejyushos = business.circlejyushos;
				
				post("dcircletotals",
					{
						"storecds":para.storecds,"datetype":para.datetype,"yearmonthcd":para.yearmonthcd,
						"circletype":para.circletype,"circlevalue":para.circlevalue,"companycd":para.companycd,
						"arealevel":para.arealevel,"circlejyushos":para.circlejyushos
					},
					function(results){
						var circletotals = Enumerable.From(results)
															.Select("{population:$.c,tmember:$.d,tmemberrate:$.e,footprint:$.f,userforallstore:$.g,userforstore:$.h,circlename:$.i}")
															.ToArray();
						$.tremaps.businessAreaTotal(circletotals,0);
				});
			}