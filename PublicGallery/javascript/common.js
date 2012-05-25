/*------------------------------------*/
// Add Spinner
/*------------------------------------*/
function addSpinner(query){
	var html = '<div class="spinnerRemove"><div class="loadingAjax"></div></div>';
	var node = dojo.query(query);
	if(node.length > 0){
		node.innerHTML(html);
	}
}
/*------------------------------------*/
// Reverse sort order
/*------------------------------------*/
function reverseSortOrder(order){
	if(order==='desc'){
		return 'asc';
	}
	else{
		return 'desc';
	}
}
/*------------------------------------*/
// Remove Spinner
/*------------------------------------*/
function removeSpinner(){
	dojo.query('.spinnerRemove').orphan();
}
/*------------------------------------*/
// Hide all content
/*------------------------------------*/
function hideAllContent(){
	var node = dojo.byId('content');
	if(node){
		node.innerHTML = "";
	}
}
/*------------------------------------*/
// App ID Settings
/*------------------------------------*/
function setAppIdSettings(callback){
	if(configOptions.appid){
		var requestHandle = esri.request({
			url: configOptions.sharingurl + "/" + configOptions.appid + "/data",
			content: {
				f: "json"
			},
			callbackParamName: "callback",
			// on load
			load: function (response) {
				// set config options from app id
				dojo.mixin(configOptions, response.values);
				// callback function
				if(typeof callback === 'function'){
					// call callback function
					callback.call(this);
				}
			},
			// on error
			error: function (response) {
				var error = response.message;
				// show error dialog
				var dialog = new dijit.Dialog({
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
		// callback function
		if(typeof callback === 'function'){
			// call callback function
			callback.call(this);
		}
	}
}
/*------------------------------------*/
// Clear address function
/*------------------------------------*/
function clearAddress(obj){
	// empty value
	obj.attr('value', "");
	// get reset node
	var iconReset = obj.prev('.iconReset');
	// remove active class
	iconReset.removeClass('resetActive');
	// add default class
	obj.addClass('default');
}
/*------------------------------------*/
// Checks to see if address is populated
/*------------------------------------*/
function checkAddressStatus(obj){
	// get value of node
	var cAVal = dojo.query(obj).attr('value')[0];
	// get reset node
	var iconReset = dojo.query(obj).prev('.iconReset');
	// if value is not empty
	if(cAVal !== ''){
		// add reset class
		iconReset.addClass('resetActive');
	}
}
/*------------------------------------*/
// Set default options for the template
/*------------------------------------*/
function setDefaultConfigOptions(){
	// set user agent
	setUserAgent();
	// set localization
	i18n = dojo.i18n.getLocalization("esriTemplate", "template");
	// if group object is empty
	if(!configOptions.group){
		configOptions.group = {};
	}
	// right to left
	configOptions.isRightToLeft = false;
	// if RTL
	if(window.dojoConfig.locale && window.dojoConfig.locale.indexOf("ar") !== -1) {
		//right now checking for Arabic only, to generalize for all RTL languages
		configOptions.isRightToLeft = true; // configOptions.isRightToLeft property setting to true when the locale is 'ar'
	}
	// Template Development
	configOptions.development = true;
	// Template Version
	configOptions.templateVersion = 2.01;
	// ArcGIS Rest Version
	configOptions.arcgisRestVersion = 1;
	// row items
	configOptions.galleryPerRow = 3;
	// Set geometry to HTTPS if protocol is used
	if(configOptions.geometryserviceurl && location.protocol === "https:") {
		configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:', 'https:');
	}
	// https locator url
	if(configOptions.locatorserviceurl && location.protocol === "https:") {
		configOptions.locatorserviceurl = configOptions.locatorserviceurl.replace('http:', 'https:');
	}
	// https sharing url
	if(configOptions.sharingurl && location.protocol === "https:") {
		configOptions.sharingurl = configOptions.sharingurl.replace('http:', 'https:');
	}
	// https portal url
	if(configOptions.portalUrl && location.protocol === "https:") {
		configOptions.portalUrl = configOptions.portalUrl.replace('http:', 'https:');
	}
	// set sharing URL
	if(!configOptions.sharingurl){
		configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/rest/content/items";
	}
	// set portal URL
	if(!configOptions.portalUrl){
		configOptions.portalUrl = location.protocol + '//' + location.host + "/";
	}
	// set portal URL
	if(!configOptions.mobilePortalUrl){
		configOptions.mobilePortalUrl =  'arcgis://' + location.host + "/";
	}
	// Set Proxy URL
	if(!configOptions.proxyurl){   
		configOptions.proxyurl = location.protocol + '//' + location.host + "/sharing/proxy";
	}
	// lowercase layout
	if(configOptions.defaultLayout){
		configOptions.defaultLayout = configOptions.defaultLayout.toLowerCase();
	}
	// if no theme is set at all
	if(!configOptions.theme){
		configOptions.theme = "blueTheme";
	}
	// if no point symbol set
	if(!configOptions.hasOwnProperty('pointGraphic')){
		configOptions.pointGraphic = "images/ui/bluepoint-21x25.png";
	}
	// if no gallery per page set
	if(!configOptions.hasOwnProperty('galleryItemsPerPage')){
		configOptions.galleryItemsPerPage = 9;
	}
	// if no gallery per page set
	if(!configOptions.hasOwnProperty('mapViewer')){
		configOptions.mapViewer = 'simple';
	}
	// if no sort order set
	if(!configOptions.hasOwnProperty('sortOrder')){
		configOptions.sortOrder = 'desc';
	}
	// if no sort field set
	if(!configOptions.hasOwnProperty('sortField')){
		configOptions.sortField = 'created';
	}
	// if no default layout
	if(!configOptions.hasOwnProperty('defaultLayout')){
		configOptions.defaultLayout = 'grid';
	}
	// set defaults
	esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
	esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);
	esri.config.defaults.io.proxyUrl =  configOptions.proxyUrl;
	esri.config.defaults.io.corsEnabledServers = [location.protocol + '//' + location.host];
	esri.config.defaults.io.alwaysUseProxy = false;
}
/*------------------------------------*/
// query group
/*------------------------------------*/
function queryGroup(callback){
	// query group info
	queryArcGISGroupInfo({
		// Settings
		id_group: configOptions.group.id,
		// Group Owner
		owner: configOptions.group.owner,
		// Group Title
		groupTitle: configOptions.group.title,
		// Executed after ajax returned
		callback: function(obj,data){
			if(data.results.length > 0){
				// set group content
				setGroupContent(data.results[0]);
				// if callback
				if(callback && typeof callback === 'function'){
					// call callback function
					callback.call(this);
				}
			}
			else{
				// show error dialog
				var dialog = new dijit.Dialog({
					title: i18n.viewer.errors.general,
					content: i18n.viewer.errors.noGroupResults
				});
				dialog.show();
			}
		}
	});
}
/*------------------------------------*/
// Set group information to template
/*------------------------------------*/
function setGroupContent(groupInfo){
	// set group id
	if(!configOptions.group.id){
		configOptions.group.id = groupInfo.id;
	}
	// Set owner
	if(!configOptions.group.owner){
		configOptions.group.owner = groupInfo.owner;
	}
	// Set group title
	if(!configOptions.group.title){
		configOptions.group.title = groupInfo.title;
	}
	// Set home heading
	if(!configOptions.homeHeading){
		configOptions.homeHeading = groupInfo.title;
	}
	// Set home snippet
	if(!configOptions.homeSnippet){
		configOptions.homeSnippet = groupInfo.snippet;
	}
	// Set home side content
	if(!configOptions.homeSideContent){
		configOptions.homeSideContent = groupInfo.description;
	}
	// set footer image
	if(!configOptions.footerLogo){
		configOptions.footerLogo = groupInfo.thumbnailUrl;
	}
	// set footer image link
	if(!configOptions.footerLogoUrl){
		configOptions.footerLogoUrl = getViewerURL('group_page');
	}
	// set page title
	document.title = configOptions.siteTitle + ' - ' + groupInfo.title;
	// insert all the group content
	insertContent();
}
/*------------------------------------*/
// Set URL params for GROUP, THEME and WEBMAP
/*------------------------------------*/
function configUrlParams(){
	// set url object
	urlObject = esri.urlToObject(document.location.href);
	urlObject.query = urlObject.query || {};
	// if group is set in url
	if(urlObject.query.group){
		configOptions.group.id = urlObject.query.group;
	}
	// if title is set via url
	if(urlObject.query.title) {
		configOptions.mapTitle = urlObject.query.title;
	}
	// if subtitle set via url
	if(urlObject.query.subtitle) {
		configOptions.mapTitle = urlObject.query.subtitle;
	}
	// if webmap set via url
	if(urlObject.query.webmap){
		configOptions.webmap = urlObject.query.webmap;
	}
	// if bing maps key set via url
	if(urlObject.query.bingMapsKey) {
		configOptions.bingmapskey = urlObject.query.bingMapsKey;
	}
	// if theme is set in url
	if(urlObject.query.theme){
		configOptions.theme = urlObject.query.theme;
	}
	// set RTL
	if(urlObject.query.rtl){
		configOptions.isRightToLeft = true;
	}
}
/*------------------------------------*/
// is user on supported mobile device
/*------------------------------------*/
function isMobileUser(){
	if(configOptions.agent_ios || configOptions.agent_android){
		return true;	
	}
	else{
		return false;
	}
}
/*------------------------------------*/
// Open Mobile App Link
/*------------------------------------*/
function openmobileAppUrl(){
	// if iOS Device
	if(configOptions.agent_ios && configOptions.iosAppUrl){
		window.open(configOptions.iosAppUrl);
	}
	// if Android Device
	else if(configOptions.agent_android && configOptions.androidAppUrl){
		window.open(configOptions.androidAppUrl);
	}
}
/*------------------------------------*/
// ZOOM TO LOCATION: ZOOMS MAP TO LOCATION POINT
/*------------------------------------*/
function zoomToLocation(x, y, IPAccuracy){
	// calculate lod
	var lod = 16;
	// set point
	var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(x, y));
	// if point graphic set
	if(configOptions.pointGraphic){
		// If locate layer
		if(locateResultLayer) {
			// clear layer
			locateResultLayer.clear();
		}
		else{
			// Create layer for result
			locateResultLayer = new esri.layers.GraphicsLayer();
			// Add layer to map
			map.addLayer(locateResultLayer);
		}
		// Create point symbol
		var pointSymbol = new esri.symbol.PictureMarkerSymbol(configOptions.pointGraphic, 21, 25).setOffset(0,12);
		// Set graphic
		var locationGraphic = new esri.Graphic(pt,pointSymbol);
		// Add graphic to layer
		locateResultLayer.add(locationGraphic);
	}
	// zoom and center
	map.centerAndZoom(pt,lod);
}
/*------------------------------------*/
// GEOLOCATE FUNCTION: SETS MAP LOCATION TO USERS LOCATION
/*------------------------------------*/
function geoLocateMap(position){
	// Get lattitude
	var latitude = position.coords.latitude;
	// Get longitude
	var longitude = position.coords.longitude;
	// Get accuracy
	var IPAccuracy = position.coords.accuracy;
	// Zoom to location
	zoomToLocation(longitude,latitude,IPAccuracy);
}
/*------------------------------------*/
// Check Mobile Cookie
/*------------------------------------*/
function checkMobileCookie(){
	// if disable mobile dialog is false
	if(configOptions.showMobileDialog){
		// get cookie
		configOptions.appCookie = dojo.cookie('ArcGISAppInstalled');
		// if mobile user and mobile enabled
		if(isMobileUser() && !configOptions.appCookie){
			// prompt for decision
			var installedButton = new dijit.form.Button({
				label: i18n.viewer.mobileOptions.installed,
				onClick: function(){
					// set cookie to installed
					dojo.cookie("ArcGISAppInstalled", "installed", {expires: 365});
					// update config value to installed
					configOptions.appCookie = 'installed';
					mobileDialog.onCancel();
					// requery data
					document.location.reload(true);
				}
			});
			var notInstalledButton = new dijit.form.Button({
				label: i18n.viewer.mobileOptions.install,
				onClick: function(){
					openmobileAppUrl();
					mobileDialog.onCancel();
				}
			});
			var ignoreButton = new dijit.form.Button({
				label: i18n.viewer.mobileOptions.ignore,
				onClick: function(){
					// set cookie to opt out of app
					dojo.cookie("ArcGISAppInstalled", "disabled", {expires: 365});
					// update config value to optout
					configOptions.appCookie = 'disabled';
					// close dialog
					mobileDialog.onCancel();
				}
			});
			mobileDialog = new dijit.Dialog({
				title: i18n.viewer.mobileOptions.mobileAppDialogTitle,
				content: '<div class="dialogContent">' + i18n.viewer.mobileOptions.mobileAppDialogContent + '</div>'
			});
			mobileDialog.containerNode.appendChild(installedButton.domNode);
			mobileDialog.containerNode.appendChild(notInstalledButton.domNode);
			mobileDialog.containerNode.appendChild(ignoreButton.domNode);
			mobileDialog.show();
		}
	}	
}
/*------------------------------------*/
// Set user agent
/*------------------------------------*/
function setUserAgent(){
	// set agent
	configOptions.agent = navigator.userAgent.toLowerCase();
	// if iOS
	configOptions.agent_ios = configOptions.agent.match(/(iphone|ipod|ipad)/);
	// if Android
	configOptions.agent_android = configOptions.agent.match(/(android)/);
}
/*------------------------------------*/
// Insert social media html
/*------------------------------------*/
function insertSocialHTML(){
	var html = '';
	html += '<div class="addthis_toolbox addthis_default_style">';
	html += '<a class="addthis_button_facebook"></a>';
	html += '<a class="addthis_button_twitter"></a>';
	html += '<a class="addthis_button_linkedin"></a>';
	html += '<a class="addthis_button_email"></a>';
	html += '<a class="addthis_button_compact"></a>';
	html += '<a class="addthis_counter addthis_bubble_style"></a>';
	html += '</div>';
	// if social HTML
	var node = dojo.query("#socialHTML");
	if(node.length > 0){
		node.innerHTML(html);
	}
	// addthis url
	var addthisURL = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=";
	// https support
	if(addthisURL && location.protocol === "https:"){
		addthisURL = addthisURL.replace('http:', 'https:');
	}
	// load share script
	dojo.io.script.get({
        url: addthisURL + configOptions.addThisProfileId
    });
}
/*------------------------------------*/
// Insert footer HTML
/*------------------------------------*/
function insertFooterHTML(){
	var html = '';
	html += '<div id="footerCon">';
		html += '<div class="container_12">';
			html += '<div class="grid_6">';
				html += '<div class="Pad"> ';
					html += '<h2 id="footerHeading">';
					// Set footer heading
					if(configOptions.footerHeading){
						html += configOptions.footerHeading;
					}
					html += '</h2>';
					html += '<p id="footerDescription">';
					// if footer description
					if(configOptions.footerDescription){
						html += configOptions.footerDescription;
					}
					html += '</p>';
				html += '</div>';
			html += '</div>';
			html += '<div class="prefix_3 grid_3">';
				html += '<div id="footerLogoDiv" class="logoDiv footBorder">';
				// Set footer logo
				if(configOptions.footerLogo && configOptions.showFooter){
					html += '<div><a id="yourLogo" ';
					// if logo url
					if(configOptions.footerLogoUrl){
						html += 'href="' + configOptions.footerLogoUrl + '"';
					}
					html += 'title="' + configOptions.homeHeading + '" ';
					html += '>';
					html += '<img src="' + configOptions.footerLogo + '" alt="' + configOptions.homeHeading + '" title="' + configOptions.homeHeading + '" />';
					html += '</a></div>';
					// if profile url
					if(configOptions.showProfileUrl){
						html += '<div><a href="' + getViewerURL('owner_page') + '">' + configOptions.group.owner + '</a></div>';
					}
				}
				html += '</div>';
			html += '</div>';
			html += '<div class="clear"></div>';
		html += '</div>';
	html += '</div>';
	// if Footer
	var node = dojo.query("#footer");
	if(node.length > 0){
		node.innerHTML(html);
	}
	// set Background Color
	dojo.query("body").style('background-color', '#4d4d4d');
}
/*------------------------------------*/
// Insert Navigation/Banner
/*------------------------------------*/
function insertHeaderContent(){
	var html = '';
	html += '<li id="homeItem"><a title="' + configOptions.siteTitle + '" href="' + getViewerURL('index_page') + '" id="siteTitle">';
	// if banner image
	if(configOptions.siteBannerImage){
		html += '<img alt="' + configOptions.siteTitle + '" title="' + configOptions.siteTitle + '" src="' + configOptions.siteBannerImage + '" />';
	}
	else{
		html += configOptions.siteTitle;
	}
	html += '</a></li>';
	// if show about page
	if(configOptions.showAboutPage){
		html += '<li><a href="' + getViewerURL('about_page') + '">' + i18n.viewer.sidePanel.aboutButton + '</a></li>';
	}
	// insert HTML
	dojo.place(html, "templateNav", "first");
	// set selected class
	dojo.forEach(dojo.query('#templateNav li a'),function(obj){
		// if link HREF equals page HREF
		if(obj.href === location.href){
			// add selected class
			dojo.query(obj).addClass('activeLink');
		}
	});
}
/*------------------------------------*/
// Insert content
/*------------------------------------*/
function insertContent(){
	// add direction tag to HTML
	var dirNode = document.getElementsByTagName("html")[0];
	// if RTL
	if(configOptions.isRightToLeft) {
		// Set direction class
		dirNode.className += " esriRtl";
		// direction attribute
		dirNode.setAttribute("dir", "rtl");
	}
	else {
		// Set direction class
		dirNode.className += " esriLtr";
		// direction attribute
		dirNode.setAttribute("dir", "ltr");
	}
	// Set Theme
	dirNode.className += " " + configOptions.theme;
	// Insert banner and navigation
	insertHeaderContent();
	// Set social media buttons
	if(configOptions.showSocialButtons){
		insertSocialHTML();	
	}
	// Set footer
	if(configOptions.showFooter){
		insertFooterHTML();
	}
}
/*------------------------------------*/
// query arcgis group info
/*------------------------------------*/
function queryArcGISGroupInfo(obj){
	// default values
	var settings = {
		// set group id for web maps
		id_group : '',
		// Group Owner
		owner: '',
		// Group Title
		groupTitle: '',
		// format
		dataType : 'json',
		// callback function with object
		callback: null
    };
	// If options exist, lets merge them with our default settings
	if(obj) { 
		dojo.mixin(settings,obj);
	}
	var q = '';
	if(settings.id_group){
		q += 'id:"' + settings.id_group + '"';
	}
	else{
		q += 'title:"' + settings.groupTitle + '" AND owner:"' + settings.owner + '"';
	}
	var params = {
		q: q,
		v: configOptions.arcgisRestVersion,
		f: settings.dataType
	};
	portal.queryGroups(params).then(function(data){
		if(typeof settings.callback === 'function'){
			// call callback function with settings and data
			settings.callback.call(this,settings,data);
		}
	});
}
/*------------------------------------*/
// Create portal and proceed
/*------------------------------------*/
function createPortal(callback){
	// create portal
	portal = new esri.arcgis.Portal(configOptions.portalUrl);
	// portal loaded
	dojo.connect(portal, 'onLoad', function(){
		if(typeof callback === 'function'){
			// call callback function
			callback.call(this);
		}
	});
}
/*------------------------------------*/
// Query arcgis items
/*------------------------------------*/
function queryArcGISGroupItems(obj){
	// default values
	var settings = {
		// set group id for web maps
		id_group: '',
		// type of item
		searchType: '',
		// filter these items
		filterType: '',
		// access type
		searchAccess: '',
		// format
		dataType: 'json',
		// sorting column: The allowed field names are title, created, type, owner, avgRating, numRatings, numComments and numViews.
		sortField: 'created',
		// sorting order: Values: asc | desc
		sortOrder: 'desc',
		// if pagination
		pagination: true,
		// how many links to show on each side of pagination
		paginationSize: 1,
		// show first and last links on pagination
		paginationShowFirstLast: true,
		// show previous and next links
		paginationShowPrevNext: true,
		// search limit
		perPage: '',
		// maps per row
		perRow: '',
		// offset
		searchStart: 1,
		// search keywords
		keywords: '',
		// style of layout for the results
		layout: 'grid',
		// use arcgis mobile app links when on a mobile device
		mobileAppUrl: false,
		// callback function with object
		callback: null
    };
	// If options exist, lets merge them with our default settings
	if(obj) { 
		dojo.mixin(settings,obj);
	}
	var q = '';
	q += 'group:"' + settings.id_group + '"';
	if(settings.keywords){
		q += ' AND (';
		q += ' title:"' + settings.keywords + '"';
		q += ' OR tags:"' + settings.keywords + '"';
		q += ' OR typeKeywords:"' + settings.keywords + '"';
		q += ' OR snippet:"' + settings.keywords + '"';
		q += ' ) ';
	}
	if(settings.searchType){
		q += ' AND type:"' + settings.searchType + '"';
	}
	if(settings.searchType && settings.filterType){
		q += ' -type:"' + settings.filterType + '"';
	}
	if(settings.searchAccess){
		q += ' AND access:"' + settings.searchAccess + '"';
	}
	var params = {
		q: q,
		v: configOptions.arcgisRestVersion,
		f: settings.dataType
	};
	if(settings.sortField){
		params.sortField = settings.sortField;
	}
	if(settings.sortOrder){
		params.sortOrder = settings.sortOrder;
	}
	if(settings.perPage){
		params.num = settings.perPage;
	}
	else{
		params.num = 0;
	}
	if(settings.searchStart > 1){
		params.start  = (((settings.searchStart - 1) * settings.perPage) + 1);
	}
	portal.queryItems(params).then(function(data){
		if(typeof settings.callback === 'function'){
			// call callback function with settings and data
			settings.callback.call(this,settings,data);
		}
	});
}
/*------------------------------------*/
// create pagination function
/*------------------------------------*/
function createPagination(obj, totalItems, pagObject){
	// creates middle pagination item HTML
	function createMiddleItem(i, current){
		// class
		var selectedClass = '';
		if(i === current){
			// IF SELECTED
			selectedClass = 'selected';
		}
		// page list item
		return '<li title="' + i18n.viewer.pagination.page + ' ' +  dojo.number.format(i) + '" data-offset="' + i + '" class="' + selectedClass + '"><span class="default">' +  dojo.number.format(i) + '</span></li>';
	}
	// variables
	var html = '', startHTML = '', middleHTML = '', endHTML = '', current, first, previous, next, last, middleCount = 0, lastMiddle = 0, firstMiddle = 0, remainderStart;
	// if pagination is necessary
	if(obj.pagination && obj.perPage && totalItems > obj.perPage){
		// create pagination list
		html += '<ul>';
		// determine offset links
		current =  parseInt(obj.searchStart, 10);
		first = 1;
		previous = current - 1;
		next = current + 1;
		last = Math.ceil(totalItems/obj.perPage);
		// pagination previous
		if(obj.paginationShowPrevNext){
			var firstClass = 'disabled';
			if(current > 1){
				firstClass = '';
			}
			startHTML += '<li title="' + i18n.viewer.pagination.previous + '" class="previous ' + firstClass + '" data-offset="' + previous + '"><span class="silverButton buttonLeft"><span></span></span></li>';
		}
		// pagination first page
		if(obj.paginationShowFirstLast && current > (obj.paginationSize + 1)){
			startHTML += '<li title="' + i18n.viewer.pagination.first + '" data-offset="' + first + '"><span class="default">' +  dojo.number.format(first) + i18n.viewer.pagination.helip + '</span></li>';
		}
		else{
			middleCount = middleCount - 1;
		}
		// pagination last page
		if(obj.paginationShowFirstLast && current < (last - obj.paginationSize)){
			endHTML += '<li title="' + i18n.viewer.pagination.last + '" data-offset="' + last + '"><span class="default">' +  i18n.viewer.pagination.helip + dojo.number.format(last) + '</span></li>';
		}
		else{
			middleCount = middleCount - 1;
		}
		// pagination next
		if(obj.paginationShowPrevNext){
			var lastClass = 'disabled';
			if(current < last){
				lastClass = '';
			}
			endHTML += '<li title="' + i18n.viewer.pagination.next + '" class="next ' + lastClass + '" data-offset="' + next + '"><span class="silverButton buttonRight"><span></span></span></li>';
		}
		// create each pagination item
		for(var i=1; i <= last; ++i) {
			if(i <= (current + obj.paginationSize) && i >= (current - obj.paginationSize)){
				if(firstMiddle === 0){
					firstMiddle = i;
				}
				middleHTML += createMiddleItem(i, current);
				middleCount++;
				lastMiddle = i;
			}
		}
		// if last middle is last page
		if(lastMiddle === last){
			// get remainderStart start
			remainderStart = firstMiddle - 1;
			// while not enough remainders
			while(middleCount < (obj.paginationSize * 2) + 1){
				// if remainder start is less or equal to first page
				if(remainderStart <= first){
					// end while
					break;
				}
				// add item to beginning of middle html
				middleHTML = createMiddleItem(remainderStart, current) + middleHTML;
				// increase middle count
				middleCount++;
				// decrease remainder start
				remainderStart--;
			}
		}
		// if first middle is first page
		else if(firstMiddle === first){
			// get remainderStart start
			remainderStart = lastMiddle + 1;
			// while not enough remainders
			while(middleCount < (obj.paginationSize * 2) + 1){
				// if remainder start is greater or equal to last page
				if(remainderStart >= last){
					// end while
					break;
				}
				// add item to end of middle html
				middleHTML += createMiddleItem(remainderStart, current);
				// increase middle count
				middleCount++;
				// increase remainder start
				remainderStart++;
			}
		}
		// add up HTML	
		html += startHTML + middleHTML + endHTML;
		// Pagination Spinner Container
		html += '<li id="paginationSpinner" class="spinnerCon"></li>';
		// end pagination
		html += '</ul>';
	}
	else{
		html += '&nbsp;';
	}
	html += '<div class="clear"></div>';
	// insert into html
	var node = dojo.query(pagObject);
	// insert pagination html
	node.innerHTML(html);
}
/*------------------------------------*/
// Configure viewer URL to use
/*------------------------------------*/
function getViewerURL(viewer, webmap){
	// if not defined
	if(!viewer){
		// set to default in config
		viewer = configOptions.mapViewer;
	}
	// lowercase
	viewer = viewer.toLowerCase();
	// return url and vars
	var retUrl = '', theme = '', rtl = '', group ='', queryString = '';
	// if group set via url
	if(urlObject.query.group){
		group = "&group=" + encodeURIComponent(urlObject.query.group);
	}
	// if theme set via url
	if(urlObject.query.theme){
		theme = "&theme=" + encodeURIComponent(urlObject.query.theme);
	}
	// if rtl set via url
	if(urlObject.query.rtl){
		rtl = "&rtl=" + encodeURIComponent(urlObject.query.rtl);
	}
	if(theme || rtl || group){
		queryString = '?';
	}
	// return correct url
	switch(viewer){
		case 'index_page':
			retUrl = 'index.html' + queryString + group + theme + rtl;
			return retUrl;
		case 'about_page':
			retUrl = 'about.html' + queryString + group + theme + rtl;
			return retUrl;
		case 'arcgis':
			return configOptions.portalUrl + 'home/webmap/viewer.html?webmap=' + webmap;
		case 'explorer':
			retUrl = "http://explorer.arcgis.com/?open=" + webmap;
			if(retUrl && location.protocol === "https:") {
				retUrl = retUrl.replace('http:', 'https:');
			}
			return retUrl;
		case 'explorer_present':
			retUrl = "http://explorer.arcgis.com/?present=" + webmap;
			if(retUrl && location.protocol === "https:") {
				retUrl = retUrl.replace('http:', 'https:');
			}
			return retUrl;
		case 'owner_page':
			if(configOptions.group.owner){
				retUrl = configOptions.portalUrl + 'home/user.html?user=' + encodeURIComponent(configOptions.group.owner);
			}
			return retUrl;
		case 'item_page':
			if(configOptions.webmap){
				retUrl = configOptions.portalUrl + 'home/item.html?id=' + configOptions.webmap;
			}
			return retUrl;
		case 'group_page':
			if(configOptions.group.owner && configOptions.group.title){
				retUrl = configOptions.portalUrl + 'home/group.html?owner=' + encodeURIComponent(configOptions.group.owner) + '&title=' + encodeURIComponent(configOptions.group.title);
			}
			return retUrl;
		case 'mobile':
			if(configOptions.agent_ios){
				retUrl = configOptions.mobilePortalUrl + 'sharing/rest/content/items/' + webmap + '/data';
			}
			else if(configOptions.agent_android){
				retUrl = configOptions.mobilePortalUrl + '?webmap=' + webmap;
			}
			return retUrl;
		case 'simple':
			retUrl = "map.html?webmap=" + webmap + group + theme + rtl;
			return retUrl;
		default:
			return '';
	}
}