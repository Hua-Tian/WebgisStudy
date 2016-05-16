			var infowindow = new google.maps.InfoWindow({maxWidth:500});
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

        var pacinput = $("#pac-input")[0];
        var input = $("#pac-input input")[0];
			  var searchBox = new google.maps.places.SearchBox(input);
			  map.controls[google.maps.ControlPosition.TOP_LEFT].push(pacinput);
			  searchBox.addListener('places_changed', function() {
			  	
			  	setMapPara();

			    var places = searchBox.getPlaces();
			    if (places.length == 0) {
			    	$.tremaps.showMessage("M-049");
			      return;
			    }
			    // Clear out the old markers.
			    $.tremaps.mapStoreClear();

			    // For each place, get the icon, name and location.
			    var bounds = new google.maps.LatLngBounds();
			    
			    var place = places[0];
		    	var lnglat = place.geometry.location;
		      
		      storeArray=[{storetype:1,storecd:"0",storename:place.name,latitude:lnglat.lat(),longitude:lnglat.lng()}];
		      
		      $("#hidlng").val(lnglat.lng());
					$("#hidlat").val(lnglat.lat());

		      enableRight();

		      setTitle();

		      storesCreate(3,0);

					$("#print-area,#title-company").text(place.name);

		      getPlace();

		      if (place.geometry.viewport) {
		        // Only geocodes have viewport.
		        bounds.union(place.geometry.viewport);
		      } else {
		        bounds.extend(place.geometry.location);
		      }

			    map.fitBounds(bounds);
			  });

				var button = $("#pac-input button");
				button.click(function(){
					button.attr("disabled",true);
					var address = $("#pac-input input").val();
					if (address=="") {
						$.tremaps.showMessage("M-046");
						button.attr("disabled",false);
						return;
					}
					var geocoder = new google.maps.Geocoder();
					$("#mask,#loading").show();
					geocoder.geocode({"address":address},function(data){
			      button.attr("disabled",false);
			      $("#mask,#loading").hide();
						if (data.length==0) {
							$.tremaps.showMessage("M-049");
							return;
						}
						var lnglat = data[0].geometry.location;
						var lat = lnglat.lat();
						var lng = lnglat.lng();
						setMapPara();
						storeArray=[{storetype:1,storecd:"0",storename:address,latitude:lat,longitude:lng}];
						$("#hidlng").val(lnglat.lng());
						$("#hidlat").val(lnglat.lat());

			      enableRight();

						setTitle();

			      storesCreate(3,0);

 						$("#print-area,#title-company").text(address);

		      	getPlace();

			      map.setCenter(lnglat);

					});
				});


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
      function addBindArea(obj,areacd){
				var arealevel = "";
				switch(obj){
					case "narea1":
					arealevel = "arealevel1";
					break;
					case "narea2":
					arealevel = "arealevel2";
					break;
					case "narea3":
					arealevel = "arealevel3";
					break;
					case "narea4":
					arealevel = "arealevel4";
					break;
				}
				get("mranges",{"arealevel":arealevel,"areacd":areacd},function(results){
					var $obj = $("#"+obj);
					if (obj!="narea1" &&  obj!="narea4") {
						$obj.html($("<option value='0'>").text("-"));
					}
					Enumerable.From(results).Select(function (x) { return $("<option x='"+x.x+"' y='"+x.y+"' value='"+x.a+"'>").text(x.b)[0] })
						    .TojQuery()
						    .appendTo("#"+obj);
					if (obj!="narea1") {
						$obj.selectpicker("refresh");
					}
				});
			}
      function competitorAdd(event){
      	if (storeArray.length>0 && mapStoreArray.length>0) {
	      	var store = storeArray[0];
					var latlng = {lat:store["latitude"],lng:store["longitude"]};
					var mapstore = mapStoreArray[0];
					mapstore.setPosition(latlng);      		
      	}
				var contentString = '<div role="tabpanel" class="tab-pane active" id="map-addstore">'+
		    	'<p style="border-bottom: 1px solid #CECECE;">'+
						'<label>分析地追加</label>'+
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
					
					$('#map-addstore .btnsave,#map-addstore .btncancle').unbind("click");

					$("#map-addstore .btnsave").click(function(){
						var addressnm = $.trim($("#map-addstore .addressnm").val());
						var comment = $.trim($("#map-addstore .mark").val());
						var address = $("#map-addstore .address").text();
						var lng = $("#map-addstore .lng").text();
						var lat = $("#map-addstore .lat").text();
						if (addressnm=="") {
							$.tremaps.showMessage("M-046");
							return;
						}
						var para = {
							companycd:getMapPara().companycd,
							addressnm:addressnm,
							comment:comment,
							address:address,
							longitude:lng,
							latitude:lat
						};
						post("danalysis",para,function(response){
							var result = response;
							getPlace();
							$.tremaps.showMessage("M-035");
							infowindow.open(null);
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

				post("dnewstoretotals",
					{
						"datetype":para.datetype,"yearmonthcd":para.yearmonthcd,
						"circletype":para.circletype,"circlevalue":para.circlevalue,"companycd":para.companycd,
						"arealevel":para.arealevel,"circlejyushos":para.circlejyushos,
						"longitude":para.longitude,"latitude":para.latitude
					},
					function(results){
						var circletotals = Enumerable.From(results)
															.Select("{population:$.a,tmember:$.b,tmemberrate:$.c,footprint:$.d,userforallstore:$.e,circlename:$.f}")
															.ToArray();
						$.tremaps.businessAreaTotal(circletotals,1);
				});
			}