/*------------------------------------*/
// QUERY MOBILE MAPS
/*------------------------------------*/
function queryMobileMaps(data_offset){
	// IF OFFSET IS UNDEFINED, SET TO 1
	if(!data_offset) {
		var data_offset = 1;
	}
	// CALL FEATURED MAPS FUNCTION
	queryArcGISGroup({
		// SETTINGS
		id_group : ymConfig.mobileGroupID,
		searchType : 'Web Map',
		sortField : 'uploaded',
		sortOrder : 'desc',
		pagination: true,
		perPage : 9,
		perRow : 3,
		searchStart : data_offset,
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			buildMobilePlaylist(obj,data);
		}
	});
}
/*------------------------------------*/
// MAP PLAYLIST BUILD
/*------------------------------------*/
function buildMobilePlaylist(obj,data){
	// HTML VARIABLE
	var html = '';
	var fortotal;
	// GET TOTAL RESULTS
	var totalItems = data.total;
	var totalResults = data.results.length;
	// IF WE HAVE ITEMS
	if(totalItems > 0){
		// START OF UNORDERED LIST
		html += '<ul class="featuredMaps">';
		// IF PERPAGE IS MORE THAN TOTAL
		if(obj.pagination && obj.perPage && obj.perPage < totalResults){
			// USE PER PAGE
			forTotal = obj.perPage;	
		}
		else{
			// USE TOTAL
			forTotal = totalResults;
		}
		// CREATE LIST ITEMS
		for(var i=0; i < forTotal; ++i) {
			var itemClass = '';
			var itemTitle = truncate(data.results[i].title, 25);
			// LAST ROW ITEM
			if((i + 1) % obj.perRow == 0){
				itemClass = ' endRow';
			}
			// SET ITEM URL
			var itemURL = 'map.html?webmap=' + data.results[i].id;
			// IF IOS DEVICE
			if(ymConfig.agent_ios){
				// SHOW IOS LINK
				itemURL = 'arcgis://www.arcgis.com/sharing/content/items/' + data.results[i].id + '/data';
			}
			// BUILD LIST ITEM
			html += '<li class="item ' + itemClass + '"><a id="mapItem'+i+'" title="' + data.results[i].snippet + '" href="' + itemURL + '"><img src="' + obj.arcgispath + obj.imagepath + data.results[i].id + obj.imagepath2 + data.results[i].thumbnail + '" width="200" height="133"><span>' + itemTitle + '</span></a></li>';
		}
		// CLOSE LIST
		html += '</ul>';	
	}
	else{
		// NO RESULTS
		html += '<p>No maps were found.</p>';	
	}
	// INSERT TO HTML
	$('#featuredMaps').html(html);
	for(var i=0; i < forTotal; ++i) {
		document.getElementById("mapItem" + i).onclick = applink(ymConfig.iosAppURL);	
	}
	// IF PAGINATION IS NECESSARY
	createPagination(obj,totalItems,'#maps_pagination');
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	// CALL MAPS AND LAYERS QUERY ON PAGE LOAD. INITIAL QUERY
	queryMobileMaps();
	// FEATURED MAPS PAGINATION ONCLICK FUNCTION
	$('#maps_pagination ul li:not(.selected, .disabled) span').live('click',function() {
		// ADD LOADING SPINNER
		$('#maps_pagination ul').append('<li><span class="loadingAjax"></span></li>');
		// GET OFFSET NUMBER
        var data_offset = $(this).attr('data-offset');
		// QUERY MAPS FUNCTION
		queryMobileMaps(data_offset);
    });
	// END
});
// END