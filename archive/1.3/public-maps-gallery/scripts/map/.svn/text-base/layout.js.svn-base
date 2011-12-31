/*------------------------------------*/
// DOJO REQUIRES
/*------------------------------------*/
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.StackContainer");
dojo.require("esri.map");
dojo.require("esri.arcgis.utils");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
/*------------------------------------*/
// VARIABLES
/*------------------------------------*/
var map;
var customMapSlider;
/*------------------------------------*/
// JQUERY UI SLIDER
/*------------------------------------*/
function createCustomSlider() {
	customMapSlider = $("#zoomSliderCustom").slider({
		min: 0,
		max: map._params.lods.length - 1,
		value: map.getLevel(),
		orientation: "vertical",
		range: "min",
		change: function(event, ui) {
			map.setLevel(ui.value);
		}
	});
	dojo.connect(map, "onZoomEnd", function(evt) {
		customMapSlider.slider("value", map.getLevel());
	});
}
/*------------------------------------*/
// MAP NOW LOADED
/*------------------------------------*/
function mapNowLoaded(layers){
	initUI(layers);
	$(document).ready(createCustomSlider);
	initMapPreview();
}
/*------------------------------------*/
// INIT
/*------------------------------------*/
function initMap() {
	var itemDeferred = esri.arcgis.utils.getItem(webmap);
	itemDeferred.addCallback(function(itemInfo) {
		dojo.byId("title").innerHTML = ymConfig.title || itemInfo.item.title;
		dojo.byId("subtitle").innerHTML = ymConfig.subtitle || itemInfo.item.snippet || "";
		dojo.byId("description").innerHTML = ymConfig.sidebarContent || itemInfo.item.description || "";
		var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
			mapOptions: {
				slider: false,
				wrapAround180:true,
				nav: false
			},
			ignorePopups:false,
			bingMapsKey: ymConfig.bingMapsKey,
			geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
		});
		mapDeferred.addCallback(function(response) {
			map = response.map;
			var layers = response.itemInfo.itemData.operationalLayers;
			if(map.loaded){
				mapNowLoaded(layers);
			}
			else{
				dojo.connect(map,"onLoad",function(){
					mapNowLoaded(layers);
				});
			}
		});
		mapDeferred.addErrback(function(error) {
			console.log("CreateMap failed: ", dojo.toJson(error));
		});
	});
	itemDeferred.addErrback(function(error) {
		if (error && error.message === "BingMapsKey must be provided.") {
			alert("Deploying this application requires your own Bing Maps key.");
		}
		else {
			console.log("CreateMap failed: ", dojo.toJson(error));
		}
	});
}
/*------------------------------------*/
// BUILD LAYERS LIST
/*------------------------------------*/
function buildLayersList(layers){
	//build a list of layers for the legend.
	var layerInfos = [];
	dojo.forEach(layers, function(mapLayer, index) {
		if(mapLayer.featureCollection){
			if (mapLayer.featureCollection.layers && mapLayer.featureCollection.showLegend && mapLayer.title !== 'Map Notes') {
				if(mapLayer.featureCollection.layers.length === 1){
					layerInfos.push({
						"layer":mapLayer.featureCollection.layers[0].layerObject,
						"title":mapLayer.title
					});
				}
				else{
					dojo.forEach(mapLayer.featureCollection.layers, function(layer) {
						layerInfos.push({
							layer: layer.layerObject, 
							title: layer.layerDefinition.name
						});
					}); 
				}
			}
		}
		else if (mapLayer.layerObject){
			layerInfos.push({layer:mapLayer.layerObject, title:mapLayer.title});
		}
	});
	return layerInfos;
}
/*------------------------------------*/
// INIT UI
/*------------------------------------*/
function initUI(layers) {
	$embed_xmin = map.extent.xmin;
	$embed_ymin = map.extent.ymin;
	$embed_xmax = map.extent.xmax;
	$embed_ymax = map.extent.ymax;
	$embed_wkid = map.extent.spatialReference.wkid;	
	updateEmbed();
	dojo.connect(window, "onresize", resizeMap);
	dojo.connect(map, "onExtentChange", function(extent){
		$embed_xmin = extent.xmin;
		$embed_ymin = extent.ymin;
		$embed_xmax = extent.xmax;
		$embed_ymax = extent.ymax;
		$embed_wkid = extent.spatialReference.wkid;	
		updateEmbed();
		var extentChange = new esri.geometry.Extent(extent.xmin,extent.ymin,extent.xmax,extent.ymax,extent.spatialReference);
		if(mapPreviewLoaded == 1){
			mapPreview.setExtent(extentChange);
		}
	});
	//add theme for popup
	dojo.addClass(map.infoWindow.domNode, "seaside");
	//add scalebar
	var scalebar = new esri.dijit.Scalebar({
		map: map,
		scalebarUnit:"english" //metric or english
	});
	// LEGEND INFO
	var layerInfo = buildLayersList(layers);
	// BUILD LEGEND
	if(layerInfo.length > 0){
		var legendDijit = new esri.dijit.Legend({
			map:map,
			layerInfos:layerInfo
		},"legendDiv");
		legendDijit.startup();
	}
	else{
		dojo.byId('legendDiv').innerHTML = 'No operational layers';
	}
}
/*------------------------------------*/
// RESIZE MAP FUNCTION
/*------------------------------------*/
function resizeMap() {
	var resizeTimer;
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
	map.resize();
	map.reposition();
	}, 500);
}
/*------------------------------------*/
// ON LOAD FUNCTION CALL
/*------------------------------------*/
dojo.addOnLoad(initMap);