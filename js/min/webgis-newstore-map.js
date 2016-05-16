function initMap(){var c,d,e,f,g,h,i,j,a=$("#map"),b={lat:38.352256,lng:137.447687};map=$.tremaps.mapCreate(a,b),c=$("#mapheader")[0],map.controls[google.maps.ControlPosition.TOP].push(c),d=$("#save-widget")[0],map.controls[google.maps.ControlPosition.RIGHT].push(d),e=$("#settings")[0],map.controls[google.maps.ControlPosition.LEFT_TOP].push(e),f=$("#pac-input")[0],g=$("#pac-input input")[0],h=new google.maps.places.SearchBox(g),map.controls[google.maps.ControlPosition.TOP_LEFT].push(f),h.addListener("places_changed",function(){var a,b,c,d;return setMapPara(),a=h.getPlaces(),0==a.length?($.tremaps.showMessage("M-049"),void 0):($.tremaps.mapStoreClear(),b=new google.maps.LatLngBounds,c=a[0],d=c.geometry.location,storeArray=[{storetype:1,storecd:"0",storename:c.name,latitude:d.lat(),longitude:d.lng()}],$("#hidlng").val(d.lng()),$("#hidlat").val(d.lat()),enableRight(),setTitle(),storesCreate(3,0),$("#print-area,#title-company").text(c.name),getPlace(),c.geometry.viewport?b.union(c.geometry.viewport):b.extend(c.geometry.location),map.fitBounds(b),void 0)}),i=$("#pac-input button"),i.click(function(){var a,b;return i.attr("disabled",!0),a=$("#pac-input input").val(),""==a?($.tremaps.showMessage("M-046"),i.attr("disabled",!1),void 0):(b=new google.maps.Geocoder,$("#mask,#loading").show(),b.geocode({address:a},function(b){var c,d,e;return i.attr("disabled",!1),$("#mask,#loading").hide(),0==b.length?($.tremaps.showMessage("M-049"),void 0):(c=b[0].geometry.location,d=c.lat(),e=c.lng(),setMapPara(),storeArray=[{storetype:1,storecd:"0",storename:a,latitude:d,longitude:e}],$("#hidlng").val(c.lng()),$("#hidlat").val(c.lat()),enableRight(),setTitle(),storesCreate(3,0),$("#print-area,#title-company").text(a),getPlace(),map.setCenter(c),void 0)}),void 0)}),j=$("#businessarea1")[0],map.controls[google.maps.ControlPosition.LEFT].push(j),j=$("#businessarea2")[0],map.controls[google.maps.ControlPosition.LEFT].push(j),j=$("#businessarea3")[0],map.controls[google.maps.ControlPosition.LEFT].push(j),lineArea=new google.maps.Polygon({clickable:!1,strokeColor:"#605ca8",strokeOpacity:1,strokeWeight:3,fillOpacity:.2}),freeBusinessArea=new google.maps.Polygon({strokeColor:"#605ca8",strokeOpacity:1,strokeWeight:3,fillOpacity:0})}function addBindArea(a,b){var c="";switch(a){case"narea1":c="arealevel1";break;case"narea2":c="arealevel2";break;case"narea3":c="arealevel3";break;case"narea4":c="arealevel4"}get("mranges",{arealevel:c,areacd:b},function(b){var c=$("#"+a);"narea1"!=a&&"narea4"!=a&&c.html($("<option value='0'>").text("-")),Enumerable.From(b).Select(function(a){return $("<option x='"+a.x+"' y='"+a.y+"' value='"+a.a+"'>").text(a.b)[0]}).TojQuery().appendTo("#"+a),"narea1"!=a&&c.selectpicker("refresh")})}function competitorAdd(a){var b,c,d,e,f;storeArray.length>0&&mapStoreArray.length>0&&(b=storeArray[0],c={lat:b["latitude"],lng:b["longitude"]},d=mapStoreArray[0],d.setPosition(c)),e='<div role="tabpanel" class="tab-pane active" id="map-addstore"><p style="border-bottom: 1px solid #CECECE;"><label>分析地追加</label></p><p class="form-control-item"><label>分析地名</label><input type="text" class="form-control input-sm addressnm" maxlength="30"></input></p><p class="form-control-item"><label>備考</label><input type="text" class="form-control input-sm mark" maxlength="100"></input></p><p class="form-control-item"><div style="width:220px;margin-left:5px;" class="address"><div id="loadingID"><div id="fountainTextG"><div id="fountainTextG_1" class="fountainTextG">L</div><div id="fountainTextG_2" class="fountainTextG">o</div><div id="fountainTextG_3" class="fountainTextG">a</div><div id="fountainTextG_4" class="fountainTextG">d</div><div id="fountainTextG_5" class="fountainTextG">i</div><div id="fountainTextG_6" class="fountainTextG">n</div><div id="fountainTextG_7" class="fountainTextG">g</div><div id="fountainTextG_8" class="fountainTextG">.</div><div id="fountainTextG_9" class="fountainTextG">.</div><div id="fountainTextG_10" class="fountainTextG">.</div></div></div></div></p><p class="form-control-item" style="border-bottom: 1px solid #CECECE;"><span><b>経</b>：<span class="lng">'+a.latLng.lng().toFixed(7)+"</span></span>"+'<span style="float:right;"><b>緯</b>：<span class="lat">'+a.latLng.lat().toFixed(7)+"</span></span></p>"+'<p class="form-control-item">'+'<button class="btn btn-sm btn-default btncancle">キャンセル</button>'+'<button class="btn btn-sm btn-warning btnsave">登録</button>'+"</p>"+"</div>",infowindow.setContent(e),infowindow.setPosition(a.latLng),infowindow.open(map),f=new google.maps.Geocoder,f.geocode({location:a.latLng},function(a,b){address=b===google.maps.GeocoderStatus.OK?a[1]?a[1].formatted_address:"No results found":"Geocoder failed due to: "+b,$("#map-addstore .address").html(address),$("#map-addstore .btnsave,#map-addstore .btncancle").unbind("click"),$("#map-addstore .btnsave").click(function(){var f,a=$.trim($("#map-addstore .addressnm").val()),b=$.trim($("#map-addstore .mark").val()),c=$("#map-addstore .address").text(),d=$("#map-addstore .lng").text(),e=$("#map-addstore .lat").text();return""==a?($.tremaps.showMessage("M-046"),void 0):(f={companycd:getMapPara().companycd,addressnm:a,comment:b,address:c,longitude:d,latitude:e},post("danalysis",f,function(a){getPlace(),$.tremaps.showMessage("M-035"),infowindow.open(null)}),void 0)}),$("#map-addstore .btncancle").click(function(){infowindow.open(null)})})}function drawPoly(a){return $("#businessarea .label").is("[areatype='6']")?($.tremaps.showMessage("M-047"),void 0):(linePath.unshift(a.latLng),null!=lineArea&&lineArea.setMap(null),lineArea.setPath(linePath),lineArea.setMap(map),void 0)}function circleTotals(){var c,d,e,f;1==storeArray.length&&(c=$("#businessarea .label").length,d=mapRegionShowArray.length,c==d&&(e=getMapPara(),f=$.tremaps.mapBusiness(),e.circletype=f.circletype,e.circlevalue=f.circlevalue,e.circlejyushos=f.circlejyushos,post("dnewstoretotals",{datetype:e.datetype,yearmonthcd:e.yearmonthcd,circletype:e.circletype,circlevalue:e.circlevalue,companycd:e.companycd,arealevel:e.arealevel,circlejyushos:e.circlejyushos,longitude:e.longitude,latitude:e.latitude},function(a){var b=Enumerable.From(a).Select("{population:$.a,tmember:$.b,tmemberrate:$.c,footprint:$.d,userforallstore:$.e,circlename:$.f}").ToArray();$.tremaps.businessAreaTotal(b,1)})))}var infowindow=new google.maps.InfoWindow({maxWidth:500});