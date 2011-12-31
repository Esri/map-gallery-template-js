/*------------------------------------*/
// OPTIONAL
/*------------------------------------*/
pmgConfig.sortField = 'uploaded'; // SORTING COLUMN= The allowed field names are title, uploaded, type, owner, avgRating, numRatings, numComments and numViews.
pmgConfig.sortOrder = 'desc'; // SORTING ORDER= Values= asc | desc
pmgConfig.galleryPerPage=9;
pmgConfig.galleryPerRow= 3;
pmgConfig.mapViewer= 'simple'; // simple, explorer, arcgis
// Required for maps that use a Bing Maps basemap. Get a Bing Maps key= http=//www.bingmapsportal.com/
// http=//help.arcgis.com/en/webapi/javascript/arcgis/help/jshelp_start.htm
pmgConfig.bingMapsKey = "";
// SHOW GROUP SEARCH
pmgConfig.showGroupSearch= true;
// SHOW LAYOUT CHANGER
pmgConfig.showLayoutSwitch= true;
// DEFAULT LAYOUT MODE= 'grid' or 'list'
pmgConfig.defaultLayout= "grid";
// USE ARCGIS iOS APP LINKS FOR USERS ON iOS DEVICES
pmgConfig.mobileAppLink= false;
// SHOW PAGINATION LINKS
pmgConfig.showPagination= true;
// IOS APP URL
pmgConfig.iosAppURL = "itms://itunes.apple.com/us/app/arcgis/id379687930?mt=8";
// LOCATOR URL
pmgConfig.locatorURL= 'http://tasks.arcgis.com/ArcGIS/rest/services/WorldLocator/GeocodeServer';
// ARCGIS URL
pmgConfig.arcgisURL= 'http://arcgis.com/sharing/content/items';
// PROXY URL
pmgConfig.proxyURL = '';
//Enter a title, if no title is specified, the webmap's title is used.
pmgConfig.title = "";
//Enter a subtitle, if not specified the ArcGIS.com web map's summary is used
pmgConfig.subtitle = "";
//By default the application will display the map's description in the sidebar. To define custom content set this value to custom.
pmgConfig.sidebarContent = "";