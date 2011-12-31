/*------------------------------------*/
// CONFIG VARIABLE
/*------------------------------------*/
var pmgConfig = {};
pmgConfig.version = 1.4;
pmgConfig.toolURL = 'http://www.esri.com/public-maps-gallery/group-id-tool/index.html';
pmgConfig.showVersion = false;
/*------------------------------------*/
// QUERY ARCGIS GROUP INFO
/*------------------------------------*/
function queryArcGISGroupInfo(obj){
	// DEFAULT VALUES
	var settings = {
		id_group : '',
		dataType : 'json',
		callback: null
    };
	// If options exist, lets merge them with our default settings
	if(obj) { 
		$.extend(settings,obj);
	}
	//EXAMPLE URL: http://www.arcgis.com/sharing/community/groups/2ecb37a8c8fb4051af9c086c25503bb0
	if(settings.id_group){
		var dataString = '';
		dataString += '&f=' + settings.dataType;
		// JQUERY AJAX FUNCTION CALL
		$.ajax({
			// AJAX URL
			url: pmgConfig.arcgisPortalURL + 'sharing/community/groups/' + settings.id_group,
			// DATA STRING WITH PARAMETERS
			data: dataString,
			// DATA TYPE
			dataType: 'jsonp',
			success: function(data, textStatus, jqXHR){
				// IF CALLBACK IS A FUNCTION
				if(typeof settings.callback == 'function'){
					// CALL CALLBACK FUNCTION WITH SETTINGS AND DATA
					settings.callback.call(this,settings,data);
				}
			}
		});
	}
}
/*------------------------------------*/
// QUERY ARCGIS FUNCTION: QUERIES ARCGIS FOR GROUP ITEMS
/*------------------------------------*/
/*
EXAMPLE URL
http://www.arcgis.com/sharing/search?q=group%3A%224a6f9fdc83ce44b6985115e4bd73cacd%22%20AND%20type%3A%22Web%20Map%22&f=json&sortField=title&sortOrder=asc&num=6&start=1
*/
function queryArcGISGroup(obj){
	// DEFAULT VALUES
	var settings = {
		// ARCGIS.COM URL
		arcgispath : pmgConfig.arcgisPortalURL,
		// SEARCH PATH
		searchpath : 'sharing/search',
		// IMAGE PATHS
		imagepath : 'sharing/content/items/',
		imagepath2 : '/info/',
		// SET GROUP ID FOR WEB MAPS
		id_group : '',
		// TYPE OF ITEM
		searchType : '',
		// ACCESS TYPE
		searchAccess : '',
		// FORMAT
		dataType : 'json',
		// SORTING COLUMN: The allowed field names are title, uploaded, type, owner, avgRating, numRatings, numComments and numViews.
		sortField : 'uploaded',
		// SORTING ORDER: Values: asc | desc
		sortOrder : 'desc',
		// IF PAGINATION
		pagination : true,
		// HOW MANY LINKS TO SHOW ON EACH SIDE OF PAGINATION
		paginationSize : 2,
		// SHOW FIRST AND LAST LINKS ON PAGINATION
		paginationShowFirstLast: true,
		// SHOW PREVIOUS AND NEXT LINKS
		paginationShowPrevNext: true,
		// SEARCH LIMIT
		perPage : '',
		// MAPS PER ROW
		perRow : '',
		// OFFSET
		searchStart : 1,
		// SEARCH KEYWORDS
		keywords : '',
		// STYLE OF LAYOUT FOR THE RESULTS
		layout: 'grid',
		// USE ARCGIS MOBILE APP LINKS WHEN ON A MOBILE DEVICE
		mobileAppLink: false,
		// CALLBACK FUNCTION WITH OBJECT
		callback: null
    };
	// If options exist, lets merge them with our default settings
	if(obj) { 
		$.extend(settings,obj);
	}
	if(settings.id_group){	
		// BUILD DATA STRING
		var dataString = '';
		dataString += 'q=group:"'+settings.id_group+'"';
		if(settings.keywords){
			dataString += ' AND (';
			dataString += ' title:"'+settings.keywords+'"';
			dataString += ' OR tags:"'+settings.keywords+'"';
			dataString += ' OR typeKeywords:"'+settings.keywords+'"';
			dataString += ' OR snippet:"'+settings.keywords+'"';
			dataString += ' ) ';
		}
		if(settings.searchType){
			dataString += ' AND type:"'+settings.searchType+'"';
		}
		if(settings.searchAccess){
			dataString += ' AND access:"'+settings.searchAccess+'"';
		}
		dataString += '&f='+settings.dataType;
		if(settings.sortField){
			dataString += '&sortField='+settings.sortField;
		}
		if(settings.sortOrder){
			dataString += '&sortOrder='+settings.sortOrder;
		}
		if(settings.perPage){
			dataString += '&num='+settings.perPage;
		}
		else{
			dataString += '&num=0';
		}
		if(settings.searchStart > 1){
			dataString += '&start='+(((settings.searchStart - 1) * settings.perPage) + 1);
		}
		// JQUERY AJAX FUNCTION CALL
		$.ajax({
			// AJAX URL
			url: settings.arcgispath + settings.searchpath,
			// DATA STRING WITH PARAMETERS
			data: dataString,
			// DATA TYPE
			dataType: 'jsonp',
			success: function(data, textStatus, jqXHR){
				// IF CALLBACK IS A FUNCTION
				if(typeof settings.callback == 'function'){
					// CALL CALLBACK FUNCTION WITH SETTINGS AND DATA
					settings.callback.call(this,settings,data);
				}
			}
		});
	}
}
/*------------------------------------*/
// CREATE PAGINATION FUNCTION
/*------------------------------------*/
function createPagination(obj,totalItems,pagObject){
	// IF PAGINATION IS NECESSARY
	if(obj.pagination && obj.perPage && totalItems > obj.perPage){
		// CREATE PAGINATION LIST
		var pagination = '<ul>';
		// DETERMINE OFFSET LINKS
		var current =  parseInt(obj.searchStart);
		var first = 1;
		var previous = current - 1;
		var next = current + 1;
		var last = Math.ceil(totalItems/obj.perPage);
		var shown = 0;
		// PAGINATION PREVIOUS
		if(obj.paginationShowPrevNext){
			var firstClass = 'disabled';
			if(obj.searchStart > 1){
				firstClass = '';
			}
			pagination += '<li title="Previous" class="previous '+firstClass+'" data-offset="'+ previous +'"><span class="arrowButton buttonLeft"><span></span></span></li>';
		}
		if(obj.paginationShowFirstLast && current > (obj.paginationSize + 1)){
			pagination += '<li title="First Page" data-offset="'+first+'"><span class="default">'+first+'</span></li><li><sub>&hellip;</sub></span></li>';
			shown = shown + 2;
		}
		// CREATE EACH PAGINATION ITEM
		for(var i=1; i <= last; ++i) {
			if(i <= (current + obj.paginationSize) && i >= (current - obj.paginationSize)){
				// CLASS
				var selectedClass = '';
				if(i == obj.searchStart){
					// IF SELECTED
					selectedClass = 'selected';
				}
				// PAGE LIST ITEM
				pagination += '<li title="Page '+i+'" data-offset="'+i+'" class="'+selectedClass+'"><span class="default">'+i+'</span></li>';
				shown++;
			}
		}
		// PAGINATION AFTER
		if(obj.paginationShowFirstLast && current < (last - obj.paginationSize)){
			pagination += '<li><sub>&hellip;</sub></span></li><li title="Last Page" data-offset="'+last+'"><span class="default">'+last+'</span></li>';
			shown = shown + 2;
		}
		// PAGINATION NEXT
		if(obj.paginationShowPrevNext){
			var lastClass = 'disabled';
			if(obj.searchStart < last){
				lastClass = '';
			}
			pagination += '<li title="Next" class="next '+lastClass+'" data-offset="'+next+'"><span class="arrowButton buttonRight"><span></span></span></li>';
		}
		// END PAGINATION
		pagination += '</ul><div class="clear"></div>';
		// INSERT INTO HTML
		$(pagObject).html(pagination).show();
	}
}
/*------------------------------------*/
// TRUNCATE FUNCTION: CLIPS TEXT TO DESIRED LENGTH
/*------------------------------------*/
function truncate(text, length, ellipsis) {
	var defaultLength = 100;
	if(!length){
		var length = defaultLength;
	}
	if(!ellipsis){
		var ellipsis = '&hellip;';
	}
	if(text.length < length) {
		return text;
	}
	else{
		for(var i = length-1; text.charAt(i) != ' ' && i >= 0; i--) {
			length--;
		}
		if(length <= 0){
			length = defaultLength;
		}
		return text.substr(0, length) + ellipsis;
	}
}
/*------------------------------------*/
// URL LOOKUP: GRABS PARAMETER VALUES FROM THE URL
/*------------------------------------*/
function URLLookup( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if (results === null) {
        return "";
    }
	return results[1];
}
/*------------------------------------*/
// DELAY FUNCTION
/*------------------------------------*/
var timer;
var delay = (function(){
	timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();
/*------------------------------------*/
// GET VIEWER URL TO USE
/*------------------------------------*/
function getViewerURL(){
	switch(pmgConfig.mapViewer){
		case 'arcgis':
			return pmgConfig.arcgisPortalURL + 'home/webmap/viewer.html?webmap=';
			break;
		case 'explorer':
			return 'http://explorer.arcgis.com/?open=';
			break;
		case 'simple':
			return 'map.html?webmap=';
			break;
		default:
			return 'map.html?webmap=';
	}
}