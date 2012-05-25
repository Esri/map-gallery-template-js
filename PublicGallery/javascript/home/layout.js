// Dojo Requires
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.Portal");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojox.NodeList.delegate");
dojo.require("dijit.Dialog");
dojo.require("dojo.cookie");
dojo.require("dojo.io.script");
dojo.require("dojo.number");
/*------------------------------------*/
// on dojo load
/*------------------------------------*/
dojo.addOnLoad(function(){
	// set default configuration options
	setDefaultConfigOptions();
	// set app ID settings and call init after
	setAppIdSettings(function(){
		// create portal
		createPortal(function(){
			init();
		});
	});
});
/*------------------------------------*/
// On sort button click
/*------------------------------------*/
function buildSortingMenu(){
	// sorting fields
	var sortFields = [
		{
			"title":"Date",
			"field":"created",
			"defaultOrder":"desc"
		},
		{
			"title":"Title",
			"field":"title",
			"defaultOrder":"asc"
		},
		{
			"title":"Type",
			"field":"type",
			"defaultOrder":"asc"
		},
		{
			"title":"Owner",
			"field":"owner",
			"defaultOrder":"asc"
		},
		{
			"title":"Rating",
			"field":"avgRating",
			"defaultOrder":"desc"
		},
		{
			"title":"Comments",
			"field":"numComments",
			"defaultOrder":"desc"
		},
		{
			"title":"Views",
			"field":"numViews",
			"defaultOrder":"desc"
		}
	];
	// html variable
	var html = '';
	html += '<div class="grid_9 alpha omega">';
		html += '<ul id="sortGallery">';
			html += '<li class="label"><span>Sort By</span></li>';
			// for each sort field
			for(var i = 0; i < sortFields.length; i++){
				// variables
				var selectedClass = '', buttonClass = '';
				// if first button
				if(i == 0){
					buttonClass = ' buttonLeft';
				}
				// if last button
				if(i == (sortFields.length - 1)){
					buttonClass = ' buttonRight';
				}
				// if default selected button
				if(sortFields[i].field === configOptions.sortField){
					selectedClass = sortFields[i].defaultOrder + ' active';
				}
				// button html
				html += '<li class="' + selectedClass + '" data-default-order="' + sortFields[i].defaultOrder + '" data-sort-field="' + sortFields[i].field + '"><span class="silverButton' + buttonClass + '">' + sortFields[i].title + '<span class="arrow"></span></span></li>';
			}
		html += '</ul>';
	html += '</div>';
	html += '<div class="clear"></div>';
	// html node
	var node = dojo.query("#groupSortOptions");
	// if node exists
	if(node.length > 0){
		// insert html
		node.innerHTML(html);
	}
	// toggle basemap button
	dojo.query(document).delegate("#sortGallery li", "onclick", function(event){
		// get nodes
		var buttonNode = dojo.query(this);
		var node = dojo.query('#sortGallery')[0];
		// if they exist
		if(node && buttonNode){
			// 
			var sortColumn = buttonNode.attr("data-sort-field")[0];
			var defaultOrder = buttonNode.attr("data-default-order")[0];
			var sortOrder = buttonNode.attr("data-sort-order")[0];
			// sort field
			configOptions.sortField = sortColumn;
			// sort order
			if(sortOrder){
				configOptions.sortOrder = reverseSortOrder(sortOrder);
			}
			else{
				configOptions.sortOrder = defaultOrder;
			}
			// set sort order
			buttonNode.attr("data-sort-order", configOptions.sortOrder);
			dojo.query('#sortGallery li').removeClass('asc desc active');
			buttonNode.addClass(configOptions.sortOrder + ' active');
			// get maps
			queryMaps();
		}
    });
}
/*------------------------------------*/
// QUERY FEATURED MAPS
/*------------------------------------*/
function queryMaps(data_offset,keywords){
	// If no offest, set to 1
	if(!data_offset) {
		data_offset = 1;
	}
	// If no keywords
	if(!keywords) {
		keywords = '';
	}
	// Call featured maps
	queryArcGISGroupItems({
		// Settings
		id_group : configOptions.group.id,
		searchType : configOptions.searchType,
		sortField : configOptions.sortField,
		sortOrder : configOptions.sortOrder,
		pagination: configOptions.showPagination,
		paginationShowFirstLast: true,
		paginationShowPrevNext: true,
		mobileAppUrl: configOptions.mobileAppUrl,
		keywords: keywords,
		perPage : parseInt(configOptions.galleryItemsPerPage, 10),
		perRow : parseInt(configOptions.galleryPerRow, 10),
		layout: configOptions.defaultLayout,
		searchStart : data_offset,
		// Executed after ajax is returned
		callback: function(obj,data){
			// Build featured items
			buildMapPlaylist(obj,data);
		}
	});
}
/*------------------------------------*/
// Insert Home Content
/*------------------------------------*/
function insertHomeContent(){
	// Set home heading
	if(configOptions.homeHeading){
		node = dojo.query("#homeHeading");
		if(node.length > 0){
			node.innerHTML(configOptions.homeHeading);
		}
	}
	// Set home intro text
	if(configOptions.homeSnippet){
		node = dojo.query("#homeSnippet");
		if(node.length > 0){
			node.innerHTML(configOptions.homeSnippet);
		}
	}
	// Set home right heading
	if(configOptions.homeSideHeading){
		node = dojo.query("#homeSideHeading");
		if(node.length > 0){
			node.innerHTML(configOptions.homeSideHeading);
		}
	}
	// Set home right content
	if(configOptions.homeSideContent){
		node = dojo.query("#homeSideContent");
		if(node.length > 0){
			node.innerHTML(configOptions.homeSideContent);
		}
	}
}
/*------------------------------------*/
// Group auto-complete search
/*------------------------------------*/
function groupAutoComplete(acQuery){
	// Called when searching (Autocomplete)
	queryArcGISGroupItems({
		// Settings
		id_group : configOptions.group.id,
		searchType : configOptions.searchType,
		sortField : configOptions.sortField, // SORTING COLUMN: The allowed field names are title, created, type, owner, avgRating, numRatings, numComments and numViews.
		sortOrder : configOptions.sortOrder, // SORTING ORDER: Values: asc | desc
		keywords: acQuery,
		perPage : 10,
		searchStart : 1,
		// Executed after ajax is returned
		callback: function(obj,data){
			// Show auto-complete
			showGroupAutoComplete(obj,data);
		}
	});
}
/*------------------------------------*/
// Hide auto-complete
/*------------------------------------*/
function hideGroupAutoComplete(){
	dojo.query("#searchListUL").removeClass('autoCompleteOpen');
	dojo.query("#groupAutoComplete").style('display','none');
}
/*------------------------------------*/
// Show auto-complete
/*------------------------------------*/
function showGroupAutoComplete(obj, data){
    var aResults = '';
	var node;
    var partialMatch = dojo.query("#searchGroup").attr('value')[0];
    var regex = new RegExp('(' + partialMatch + ')','gi');
    if(data.results !== null){
		dojo.query(".searchList").addClass('autoCompleteOpen');
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
          aResults += '<li tabindex="' + (i + 2) + '" class="' + layerClass + '">' +  data.results[i].title.replace(regex,'<span>' + partialMatch + '</span>')  + '</li>';
        }
        aResults += '</ul>';
        if(data.results.length > 0){
			node = dojo.query("#groupAutoComplete");
			if(node.length > 0){
				node.innerHTML(aResults).style('display','block');
			}
		}
		else{
			node = dojo.query("#groupAutoComplete");
			if(node.length > 0){
				node.innerHTML('<p>' + i18n.viewer.errors.noMatches + '</p>').style('display','block');
			}
			clearTimeout(ACTimeout);
			ACTimeout  = setTimeout(function(){
				hideGroupAutoComplete();
			},3000);
		}
    }
}
/*------------------------------------*/
// Build Map Playlist
/*------------------------------------*/
function buildMapPlaylist(obj,data){
	// hide auto complete
	hideGroupAutoComplete();
	// Remove Spinner
	removeSpinner();
	// Clear Pagination
	var node = dojo.query("#maps_pagination");
	if(node.length > 0){
		node.innerHTML('');
	}
	// HTML Variable
	var html = '';
	// Get total results
	var totalItems = data.total;
	var totalResults = data.results.length;
	var layout;
	// If we have items
	if(totalItems > 0){
		layout = 'mapsGrid';
		if(obj.layout === 'list'){
			layout = 'mapsList';
		}
		// If perpage is more than total
		var fortotal;
		if(obj.pagination && obj.perPage && obj.perPage < totalResults){
			// Use per page
			forTotal = obj.perPage;	
		}
		else{
			// Use total
			forTotal = totalResults;
		}
		// Create list items
		for(var i=0; i < forTotal; ++i) {
			//	TODO
			if(configOptions.development){
				if(i === 0 || i === (forTotal - 1)){
					if(i === 0){
						console.log('------- FIRST ----------');
					}
					else{
						console.log('-------- LAST ---------');
					}
					console.log(i);
					console.log(data.results[i]);
					console.log('Views: ' + data.results[i].numViews);
					console.log('Comments: ' + data.results[i].numComments);
					console.log('Created: ' + data.results[i].created);
					console.log('Rating: ' + data.results[i].avgRating);
					console.log('Owner: ' + data.results[i].owner);
					console.log('Type: ' + data.results[i].type);
				}
			}
			var appClass = '';
			var itemTitle;
			var itemURL;
			var snippet;
			var linkTarget;
			var externalLink = false;
			// If item has URL
			if(data.results[i].url){
				itemURL = data.results[i].url;
				appClass = ' externalLink';
				externalLink = true;
			}
			else{
				// url variable
				itemURL = getViewerURL('simple', data.results[i].id);
				// if mobile
				if(isMobileUser() && obj.mobileAppUrl && configOptions.appCookie === 'installed'){
					itemURL = getViewerURL('mobile', data.results[i].id);
				}
			}
			if(obj.layout === 'list'){
				itemTitle = data.results[i].title;
				snippet = '';
				if(data.results[i].snippet){
					snippet = data.results[i].snippet;
				}
				linkTarget = '';
				if(configOptions.openGalleryItemsNewWindow || externalLink){
					linkTarget = 'target="_blank"';
				}
				// Build list item
				html += '<div class="grid_9 alpha omega">';
					html += '<div class="item' + appClass + '">';
						html += '<a ' + linkTarget + ' class="block" id="mapItem' + i + '" title="' + snippet + '" href="' + itemURL + '">';
						if(externalLink){
							html += '<span class="externalIcon"></span>';
						}
						html += '<img src="' + configOptions.sharingurl + "/" + data.results[i].id + "/info/" + data.results[i].thumbnail + '" width="200" height="133" />';
						html += '</a>';
						html += '<div class="itemInfo">';
						html += '<a ' + linkTarget + ' class="title" id="mapItemLink' + i + '" title="' + snippet + '" href="' + itemURL + '"><strong>' + itemTitle + '</strong></a>';
						html += '<p>' + snippet + '</p>';
						//	TODO
						if(configOptions.development){
							html += '<p>';
							html += data.results[i].numViews;
							html += data.results[i].numComments;
							//html +=  data.results[i].created;
							html += data.results[i].avgRating;
							//html += data.results[i].owner;
							html += data.results[i].type;
							html += '</p>';
						}
						html += '<p><a ' + linkTarget + ' class="viewMap" title="' + i18n.viewer.groupPage.itemTitle + '" href="' + itemURL + '">' + i18n.viewer.groupPage.itemTitle + '<span class="arrow"></span></a></p>';
						html += '</div>';
						html += '<div class="clear"></div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';
			}
			else{
				var endRow = false, frontRow = false;
				var itemClass = '';
				itemTitle = data.results[i].title;
				snippet = '';
				if(data.results[i].snippet){
					snippet = data.results[i].snippet;
				}
				linkTarget = '';
				if(configOptions.openGalleryItemsNewWindow || externalLink){
					linkTarget = 'target="_blank"';
				}
				// Last row item
				if((i + 1) % obj.perRow === 0){
					itemClass = ' omega';
					endRow = true;
				}
				// First row item
				if((i + 3) % obj.perRow === 0){
					itemClass = ' alpha';
					frontRow = true;
				}
				// Build grid item
				html += '<div class="grid_3' + itemClass + '">';
					html += '<div class="item' + appClass + '">';
						html += '<a ' + linkTarget + ' id="mapItem' + i + '" title="' + snippet + '" href="' + itemURL + '">';
							if(externalLink){
								html += '<span class="externalIcon"></span>';
							}
							html += '<img src="' + configOptions.sharingurl + "/" + data.results[i].id + "/info/" + data.results[i].thumbnail + '" width="200" height="133" />';
							html += '<span>' + itemTitle + '</span>';
						html += '</a>';
					html += '</div>';
				html += '</div>';
				if(endRow){
					html += '<div class="clear"></div>';
				}
			}
		}
		// Close
		html += '<div class="clear"></div>';
	}
	else{
		// No results
		html += '<div class="grid_5 suffix_4 alpha omega"><p class="alert error">' + i18n.viewer.errors.noMapsFound + ' <a id="resetGroupSearch">' + i18n.viewer.groupPage.showAllMaps + '</a></p></div>';
		html += '<div class="clear"></div>';
	}
	// Insert HTML
	node = dojo.query("#featuredMaps");
	if(node.length > 0){
		node.removeClass('mapsGrid mapsList').addClass(layout).innerHTML(html);
	}
	// Create pagination
	createPagination(obj,totalItems,'#maps_pagination');
}
/*------------------------------------*/
// Enalbe layout and search options
/*------------------------------------*/
function configLayoutSearch(){
	// if show search or show layout switch
	if(configOptions.showGroupSearch || configOptions.showLayoutSwitch){
		// create HTML
		var html = '';
		html += '<div id="searchListCon" class="grid_5 alpha">';
		html += '<ul id="searchListUL" class="searchList">';
		// if show search
		if(configOptions.showGroupSearch){
			html += '<li id="mapSearch" class="iconInput">';	
			html += '<div title="' + i18n.viewer.main.clearSearch + '" class="iconReset" id="clearAddress"></div>';	
			html += '<input placeholder="' + i18n.viewer.groupPage.searchPlaceholder + '" id="searchGroup" title="' + i18n.viewer.groupPage.searchTitle + '" value="" autocomplete="off" type="text" tabindex="1" />';	
			html += '</li>';
			html += '<li title="' + i18n.viewer.groupPage.searchTitleShort + '" class="searchButtonLi">';	
			html += '<span id="searchGroupButton" class="silverButton buttonRight">';
			html += '<span class="searchButton"></span></span>';
			html += '</li>';
			html += '<li id="groupSpinner" class="spinnerCon"></li>';
		}
		html += '</ul>';
		html += '<div class="clear"></div>';
		html += '</div>';
		// if show switch
		var listClass, gridClass;
		if(configOptions.showLayoutSwitch){
			if(configOptions.defaultLayout === "list"){
				listClass = 'active';
				gridClass = '';	
			}
			else{
				listClass = '';
				gridClass = 'active';
			}
			html += '<div class="grid_4 omega">';
			html += '<div class="toggleLayout">';
			html += '<ul>';
			html += '<li id="layoutSpinner" class="spinnerCon"></li>';
			html += '<li id="layoutGrid" class="' + gridClass + '" title="' + i18n.viewer.groupPage.gridSwitch + '">';
			html += '<span class="silverButton buttonLeft"><span class="gridView"></span></span>';
			html += '</li>';
			html += '<li id="layoutList" class="' + listClass + '" title="' + i18n.viewer.groupPage.listSwitch + '">';
			html += '<span class="silverButton buttonRight"><span class="listView"></span></span>';
			html += '</li>';
			html += '</ul>';
			html += '</div>';
			html += '<div class="clear"></div>';
			html += '</div>';
		}
		html += '<div class="clear"></div>';
		// if node, insert HTML
		var node = dojo.query("#layoutAndSearch");
		if(node.length > 0){
			node.innerHTML(html);
		}
		// if show search
		if(configOptions.showGroupSearch){
			dojo.place('<div id="acCon"><div id="groupAutoComplete" class="autoComplete"></div></div><div class="clear"></div>', "searchListCon", "last");
		}
	}
}
/*------------------------------------*/
// Init
/*------------------------------------*/
function init(){
	// set up params
	configUrlParams();
	// set default data offset
	if(!dataOffset){
		dataOffset = 0;
	}	
	// set loading text
	var node = dojo.query(".featuredLoading");
	if(node.length > 0){
		node.innerHTML(i18n.viewer.groupPage.loadingText);
	}
	// check for mobile cookie	
	checkMobileCookie();
	// Query group and then query maps
	queryGroup(function(){
		// insert home items
		insertHomeContent();
		// query for maps
		queryMaps();
	});
	// Configure grid/list and search
	configLayoutSearch();
	// Set placeholder
	var theNode = dojo.query('#searchGroup')[0];
	// Featured maps pagination onclick function
	dojo.query('#maps_pagination').delegate("ul li[data-offset]:not(.selected):not(.disabled):not(.clicked)", "onclick", function(event){
		// clicked
		dojo.query(this).addClass('clicked');
		var placeDom = dojo.query("#maps_pagination ul");
		// add loading spinner
		addSpinner("#paginationSpinner");
		// get offset number
        var data_offset = dojo.query(this).attr('data-offset')[0];
		dataOffset = data_offset;
		// query maps function
		queryMaps(data_offset,searchVal);
    });
	// search button
	dojo.query(document).delegate("#searchGroupButton", "onclick", function(event){
		var textVal = dojo.query("#searchGroup").attr('value')[0];
		if(textVal !== prevVal){
			searchVal = textVal;
			addSpinner("#groupSpinner");
			queryMaps(1,textVal);
			prevVal = searchVal;
		}
	});
	// search reset button
	dojo.query(document).delegate("#clearAddress, #resetGroupSearch", "onclick", function(event){
		dojo.query('#clearAddress').removeClass('resetActive');
		dojo.query("#searchGroup").attr('value', '');
		searchVal = '';
		addSpinner("#groupSpinner");
		queryMaps(1,'');
		prevVal = searchVal;
		hideGroupAutoComplete();
	});
	// list view
	dojo.query(document).delegate("#layoutList", "onclick", function(event){
		if(configOptions.defaultLayout !== 'list'){
			configOptions.defaultLayout = 'list';
			dojo.query('.toggleLayout li').removeClass('active');
			dojo.query(this).addClass('active');
			addSpinner("#layoutSpinner");
			queryMaps(dataOffset,searchVal);
		}
	});
	// grid view
	dojo.query(document).delegate("#layoutGrid", "onclick", function(event){
		if(configOptions.defaultLayout !== 'grid'){
			configOptions.defaultLayout = 'grid';
			dojo.query('.toggleLayout li').removeClass('active');
			dojo.query(this).addClass('active');
			addSpinner("#layoutSpinner");
			queryMaps(dataOffset,searchVal);
		}
	});
	// listener for address key up
	dojo.query(document).delegate(".iconInput input", "onkeyup", function(e){
		checkAddressStatus(this);
	});
	// Reset X click
	dojo.query(document).delegate(".iconInput .iconReset", "onclick", function(event){
		var obj = dojo.query(this).nextAll('input');
		clearAddress(obj);
	});
	// auto complete && address specific action listeners
	dojo.query(document).delegate("#searchGroup", "onkeyup", function(e){
		var aquery = dojo.query(this).attr('value')[0];
		var alength = aquery.length;
		if(e.keyCode === 13 && aquery !== '') {
			clearTimeout (timer);
			var textVal = dojo.query(this).attr('value');
			if(textVal !== prevVal){
				searchVal = textVal;
				addSpinner("#groupSpinner");
				queryMaps(1,textVal);
				prevVal = searchVal;
			}
			hideGroupAutoComplete();
		}
		else if(e.keyCode === 38) {
			dojo.query('#groupAutoComplete li:last')[0].focus();
		}
		else if(e.keyCode === 40) {
			dojo.query('#groupAutoComplete li:first')[0].focus();
		}
		else if(alength >= 2){
			clearTimeout (timer);
			timer = setTimeout(function(){
				groupAutoComplete(aquery);
			}, 250);
		}
		else{
			hideGroupAutoComplete();
		}
	});
	// Autocomplete result click
	dojo.query(document).delegate("#groupAutoComplete ul li", "onclick", function(event){
		// hide auto complete
		hideGroupAutoComplete();
		// get result number
		var locNum = dojo.indexOf(dojo.query('#groupAutoComplete ul li'), this);
		// if map has a url
		var mapURL;
		if(ACObj[locNum].url){
			mapURL = ACObj[locNum].url;
		}
		else{		
			// item url
			mapURL = getViewerURL('simple', ACObj[locNum].id);
		}
		// load map
		window.location = mapURL;
	});
	// Autocomplete key up
	dojo.query(document).delegate("#groupAutoComplete ul li", "onkeyup", function(e){
		if(e.type === 'keyup' && e.keyCode === 13) {
			// hide auto complete
			hideGroupAutoComplete();
			// get result number
			var locNum = dojo.indexOf(dojo.query('#groupAutoComplete ul li'), this);
			// if map has a url
			var mapURL;
			if(ACObj[locNum].url){
				mapURL = ACObj[locNum].url;
			}
			else{
				// item url
				mapURL = getViewerURL('simple', ACObj[locNum].id);
			}
			// load map
			window.location = mapURL;
		}
		else if(e.type === 'keyup' && e.keyCode === 40) {
			dojo.query(this).next('li')[0].focus();
		}
		else if(e.type === 'keyup' && e.keyCode === 38) {
			dojo.query(this).prev('li')[0].focus();
		}
	});
	//	TODO
	// Create sorting menu filter
	if(configOptions.development){
		buildSortingMenu();
	}
}