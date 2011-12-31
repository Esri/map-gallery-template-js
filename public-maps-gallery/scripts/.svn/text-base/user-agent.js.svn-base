/*------------------------------------*/
// USER AGENT DEVICE VARIABLES: GETS USERS CURRENT DEVICE
/*------------------------------------*/
pmgConfig.agent = navigator.userAgent.toLowerCase();
// MATCH AGENT
pmgConfig.agent_ios = pmgConfig.agent.match(/(iphone|ipod|ipad)/);
pmgConfig.agent_android = pmgConfig.agent.match(/(android)/);
pmgConfig.agent_winphone = pmgConfig.agent.match(/(iemobile)/);
/*------------------------------------*/
// Get mobile app link
/*------------------------------------*/
function getMobileAppURL(id){
	// IF IOS DEVICE
	if(pmgConfig.agent_ios){
		// SHOW IOS LINK
		return pmgConfig.mobileArcgisURL + 'sharing/content/items/' + id + '/data';
	}
	// If Android
	else if(pmgConfig.agent_android){
		// SHOW Android LINK
		return pmgConfig.mobileArcgisURL + '?webmap=' + id;
	}
	else{
		return false;	
	}
}
/*------------------------------------*/
// is user on supported mobile device
/*------------------------------------*/
function isMobileUser(){
	if(pmgConfig.agent_ios || pmgConfig.agent_android){
		return true;	
	}
	else{
		return false;
	}
}
/*------------------------------------*/
// Open Mobile App Link
/*------------------------------------*/
function openMobileAppLink(){
	if(pmgConfig.agent_ios){
		window.open(pmgConfig.iosAppURL);
	}
	else if(pmgConfig.agent_android){
		window.open(pmgConfig.androidAppURL);
	}
}
/*------------------------------------*/
// ZOOM TO LOCATION: ZOOMS MAP TO LOCATION POINT
/*------------------------------------*/
function zoomToLocation(x, y, IPAccuracy){
	// calculate lod
	var lod = 14;
	// set point
	var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(x, y));
	// zoom and center
	map.centerAndZoom(pt,lod);
}
/*------------------------------------*/
// GEOLOCATE FUNCTION: SETS MAP LOCATION TO USERS LOCATION
/*------------------------------------*/
function geoLocateMap(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var IPAccuracy = position.coords.accuracy;
	zoomToLocation(longitude,latitude,IPAccuracy);
}
/*------------------------------------*/
// Check Mobile Cookie
/*------------------------------------*/
function checkMobileCookie(){
	// get cookie
	pmgConfig.appCookie = $.cookie('ArcGISAppInstalled');
	// if mobile user and mobile enabled
	if(isMobileUser() && !pmgConfig.appCookie){
		// set modal content
		$("#mobile-app-dialog").html(pmgConfig.mobileAppDialogContent);
		// prompt for decision
		$("#mobile-app-dialog").dialog({
			title: pmgConfig.mobileAppDialogTitle,
			resizable: false,
			position: 'center',
			height: pmgConfig.mobileAppDialogSize.height,
			width: pmgConfig.mobileAppDialogSize.width,
			modal: true,
			close: function(event, ui) {
				// if button wasnt click. assume disable
				if(!pmgConfig.appCookie){
					// set cookie to opt out of app
					$.cookie('ArcGISAppInstalled', 'disabled', { expires: 365 }); // 365 days
					// update config value to optout
					pmgConfig.appCookie = 'disable';
				}
			},
			buttons: [
				{
					text: pmgConfig.mobileAppButtons.notinstalled,
					click: function(){
						// open mobile app store link
						openMobileAppLink();
						// close dialog
						$(this).dialog("close");
					}
				},
				{
					text: pmgConfig.mobileAppButtons.installed,
					click: function(){
						// set cookie to installed
						$.cookie('ArcGISAppInstalled', 'installed', { expires: 365 }); // 365 days
						// update config value to installed
						pmgConfig.appCookie = 'installed';
						// requery data
						document.location.reload(true);
						// close dialog
						$(this).dialog("close");
					}
				},
				{
					text: pmgConfig.mobileAppButtons.noinstall,
					click: function(){
						// set cookie to opt out of app
						$.cookie('ArcGISAppInstalled', 'disabled', { expires: 365 }); // 365 days
						// update config value to optout
						pmgConfig.appCookie = 'disabled';
						// close dialog
						$(this).dialog("close");
					}
				}
			]
		});
	}	
}
/*------------------------------------*/
// TEST CODE
/*------------------------------------*/
var tmp_group = URLLookup('group');
if(tmp_group){
	pmgConfig.groupID = tmp_group;
}
var tmp_theme = URLLookup('theme');
if(tmp_theme){
	pmgConfig.theme = tmp_theme;
}
f