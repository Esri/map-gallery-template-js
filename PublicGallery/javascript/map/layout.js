// Dojo Requires
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.Portal");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojox.NodeList.delegate");
dojo.require("dijit.Dialog");
dojo.require("dojo.cookie");
dojo.require("dojo.io.script");
dojo.require("dojo.number");
dojo.require("dojox.form.Rating");
// Map Only
dojo.require("esri.map");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.tasks.locator");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.TitlePane");
// Localization
dojo.requireLocalization("esriTemplate","template");
/*------------------------------------*/
// on dojo load
/*------------------------------------*/
dojo.addOnLoad(function(){
	// set default options
	setDefaultConfigOptions();
	// set app ID settings and call setWebmap after
	setAppIdSettings(function(){
		// create portal
		createPortal(function(){
			// set URL params
			configUrlParams();
			// query group info
			queryGroup(function(){
				// set webmap info
				setWebmap();
			});
		});
	});
});
/*------------------------------------*/
// Sets the webmap to load
/*------------------------------------*/
function setWebmap(){
	// if webmap set
	if(configOptions.webmap) {
		// init map page
		initMap();
	}
	// get first map in group if no webmap is set
	else{
		// call featured maps function to get 1 webmap
		queryArcGISGroupItems({
			// settings
			id_group: configOptions.group.id,
			searchType: "Web Map",
			filterType: "Web Mapping Application",
			sortField: configOptions.sortField,
			sortOrder: configOptions.sortOrder,
			perPage: 1,
			// executed after ajax is returned
			callback: function(obj, data){
				// if group has at least 1 webmap
				if(data.results.length > 0){
					// set webmap
					configOptions.webmap = data.results[0].id;
					// init map page
					initMap();
				}
				else{
					// show error dialog
					var dialog = new dijit.Dialog({
						title: i18n.viewer.errors.general,
						content: i18n.viewer.errors.noSearchResults
					});
					dialog.show();
				}
			}
		});
	}
}
/*------------------------------------*/
// Toggle full screen map view
/*------------------------------------*/
function toggleFullscreenMap(value){
	var buttonText;
	// Record center of map
	mapCenter = map.extent.getCenter();
	// if true, fullscreen
	if(value){
		// button text
		buttonText = i18n.viewer.mapPage.exitFullscreen;
		// change html class
		dojo.query("html").addClass('fullScreen');
		// set buttton classes and text
		dojo.query("#fullScreen").attr('title',buttonText);
		// toggle global variable
		mapFullscreen = true;
	}
	// exit fullscreen
	else{
		// button text
		buttonText = i18n.viewer.mapPage.enterFullscreen;
		// change html class
		dojo.query("html").removeClass('fullScreen');
		// set buttton classes and text
		dojo.query("#fullScreen").attr('title',buttonText);
		// toggle global variable
		mapFullscreen = false;
	}
	// reset center of map
	resizeMapAndCenter();
}
/*------------------------------------*/
// Tabs
/*------------------------------------*/
function tabMenu(menuObj, buttonObj){
	// hide all tabs
	dojo.query('.tabMenu').style('display','none');
	// remove selected button class
	dojo.query('#tabMenu .toggleButton').removeClass('buttonSelected');
	// show new tab
	dojo.query(menuObj).style('display','block');
	// set new tab button to selected
	dojo.query(buttonObj).addClass('buttonSelected');
}
/*------------------------------------*/
// Map Buttons
/*------------------------------------*/
function setInnerMapButtons(){
	var html = '';
	// fullscreen button
	html += '<div title="' + i18n.viewer.mapPage.enterFullscreen + '" class="mapButton buttonSingle" id="fullScreen"><span class="fullScreenButton"></span></div>';
	// fullscreen button
	dojo.query(document).delegate("#fullScreen", "onclick", function(event){
		// if currently in full screen
		if(!mapFullscreen){
			// enter fullscreen
			toggleFullscreenMap(true);
		}
		else{
			// exit fullscreen
			toggleFullscreenMap(false);
		}
    });
	// if gelocation is available
	if(navigator.geolocation){
		html += '<div id="geoButton" title="' + i18n.viewer.mapPage.geoLocateTitle + '" class="mapButton buttonSingle"><span class="geoLocateButton"></span></div>';
		dojo.query(document).delegate("#geoButton", "onclick", function(event){
			navigator.geolocation.getCurrentPosition(geoLocateMap);
		});
	}
	// insert html
	dojo.place(html, "map", "last");
}
/*------------------------------------*/
// Hide auto-complete
/*------------------------------------*/
function hideAutoComplete(){
	dojo.query(".searchList").removeClass('autoCompleteOpen');
	dojo.query("#autoComplete").style('display','none');
}
/*------------------------------------*/
// Set map content
/*------------------------------------*/
function setMapContent(){
	// check for mobile cookie	
	checkMobileCookie();
	// if showMoreInfo is set
	if(configOptions.showMoreInfo){
		// set map contents url
		var mapURL = getViewerURL('item_page');
		// show and set href
		dojo.place('<h2>' + i18n.viewer.mapPage.moreInformation + '</h2><a id="mapContentsLink" href="' + mapURL + '" target="_blank">' + i18n.viewer.mapPage.arcgisLink + '</a>', "mapMoreInfo", "last");	
	}
    // show about button click
	dojo.query(document).delegate("#showAbout", "onclick", function(event){
        tabMenu('#aboutMenu',this);
    });
	// show legend button click
	dojo.query(document).delegate("#showLegend", "onclick", function(event){
		tabMenu('#legendMenu',this);
	});
	// escape button when in full screen view
	dojo.query(document).delegate("body", "onkeyup", function(e){
		// if esc key and map is fullscreen
		if(e.keyCode === 27 && mapFullscreen) {
			// exit fullscreen
			toggleFullscreenMap(false);
		}
	});
	// set map buttons
	setInnerMapButtons();
	// If mobile user
	if(isMobileUser() && configOptions.appCookie === 'installed'){
		// get item url
		var itemURL = getViewerURL('mobile', configOptions.webmap);
		// add button
		dojo.place('<a href="' + itemURL + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInMobile + '</a>', "mapButtons", "last");
	}
	// Search Button
	dojo.query(document).delegate("#searchAddressButton", "onclick", function(event){
		locate();
		hideAutoComplete();
	});
	// listener for address key up
	dojo.query(document).delegate(".iconInput input", "onkeyup", function(e){
		checkAddressStatus(this);
	});
	// Clear address button
	dojo.query(document).delegate(".iconInput .iconReset", "onclick", function(event){
		var obj = dojo.query(this).nextAll('input');
		clearAddress(obj);
	});
	// auto complete && address specific action listeners
	dojo.query(document).delegate("#searchAddress", "onkeyup", function(e){
		var aquery = dojo.query(this).attr('value')[0];
		var alength = aquery.length;
		// enter key
		if(e.keyCode === 13 && aquery !== '') {
			clearTimeout (timer);
			clearLocate();
			locate();
			hideAutoComplete();
		}
		// up arrow key
		else if(e.keyCode === 38) {
			dojo.query('#autoComplete li:last')[0].focus();
		}
		// down arrow key
		else if(e.keyCode === 40) {
			dojo.query('#autoComplete li:first')[0].focus();
		}
		// more than 3 chars
		else if(alength >= 2){
			clearTimeout (timer);
			timer = setTimeout(function(){
				autoComplete(aquery);
			}, 250);
		}
		else{
			hideAutoComplete();
		}
	});
	// autocomplete result click
	dojo.query(document).delegate("#autoComplete ul li", "onclick", function(event){
		var locTxt = dojo.query(this).text();
		var locNum = dojo.indexOf(dojo.query('#autoComplete ul li'), this);
		dojo.query('#searchAddress').attr('value', locTxt);
		showResults(ACObj, locNum);
		hideAutoComplete();
	});
	// autocomplete result key up
	dojo.query(document).delegate("#autoComplete ul li", "onkeyup", function(e){
		if(e.type === 'keyup' && e.keyCode === 13) {
			var locTxt = dojo.query(this).text();
			var locNum = dojo.indexOf(dojo.query('#autoComplete ul li'), this);
			dojo.query('#searchAddress').attr('value', locTxt);
			showResults(ACObj, locNum);
			hideAutoComplete();
		}
		else if(e.type === 'keyup' && e.keyCode === 40) {
			dojo.query(this).next('li')[0].focus();
		}
		else if(e.type === 'keyup' && e.keyCode === 38) {
			dojo.query(this).prev('li')[0].focus();
		}
	});
	// clear address
	dojo.query(document).delegate("#clearAddress", "onclick", function(event){
		clearLocate();
		hideAutoComplete();
	});
	// toggle legend layers
	dojo.query(document).delegate("#mapLayerToggle .toggleLayers", "onclick", function(event){
		var dataAttr = dojo.query(this).attr('data-layers')[0].split(',');
		for(var i = 0; i < dataAttr.length; i++){
			toggleLayerSwitch(dataAttr[i]);
		}
    });
}
/*------------------------------------*/
// show autocomplete
/*------------------------------------*/
function showAutoComplete(geocodeResults){
    var aResults = '';
    var partialMatch = dojo.query("#searchAddress").attr('value')[0]; 
    var regex = new RegExp('(' + partialMatch + ')','gi');
    if(geocodeResults !== null){
		dojo.query(".searchList").addClass('autoCompleteOpen');
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
			aResults += '<li tabindex="' + (i + 2) + '" class="' + layerClass + '">' + geocodeResults[i].address.replace(regex,'<span>' + partialMatch + '</span>')  + '</li>';
        }
        aResults += '</ul>';
        if(geocodeResults.length > 0){
			var node = dojo.query("#autoComplete");
			if(node.length > 0){
				node.innerHTML(aResults).style('display','block');
			}
		}
		else{
			hideAutoComplete();
		}
    }
}
/*------------------------------------*/
// map now loaded
/*------------------------------------*/
function mapNowLoaded(layers){
	// Map Loaded Class
	dojo.query("#map").addClass('mapLoaded');
	// if overview map
	if(configOptions.showOverviewMap){
		//add the overview map 
		var overviewMapDijit = new esri.dijit.OverviewMap({
			map: map,
			attachTo: "bottom-left",
			visible: false
		});
		overviewMapDijit.startup();
	}
	initUI(layers);
	// add popup theme
	dojo.addClass(map.infoWindow.domNode, configOptions.theme);
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
// Locate
/*------------------------------------*/
function locate() {
    var query = dojo.byId("searchAddress").value;
	if(query){
		// add loading spinner
		addSpinner("#locateSpinner");
		// locate string
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
    aoGeoCoderAutocomplete.addressToLocations(address,["*"]);
}
/*------------------------------------*/
// Show search results
/*------------------------------------*/
function showResults(geocodeResults, resultNumber){
	// remove spinner
	removeSpinner();
	// hide autocomplete
	hideAutoComplete();
	// if result found
	if(geocodeResults.length > 0) {
		// num result variable
		var numResult = 0;
		// if result number
		if(resultNumber){
			numResult = resultNumber;
		}
		// if point graphic set
		if(configOptions.pointGraphic){
			// if locate results
			if(locateResultLayer) {
				locateResultLayer.clear();
			}
			else{
				locateResultLayer = new esri.layers.GraphicsLayer();
				map.addLayer(locateResultLayer);
			}
			// create point marker
			var pointMeters = esri.geometry.geographicToWebMercator(geocodeResults[0].location);
			var pointSymbol = new esri.symbol.PictureMarkerSymbol(configOptions.pointGraphic, 21, 25).setOffset(0,12);
			var locationGraphic = new esri.Graphic(pointMeters,pointSymbol);
			locateResultLayer.add(locationGraphic);
		}
		// set extent variables
		var xminNew, yminNew, xmaxNew, ymaxNew;
		// if no attributes set
		if(!geocodeResults[numResult].hasOwnProperty('attributes')){
			geocodeResults[numResult].attributes = {};
		}
		// if one of the extent properteis isn't set
		if(!geocodeResults[numResult].attributes.hasOwnProperty('West_Lon') || !geocodeResults[numResult].attributes.hasOwnProperty('South_Lat') || !geocodeResults[numResult].attributes.hasOwnProperty('East_Lon') || !geocodeResults[numResult].attributes.hasOwnProperty('North_Lat')){
			xminNew = parseFloat(geocodeResults[numResult].location.x - 0.011);
			yminNew = parseFloat(geocodeResults[numResult].location.y - 0.011);
			xmaxNew = parseFloat(geocodeResults[numResult].location.x + 0.011);
			ymaxNew = parseFloat(geocodeResults[numResult].location.y + 0.011);
		}
		else{
			xminNew = parseFloat(geocodeResults[numResult].attributes.West_Lon);
			yminNew = parseFloat(geocodeResults[numResult].attributes.South_Lat);
			xmaxNew = parseFloat(geocodeResults[numResult].attributes.East_Lon);
			ymaxNew =  parseFloat(geocodeResults[numResult].attributes.North_Lat);
		}
		// create new extent
		var newExtent = new esri.geometry.Extent({
			xmin: xminNew,
			ymin: yminNew,
			xmax: xmaxNew,
			ymax: ymaxNew,
			spatialReference: map.extent.spatialReference
		});
		// set extent converted to web mercator
		map.setExtent(esri.geometry.geographicToWebMercator(newExtent));
	}
	else{
		// show error dialog
		var dialog = new dijit.Dialog({
			title: i18n.viewer.errors.general,
			content: i18n.viewer.errors.noSearchResults
		});
		dialog.show();
	}
}
/*------------------------------------*/
// Basemap Gallery
/*------------------------------------*/
function createBasemapGallery() {
	var html = '';
	// insert HTML for basemap
	html += '<div class="silverButton buttonSingle" id="basemapButton"><span class="basemapArrowButton"></span>' + i18n.viewer.mapPage.switchBasemap + '</div>';
	html += '<div class="clear"></div>';
	html += '<div id="basemapGallery"></div>';
	// if node exists
	var node = dojo.byId("basemapContainer");
	if(node){
		node.innerHTML = html;
	}
	//add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
	var basemapGallery = new esri.dijit.BasemapGallery({
		showArcGISBasemaps: true,
		bingMapsKey: configOptions.bingMapsKey,
		map: map
	}, dojo.create("div"));
	dojo.byId("basemapGallery").appendChild(basemapGallery.domNode);
	// start it up!
	basemapGallery.startup();
	// if something bad happened
	dojo.connect(basemapGallery, "onError", function(msg){
		// show error dialog
		var dialog = new dijit.Dialog({
			title: i18n.viewer.errors.general,
			content: msg
		});
		dialog.show();
	});
	// toggle basemap button
	dojo.query(document).delegate("#basemapButton", "onclick", function(event){
		// get nodes
		var buttonNode = dojo.query(this);
		var node = dojo.query('#basemapGallery')[0];
		// if they exist
		if(node && buttonNode){
			// remove classes
			buttonNode.removeClass('buttonSelected open');
			// if already shown
			if(node.style.display === 'block'){
				// hide
				node.style.display = 'none';
			}
			else{
				// show and add class
				node.style.display = 'block';
				buttonNode.addClass('buttonSelected open');
			}
		}
    });
}
/*------------------------------------*/
// Set search address html
/*------------------------------------*/
function setAddressContainer(){
	var html = '';
	html += '<div class="grid_4 alpha searchListCon">';
	if(configOptions.locatorserviceurl && configOptions.showMapSearch){
		html += '<ul class="searchList">';
			html += '<li id="mapSearch" class="iconInput">';
				html += '<div title="' + i18n.viewer.main.clearSearch + '" class="iconReset" id="clearAddress"></div>';
				html += '<input placeholder="' + i18n.viewer.mapPage.findPlaceholder + '" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddress" value="" autocomplete="off" type="text" tabindex="1">';
			html += '</li>';
			html += '<li class="searchButtonLi" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddressButton"><span class="silverButton buttonRight"><span class="searchButton"></span></span></li>';
			html += '<li id="locateSpinner" class="spinnerCon"></li>';
		html += '</ul>';
		html += '<div class="clear"></div>';
		html += '<div id="acCon">';
			html += '<div id="autoComplete" class="autoComplete"></div>';
		html += '</div>';
		html += '<div class="clear"></div>';
	}
	else{
		html += '&nbsp;';
	}
	html += '</div>';
	html += '<div class="grid_5 omega basemapConRel"><div id="basemapContainer"></div>';
	html += '</div>';	
	html += '<div class="clear"></div>';
	// Set
	var node = dojo.byId("addressContainer");
	if(node){
		node.innerHTML = html;
	}
}
/*------------------------------------*/
// Insert Menu Tab HTML
/*------------------------------------*/
function insertMenuTabs(){
	var html = '';
	html += '<div title="' + i18n.viewer.sidePanel.legendButtonTitle + '" id="showLegend" class="toggleButton buttonLeft buttonSelected">' + i18n.viewer.sidePanel.legendButton + '</div>';
	html += '<div title="' + i18n.viewer.sidePanel.aboutButtonTitle + '" id="showAbout" class="toggleButton buttonRight">' + i18n.viewer.sidePanel.aboutButton + '</div>';
	html += '<div class="clear"></div>';
	// Set
	var node = dojo.byId("tabMenu");
	if(node){
		node.innerHTML = html;
	}
}
/*------------------------------------*/
// Add bottom map buttons
/*------------------------------------*/
function addBottomMapButtons(){
	var html = '';
	if(configOptions.showExplorerButton){
		// add open in explorer button
		html += '<a target="_blank" href="' + getViewerURL('explorer', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInExplorer + '</a>';
	}
	if(configOptions.showArcGISOnlineButton){
		// add open in arcgis button
		html += '<a target="_blank" href="' + getViewerURL('arcgis', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInArcGIS + '</a>';
	}
	if(html){
		// insert
		dojo.place(html, "mapButtons", "first");
	}
}
/*------------------------------------*/
// Set Owner
/*------------------------------------*/
function setItemOwner(owner){
	var html = '';
	if(owner){
		var ownerNode = dojo.byId("mapOwner");
		if(ownerNode){
			html += '<h2>' + i18n.viewer.mapPage.ownerHeader + '</h2>';
			html += '<p>' + i18n.viewer.footer.label + ' <a href="' + getViewerURL('owner_page', false, owner) + '" target="_blank">' + owner + '</a></p>';
			html += '<div class="clear"></div>';
			ownerNode.innerHTML = html;
		}
	}
}
/*------------------------------------*/
// Init Map
/*------------------------------------*/
function initMap() {
	// set map content
	setMapContent();
	// ITEM
	var itemDeferred = esri.arcgis.utils.getItem(configOptions.webmap);
	itemDeferred.addErrback(function(error) {
		// show error dialog
		dialog = new dijit.Dialog({
			title: i18n.viewer.errors.general,
			content: i18n.viewer.errors.createMap + error
		});
		dialog.show();
		// hide all content
		hideAllContent();
	});
	itemDeferred.addCallback(function(itemInfo) {
		// if it's a webmap
		if(itemInfo && itemInfo.item && itemInfo.item.type === 'Web Map'){
			// insert menu tab html
			insertMenuTabs();
			// insert address html
			setAddressContainer();
			// if no title set in config
			if(!configOptions.mapTitle){
				configOptions.mapTitle = itemInfo.item.title;
			}
			// if no subtitle set in config
			if(!configOptions.mapSnippet){
				configOptions.mapSnippet = itemInfo.item.snippet;
			}
			// if no description set in config
			if(!configOptions.mapItemDescription){
				configOptions.mapItemDescription = itemInfo.item.description;
			}
			// Set title
			var titleNode = dojo.byId("title");
			if(titleNode){
				titleNode.innerHTML = configOptions.mapTitle || "";
			}
			// Set subtitle
			var subTitleNode = dojo.byId("subtitle");
			if(subTitleNode){
				subTitleNode.innerHTML = configOptions.mapSnippet || "";
			}
			// TODO
			if(configOptions.development){
				console.log(itemInfo);
				// Set license info
				var licenseInfo = dojo.byId("licenseInfo");
				if(licenseInfo && itemInfo.item.licenseInfo){
					licenseInfo.innerHTML = '<h2>Use Constraints</h2>' + itemInfo.item.licenseInfo;
				}
				// Set credits
				var accessInformation = dojo.byId("accessInformation");
				if(accessInformation && itemInfo.item.accessInformation){
					accessInformation.innerHTML = '<div class="credits"><strong>Credits:</strong> ' + itemInfo.item.accessInformation + '</div>';
				}
				
				//
				var numViews = dojo.byId("numViews");
				if(numViews && itemInfo.item.numViews){
					numViews.innerHTML = dojo.number.format(itemInfo.item.numViews);
				}
				
				//
				var numComments = dojo.byId("numComments");
				if(numComments && itemInfo.item.numComments){
					numComments.innerHTML = dojo.number.format(itemInfo.item.numComments);
				}
				
				//
				var created = dojo.byId("created");
				if(created && itemInfo.item.created){
					// date object
					var d = new Date(itemInfo.item.created);
					// date format for locale
					var dateLocale = dojo.date.locale.format(d, {
						selector:"date",
						datePattern:"MMM d, yyyy"
					}); 
					created.innerHTML = dateLocale;
				}
			}
			// Set owner
			setItemOwner(itemInfo.item.owner);
			// Set description
			var descriptionInfo = configOptions.mapItemDescription || "";
			var descNode = dojo.byId("descriptionContent");
			if(descNode){
				descNode.innerHTML = '<h2>' + i18n.viewer.mapPage.aboutHeader + '</h2>' + descriptionInfo + '<div class="clear"></div>';
			}
			// set page title
			if(configOptions.mapTitle){
				document.title = configOptions.siteTitle + ' | ' + configOptions.mapTitle;
			}
			else{
				document.title = configOptions.siteTitle;	
			}
			// add bottom map buttons
			addBottomMapButtons();
			// create map
			var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
				mapOptions: {
					slider: true,
					sliderStyle: "small",
					wrapAround180:true,
					nav: false
				},
				ignorePopups:false,
				bingMapsKey: configOptions.bingMapsKey,
				geometryServiceURL: configOptions.geometryserviceurl
			});
			// map response
			mapDeferred.addCallback(function(response) {
				// set map
				map = response.map;
				var layers = response.itemInfo.itemData.operationalLayers;
				// LAYER TOGGLE
				if(configOptions.showLayerToggle && layers.length > 0){
					var layerClick = '';
					var mapLayersNode = dojo.query("#mapLayers");
					if(mapLayersNode.length > 0){
						mapLayersNode.innerHTML('<h2>' + i18n.viewer.mapPage.layersHeader + '</h2><table id="mapLayerToggle"></table><div class="clear"></div>');
					}
					layerClick += "<tbody>";
					for(j=0; j< layers.length; j++){
						var checked;
						if(layers[j].featureCollection){
							layerClick += "<tr>";
							checked = '';
							if(layers[j].visibility){
								checked = 'checked="checked"';
							}
							// check column
							layerClick += '<td class="checkColumn"><input class="toggleLayers" id="layerCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
							for(k=0; k < layers[j].featureCollection.layers.length; k++){
								layerClick += layers[j].featureCollection.layers[k].id;
								// if not last
								if(k !== (layers[j].featureCollection.layers.length - 1)){
									layerClick += ",";
								}
							}
							layerClick += '" /></td>';
							// label column
							layerClick += '<td><label for="layerCheckbox' + j + '">' + layers[j].title + '</label></td>';
							layerClick += "</tr>";
						}
						else{
							layerClick += "<tr>";
							checked = '';
							if(layers[j].visibility){
								checked = 'checked="checked"';
							}
							// check column
							layerClick += '<td class="checkColumn"><input class="toggleLayers" id="layerSingleCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
							layerClick += layers[j].id;
							layerClick += '" /></td>';
							// label column
							layerClick += '<td><label for="layerSingleCheckbox' + j + '">' + layers[j].title + '</label></td>';
							layerClick += "</tr>";
						}
					}
					layerClick += "</tbody>";
					dojo.place(layerClick, 'mapLayerToggle', "first");
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
				// show error dialog
				var dialog = new dijit.Dialog({
					title: i18n.viewer.errors.general,
					content: i18n.viewer.errors.createMap + " : " + error
				});
				dialog.show();
				// hide all content
				hideAllContent();
			});
			// LOCATOR
			aoGeocoder = new esri.tasks.Locator(configOptions.locatorserviceurl);
			aoGeoCoderAutocomplete = new esri.tasks.Locator(configOptions.locatorserviceurl);
			dojo.connect(aoGeocoder, "onAddressToLocationsComplete", showResults);
			dojo.connect(aoGeoCoderAutocomplete, "onAddressToLocationsComplete", showAutoComplete);
			itemDeferred.addErrback(function(error) {
				var dialog;
				// don't i18n this. I'ts returned from the server
				if (error && error.message === "BingMapsKey must be provided.") {
					dialog = new dijit.Dialog({
						title: i18n.viewer.errors.general,
						content: i18n.viewer.errors.bingError
					});
					dialog.show();
				}
				else {
					// show error dialog
					dialog = new dijit.Dialog({
						title: i18n.viewer.errors.general,
						content: i18n.viewer.errors.createMap + " : " + error
					});
					dialog.show();
					// hide all content
					hideAllContent();
				}
			});			
		}
		else{
			// show error dialog
			dialog = new dijit.Dialog({
				title: i18n.viewer.errors.general,
				content: i18n.viewer.errors.createMap
			});
			dialog.show();
			// hide all content
			hideAllContent();
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
		if(layer.visible === true) {
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
function buildLayersList(layers) {
    //layers  arg is  response.itemInfo.itemData.operationalLayers;
    var layerInfos = [];
    dojo.forEach(layers, function (mapLayer, index) {
        var layerInfo = {};
        if (mapLayer.featureCollection && mapLayer.type !== "CSV") {
            if (mapLayer.featureCollection.showLegend === true) {
                dojo.forEach(mapLayer.featureCollection.layers, function (fcMapLayer) {
                    if (fcMapLayer.showLegend !== false) {
                        layerInfo = {
                            "layer": fcMapLayer.layerObject,
                            "title": mapLayer.title,
                            "defaultSymbol": false
                        };
                        if (mapLayer.featureCollection.layers.length > 1) {
                            layerInfo.title += " - " + fcMapLayer.layerDefinition.name;
                        }
                        layerInfos.push(layerInfo);
                    }
                });
            }
        } else if (mapLayer.showLegend !== false) {
            layerInfo = {
                "layer": mapLayer.layerObject,
                "title": mapLayer.title,
                "defaultSymbol": false
            };
            //does it have layers too? If so check to see if showLegend is false
            if (mapLayer.layers) {
                var hideLayers = dojo.map(dojo.filter(mapLayer.layers, function (lyr) {
                    return (lyr.showLegend === false);
                }), function (lyr) {
                    return lyr.id;
                });
                if (hideLayers.length) {
                    layerInfo.hideLayers = hideLayers;
                }
            }
            layerInfos.push(layerInfo);
        }
    });
    return layerInfos;
}
/*------------------------------------*/
// INIT UI
/*------------------------------------*/
function initUI(layers) {
	// Set legend header
	var node = dojo.byId('legendHeader');
	if(node){
		node.innerHTML = i18n.viewer.sidePanel.title;
	}
	// Set basemap gallery
	if(configOptions.showBasemapGallery){
		createBasemapGallery();
	}
	// Set map background image
	dojo.query("#map").style('background-image','none');
	// Setup resize map
	dojo.connect(window, "onresize", resizeMap);
	//add scalebar
	var scalebar = new esri.dijit.Scalebar({
		map: map,
		scalebarUnit: i18n.viewer.main.scaleBarUnits
	});
	// Legend Information
	var layerInfo = buildLayersList(layers);
	// Build Legend
	if(layerInfo.length > 0){
		var legendDijit = new esri.dijit.Legend({
			map:map,
			layerInfos:layerInfo
		},"legendContent");
		legendDijit.startup();
	}
	else{
		var legendContentNode = dojo.byId('legendContent');
		if(legendContentNode){
			legendContentNode.innerHTML = i18n.viewer.errors.noLayers;
		}
	}
}
/*------------------------------------*/
// Resize and Reposition Map
/*------------------------------------*/
function mapResizeAndReposition(){
	map.resize();
	map.reposition();
}
/*------------------------------------*/
// Resize Map And Center
/*------------------------------------*/
function resizeMapAndCenter(){
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		mapResizeAndReposition();
		if(mapCenter.x && mapCenter.y){
			setTimeout(function() {
				map.centerAt(mapCenter);
				mapResizeAndReposition();
			}, 500);
		}
	}, 500);
}
/*------------------------------------*/
// Resize Map
/*------------------------------------*/
function resizeMap() {
	clearTimeout(resizeTimer);
	if(map){
		resizeTimer = setTimeout(function() {
			mapResizeAndReposition();
		}, 500);
	}
}