/*------------------------------------*/
// GLOBAL VARIABLES
/*------------------------------------*/
var searchVal = "";
var layoutType = pmgConfig.defaultLayout;
var dataOffset = 0;
var placeHolder;
var prevVal;
var ACObj;
var ACTimeout;
pmgConfig.pmgSubTitle = 'Home';
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
		id_group : pmgConfig.groupID,
		searchType : 'Web Map',
		sortField : pmgConfig.sortField,
		sortOrder : pmgConfig.sortOrder,
		pagination: pmgConfig.showPagination,
		paginationSize: 2,
		paginationShowFirstLast: true,
		paginationShowPrevNext: true,
		mobileAppLink: pmgConfig.mobileAppLink,
		keywords: keywords,
		perPage : pmgConfig.galleryPerPage,
		perRow : pmgConfig.galleryPerRow,
		layout: layoutType,
		searchStart : data_offset,
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			buildMapPlaylist(obj,data);
		}
	});
}
/*------------------------------------*/
// GROUP AUTO COMPLETE SEARCH
/*------------------------------------*/
function groupAutoComplete(acQuery){
	// CALL FEATURED MAPS FUNCTION
	queryArcGISGroup({
		// SETTINGS
		id_group : pmgConfig.groupID,
		searchType : 'Web Map',
		sortField : 'uploaded', // SORTING COLUMN: The allowed field names are title, uploaded, type, owner, avgRating, numRatings, numComments and numViews.
		sortOrder : 'desc', // SORTING ORDER: Values: asc | desc
		keywords: acQuery,
		perPage : 10,
		searchStart : 1,
		// EXECUTED AFTER AJAX IS RETURNED
		callback: function(obj,data){
			showGroupAutoComplete(obj,data);
		}
	});
}
/*------------------------------------*/
// SHOW AUTOCOMPLETE
/*------------------------------------*/
function showGroupAutoComplete(obj, data){
    var aResults = '';
    var partialMatch = $('#searchGroup').val();
    var regex = new RegExp('('+ partialMatch +')','gi');
    if(data.results !== null){
        ACObj = data.results;
        aResults += '<ul class="zebraStripes">';
        for(var i=0; i < data.results.length; ++i){
            var layerClass = '';
            if(i % 2 === 0){
                layerClass = '';
            }
            else{
                layerClass = 'stripe';
            }
          aResults += '<li tabindex="'+ (i + 2) +'" class="'+ layerClass +'">' +  data.results[i].title.replace(regex,'<span>' + partialMatch + '</span>')  + '</li>';
        }
        aResults += '</ul>';
        if(data.results.length > 0){
			$('#groupAutoComplete').html(aResults).show();
		}
		else{
			$('#groupAutoComplete').html('<p>No matches found.</p>').show();
			clearTimeout(ACTimeout);
			ACTimeout  = setTimeout(function(){
				$('#groupAutoComplete').hide();	
			},3000);
		}
    }
}
/*------------------------------------*/
// MAP PLAYLIST BUILD
/*------------------------------------*/
function buildMapPlaylist(obj,data){
	// REMOVE SPINNER
	$('.spinnerRemove').remove();
	// CLEAR PAGINATION
	$('#maps_pagination').html('');
	// HTML VARIABLE
	var html = '';
	// GET TOTAL RESULTS
	var totalItems = data.total;
	var totalResults = data.results.length;
	// IF WE HAVE ITEMS
	if(totalItems > 0){
		var layout = 'mapsGrid';
		if(obj.layout == 'list'){
			layout = 'mapsList';
		}
		// START OF UNORDERED LIST
		html += '<ul class="' + layout + '">';
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
			var appClass = '';
			// IF ITEM HAS URL
			if(data.results[i].url){
				var itemURL = data.results[i].url;
				appClass = 'Application';
			}
			else{
				// url variable
				var itemURL = getViewerURL() + data.results[i].id;
				// if mobile
				if(isMobileUser() && obj.mobileAppLink && pmgConfig.appCookie == 'installed'){
					itemURL = getMobileAppURL(data.results[i].id);
				}
			}
			if(obj.layout == 'list'){
				var itemTitle = truncate(data.results[i].title, 100);
				var snippet = '';
				if(data.results[i].snippet){
					snippet = data.results[i].snippet;
				}
				var linkTarget = '';
				if(pmgConfig.openGalleryNewWindow){
					linkTarget = 'target="_blank"';
				}
				// BUILD LIST ITEM
				html += '<li class="item ' + appClass + '"><a ' + linkTarget + ' class="block" id="mapItem'+i+'" title="' + snippet + '" href="' + itemURL + '"><img src="' + obj.arcgispath + obj.imagepath + data.results[i].id + obj.imagepath2 + data.results[i].thumbnail + '?token=' + obj.token + '" width="200" height="133"></a><a ' + linkTarget + ' class="title" id="mapItemLink'+i+'" title="' + snippet + '" href="' + itemURL + '"><strong>' + itemTitle + '</strong></a><p>' + snippet + '</p><p><a ' + linkTarget + ' class="viewMap" title="View map" href="' + itemURL + '">View map<span class="arrow"></span></a></p><div class="clear"></div></li>';
			}
			else{
				var endRow = false;
				var itemClass = '';
				var itemTitle = truncate(data.results[i].title, 25);
				var snippet = '';
				if(data.results[i].snippet){
					snippet = data.results[i].snippet;
				}
				var linkTarget = '';
				if(pmgConfig.openGalleryNewWindow){
					linkTarget = 'target="_blank"';
				}
				// LAST ROW ITEM
				if((i + 1) % obj.perRow == 0){
					itemClass = ' endRow';
					endRow = true;
				}
				// BUILD LIST ITEM
				html += '<li class="item ' + appClass + ' ' + itemClass + '">';
				html += '<a ' + linkTarget + ' id="mapItem'+i+'" title="' + snippet + '" href="' + itemURL + '"><img src="' + obj.arcgispath + obj.imagepath + data.results[i].id + obj.imagepath2 + data.results[i].thumbnail + '?token=' + obj.token + '" width="200" height="133"><span>' + itemTitle + '</span></a>';
				html += '</li>';
				if(endRow){
					html += '<li class="clear"></li>';
				}
			}
		}
		// CLOSE LIST
		html += '</ul><div class="clear"></div>';
	}
	else{
		// NO RESULTS
		html += '<p>No maps were found. <a id="resetGroupSearch">Show all maps</a>.</p><div class="clear"></div>';
	}
	// INSERT TO HTML
	$('#featuredMaps').html(html);
	// CREATE PAGINATION
	createPagination(obj,totalItems,'#maps_pagination');
}
/*------------------------------------*/
// ENABLE LAYOUT OR SEARCH OPTIONS
/*------------------------------------*/
function configLayoutSearch(){
	if(pmgConfig.showGroupSearch || pmgConfig.showLayoutSwitch){
		var html = '<ul class="searchList">';
		if(pmgConfig.showGroupSearch){
			html += '<li id="mapSearch" class="iconInput"><div title="Clear" class="iconReset" id="clearAddress"></div><input placeholder="Search maps" id="searchGroup" title="Search this group" value="" autocomplete="off" type="text" tabindex="1"></li><li title="Search" class="searchButtonLi"><span id="searchGroupButton" class="silverButton buttonRight"><span class="searchButton"></span></span> </li>';	
		}
		if(pmgConfig.showLayoutSwitch){
			switch(pmgConfig.defaultLayout){
				case 'list':
					var listClass = 'active';
					var gridClass = '';	
					break;
				default:
					var listClass = '';
					var gridClass = 'active';
			}
			html += '<li class="toggleLayout"><ul ><li id="layoutGrid" class="'+gridClass+'" title="Switch to Grid View"><span class="silverButton buttonLeft"><span class="gridView"></span></span></li><li id="layoutList" class="'+listClass+'" title="Switch to List View"><span class="silverButton buttonRight"><span class="listView"></span></span></li></ul></li>';	
		}
		html += '</ul><div class="clear"></div>';
		$('#layoutAndSearch').html(html);
		if(pmgConfig.showGroupSearch){
			$('#layoutAndSearch').append('<div id="acCon"><div id="groupAutoComplete" class="autoComplete"></div></div><div class="clear"></div>');
		}
	}
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	// check for mobile cookie	
	checkMobileCookie();
	// GROUP ID CHECK
	if(!pmgConfig.groupID){
		alert('Please enter a group ID in the required settings config.');
		window.location = pmgConfig.toolURL;
	}
	// CALL MAPS QUERY ON PAGE LOAD. INITIAL QUERY
	queryMaps();
	// CONFIGURE LIST/GRID AND SEARCH
	configLayoutSearch();
	// SET PLACEHOLDER
	placeHolder = $('#searchGroup').attr('placeholder');
	// FEATURED MAPS PAGINATION ONCLICK FUNCTION
	$(document).on('click','#maps_pagination ul li:not(.selected, .disabled, .clicked)[data-offset]',function(event) {
		// CLICKED
		$(this).addClass('clicked');
		// ADD LOADING SPINNER
		$('#maps_pagination ul').append('<li><span class="loadingAjax"></span></li>');
		// GET OFFSET NUMBER
        var data_offset = $(this).attr('data-offset');
		dataOffset = data_offset;
		// QUERY MAPS FUNCTION
		queryMaps(data_offset,searchVal);
    });
	// SEARCH BUTTON
	$(document).on('click','#searchGroupButton',function(event) {
		var textVal = $('#searchGroup').val();
		if(textVal != placeHolder && textVal != prevVal){
			searchVal = textVal;
			$('.toggleLayout').before('<li class="spinnerRemove"><span class="loadingAjax"></span></li>');
			queryMaps(1,textVal);
			prevVal = searchVal;
		}
	});
	// SEARCH RESET BUTTON
	$(document).on('click','#clearAddress, #resetGroupSearch',function(event) {
		$('#clearAddress').removeClass('resetActive');
		$('#searchGroup').val("");
		searchVal = '';
		$('.toggleLayout').before('<li class="spinnerRemove"><span class="loadingAjax"></span></li>');
		queryMaps(1,'');
		prevVal = searchVal;
		$('#groupAutoComplete').hide();
	});
	// LIST VIEW
	$(document).on('click','#layoutList',function(event) {
		if(layoutType != 'list'){
			layoutType = 'list';
			$('.toggleLayout li').removeClass('active');
			$(this).addClass('active');
			$('.toggleLayout').before('<li class="spinnerRemove"><span class="loadingAjax"></span></li>');
			queryMaps(dataOffset,searchVal);
		}
	});
	// GRID VIEW
	$(document).on('click','#layoutGrid',function(event) {
		if(layoutType != 'grid'){
			layoutType = 'grid';
			$('.toggleLayout li').removeClass('active');
			$(this).addClass('active');
			$('.toggleLayout').before('<li class="spinnerRemove"><span class="loadingAjax"></span></li>');
			queryMaps(dataOffset,searchVal);
		}
	});
	/*------------------------------------*/
	// SEARCH BOX JAVASCRIPT
	/*------------------------------------*/
	// CLEAR ADDRESS FUNCTION THAT REMOVES BUTTON AS WELL
	function clearAddress(obj){
		$(obj).val('');
		var iconReset = $(obj).prev('.iconReset');
		iconReset.removeClass('resetActive');
		$(obj).addClass('default');
	}
	// CHECKS TO SEE IF ADDRESS IS POPULATED
	function checkAddressStatus(obj){
		var cAVal = $(obj).val();
		var iconReset = $(obj).prev('.iconReset');
		if(cAVal !== ''){
			iconReset.addClass('resetActive');
		}
	}
	$(document).on('focusin','.iconInput input',function(event) {
		var cAVal2 = $(this).val();
		var $searchDefault = $(this).attr('placeholder');
		if(cAVal2 == $searchDefault){
			clearAddress(this);
		}
	});
	$(document).on('focusout','.iconInput input',function(event) {
		var cAVal2 = $(this).val();
		var $searchDefault = $(this).attr('placeholder');
		if(cAVal2 === ''){
			clearAddress(this);
			$(this).val($searchDefault);
		}
	});
	// LISTENER FOR ADDRESS KEY UP
	$('.iconInput input').keyup(function(e) {
		checkAddressStatus(this);
	});
	$(document).on('click','.iconInput .iconReset',function(event) {
		var obj = $(this).nextAll('input');
		clearAddress(obj);
	});
	/*------------------------------------*/
	// AUTO COMPLETE && ADDRESS SPECIFIC ACTION LISTENERS
	/*------------------------------------*/
	$('#searchGroup').keyup(function(e){
		var aquery = $(this).val();
		var alength = aquery.length;
		var $searchDefault = $(this).attr('placeholder');
		if(e.keyCode == 13 && $(this).val()!==$searchDefault && $(this).val()!=='') {
			clearTimeout (timer);
			var textVal = $(this).val();
			if(textVal != placeHolder && textVal != prevVal){
				searchVal = textVal;
				$('.toggleLayout').before('<li class="spinnerRemove"><span class="loadingAjax"></span></li>');
				queryMaps(1,textVal);
				prevVal = searchVal;
			}
			$('#groupAutoComplete').hide();
		}
		else if(e.keyCode == 38) {
			$('#groupAutoComplete li:last').focus();
		}
		else if(e.keyCode == 40) {
			$('#groupAutoComplete li:first').focus();
		}
		else if(alength >= 2){
			delay(function(){
				groupAutoComplete(aquery);
			},250);
		}
		else{
			$('#groupAutoComplete').hide();
		}
	});
	$(document).on('click','#groupAutoComplete ul li',function(event) {
		// hide auto complete
		$('#groupAutoComplete').hide();
		// GET RESULT NUMBER
		var locNum = $('#groupAutoComplete ul li').index(this);
		// IF MAP HAS A URL
		if(ACObj[locNum].url){
			var mapURL = ACObj[locNum].url;
		}
		else{		
			// ITEM URL
			var mapURL = getViewerURL() + ACObj[locNum].id;
		}
		// LOAD MAP
		window.location = mapURL;
	});
	$(document).on('keypress','#groupAutoComplete ul li',function(e) {
		if(e.type == 'keypress' && e.keyCode == 13) {
			// hide auto complete
			$('#groupAutoComplete').hide();
			// GET RESULT NUMBER
			var locNum = $('#groupAutoComplete ul li').index(this);
			// IF MAP HAS A URL
			if(ACObj[locNum].url){
				var mapURL = ACObj[locNum].url;
			}
			else{
				// ITEM URL
				var mapURL = getViewerURL() + ACObj[locNum].id;
			}
			// LOAD MAP
			window.location = mapURL;
		}
		else if(e.type == 'keypress' && e.keyCode == 40) {
			$(this).next('li').focus();
		}
		else if(e.type == 'keypress' && e.keyCode == 38) {
			$(this).prev('li').focus();
		}
	});
	// END
});
// END
$(document).ready(function(){
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		  }
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  $(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
			  input.val('');
			}
		  })
		});
	}
});