/*------------------------------------*/
// EMBED REQUIRED
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
// GLOBAL VARIABLES
/*------------------------------------*/
var map;
var webmap = pmgConfig.defaultWebmap;
var webmap_width = 720;
var webmap_height = 405;
var webmap_legend = 1;
var webmap_about = 1;
var webmap_lagroup = 0;
var webmap_xmin = 0;
var webmap_ymin = 0;
var webmap_xmax = 0;
var webmap_ymax = 0;
var webmap_wkid = 0;
var webmap_groupwidth = 170;
var webmap_scalebar = 1;
var customMapSlider;
/*------------------------------------*/
// JQUERY UI SLIDER
/*------------------------------------*/
function createCustomSlider() {
	if(pmgConfig.theme){
		$('body').addClass(pmgConfig.theme);
	}
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
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	/*------------------------------------*/
	// ZOOM SLIDER BUTTONS
	/*------------------------------------*/
	$(document).on('click','#zoomSliderMinus',function(event) {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue - 1);
    });
	$(document).on('click','#zoomSliderPlus',function(event) {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue + 1);
    });
});
/*------------------------------------*/
// TOGGLE MENU FUNCTIONS
/*------------------------------------*/
function showAbout(){
	dojo.removeClass("legend_btn", "buttonSelected");
	dojo.addClass("about_btn", "buttonSelected");
	dojo.query('#legend').style('display','none');
	dojo.query('#description').style('display','block');
}
function showLegend(){
	dojo.removeClass("about_btn", "buttonSelected");
	dojo.addClass("legend_btn", "buttonSelected");
	dojo.query('#description').style('display','none');
	dojo.query('#legend').style('display','block');
}
/*------------------------------------*/
// MAP NOW LOADED
/*------------------------------------*/
function mapNowLoaded(layers){
	initUI(layers);
	$(document).ready(createCustomSlider);
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
// INIT FUNCTION
/*------------------------------------*/
function initMap() {
	// GET URL PARAMETERS
	var tmp_webmap = URLLookup('webmap');
	if(tmp_webmap){
		webmap = tmp_webmap;
	}
	var tmp_webmap_width = URLLookup('width');
	if(tmp_webmap_width){
		webmap_width = parseInt(tmp_webmap_width);
	}
	var tmp_webmap_height = URLLookup('height');
	if(tmp_webmap_height){
		webmap_height = parseInt(tmp_webmap_height);
	}
	var tmp_webmap_legend = URLLookup('legend');
	if(tmp_webmap_legend){
		webmap_legend = parseInt(tmp_webmap_legend);
	}
	var tmp_webmap_about = URLLookup('about');
	if(tmp_webmap_about){
		webmap_about = parseInt(tmp_webmap_about);
	}
	var tmp_webmap_lagroup = URLLookup('lagroup');
	if(tmp_webmap_lagroup){
		webmap_lagroup = parseInt(tmp_webmap_lagroup);
	}
	var tmp_webmap_xmin = URLLookup('xmin');
	if(tmp_webmap_xmin){
		webmap_xmin  = parseFloat(tmp_webmap_xmin);
	}
	var tmp_webmap_ymin = URLLookup('ymin');
	if(tmp_webmap_ymin){
		webmap_ymin = parseFloat(tmp_webmap_ymin);
	}
	var tmp_webmap_xmax = URLLookup('xmax');
	if(tmp_webmap_xmax){
		webmap_xmax = parseFloat(tmp_webmap_xmax);
	}
	var tmp_webmap_ymax = URLLookup('ymax');
	if(tmp_webmap_ymax){
		webmap_ymax  = parseFloat(tmp_webmap_ymax);
	}
	var tmp_webmap_wkid = URLLookup('wkid');
	if(tmp_webmap_wkid){
		webmap_wkid = parseInt(tmp_webmap_wkid);
	}
	var tmp_webmap_groupwidth = URLLookup('groupwidth');
	if(tmp_webmap_groupwidth){
		webmap_groupwidth = parseInt(tmp_webmap_groupwidth);
	}
	var tmp_webmap_scalebar = URLLookup('scalebar');
	if(tmp_webmap_scalebar){
		webmap_scalebar = parseInt(tmp_webmap_scalebar);
	}
	// IF WEBMAP IS SET
	if(webmap){
		// SET MAP CONTAINER SIZE	
		dojo.style(dojo.byId("mapContainer"), 'width', webmap_width+'px');
		dojo.style(dojo.byId("mapContainer"), 'height', webmap_height+'px');
		// SET GROUP SIZES
		if(webmap_legend || webmap_about){
			// LEFT OR RIGHT
			var group_style;
			if(webmap_lagroup){
				group_style = 'right';
			}
			else{
				group_style = 'left';
			}
			// MAP SIZE AND LEFT OR RIGHT
			dojo.style(dojo.byId("map"), 'width', webmap_width - webmap_groupwidth +'px');
			dojo.style(dojo.byId("map"), 'height', webmap_height+'px');
			dojo.style(dojo.byId("map"), group_style, webmap_groupwidth+'px');
			// SET GROUP SIZES
			dojo.style(dojo.byId("groupCon"), 'width', webmap_groupwidth+'px');
			dojo.style(dojo.byId("groupCon"), 'height', webmap_height+'px');
			// LEFT OR RIGHT
			dojo.style(dojo.byId("groupCon"), group_style, '0');
			// ONLY LEGEND
			if(webmap_legend && !webmap_about){
				dojo.style(dojo.byId("legend"), 'display', 'block');
				dojo.style(dojo.byId("description"), 'display', 'none');
				dojo.byId("groupMenu").innerHTML = '<div id="AboutHeading" class="menuHeading">Legend</div>';
			}
			// ONLY ABOUT
			if(!webmap_legend && webmap_about){
				dojo.style(dojo.byId("legend"), 'display', 'none');
				dojo.style(dojo.byId("description"), 'display', 'block');
				dojo.byId("groupMenu").innerHTML = '<div id="LegendHeading" class="menuHeading">About this map</div>';
			}
		}
		else{
			// NO GROUP
			dojo.style(dojo.byId("groupCon"), 'display', 'none');
			// FULL SIZE MAP
			dojo.style(dojo.byId("map"), 'width', webmap_width +'px');
			dojo.style(dojo.byId("map"), 'height', webmap_height+'px');	
		}
		// ARCGIS URL
		esri.arcgis.utils.arcgisUrl = pmgConfig.arcgisURL;
		// DEFERRED
		var itemDeferred = esri.arcgis.utils.getItem(webmap);
		itemDeferred.addCallback(function(itemInfo) {
			if(webmap_about){
				dojo.byId("description").innerHTML = itemInfo.item.description || "";
			}
			if(webmap_xmin || webmap_ymin || webmap_xmax || webmap_ymax){
				var spatialReference = new esri.SpatialReference({ wkid: webmap_wkid });
				var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
					mapOptions: {
						extent: new esri.geometry.Extent(webmap_xmin,webmap_ymin,webmap_xmax,webmap_ymax,spatialReference),
						slider: false,
						wrapAround180:true,
						nav: false
					},
					bingMapsKey: pmgConfig.bingMapsKey,
					ignorePopups:false,
					geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
				});
			}
			else{
				var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
					mapOptions: {
						slider: false,
						wrapAround180:true,
						nav: false
					},
					bingMapsKey:pmgConfig.bingMapsKey,
					ignorePopups:false,
					geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
				});
			}
			mapDeferred.addCallback(function(response) {
				map = response.map;
				if(webmap_legend){
					var layers = response.itemInfo.itemData.operationalLayers;
				}
				else{
					var layers = false;	
				}
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
		//
		itemDeferred.addErrback(function(error) {
			if (error && error.message === "BingMapsKey must be provided.") {
				alert("Deploying this application requires your own Bing Maps key.");
			}
			else {
				console.log("CreateMap failed: ", dojo.toJson(error));
			}
		});
	}
}
/*------------------------------------*/
// INIT LEGEND
/*------------------------------------*/
function initUI(layers) {
	$('#map').css('background-image','none');
  //add theme for popup
  dojo.addClass(map.infoWindow.domNode, "pimPopup");
  if(webmap_scalebar){
	  //add scalebar
	  var scalebar = new esri.dijit.Scalebar({
		map: map,
		scalebarUnit:"english" //metric or english
	  });
  }
  if(layers){
	// LEGEND INFO
	var layerInfo = buildLayersList(layers);
	// BUILD LEGEND
	  if(layerInfo.length > 0){
		var legendDijit = new esri.dijit.Legend({
		  map:map,
		  layerInfos:layerInfo
		},"legend");
		legendDijit.startup();
	  }
	  else{
		dojo.byId('legend').innerHTML = 'No operational layers';
	  }
  }
}
/*------------------------------------*/
// ON LOAD FUNCTION CALL
/*------------------------------------*/
dojo.addOnLoad(initMap);