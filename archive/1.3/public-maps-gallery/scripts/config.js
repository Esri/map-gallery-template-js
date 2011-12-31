/*------------------------------------*/
// GLOBAL VARIABLES
/*------------------------------------*/
var ymConfig = {
	//Enter a title, if no title is specified, the webmap's title is used.
	title : "",
	//Enter a subtitle, if not specified the ArcGIS.com web map's summary is used
	subtitle : "",
	//By default the application will display the map's description in the sidebar. To define custom content set this value to custom.
	sidebarContent : "",
	// Required for maps that use a Bing Maps basemap. Get a Bing Maps key: http://www.bingmapsportal.com/
	bingMapsKey : "AoVj6ryrJFN8wvCQdP1ERZJKLvGFqAw9a7mYEBf-5DkyqSGhx5jzinFjBQRw6Vm4",
	// GROUP ID FOR HOME PAGE MAPS
	mapsGroupID : "470a5939ad1b4b12ba5a1329cbb64e9d",
	// GROUP ID FOR LAYERS
	layersGroupID : "715e193ca641468ea1eccdb6a459fda8",
	// DEFAULT WEB MAP. THIS WEBMAP LOADS WHEN NO WEBMAP IS SPECIFIED ON MAP.HTML
	defaultWebmap : "1a581e0ef5254264804a9c438d8e95ff",
	// MOBILE MAP GROUP
	mobileGroupID : "e0a41f2431f343ae81c9430d4c14264a",
	// EMBED BASE URL
	baseURL : "http://www.esri.com/templates/yourmaps/",
	// IOS APP URL
	iosAppURL : "itms://itunes.apple.com/us/app/arcgis/id379687930?mt=8"
}
/*------------------------------------*/
// GROUP TEST CODE
/*------------------------------------*/
var tmp_group = URLLookup('group');
if(tmp_group){
	ymConfig.mapsGroupID = tmp_group;
	ymConfig.layersGroupID = tmp_group;
	ymConfig.mobileGroupID = tmp_group;
}