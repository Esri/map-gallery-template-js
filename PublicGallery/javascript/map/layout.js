// Dojo Requires
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.Portal");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojox.NodeList.delegate");
dojo.require("dijit.Dialog");
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
			id_group: configOptions.group,
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
	html += '<div tabindex="0" title="' + i18n.viewer.mapPage.enterFullscreen + '" class="mapButton buttonSingle" id="fullScreen"><span class="fullScreenButton">&nbsp;</span></div>';
	// fullscreen button
	dojo.query(document).delegate("#fullScreen", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			// if currently in full screen
			if(!mapFullscreen){
				// enter fullscreen
				toggleFullscreenMap(true);
			}
			else{
				// exit fullscreen
				toggleFullscreenMap(false);
			}
		}
    });
	// if gelocation is available
	if(navigator.geolocation){
		html += '<div tabindex="0" id="geoButton" title="' + i18n.viewer.mapPage.geoLocateTitle + '" class="mapButton buttonSingle"><span class="geoLocateButton">&nbsp;</span></div>';
		dojo.query(document).delegate("#geoButton", "onclick,keyup", function(event){
			if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
				navigator.geolocation.getCurrentPosition(geoLocateMap);
			}
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
function setDelegations(){
    // show about button click
	dojo.query(document).delegate("#showAbout", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			tabMenu('#aboutMenu',this);
		}
    });
	// show legend button click
	dojo.query(document).delegate("#showLegend", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			tabMenu('#legendMenu',this);
		}
	});
	// escape button when in full screen view
	dojo.query(document).delegate("body", "onkeyup", function(e){
		// if esc key and map is fullscreen
		if(e.keyCode === 27 && mapFullscreen) {
			// exit fullscreen
			toggleFullscreenMap(false);
		}
	});
	// Search Button
	dojo.query(document).delegate("#searchAddressButton", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			locate();
			hideAutoComplete();
		}
	});
	// Clear address button
	dojo.query(document).delegate(".iconInput .iconReset", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			var obj = dojo.query(this).prevAll('input');
			clearAddress(obj);
		}
	});
	// auto complete && address specific action listeners
	dojo.query(document).delegate("#searchAddress", "onkeyup", function(e){
		checkAddressStatus(this);
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
	// autocomplete result key up
	dojo.query(document).delegate("#autoComplete ul li", "onclick,keyup", function(e){
		if(e.type === 'click' || (e.type === 'keyup' && e.keyCode === 13)){
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
	dojo.query(document).delegate("#clearAddress", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			clearLocate();
			hideAutoComplete();
		}
	});
	// toggle legend layers
	dojo.query(document).delegate("#mapLayerToggle .toggleLayers", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			var dataAttr = dojo.query(this).attr('data-layers')[0].split(',');
			for(var i = 0; i < dataAttr.length; i++){
				toggleLayerSwitch(dataAttr[i]);
			}
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
        for(var i = 0; i < geocodeResults.length; i++){
            var layerClass = '';
            if(i % 2 === 0){
                layerClass = '';
            }
            else{
                layerClass = 'stripe';
            }
			aResults += '<li tabindex="0" class="' + layerClass + '">' + geocodeResults[i].address.replace(regex,'<span>' + partialMatch + '</span>')  + '</li>';
        }
        aResults += '</ul>';
        if(geocodeResults.length > 0){
			var node = dojo.byId('autoComplete');
			if(node){
				setNodeHTML(node, aResults);
				dojo.style(node, 'display', 'block');
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
	// if locate layer exists
    if(locateResultLayer){
		// clear it
        locateResultLayer.clear();
    }
	// reset locate string
    locateString = "";
}
/*------------------------------------*/
// Locate
/*------------------------------------*/
function locate() {
    var query = dojo.byId("searchAddress").value;
	if(query){
		// add loading spinner
		addSpinner("locateSpinner");
		// locate string
		locateString = query;
		// address object
		var address = {
			SingleLine: locateString
		};
		// get address and set callback. * includes all fields in query
		aoGeocoder.addressToLocations(address,["*"]);
	}
}
/*------------------------------------*/
// search box functions
/*------------------------------------*/ 
function autoComplete(query) {
	// set global locate string
	locateString = query;
	// address object
	var address = {
		SingleLine: locateString
	};
	// get address and set callback. * includes all fields in query
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
	html += '<div tabindex="0" class="silverButton buttonSingle" id="basemapButton"><span class="basemapArrowButton">&nbsp;</span>' + i18n.viewer.mapPage.switchBasemap + '</div>';
	html += '<div class="clear"></div>';
	html += '<div id="basemapGallery"></div>';
	// if node exists
	var node = dojo.byId("basemapContainer");
	setNodeHTML(node, html);
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
	dojo.query(document).delegate("#basemapButton", "onclick,keyup", function(event){
		if(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)){
			// get nodes
			var buttonNode = dojo.query(this);
			var node = dojo.byId('basemapGallery');
			// if they exist
			if(node && buttonNode){
				// remove classes
				buttonNode.removeClass('buttonSelected open');
				// if already shown
				if(dojo.style(node, 'display') === 'block'){
					// hide
					dojo.style(node, 'display', 'none');
				}
				else{
					// show and add class
					dojo.style(node, 'display', 'block');
					buttonNode.addClass('buttonSelected open');
				}
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
				html += '<input tabindex="0" placeholder="' + i18n.viewer.mapPage.findPlaceholder + '" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddress" value="" autocomplete="off" type="text" tabindex="1">';
				html += '<div tabindex="0" title="' + i18n.viewer.main.clearSearch + '" class="iconReset" id="clearAddress"></div>';
			html += '</li>';
			html += '<li class="searchButtonLi" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddressButton"><span tabindex="0" class="silverButton buttonRight"><span class="searchButton">&nbsp;</span></span></li>';
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
	html += '<div class="grid_5 omega basemapConRel"><div id="basemapContainer">&nbsp;</div>';
	html += '</div>';	
	html += '<div class="clear"></div>';
	// Set
	var node = dojo.byId("addressContainer");
	setNodeHTML(node, html);
}
/*------------------------------------*/
// Insert Menu Tab HTML
/*------------------------------------*/
function insertMenuTabs(){
	var html = '';
	html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.legendButtonTitle + '" id="showLegend" class="toggleButton buttonLeft buttonSelected">' + i18n.viewer.sidePanel.legendButton + '</div>';
	html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.aboutButtonTitle + '" id="showAbout" class="toggleButton buttonRight">' + i18n.viewer.sidePanel.aboutButton + '</div>';
	html += '<div class="clear"></div>';
	// Set
	var node = dojo.byId("tabMenu");
	setNodeHTML(node, html);
}
/*------------------------------------*/
// Add bottom map buttons
/*------------------------------------*/
function addBottomMapButtons(){
	var html = '';
	if(configOptions.showExplorerButton && !isMobileUser()){
		// add open in explorer button
		html += '<a tabindex="0" target="_blank" href="' + getViewerURL('explorer', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInExplorer + '</a>';
	}
	if(configOptions.showArcGISOnlineButton){
		// add open in arcgis button
		html += '<a tabindex="0" target="_blank" href="' + getViewerURL('arcgis', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInArcGIS + '</a>';
	}
	// If mobile user
	if(isMobileUser() && configOptions.showMobileButtons){
		// add button
		html += '<a tabindex="0" href="' + getViewerURL('mobile', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInMobile + '</a>';
		// add app button
		html += '<a tabindex="0" href="' + getViewerURL('mobile_app') + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.getMobileApp + '</a>';
	}
	if(html === ''){
		html = '&nbsp;';
	}
	// insert
	var node = dojo.byId("mapButtons");
	setNodeHTML(node, html);
}
/*------------------------------------*/
// Query Comments
/*------------------------------------*/
function queryComments(obj){
	// default values
	var settings = {
		// Group Owner
		id: '',
		// format
		dataType : 'json',
		// callback function with object
		callback: null
    };
	// If options exist, lets merge them with our default settings
	if(obj) { 
		dojo.mixin(settings, obj);
	}
	var q = 'id:' + settings.id;
	var params = {
		q: q,
		v: configOptions.arcgisRestVersion,
		f: settings.dataType
	};
	portal.queryItems(params).then(function(result){
		result.results[0].getComments().then(function(comments){
			if(typeof settings.callback === 'function'){
				// call callback function with settings and data
				settings.callback.call(this, comments);
			}
		});
	});
}
/*------------------------------------*/
// Builds listing of comments
/*------------------------------------*/
function buildComments(comments){
	var html = '';
	html += '<h2>' + i18n.viewer.comments.commentsHeader + '</h2>';
	if(comments && comments.length > 0){
		for(var i = 0; i < comments.length; i++){
			html += '<div id="comment_' + comments[i].id + '" class="comment">';
			html += '<p>';
			html += decodeURIComponent(comments[i].comment);
			html += '</p>';
			html += '<div class="smallText">';
			// date object
			var commentDate = new Date(comments[i].created);
			// date format for locale
			var dateLocale = dojo.date.locale.format(commentDate, {
				selector:"date",
				datePattern:"MMM d, yyyy"
			});
			html += i18n.viewer.comments.posted + ' ' + dateLocale;
			html += ' ' + i18n.viewer.comments.by + ' ';
			if(configOptions.showProfileUrl){
				html += '<a target="_blank" href="' + getViewerURL('owner_page', false, comments[i].owner) + '">'
			}
			html += comments[i].owner;
			if(configOptions.showProfileUrl){
				html += '</a>.';
			}
			html += '</div>';
			html += '</div>';
		}
	}
	else{
		html += '<p>';
		html += 'no comments';
		html += '</p>';
	}
	var commentsNode = dojo.byId("comments");
	setNodeHTML(commentsNode, html);
}
/*------------------------------------*/
// Init Map
/*------------------------------------*/
function initMap() {
	// set map content
	setDelegations();
	// set map buttons
	setInnerMapButtons();
	// TODO
	// get comments
	queryComments({
		// Group Owner
		id: configOptions.webmap,
		// Executed after ajax returned
		callback: function(comments){
			// create comments list
			buildComments(comments);
		}
	});
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
		var html = '';
		// TODO
		// rating widget
		var widget = new dojox.form.Rating({numStars:5,value:itemInfo.item.avgRating}, null);
		// rating container
		html += '<div class="ratingCon">' + widget.domNode.outerHTML + ' (';
		// Ratings
		if(itemInfo.item.numRatings){
			var pluralRatings = i18n.viewer.itemInfo.ratingsLabel;
			if(itemInfo.item.numRatings > 1){
				pluralRatings = i18n.viewer.itemInfo.ratingsLabelPlural;
			}
			html += dojo.number.format(itemInfo.item.numRatings) + ' ' + pluralRatings;
		}
		// comments
		if(itemInfo.item.numComments){
			if(itemInfo.item.numRatings){
				html += i18n.viewer.itemInfo.separator + ' ';
			}
			var pluralComments = i18n.viewer.itemInfo.commentsLabel;
			if(itemInfo.item.numComments > 1){
				pluralComments = i18n.viewer.itemInfo.commentsLabelPlural;
			}
			html += dojo.number.format(itemInfo.item.numComments) + ' ' + pluralComments;
		}
		// views
		if(itemInfo.item.numViews){
			if(itemInfo.item.numRatings || itemInfo.item.numComments){
				html += i18n.viewer.itemInfo.separator + ' ';
			}
			var pluralViews = i18n.viewer.itemInfo.viewsLabel;
			if(itemInfo.item.numViews > 1){
				pluralViews = i18n.viewer.itemInfo.viewsLabelPlural;
			}
			html += dojo.number.format(itemInfo.item.numViews) + ' ' + pluralViews;
		}
		// close container
		html += ')</div>';
		var ratingNode = dojo.byId("rating");
		setNodeHTML(ratingNode, html);
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
			setNodeHTML(titleNode, configOptions.mapTitle || "");
			// Set subtitle
			var subTitleNode = dojo.byId("subtitle");
			setNodeHTML(subTitleNode, configOptions.mapSnippet || "");
			var d, dateLocale;
			html = '';
			html += '<h2>' + i18n.viewer.mapPage.moreInformation + '</h2>';
			html += '<ul class="moreInfoList">';
			// TODO
			// Created Date
			if(itemInfo.item.created){
				// date object
				d = new Date(itemInfo.item.created);
				// date format for locale
				dateLocale = dojo.date.locale.format(d, {
					selector:"date",
					datePattern:"MMM d, yyyy"
				}); 
				html += '<li><strong>' + i18n.viewer.mapPage.createdLabel + '</strong><br />' + dateLocale + '</li>';
			}
			// Modified Date
			if(itemInfo.item.modified){
				// date object
				d = new Date(itemInfo.item.modified);
				// date format for locale
				dateLocale = dojo.date.locale.format(d, {
					selector:"date",
					datePattern:"MMM d, yyyy"
				}); 
				html += '<li><strong>' + i18n.viewer.itemInfo.modifiedLabel + '</strong><br />' + dateLocale + '</li>';
			}
			// if showMoreInfo is set
			if(configOptions.showMoreInfo){
				// Set owner
				if(itemInfo.item.owner){
					html += '<li><strong>' + i18n.viewer.mapPage.ownerHeader + '</strong><br /><a href="' + getViewerURL('owner_page', false, itemInfo.item.owner) + '" target="_blank">' + itemInfo.item.owner + '</a></li>';
				}
				// item page link
				html += '<li>';
				// TODO
				html += '<strong>' + i18n.viewer.mapPage.detailsLabel + '</strong><br />';
				html += '<a id="mapContentsLink" href="' + getViewerURL('item_page') + '" target="_blank">' + i18n.viewer.mapPage.arcgisLink + '</a>';
				html += '</li>';
				html += '</ul>';
			}
			// set html to node
			var mapMoreInfo = dojo.byId("mapMoreInfo");
			setNodeHTML(mapMoreInfo, html);
			// TODO
			// if no license info set in config
			if(!configOptions.mapLicenseInfo){
				configOptions.mapLicenseInfo = itemInfo.item.licenseInfo;
			}
			// Set license info
			var licenseInfo = dojo.byId("licenseInfo");
			if(licenseInfo && configOptions.mapLicenseInfo && configOptions.showLicenseInfo){
				setNodeHTML(licenseInfo, '<h2>' + i18n.viewer.mapPage.constraintsHeading + '</h2>' + configOptions.mapLicenseInfo);
			}
			// if no credits set in config
			if(!configOptions.mapCredits){
				configOptions.mapCredits = itemInfo.item.accessInformation;
			}
			// Set credits
			var accessInformation = dojo.byId("accessInformation");
			if(accessInformation && configOptions.mapCredits && configOptions.showCredits){
				setNodeHTML(accessInformation, '<div class="credits"><strong>' + i18n.viewer.mapPage.creditsHeading + '</strong> ' + configOptions.mapCredits + '</div>');
			}
			// Set description
			var descriptionInfo = configOptions.mapItemDescription || "";
			var descNode = dojo.byId("descriptionContent");
			setNodeHTML(descNode, '<h2>' + i18n.viewer.mapPage.aboutHeader + '</h2>' + descriptionInfo + '<div class="clear"></div>');
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
					var html = '';
					var mapLayersNode = dojo.byId('mapLayers');
					if(mapLayersNode){
						html += '<h2>' + i18n.viewer.mapPage.layersHeader + '</h2>';
						html += '<table id="mapLayerToggle">';
						html += "<tbody>";
						for(j=0; j < layers.length; j++){
							var checked;
							// if feature collection
							if(layers[j].featureCollection){
								html += "<tr>";
								checked = '';
								if(layers[j].visibility){
									checked = 'checked="checked"';
								}
								// check column
								html += '<td class="checkColumn"><input tabindex="0" class="toggleLayers" id="layerCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
								// if feature collection layers
								if(layers[j].featureCollection.layers){
									for(k = 0; k < layers[j].featureCollection.layers.length; k++){
										html += layers[j].featureCollection.layers[k].id;
										// if not last
										if(k !== (layers[j].featureCollection.layers.length - 1)){
											html += ",";
										}
									}
								}
								// csv
								else{
									html += layers[j].id;
								}
								html += '" /></td>';
								// label column
								html += '<td><label for="layerCheckbox' + j + '">' + layers[j].title.replace(/[-_]/g, " ") + '</label></td>';
								html += "</tr>";
							}
							else{
								html += "<tr>";
								checked = '';
								if(layers[j].visibility){
									checked = 'checked="checked"';
								}
								// check column
								html += '<td class="checkColumn"><input tabindex="0" class="toggleLayers" id="layerSingleCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
								html += layers[j].id;
								html += '" /></td>';
								// label column
								html += '<td><label for="layerSingleCheckbox' + j + '">' + layers[j].title.replace(/[-_]/g, " ") + '</label></td>';
								html += "</tr>";
							}
						}
						html += "</tbody>";
						html += '</table>';
						html += '<div class="clear"></div>';
						setNodeHTML(mapLayersNode, html);
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
        } else if (mapLayer.showLegend !== false && mapLayer.layerObject) {
			var showDefaultSymbol = false;
			if (mapLayer.layerObject.version < 10.1 && (mapLayer.layerObject instanceof esri.layers.ArcGISDynamicMapServiceLayer || mapLayer.layerObject instanceof esri.layers.ArcGISTiledMapServiceLayer)) {
				showDefaultSymbol = true;
			}
			layerInfo = {
				"layer": mapLayer.layerObject,
				"title": mapLayer.title,
				"defaultSymbol": showDefaultSymbol
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
	setNodeHTML(node, i18n.viewer.sidePanel.title);
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
		setNodeHTML(legendContentNode, i18n.viewer.errors.noLayers);
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