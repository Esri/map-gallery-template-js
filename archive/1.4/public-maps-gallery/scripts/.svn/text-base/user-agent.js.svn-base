/*------------------------------------*/
// USER AGENT DEVICE VARIABLES: GETS USERS CURRENT DEVICE
/*------------------------------------*/
pmgConfig.agent = navigator.userAgent.toLowerCase();
// MATCH AGENT
pmgConfig.agent_ios = pmgConfig.agent.match(/(iphone|ipod|ipad)/);
pmgConfig.agent_android = pmgConfig.agent.match(/(android)/);
pmgConfig.agent_winphone = pmgConfig.agent.match(/(iemobile)/);
/*------------------------------------*/
// ON IOS: IF APP LINK DOESN'T WORK, LOAD URL TO APP
/*------------------------------------*/
function applink(fail){
    return function(){
        var clickedAt = +new Date;
        // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
        setTimeout(function(){
            // To avoid failing on return to MobileSafari, ensure freshness!
            if (+new Date - clickedAt < 2000){
                window.location = fail;
            }
        }, 500);    
    };
}
/*------------------------------------*/
// ZOOM TO LOCATION: ZOOMS MAP TO LOCATION POINT
/*------------------------------------*/
function zoomToLocation(x, y, IPAccuracy){
	// calculate lod
	var lod = Math.floor((map._params.lods.length) * (IPAccuracy/100));
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