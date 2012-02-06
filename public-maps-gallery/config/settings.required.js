/*------------------------------------*/
// REQUIRED CONFIGURATION
/*------------------------------------*/
/*

THESE ARE THE BASIC SETTINGS YOU NEED TO CHANGE FOR YOUR OWN TEMPLATE


GROUP ID LOCATOR TOOL

Navigate to the URL below to find the ID of your group by entering your ArcGIS username. All of your public groups will be listed with thier corresponding IDs.

http://www.esri.com/public-maps-gallery/group-id-tool/index.html

1.4 Public Maps Gallery template
http://www.arcgis.com/home/item.html?id=2b158c0d94b64f208f45bcae801c2fa0

*/

// YOUR GROUP'S ID
pmgConfig.groupID = "69b91f7b857b40a484c4aacbd1b243a7";

//token if secured
//to generate token using the ArcGIS.COM sharing API:
// https://www.arcgis.com/sharing/generateToken?f=json&request=gettoken&username={arcgis.com username}&password={arcgis.com password}&Referer={base url where template is hosted}&expiration=525600
// token will expire after 1 year
//pmgConfig.token = "RzI6BXBuDlINY04fwXcljXns4cobDUwLg8-99U3uZv_vFnVB5aX67Ud_LE48P87i";
pmgConfig.token = "";

// DEFAULT WEB MAP ID. THIS WEBMAP LOADS WHEN NO WEBMAP IS SPECIFIED ON MAP.HTML
pmgConfig.defaultWebmap = "3fbfbf82b8d84409a60186b135eaa1ca";

// EMBED BASE URL. PUT THE LINK TO YOUR PUBLIC MAPS GALLERY HERE. EMBED SCRIPT USES THIS URL.
pmgConfig.baseURL = "http://www.esri.com/public-maps-gallery/v1.4/";

// Required for maps that use a Bing Maps basemap.
// Get a Bing Maps key at http://www.bingmapsportal.com/
// http://help.arcgis.com/en/webapi/javascript/arcgis/help/jshelp_start.htm
pmgConfig.bingMapsKey = "";

// END