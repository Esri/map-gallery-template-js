/*------------------------------------*/
// QUERY CAROUSEL
/*------------------------------------*/
function queryCarousel(){
	queryArcGISGroup({
		// SETTINGS
		id_group : pmgConfig.groupID,
		searchType : 'Web Map',
		sortField : 'title',
		pagination: false,
		sortOrder : 'asc',
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			buildCarousel(obj,data);
		}
	});
}
/*------------------------------------*/
// REQUIRE
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
var title, subtitle, description, keywords, sidebarContent;
var legendDijit;
var scalebar;
var customMapSlider;
var featureTabs;
var timer = 0;
/*------------------------------------*/
// INIT MAP
/*------------------------------------*/   
function initMap(newWebMap) {
	// IF newWebMap IS NOT DECLARED
	if(!newWebMap){
		// SET FALSE
		newWebMap = false;
	}
	// IF newWebMap IS SET
	if(newWebMap){
		//	DESTROY ALL WIDGETS
		dijit.registry.forEach(function(w){
			w.destroy();             
		});
		// DESTROY MAP
		map.destroy();
		// INSERT REPLACEMENT LEGEND DIV
		$('#legend_tab').html('<div id="legendDiv" class="scrollArea"></div>');
		// SET WEB MAP
		webmap = newWebMap;
		if(pmgConfig.agent_ios){
		var itemURL = 'arcgis://www.arcgis.com/sharing/content/items/' + webmap + '/data';
			$('#iOSButton').attr('href',itemURL);
			document.getElementById("iOSButton").onclick = applink(failURL);
		}
	}
	// GET WEB MAP
    var itemDeferred = esri.arcgis.utils.getItem(webmap);
    itemDeferred.addCallback(function(itemInfo) {
        var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
            mapOptions: {
                slider: false,
                nav: false,
				wrapAround180:true,
				logo:false
            },
            ignorePopups: false,
            bingMapsKey: pmgConfig.bingMapsKey,
            geometryServiceURL: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
        });
        mapDeferred.addCallback(function(response) {
            map = response.map;
            mapInfo = response.itemInfo;
            dojo.byId('shareLogo').innerHTML = mapInfo.item.title;
            dojo.byId('descDiv').innerHTML = mapInfo.item.description;
            layers = response.itemInfo.itemData.operationalLayers; 
            basemapLyr = response.itemInfo.itemData.baseMap.baseMapLayers[0].layerObject;
            mapLODs = basemapLyr.tileInfo.lods;
            var keyVals = '';
            var keyArray = mapInfo.item.tags;
            dojo.forEach(keyArray, function(key, i){
                if (i > 0) {
                    keyVals += ', ' + key;
                }
                else{
                    keyVals = key;
                }
            });
			// INSERT HTML DATA
            dojo.byId('keyDiv').innerHTML = keyVals;
            dojo.byId('ownerDiv').innerHTML = mapInfo.item.owner;
            dojo.byId('pubDiv').innerHTML = convertDate(mapInfo.item.uploaded);
            if(map.loaded){
				initUI(newWebMap);
            }
            else{
                dojo.connect(map,"onLoad",function(){
                    initUI(newWebMap);
                });
            }
        });
		// MAP FAILED
        mapDeferred.addErrback(function(error) {
            console.log("CreateMap failed: ", dojo.toJson(error));
        });
    });
	// ERROR CALLBACK
    itemDeferred.addErrback(function(error) {
        if (error && error.message === "BingMapsKey must be provided.") {
            alert("Deploying this application requires your own Bing Maps key.");
        } else {
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
function initUI(newWebMap){
	if(!newWebMap){
		newWebMap = false;
	}
	if(newWebMap == false){
		// JQUERY READY. HAPPY TIME!
		$(document).ready(jQueryReady);
	}
	else{
		var windowHeight = $('#overFlow').height();
	}
    // ADD POP UP
	dojo.addClass(map.infoWindow.domNode, "pimPopup");
    // ADD SCALEBAR. NOT CURRENTLY WORKING BECAUSE IT CAN'T BE DESTROYED
	/*
	scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit:"english" //metric or english
    });
	*/
	// BUILD LEGEND
    if(map.loaded){
        buildLegend();
    }
}
/*------------------------------------*/
// BUILD LEGEND
/*------------------------------------*/
function buildLegend(){
    // LEGEND INFO
	var layerInfo = buildLayersList(layers);
	// BUILD LEGEND
    if(layerInfo.length > 0){
        legendDijit = new esri.dijit.Legend({
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
// CONVERT DATE FORMAT FUNCTION
/*------------------------------------*/
function convertDate(gmtDate){
    var originalDate = new Date(gmtDate);
    var gmtDay, gmtMonth;
    var retStr = (originalDate.getFullYear() + '-' + (originalDate.getUTCMonth() + 1) + '-' + originalDate.getUTCDate() + ' ' + originalDate.getUTCHours() + ':' + originalDate.getUTCMinutes() + ':' + originalDate.getUTCSeconds()); 
    return retStr;
}
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
// RESIZE MAP DIV
/*------------------------------------*/
function resizeMapDiv(){
	clearTimeout(timer);
	//create new resize timer with delay of 500 milliseconds
	timer = setTimeout(function(){
	map.resize();
	}, 500);	
}
/*------------------------------------*/
// DOJO IS READY. CALL JQUERY!
/*------------------------------------*/
function jQueryReady(){
	createCustomSlider();
	var menuWidth = $('#featureMenu').width();
	var windowWidth = $('#overFlow').width();
	var windowHeight = $('#overFlow').height();
	var newWidth = windowWidth - menuWidth;
	$('#map').width(newWidth);
	resizeMapDiv();
}
/*------------------------------------*/
// LET'S CREATE THE CAROUSEL LIST
/*------------------------------------*/
function buildCarousel(obj,data){
	var html = '<ul id="mycarousel" class="jcarousel-skin-tango">';
	// RESULTS
	var totalItems = data.results.length;
	// IF MORE THAN 0 RESULTS
	if(totalItems > 0){
		// SET FIRST WEBMAP
		var IDfromURL = URLLookup("webmap");
		if (IDfromURL) {
			webmap = IDfromURL;
		}
		else{
			webmap = webmap = data.results[0].id;
		}
		// INIT CALLBACK
		dojo.addOnLoad(initMap);
		// CREATE LIST
		for(var i=0; i < totalItems; ++i) {
			var firstArticle = '';
			var mapSelected = '';
			var itemTitle = truncate(data.results[i].title, 25);
			// LAST ROW ITEM
			if(i == 0){
				mapSelected = ' class="mapSelected"';
				firstArticle = ' id="firstArticle"';
			}
			// BUILD LIST ITEM
			html += '<li' + firstArticle + '><a' + mapSelected + ' data-id-webmap="'+data.results[i].id+'" title="' + data.results[i].snippet + '" href="#"><img src="' + obj.arcgispath + obj.imagepath + data.results[i].id + obj.imagepath2 + data.results[i].thumbnail + '" width="200" height="133"><span>' + itemTitle + '</span></a></li>';
		}
		html += '</ul>';
		// INSERT TO HTML
		$('#carousel').html(html);
		// INIT CAROUSEL
		$('#mycarousel').show().jcarousel({
			wrap: 'last',
			scroll: 4,
			visible: 4,
			size: totalItems
		});
		if(pmgConfig.agent_ios){
			var itemURL = 'arcgis://www.arcgis.com/sharing/content/items/' + webmap + '/data';
			$('#mapButtons').append('<a id="iOSButton" href="' + itemURL + '" class="mapButton buttonSingle">Open in iOS App</a>');
			document.getElementById("iOSButton").onclick = applink(failURL);
		}
	}
}
/*------------------------------------*/
// JQUERY IS READY. HAPPY TIME!
/*------------------------------------*/
$(document).ready(function() {
	// QUERY ARCGIS GROUP
	queryCarousel();
	/*------------------------------------*/
	// TABS
	/*------------------------------------*/
	featureTabs = $("#featureTabs").tabs();
	/*------------------------------------*/
	// DOCUMENT RESIZE FUNCTION
	/*------------------------------------*/
	$('#overFlow').resize(function() {
		var menuWidth = $('#featureMenu').width();
		var windowWidth = $('#overFlow').width();
		var windowHeight = $('#overFlow').height();
		var newWidth = windowWidth - menuWidth;
		$('#map').width(newWidth);
		resizeMapDiv();
	});
	/*------------------------------------*/
	// ZOOM SLIDER BUTTONS
	/*------------------------------------*/
	$('#zoomSliderMinus').live('click',function() {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue - 1);
    });
	$('#zoomSliderPlus').live('click',function() {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue + 1);
    });
	/*------------------------------------*/
	// TOGGLE FEATURES MENU
	/*------------------------------------*/
	$(".togglePane").live('click',function() {
		var menuWidth = $('#featureMenu').width();
		var windowWidth = $('#overFlow').width();
		var windowHeight = $('#overFlow').height();
		var newWidth = windowWidth - menuWidth;
		var $thisOne = this;
        if ($($thisOne).attr('data-hidden') == "0") {
			$("#featureMenu").animate({ right: "-" + menuWidth + "px"}, 500, function() {
				$('#map').width(windowWidth);
				resizeMapDiv();
				$($thisOne).attr('data-hidden',"1");
				$('.iconToggle',$thisOne).addClass('Closed');
			});
        } else {
			$("#featureMenu").animate({ right: "0px" }, 500, function() {
				$($thisOne).attr('data-hidden',"0");
				$('.iconToggle',$thisOne).removeClass('Closed');
				$('#map').width(newWidth);
				resizeMapDiv();
			});
        }
    });
	/*------------------------------------*/
	// CHANGE MAP LISTENER
	/*------------------------------------*/
	// WHEN A TAG IS CLICKED
	$('#mycarousel li a').live('click',function() {
		// GET MAP ID FROM A TAG
		var newMap = $(this).attr('data-id-webmap');
		// IF EXISTS
		if(newMap){
			// REMOVE SELECTED MAP CLASSES
			$('#mycarousel li a').removeClass('mapSelected');
			// MAKE THIS A TAG BE SELECTED CLASS
			$(this).addClass('mapSelected');
			// LOAD MAP, PASSING VARIABLE
			initMap(newMap);
		}
		// DON'T DO ANYTHING ON CLICK
		return false;
    });
	// IF GELOCATION IS AVAILABLE
	if(Modernizr.geolocation){
		$('#map').append('<span id="geoButton" title="Use Current Location"></a>');
		$('#geoButton').live('click',function(){
			navigator.geolocation.getCurrentPosition(geoLocateMap);
		});
	}
});
/*------------------------------------*/
// END
/*------------------------------------*/