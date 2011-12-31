/*------------------------------------*/
// DOJO REQUIRES
/*------------------------------------*/
dojo.require("esri.tasks.locator");
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.StackContainer");
dojo.require("esri.map");
dojo.require("esri.arcgis.utils");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.IdentityManager");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("dijit.TitlePane");
/*------------------------------------*/
// VARIABLES
/*------------------------------------*/
var map;
var customMapSlider;
var locateResultLayer = false;
var aoGeocoder, aoGeoCoderAutocomplete;
var ACObj;
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
			if (map.getLevel() != ui.value) {
				map.setLevel(ui.value);
			}
		}
	});
	dojo.connect(map, "onZoomEnd", function(evt) {
		customMapSlider.slider("value", map.getLevel());
	});
}
/*------------------------------------*/
// SHOW AUTOCOMPLETE
/*------------------------------------*/
function showAutoComplete(geocodeResults){
    var aResults = '';
    var partialMatch = $('#searchAddress').val();
    var regex = new RegExp('('+ partialMatch +')','gi');
    if(geocodeResults !== null){
        ACObj = geocodeResults;
        aResults += '<ul class="zebraStripes">';
        for(var i=0; i < geocodeResults.length; ++i){
            var layerClass = '';
            if(i % 2 === 0){
                layerClass = '';
            }
            else{
                layerClass = 'stripe';
            }
          aResults += '<li tabindex="'+ (i + 2) +'" class="'+ layerClass +'">' + geocodeResults[i].address.replace(regex,'<span>' + partialMatch + '</span>')  + '</li>';
        }
        aResults += '</ul>';
        if(geocodeResults.length > 0){
			$('#autoComplete').html(aResults).show();
		}
		else{
			$('#autoComplete').hide();
		}
    }
}
/*------------------------------------*/
// MAP NOW LOADED
/*------------------------------------*/
function mapNowLoaded(layers){
	if(pmgConfig.showOverviewMap){
		//add the overview map 
		var overviewMapDijit = new esri.dijit.OverviewMap({
			map: map,
			attachTo: "bottom-left",
			visible: false
		});
		overviewMapDijit.startup();
	}
	initUI(layers);
	$(document).ready(createCustomSlider);
}
/*------------------------------------*/
// clear the locate graphic
/*------------------------------------*/
function clearLocate() {
    if (locateResultLayer){
        locateResultLayer.clear();
    }
    locateString = "";
}
/*------------------------------------*/
// LOCATE
/*------------------------------------*/
function locate() {
    var query = dojo.byId("searchAddress").value;
	if(query){
		locateString = query;
		var address = {
		  SingleLine: locateString
		};
		aoGeocoder.addressToLocations(address,["*"]);
	}
}
/*------------------------------------*/
// search box functions
/*------------------------------------*/ 
function autoComplete(query) {
	locateString = query;
    var address = {
          SingleLine: locateString
        };
    aoGeoCoderAutocomplete.addressToLocations(address,["*"]); /*address is the address to locate*/
}
/*------------------------------------*/
// SHOW RESULTS
/*------------------------------------*/
function showResults(geocodeResults, resultNumber){
	// IF RESULT FOUND
	if(geocodeResults.length > 0) {
		// NUM RESULT VARIABLE
		var numResult = 0;
		// IF RESULT NUMBER
		if(resultNumber){
			numResult = resultNumber;
		}
		// IF LOCATE RESULTS
		if(locateResultLayer) {
			locateResultLayer.clear();
		}
		else{
			locateResultLayer = new esri.layers.GraphicsLayer();
			map.addLayer(locateResultLayer);
		}
		// CREATE POINT MARKER
		var pointMeters = esri.geometry.geographicToWebMercator(geocodeResults[0].location);
		var pointSymbol = new esri.symbol.PictureMarkerSymbol("graphics/ui/bluepoint-21x25.png", 21, 25).setOffset(0,12);
		var locationGraphic = new esri.Graphic(pointMeters,pointSymbol);
		locateResultLayer.add(locationGraphic);
		// SET EXTENT VARIABLES
		var xminNew = parseFloat(geocodeResults[numResult].attributes.West_Lon);
		var yminNew = parseFloat(geocodeResults[numResult].attributes.South_Lat);
		var xmaxNew = parseFloat(geocodeResults[numResult].attributes.East_Lon);
		var ymaxNew =  parseFloat(geocodeResults[numResult].attributes.North_Lat);
		// CREATE NEW EXTENT
		var newExtent = new esri.geometry.Extent({
			xmin: xminNew,
			ymin: yminNew,
			xmax: xmaxNew,
			ymax: ymaxNew,
			spatialReference: map.extent.spatialReference
		});
		// SET EXTENT CONVERTED TO WEB MERCATOR
		map.setExtent(esri.geometry.geographicToWebMercator(newExtent));
	}
	else{
		alert('Sorry, no results for the address "' + locateString + '" were found.');	
	}
}
/*------------------------------------*/
// BASEMAP GALLERY
/*------------------------------------*/
function createBasemapGallery() {
	//add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
	var basemapGallery = new esri.dijit.BasemapGallery({
		showArcGISBasemaps: true,
		bingMapsKey: pmgConfig.bingMapsKey,
		map: map
	}, "basemapGallery");
	basemapGallery.startup();
	dojo.connect(basemapGallery, "onError", function(msg) {console.log(msg)});
}
/*------------------------------------*/
// INIT
/*------------------------------------*/
function initMap() {
	// ARCGIS URL
	if(!pmgConfig.arcgisURL){
		pmgConfig.arcgisURL = location.protocol + '//' + location.host + "/sharing/content/items";
	}
	esri.arcgis.utils.arcgisUrl = pmgConfig.arcgisURL;
	// PROXY URL
	if(!pmgConfig.proxyURL){   
		pmgConfig.proxyURL = location.protocol + '//' + location.host + "/sharing/proxy";
	}
	esri.config.defaults.io.proxyUrl =  pmgConfig.proxyURL;
	esri.config.defaults.io.alwaysUseProxy = false;
	// ITEM
	var itemDeferred = esri.arcgis.utils.getItem(webmap);
	itemDeferred.addCallback(function(itemInfo) {
		dojo.byId("title").innerHTML = pmgConfig.title || itemInfo.item.title;
		// SITE TITLE
		if(pmgConfig.siteTitle){
			pmgConfig.pmgSubTitle = pmgConfig.title || itemInfo.item.title;
			setPageTitle();
		}
		dojo.byId("subtitle").innerHTML = pmgConfig.subtitle || itemInfo.item.snippet || "";
		var descriptionInfo = pmgConfig.sidebarContent || itemInfo.item.description || "";
		dojo.byId("descriptionContent").innerHTML = '<h2>About this map</h2>' + descriptionInfo + '<div class="clear"></div>';
		//console.log(itemInfo);
		//console.log(itemInfo.item.avgRating);
		//console.log(itemInfo.item.numComments);
		//console.log(itemInfo.item.numRatings);
		//console.log(itemInfo.item.numViews);
		var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
			mapOptions: {
				slider: false,
				wrapAround180:true,
				nav: false
			},
			ignorePopups:false,
			bingMapsKey: pmgConfig.bingMapsKey,
			geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
		});
		mapDeferred.addCallback(function(response) {
			map = response.map;
			var layers = response.itemInfo.itemData.operationalLayers;
			/*------------------------------------*/
			// LAYER TOGGLE
			/*------------------------------------*/
			if(pmgConfig.showLayerToggle && layers.length > 0){
				var layerClick = '';
				$('#mapLayers').html('<h2>Layers</h2><ul id="mapLayerToggle"></ul><div class="clear"></div>');
				for(j=0; j< layers.length; j++){
					if(layers[j].featureCollection){
						var checked = '';
						if(layers[j].visibility){
							checked = 'checked="checked"';
						}
						layerClick = '<li><input id="layerCheckbox'+j+'" ' + checked + ' type="checkbox" onclick="javascript:';
						for(k=0; k < layers[j].featureCollection.layers.length; k++){
							layerClick += 'toggleLayerSwitch(\'' + layers[j].featureCollection.layers[k].id + '\');';
						}
						layerClick += '" /> <label for="layerCheckbox'+j+'">'+layers[j].title+'</label></li>'
					}
					else{
						var checked = '';
						if(layers[j].visibility){
							checked = 'checked="checked"';
						}
						layerClick = '<li><input id="layerCheckbox'+j+'" ' + checked + ' type="checkbox" onclick="javascript:toggleLayerSwitch(\''+layers[j].id+'\');" /> <label for="layerCheckbox'+j+'">'+layers[j].title+'</label></li>';
					}
					$('#mapLayerToggle').prepend(layerClick);
				}
			}
			// ENDLAYER TOGGLE
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
	/*------------------------------------*/
	// LOCATOR
	/*------------------------------------*/
	aoGeocoder = new esri.tasks.Locator(pmgConfig.locatorURL);
	aoGeoCoderAutocomplete = new esri.tasks.Locator(pmgConfig.locatorURL);
	dojo.connect(aoGeocoder, "onAddressToLocationsComplete", showResults);
	dojo.connect(aoGeoCoderAutocomplete, "onAddressToLocationsComplete", showAutoComplete);
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
// TOGGLE LAYER
/*------------------------------------*/
function toggleLayerSwitch(layerid){
	var layer = map.getLayer(layerid);
	if(layer){
		//if visible hide the layer
		if(layer.visible == true) {
			layer.hide();
		}
		//otherwise show
		else {
			layer.show();
		}
	}
}
/*------------------------------------*/
// BUILD LAYERS LIST
/*------------------------------------*/
function buildLayersList(layers){
	//build a list of layers for the legend.
	var layerInfos = [];
	dojo.forEach(layers, function(mapLayer, index) {
		if(mapLayer.featureCollection){
			if (mapLayer.featureCollection.layers && mapLayer.featureCollection.showLegend) {
				if(mapLayer.featureCollection.layers.length === 1){
					layerInfos.push({"layer":mapLayer.featureCollection.layers[0].layerObject,"title":mapLayer.title});
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
	if(pmgConfig.showBasemapGallery){
		$('#basemapContainer').show();
		createBasemapGallery();
	}
	$('#map').css('background-image','none');
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
	dojo.addClass(map.infoWindow.domNode, "pimPopup");
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
		},"legendContent");
		legendDijit.startup();
	}
	else{
		dojo.byId('legendContent').innerHTML = 'No operational layers';
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