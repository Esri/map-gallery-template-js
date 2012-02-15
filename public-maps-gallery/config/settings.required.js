/*------------------------------------*/
// REQUIRED CONFIGURATION
/*------------------------------------*/
/*

These are the basic settings you need to change.

Group ID Locator Tool:

	Navigate to the URL below to find the ID of your group by entering your ArcGIS username. All of your public groups will be listed with thier corresponding IDs.
	
	http://www.esri.com/public-maps-gallery/group-id-tool/index.html

Token Generator Tool:

	Use the URL below to create a security token to access private groups and maps from your site's URL.

	http://www.esri.com/public-maps-gallery/token-tool/index.html

1.4 Public Maps Gallery template Downoad Page:

	http://www.arcgis.com/home/item.html?id=2b158c0d94b64f208f45bcae801c2fa0

*/

// Your Group's ID
pmgConfig.groupID = "69b91f7b857b40a484c4aacbd1b243a7";

// Token if your group or map is not set to public.
// http://www.esri.com/public-maps-gallery/token-tool/index.html
pmgConfig.token = "";

// Default WebMap ID. This WebMap loads when no webmap query string parameter is specified on map.html
pmgConfig.defaultWebmap = "3fbfbf82b8d84409a60186b135eaa1ca";

// Embed functionality URL. Put the link to your public maps gallery template here.
pmgConfig.baseURL = "http://www.esri.com/public-maps-gallery/v1.4/";

// Required for maps that use a Bing Maps basemap.
// Get a Bing Maps key at http://www.bingmapsportal.com/
// http://help.arcgis.com/en/webapi/javascript/arcgis/help/jshelp_start.htm
pmgConfig.bingMapsKey = "";

// END