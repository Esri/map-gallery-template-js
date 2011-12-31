/*------------------------------------*/
// VARIABLES
/*------------------------------------*/
var mapPreview; 			// EMBED PREVIEW MAP
var mapPreviewLoaded = 0;	// LOADED VARIABLE
var customMapSlider2;		// EMBED PREVIEW MAP SLIDER
/*------------------------------------*/
// JQUERY UI SLIDER
/*------------------------------------*/
function createCustomSlider2() {
	// CREATES JQUERY UI SLIDER
	customMapSlider2 = $("#zoomSliderCustom2").slider({
		min: 0,
		max: mapPreview._params.lods.length - 1,
		value: mapPreview.getLevel(),
		orientation: "vertical",
		range: "min",
		change: function(event, ui) {
			if (mapPreview.getLevel() != ui.value) {
				mapPreview.setLevel(ui.value);
			}
		}
	});
	dojo.connect(mapPreview, "onZoomEnd", function(evt) {
		customMapSlider2.slider("value", mapPreview.getLevel());
	});
}
/*------------------------------------*/
// MAP NOW LOADED
/*------------------------------------*/
function mapPreviewNowLoaded(layers){
	mapPreviewLoaded = 1;
	initUIPreview(layers);
	$(document).ready(createCustomSlider2);
}
/*------------------------------------*/
// INIT
/*------------------------------------*/
function initMapPreview() {
	// ARCGIS URL
	esri.arcgis.utils.arcgisUrl = pmgConfig.arcgisURL;
	var itemDeferredPreview = esri.arcgis.utils.getItem(webmap);
	itemDeferredPreview.addCallback(function(itemInfo) {
		dojo.byId("descriptionPreview").innerHTML = pmgConfig.sidebarContent || itemInfo.item.description || "";
		var mapDeferredPreview = esri.arcgis.utils.createMap(itemInfo, "mapPreview", {
			mapOptions: {
				slider: false,
				wrapAround180:true,
				nav: false
			},
			ignorePopups:false,
			bingMapsKey: pmgConfig.bingMapsKey,
			geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
		});
		mapDeferredPreview.addCallback(function(response) {
			mapPreview = response.map;
			var layers = response.itemInfo.itemData.operationalLayers;
			if(mapPreview.loaded){
				mapPreviewNowLoaded(layers);
			}
			else{
				dojo.connect(mapPreview,"onLoad",function(){
					mapPreviewNowLoaded(layers);
				});
			}
		});
		mapDeferredPreview.addErrback(function(error) {
			console.log("CreateMap failed: ", dojo.toJson(error));
		});
	});
	itemDeferredPreview.addErrback(function(error) {
		if (error && error.message === "BingMapsKey must be provided.") {
			alert("Deploying this application requires your own Bing Maps key.");
		} else {
			console.log("CreateMap failed: ", dojo.toJson(error));
		}
	});
}
/*------------------------------------*/
// INIT UI
/*------------------------------------*/
function initUIPreview(layers) {
	$('#mapPreview').css('background-image','none');
	mapPreview.setExtent(map.extent);
	dojo.connect(mapPreview, "onExtentChange", function(extent){
		$embed_xmin = extent.xmin;
		$embed_ymin = extent.ymin;
		$embed_xmax = extent.xmax;
		$embed_ymax = extent.ymax;
		$embed_wkid = extent.spatialReference.wkid;
		updateEmbed();
	});
	//add theme for popup
	dojo.addClass(mapPreview.infoWindow.domNode, "pimPopup");
	//add scalebar
	var scalebar2 = new esri.dijit.Scalebar({
		map: mapPreview,
		scalebarUnit:"english" //metric or english
	});
	// LEGEND INFO
	var layerInfo = buildLayersList(layers);
	// BUILD LEGEND
	if(layerInfo.length > 0){
		var legendDijit = new esri.dijit.Legend({
			map:mapPreview,
			layerInfos:layerInfo
		},"legendDivPreview");
		legendDijit.startup();
	}
	else{
		dojo.byId('legendDivPreview').innerHTML = 'No operational layers';
	}
}