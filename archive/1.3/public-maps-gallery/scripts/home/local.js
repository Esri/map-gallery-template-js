/*------------------------------------*/
// GLOBAL VARIABLES
/*------------------------------------*/
var searchVal = "";
/*------------------------------------*/
// QUERY FEATURED MAPS
/*------------------------------------*/
function queryMaps(data_offset,keywords){
	// IF OFFSET IS UNDEFINED, SET TO 1
	if(!data_offset) {
		var data_offset = 1;
	}
	if(!keywords) {
		var keywords = '';
	}
	// CALL FEATURED MAPS FUNCTION
	queryArcGISGroup({
		// SETTINGS
		id_group : ymConfig.mapsGroupID,
		searchType : 'Web Map',
		sortField : 'uploaded',
		sortOrder : 'desc',
		pagination: true,
		keywords: keywords,
		perPage : 9,
		perRow : 3,
		searchStart : data_offset,
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			buildMapPlaylist(obj,data);
		}
	});
}
/*------------------------------------*/
// QUERY LAYERS
/*------------------------------------*/
function queryLayers(data_offset){
	// IF OFFSET IS UNDEFINED, SET TO 1
	if(!data_offset) {
		var data_offset = 1;
	}
	// CALL LAYERS FUNCTION
	queryArcGISGroup({
		// SETTINGS
		id_group : ymConfig.layersGroupID,
		sortField : 'title',
		searchType : 'Layer',
		perPage : 10,
		pagination: true,
		paginationShowPrevNext: false,
		searchStart : data_offset,
		sortOrder : 'asc',
		paginationShowFirstLast: false,
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			buildLayers(obj,data);
		}
	});
}
/*------------------------------------*/
// MAP PLAYLIST BUILD
/*------------------------------------*/
function buildMapPlaylist(obj,data){
	// CLEAR PAGINATION
	$('#maps_pagination').html('');
	// HTML VARIABLE
	var html = '';
	// GET TOTAL RESULTS
	var totalItems = data.total;
	var totalResults = data.results.length;
	// IF WE HAVE ITEMS
	if(totalItems > 0){
		// START OF UNORDERED LIST
		html += '<ul class="featuredMaps">';
		// IF PERPAGE IS MORE THAN TOTAL
		var fortotal;
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
			// BUILD LIST ITEM
			html += '<li class="item ' + itemClass + '"><a title="' + data.results[i].snippet + '" href="map.html?webmap=' + data.results[i].id + '"><img src="' + obj.arcgispath + obj.imagepath + data.results[i].id + obj.imagepath2 + data.results[i].thumbnail + '" width="200" height="133"><span>' + itemTitle + '</span></a></li>';
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
	// CREATE PAGINATION
	createPagination(obj,totalItems,'#maps_pagination');
}
/*------------------------------------*/
// BUILD LAYERS
/*------------------------------------*/
function buildLayers(obj,data){
	// CLEAR PAGINATION
	$('#featuredLayers').html('');
	// HTML VARIABLE
	var html = '';
	// GET DATA TOTAL
	var totalItems = data.total;
	var totalResults = data.results.length;
	// IF MORE THAN 0
	if(totalItems > 0){
		// START LIST
		html +=  '<ul>';
		// IF PERPAGE IS MORE THAN TOTAL
		var fortotal;
		if(obj.pagination && obj.perPage && obj.perPage < totalResults){
			// USE PER PAGE
			forTotal = obj.perPage;	
		}
		else{
			// USE TOTAL
			forTotal = totalResults;
		}
		// CREATE LIST
		for(var i=0; i < forTotal; ++i) {
			// BUILD LIST ITEM
			html += '<li><a title="' + data.results[i].snippet + '" href="'+obj.arcgispath+'home/item.html?id=' + data.results[i].id + '">' + data.results[i].title + '</span></a></li>';
		}
		// CLOSE LIST
		html += '</ul>';
		// CREATE PAGINATOIN
		createPagination(obj,totalItems,'#layers_pagination');
	}
	else{
		// NO RESULTS
		html += '<p>No layers were found.</p>';	
	}
	// INSERT TO HTML
	$('#featuredLayers').html(html);
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	// CALL MAPS AND LAYERS QUERY ON PAGE LOAD. INITIAL QUERY
	queryMaps();
	queryLayers();
	// FEATURED MAPS PAGINATION ONCLICK FUNCTION
	$('#maps_pagination ul li:not(.selected, .disabled) span').live('click',function() {
		// ADD LOADING SPINNER
		$('#maps_pagination ul').append('<li><span class="loadingAjax"></span></li>');
		// GET OFFSET NUMBER
        var data_offset = $(this).attr('data-offset');
		// QUERY MAPS FUNCTION
		queryMaps(data_offset,searchVal);
    });
	// LAYERS PAGINATION ONCLICK FUNCTION
	$('#layers_pagination ul li:not(.selected, .disabled) span').live('click',function() {
		// ADD LOADING SPINNER
		$('#layers_pagination ul').append('<li><span class="loadingAjax"></span></li>');
		// GET OFFSET NUMBER
        var data_offset = $(this).attr('data-offset');
		// QUERY LAYERS FUNCTION
		queryLayers(data_offset);
    });
	// ARCGIS SEARCH
	$('#searchGroup').bind('keypress', function(e){
		if(e.keyCode==13){
			var textVal = $(this).val();
			searchVal = textVal;
			queryMaps(1,textVal);
		}
	});
	// SEARCH BUTTON
	$('#searchGroupButton').live('click',function(){
		var textVal = $('#searchGroup').val();
		if(textVal){
			searchVal = textVal;
			queryMaps(1,textVal);
		}
	});
	// SEARCH RESET BUTTON
	$('#searchResetButton').live('click',function(){
		$('#searchGroup').val("");
		searchVal = "";
		queryMaps(1);
	});
	// END
});
// END