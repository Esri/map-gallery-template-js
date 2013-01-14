// Dojo Requires
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.Portal");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojox.NodeList.delegate");
dojo.require("dijit.Dialog");
dojo.require("dojo.io.script");
dojo.require("dojo.number");
dojo.require("dojox.form.Rating");
// Map Only
dojo.require("esri.map");
dojo.require("esri.widgets");
dojo.require("esri.tasks.locator");
// Localization
dojo.requireLocalization("esriTemplate", "template");
/*------------------------------------*/
// on dojo load
/*------------------------------------*/
dojo.addOnLoad(function () {
    // set default options
    setDefaultConfigOptions();
    // set app ID settings and call setWebmap after
    setAppIdSettings(function () {
        // create portal
        createPortal(function () {
            // query group info
            queryGroup(function () {
                // set webmap info
                setWebmap();
            });
        });
    });
});
/*------------------------------------*/
// Sets the webmap to load
/*------------------------------------*/
function setWebmap() {
    // if webmap set
    if (configOptions.webmap) {
        // init map page
        initMap();
    }
    // get first map in group if no webmap is set
    else {
        // call featured maps function to get 1 webmap
        queryArcGISGroupItems({
            // settings
            id_group: configOptions.group,
            searchType: "Web Map",
            filterType: "Web Mapping Application",
            sortField: configOptions.sortField,
            sortOrder: configOptions.sortOrder,
            perPage: 1,
            // executed after ajax is returned
            callback: function (obj, data) {
                // if group has at least 1 webmap
                if (data.results.length > 0) {
                    // set webmap
                    configOptions.webmap = data.results[0].id;
                    // init map page
                    initMap();
                } else {
                    // show error dialog
                    var dialog = new dijit.Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.noSearchResults
                    });
                    dialog.show();
                }
            }
        });
    }
}
/*------------------------------------*/
// Toggle full screen map view
/*------------------------------------*/
function toggleFullscreenMap(value) {
    var buttonText;
    // Record center of map
    mapCenter = map.extent.getCenter();
    // if true, fullscreen
    if (value) {
        // button text
        buttonText = i18n.viewer.mapPage.exitFullscreen;
        // change html class
        dojo.query("html").addClass('fullScreen');
        // set buttton classes and text
        dojo.query("#fullScreen").attr('title', buttonText);
        // toggle global variable
        mapFullscreen = true;
    }
    // exit fullscreen
    else {
        // button text
        buttonText = i18n.viewer.mapPage.enterFullscreen;
        // change html class
        dojo.query("html").removeClass('fullScreen');
        // set buttton classes and text
        dojo.query("#fullScreen").attr('title', buttonText);
        // toggle global variable
        mapFullscreen = false;
    }
    // reset center of map
    resizeMapAndCenter();
}
/*------------------------------------*/
// Tabs
/*------------------------------------*/
function tabMenu(menuObj, buttonObj) {
    // hide all tabs
    dojo.query('.tabMenu').style('display', 'none');
    // remove selected button class
    dojo.query('#tabMenu .toggleButton').removeClass('buttonSelected');
    // show new tab
    dojo.query(menuObj).style('display', 'block');
    // set new tab button to selected
    dojo.query(buttonObj).addClass('buttonSelected');
}
/*------------------------------------*/
// Map Buttons
/*------------------------------------*/
function setInnerMapButtons() {
    var html = '';
    // fullscreen button
    html += '<div tabindex="0" title="' + i18n.viewer.mapPage.enterFullscreen + '" class="mapButton buttonSingle" id="fullScreen"><span class="fullScreenButton">&nbsp;</span></div>';
    // fullscreen button
    dojo.query(document).delegate("#fullScreen", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            // if currently in full screen
            if (!mapFullscreen) {
                // enter fullscreen
                toggleFullscreenMap(true);
            } else {
                // exit fullscreen
                toggleFullscreenMap(false);
            }
        }
    });
    // if gelocation is available
    if (navigator.geolocation) {
        html += '<div tabindex="0" id="geoButton" title="' + i18n.viewer.mapPage.geoLocateTitle + '" class="mapButton buttonSingle"><span class="geoLocateButton">&nbsp;</span></div>';
        dojo.query(document).delegate("#geoButton", "onclick,keyup", function (event) {
            if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                navigator.geolocation.getCurrentPosition(geoLocateMap);
            }
        });
    }
    // insert html
    dojo.place(html, "map", "last");
}
/*------------------------------------*/
// Hide auto-complete
/*------------------------------------*/
function hideAutoComplete() {
    dojo.query(".searchList").removeClass('autoCompleteOpen');
    dojo.query("#autoComplete").style('display', 'none');
}

// add edit comment box
function editCommentBox(i) {
    // get text of comment
    var text = globalComments[i].comment;
    // set HTML for comment area
    var html = '';
    html += '<div class="editArea">';
    html += '<div><textarea id="editcomment_' + globalComments[i].id + '" rows="5">' + text + '</textarea></div>';
    html += '<div><span class="silverButton buttonSingle editCommentCancel" data-comment="' + globalComments[i].id + '">' + i18n.viewer.buttons.cancel + '</span>&nbsp;<span class="mapButton buttonSingle editCommentSubmit" data-comment="' + globalComments[i].id + '">' + i18n.viewer.buttons.submit + '</span></div>';
    html += '</div>';
    // find node to add edit text area
    var commentBody = dojo.query('#comment_' + globalComments[i].id + ' .commentBody')[0];
    // insert it before body
    dojo.place(html, commentBody, "before");
    // hide comment
    commentBody.style.display = 'none';
}

// submit edited comment
function editCommentSubmit(i, commentid) {
    // get text of edit comment box
    var text = dojo.byId("editcomment_" + commentid).value;
    // set global comment number to new text
    globalComments[i].comment = text;
    // spinner
    addSpinner('commentSpinner');
    // spinner
    addSpinner('spinner_' + commentid);
    // edit comment
    globalItem.updateComment(globalComments[i]).then(function (value) {
        // requery comments
        getComments();
    },

    function (error) {
        // requery comments
        getComments();
    });
}

// cancel editing of a comment
function cancelEditComment(i) {
    // get comment body
    var commentBody = dojo.query('#comment_' + globalComments[i].id + ' .commentBody')[0];
    // show it
    commentBody.style.display = 'block';
    // remove editing comment node area
    var editArea = dojo.query('#comment_' + globalComments[i].id + ' .editArea').orphan();
}

/*------------------------------------*/
// Set map content
/*------------------------------------*/
function setDelegations() {
    // show about button click
    dojo.query(document).delegate("#showAbout", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            tabMenu('#aboutMenu', this);
        }
    });
    // show legend button click
    dojo.query(document).delegate("#showLegend", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            tabMenu('#legendMenu', this);
        }
    });
    // show legend button click
    dojo.query(document).delegate("#showLayers", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            tabMenu('#layersMenu', this);
        }
    });
    // escape button when in full screen view
    dojo.query(document).delegate("body", "onkeyup", function (e) {
        // if esc key and map is fullscreen
        if (e.keyCode === 27 && mapFullscreen) {
            // exit fullscreen
            toggleFullscreenMap(false);
        }
    });
    // Search Button
    dojo.query(document).delegate("#searchAddressButton", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            locate(showResults);
            hideAutoComplete();
        }
    });
    // Clear address button
    dojo.query(document).delegate(".iconInput .iconReset", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var obj = dojo.query(this).prevAll('input');
            clearAddress(obj);
        }
    });
    // auto complete && address specific action listeners
    dojo.query(document).delegate("#searchAddress", "onkeyup", function (e) {
        checkAddressStatus(this);
        var aquery = dojo.query(this).attr('value')[0];
        var alength = aquery.length;
        // enter key
        if (e.keyCode === 13 && aquery !== '') {
            clearTimeout(timer);
            clearLocate();
            locate(showResults);
            hideAutoComplete();
        }
        // up arrow key
        else if (e.keyCode === 38) {
            dojo.query('#autoComplete li:last')[0].focus();
        }
        // down arrow key
        else if (e.keyCode === 40) {
            dojo.query('#autoComplete li:first')[0].focus();
        }
        // more than 3 chars
        else if (alength >= 2) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                locate(showAutoComplete);
            }, 250);
        } else {
            hideAutoComplete();
        }
    });
    // autocomplete result key up
    dojo.query(document).delegate("#autoComplete ul li", "onclick,keyup", function (e) {
        if (e.type === 'click' || (e.type === 'keyup' && e.keyCode === 13)) {
            var locTxt = dojo.query(this).text();
            var locNum = dojo.indexOf(dojo.query('#autoComplete ul li'), this);
            dojo.query('#searchAddress').attr('value', locTxt);
            showResults(ACObj, locNum);
            hideAutoComplete();
        } else if (e.type === 'keyup' && e.keyCode === 40) {
            dojo.query(this).next('li')[0].focus();
        } else if (e.type === 'keyup' && e.keyCode === 38) {
            dojo.query(this).prev('li')[0].focus();
        }
    });
    // clear address
    dojo.query(document).delegate("#clearAddress", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            clearLocate();
            hideAutoComplete();
        }
    });
    // toggle legend layers
    dojo.query(document).delegate("#mapLayerToggle .toggleLayers", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var dataAttr = dojo.query(this).attr('data-layers')[0].split(',');
            for (var i = 0; i < dataAttr.length; i++) {
                toggleLayerSwitch(dataAttr[i]);
            }
        }
    });
    // add comment button
    dojo.query(document).delegate("#addComment", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            addCommentToItem();
        }
    });
    // sign in button
    dojo.query(document).delegate("#signInPortal", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            portalSignIn(function () {
                getComments();
                setRatingInfo();
            });
        }
    });
    // delete comment
    dojo.query(document).delegate(".deleteComment", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var comment = dojo.attr(this, 'data-comment');
            for (var i = 0; i < globalComments.length; i++) {
                if (globalComments[i].id === comment && globalItem) {
                    // spinner
                    addSpinner('commentSpinner');
                    // spinner
                    addSpinner('spinner_' + comment);
                    // delete comment
                    globalItem.deleteComment(globalComments[i]).then(getComments, getComments);
                }
            }
        }
    });
    // edit comment submit
    dojo.query(document).delegate(".editCommentSubmit", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var comment = dojo.attr(this, 'data-comment');
            for (var i = 0; i < globalComments.length; i++) {
                if (globalComments[i].id === comment && globalItem) {
                    editCommentSubmit(i, comment);
                }
            }
        }
    });
    // cancel edit comment
    dojo.query(document).delegate(".editCommentCancel", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var comment = dojo.attr(this, 'data-comment');
            for (var i = 0; i < globalComments.length; i++) {
                if (globalComments[i].id === comment && globalItem) {
                    cancelEditComment(i);
                }
            }
        }
    });
    // edit comment
    dojo.query(document).delegate(".editComment", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            var comment = dojo.attr(this, 'data-comment');
            for (var i = 0; i < globalComments.length; i++) {
                if (globalComments[i].id === comment && globalItem) {
                    editCommentBox(i);
                }
            }
        }
    });
    // sign in button
    dojo.query(document).delegate("#signInRate", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            portalSignIn(function () {
                getComments();
                setRatingInfo();
            });
        }
    });
}
/*------------------------------------*/
// show autocomplete
/*------------------------------------*/
function showAutoComplete(results) {
    var aResults = '';
    var partialMatch = dojo.query("#searchAddress").attr('value')[0];
    var regex = new RegExp('(' + partialMatch + ')', 'gi');
    if (results && results.candidates.length > 0) {
        dojo.query(".searchList").addClass('autoCompleteOpen');
        ACObj = results;
        aResults += '<ul class="zebraStripes">';
        for (var i = 0; i < results.candidates.length && i < 6; i++) {
            var layerClass = '';
            if (i % 2 === 0) {
                layerClass = '';
            } else {
                layerClass = 'stripe';
            }
            aResults += '<li tabindex="0" class="' + layerClass + '">' + results.candidates[i].address.replace(regex, '<span>' + partialMatch + '</span>') + '</li>';
        }
        aResults += '</ul>';
        var node = dojo.byId('autoComplete');
        if (node) {
            setNodeHTML(node, aResults);
            dojo.style(node, 'display', 'block');
        }
    } else {
        hideAutoComplete();
    }
}
/*------------------------------------*/
// map now loaded
/*------------------------------------*/
function mapNowLoaded(layers) {
    // Map Loaded Class
    dojo.query("#map").addClass('mapLoaded');
    // if overview map
    if (configOptions.showOverviewMap) {
        //add the overview map
        var overviewMapDijit = new esri.dijit.OverviewMap({
            map: map,
            attachTo: "bottom-left",
            visible: false
        });
        overviewMapDijit.startup();
    }
    initUI(layers);
    // add popup theme
    dojo.addClass(map.infoWindow.domNode, configOptions.theme);
}
/*------------------------------------*/
// clear the locate graphic
/*------------------------------------*/
function clearLocate() {
    // if locate layer exists
    if (locateResultLayer) {
        // clear it
        locateResultLayer.clear();
    }
    // reset locate string
    locateString = "";
}
/*------------------------------------*/
// Locate
/*------------------------------------*/
function locate(callback) {
    var query = dojo.byId("searchAddress").value;
    if (query && map) {
        var queryContent = {
            "SingleLine": query,
            "outSR": map.spatialReference.wkid,
			"outFields": "*",
            "f": "json"
        };
        // send request
        var requestHandle = esri.request({
            url: configOptions.locatorserviceurl + '/findAddressCandidates',
            content: queryContent,
            handleAs: 'json',
            callbackParamName: 'callback',
            // on load
            load: function (data) {
                if (typeof callback === 'function') {
                    // call callback function
                    callback.call(this, data);
                }
            }
        });
    }
}
/*------------------------------------*/
// Show search results
/*------------------------------------*/
function showResults(results, resultNumber) {
    // remove spinner
    removeSpinner();
    // hide autocomplete
    hideAutoComplete();
	var candidates = results.candidates;
    // if result found
    if (candidates.length > 0 && map) {
        // num result variable
        var numResult = 0;
        // if result number
        if (resultNumber) {
            numResult = resultNumber;
        }
		var extent, point;
		if (
		candidates[numResult].attributes.hasOwnProperty('Xmin') && candidates[numResult].attributes.hasOwnProperty('Ymin') && candidates[numResult].attributes.hasOwnProperty('Xmax') && candidates[numResult].attributes.hasOwnProperty('Ymax')) {
			// if result has extent attributes
			// new extent
			extent = new esri.geometry.Extent({
				"xmin": candidates[numResult].attributes.Xmin,
				"ymin": candidates[numResult].attributes.Ymin,
				"xmax": candidates[numResult].attributes.Xmax,
				"ymax": candidates[numResult].attributes.Ymax,
				"spatialReference": results.spatialReference
			});
			// set map extent to location
			map.setExtent(esri.geometry.geographicToWebMercator(extent));
		} else if (
		candidates[numResult].attributes.hasOwnProperty('westLon') && candidates[numResult].attributes.hasOwnProperty('southLat') && candidates[numResult].attributes.hasOwnProperty('eastLon') && candidates[numResult].attributes.hasOwnProperty('northLat')) {
			// result has lat/lon extent attributes
			// new extent
			extent = new esri.geometry.Extent({
				"xmin": candidates[numResult].attributes.westLon,
				"ymin": candidates[numResult].attributes.southLat,
				"xmax": candidates[numResult].attributes.eastLon,
				"ymax": candidates[numResult].attributes.northLat,
				"spatialReference": results.spatialReference
			});
			// set map extent to location
			map.setExtent(esri.geometry.geographicToWebMercator(extent));
		} else {
			// use point
			map.centerAndZoom(candidates[numResult].location, 14);
		}
		point = new esri.geometry.Point( {"x": candidates[numResult].location.x, "y": candidates[numResult].location.y," spatialReference": results.spatialReference });
        // if point graphic set
        if (configOptions.pointGraphic) {
            // if locate results
            if (locateResultLayer) {
                dojo.disconnect(resultConnect);
                map.removeLayer(locateResultLayer);
                locateResultLayer = false;
            }
            locateResultLayer = new esri.layers.GraphicsLayer();
            resultConnect = dojo.connect(locateResultLayer, 'onClick', function (evt) {
                // stop overriding events
                dojo.stopEvent(evt);
                // clear popup
                map.infoWindow.clearFeatures();
                // set popup content
                map.infoWindow.setContent('<strong>' + evt.graphic.attributes.address + '</strong>');
                // set popup title
                map.infoWindow.setTitle('Address');
                // set popup geometry
                map.infoWindow.show(evt.mapPoint);
            });
            map.addLayer(locateResultLayer);
            // create point marker
            var pointSymbol = new esri.symbol.PictureMarkerSymbol(configOptions.pointGraphic, 21, 25).setOffset(0, 12);
            // create point graphic
            var locationGraphic = new esri.Graphic(point, pointSymbol);
            // graphic with address
            locationGraphic.setAttributes({
                "address": candidates[numResult].address
            });
            locateResultLayer.add(locationGraphic);
        }
    } else {
        // show error dialog
        var dialog = new dijit.Dialog({
            title: i18n.viewer.errors.general,
            content: i18n.viewer.errors.noSearchResults
        });
        dialog.show();
    }
}
/*------------------------------------*/
// Basemap Gallery
/*------------------------------------*/
function createBasemapGallery() {
    var html = '';
    // insert HTML for basemap
    html += '<div tabindex="0" class="silverButton buttonSingle" id="basemapButton"><span class="basemapArrowButton">&nbsp;</span>' + i18n.viewer.mapPage.switchBasemap + '</div>';
    html += '<div class="clear"></div>';
    html += '<div id="basemapGallery"></div>';
    // if node exists
    var node = dojo.byId("basemapContainer");
    setNodeHTML(node, html);
    //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
    var basemapGallery = new esri.dijit.BasemapGallery({
        showArcGISBasemaps: configOptions.showArcGISBasemaps,
        bingMapsKey: configOptions.bingMapsKey,
        basemapsGroup: configOptions.basemapsGroup,
        map: map
    }, dojo.create("div"));
    dojo.byId("basemapGallery").appendChild(basemapGallery.domNode);
    // start it up!
    basemapGallery.startup();
    // if something bad happened
    dojo.connect(basemapGallery, "onError", function (msg) {
        // show error dialog
        var dialog = new dijit.Dialog({
            title: i18n.viewer.errors.general,
            content: msg
        });
        dialog.show();
    });
    // toggle basemap button
    dojo.query(document).delegate("#basemapButton", "onclick,keyup", function (event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            // get nodes
            var buttonNode = dojo.query(this);
            var node = dojo.byId('basemapGallery');
            // if they exist
            if (node && buttonNode) {
                // remove classes
                buttonNode.removeClass('buttonSelected open');
                // if already shown
                if (dojo.style(node, 'display') === 'block') {
                    // hide
                    dojo.style(node, 'display', 'none');
                } else {
                    // show and add class
                    dojo.style(node, 'display', 'block');
                    buttonNode.addClass('buttonSelected open');
                }
            }
        }
    });
}
/*------------------------------------*/
// Set search address html
/*------------------------------------*/
function setAddressContainer() {
    var html = '';
    html += '<div class="grid_4 alpha searchListCon">';
    if (configOptions.locatorserviceurl && configOptions.showMapSearch) {
        html += '<ul class="searchList">';
        html += '<li id="mapSearch" class="iconInput">';
        html += '<input tabindex="0" placeholder="' + i18n.viewer.mapPage.findPlaceholder + '" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddress" value="" autocomplete="off" type="text" tabindex="1">';
        html += '<div tabindex="0" title="' + i18n.viewer.main.clearSearch + '" class="iconReset" id="clearAddress"></div>';
        html += '</li>';
        html += '<li class="searchButtonLi" title="' + i18n.viewer.mapPage.findLocation + '" id="searchAddressButton"><span tabindex="0" class="silverButton buttonRight"><span class="searchButton">&nbsp;</span></span></li>';
        html += '<li id="locateSpinner" class="spinnerCon"></li>';
        html += '</ul>';
        html += '<div class="clear"></div>';
        html += '<div id="acCon">';
        html += '<div id="autoComplete" class="autoComplete"></div>';
        html += '</div>';
        html += '<div class="clear"></div>';
    } else {
        html += '&nbsp;';
    }
    html += '</div>';
    html += '<div class="grid_5 omega basemapConRel"><div id="basemapContainer">&nbsp;</div>';
    html += '</div>';
    html += '<div class="clear"></div>';
    // Set
    var node = dojo.byId("addressContainer");
    setNodeHTML(node, html);
}
/*------------------------------------*/
// Insert Menu Tab HTML
/*------------------------------------*/
function insertMenuTabs() {
    var html = '';
    html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.legendButtonTitle + '" id="showLegend" class="toggleButton buttonLeft buttonSelected"><span class="icon"></span></div>';
    if (configOptions.showLayerToggle) {
        html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.layersButton + '" id="showLayers" class="toggleButton buttonCenter"><span class="icon"></span></div>';
    }
    html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.aboutButtonTitle + '" id="showAbout" class="toggleButton buttonRight"><span class="icon"></span></div>';
    html += '<div class="clear"></div>';
    // Set
    var node = dojo.byId("tabMenu");
    setNodeHTML(node, html);
}
/*------------------------------------*/
// Add bottom map buttons
/*------------------------------------*/
function addBottomMapButtons() {
    var html = '';
    if (configOptions.showExplorerButton && !isMobileUser()) {
        // add open in explorer button
        html += '<a tabindex="0" target="_blank" href="' + getViewerURL('explorer', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInExplorer + '</a>';
    }
    if (configOptions.showArcGISOnlineButton) {
        // add open in arcgis button
        html += '<a tabindex="0" target="_blank" href="' + getViewerURL('arcgis', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInArcGIS + '</a>';
    }
    // If mobile user
    if (isMobileUser() && configOptions.showMobileButtons) {
        // add button
        html += '<a tabindex="0" href="' + getViewerURL('mobile', configOptions.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInMobile + '</a>';
        // add app button
        html += '<a tabindex="0" href="' + getViewerURL('mobile_app') + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.getMobileApp + '</a>';
    }
    if (html === '') {
        html = '&nbsp;';
    }
    // insert
    var node = dojo.byId("mapButtons");
    setNodeHTML(node, html);
}

/*------------------------------------*/
// global item creation
/*------------------------------------*/
function setGlobalItem(obj) {
    // default values
    var settings = {
        // Group Owner
        id: '',
        // format
        dataType: 'json',
        // callback function with object
        callback: null
    };
    // If options exist, lets merge them with our default settings
    if (obj) {
        dojo.mixin(settings, obj);
    }
    var q = 'id:' + settings.id;
    var params = {
        q: q,
        v: configOptions.arcgisRestVersion,
        f: settings.dataType
    };
    portal.queryItems(params).then(function (result) {
        // set global item
        globalItem = result.results[0];
        // if callback function supplied
        if (typeof settings.callback === 'function') {
            // call callback function with settings and data
            settings.callback.call(this, settings);
        }
    });
}

/*------------------------------------*/
// Sort comments by date
/*------------------------------------*/
function commentSort(a, b) {
    if (a.created > b.created) {
        return -1;
    } else if (a.created === b.created) {
        return 0;
    } else {
        return 1;
    }
}
/*------------------------------------*/
// Builds listing of comments
/*------------------------------------*/
function buildComments() {
    // html
    var html = '';
    html += '<h2>' + i18n.viewer.comments.commentsHeader + ' (' + dojo.number.format(globalComments.length) + ') <span id="commentSpinner"></span></h2>';
    html += '<div class="addCommentBlock">';
    if (globalUser) {
        html += '<div><textarea id="commentText" rows="5"></textarea></div>';
        html += '<div><span id="addComment" class="silverButton buttonSingle">' + i18n.viewer.comments.addCommentButton + '</span></div>';
    } else {
        html += '<div><a id="signInPortal">' + i18n.viewer.comments.signIn + '</a> ' + i18n.viewer.comments.or + ' <a target="_blank" href="' + getViewerURL('signup_page') + '">' + i18n.viewer.comments.register + '</a> ' + i18n.viewer.comments.toPost + '</div>';
    }
    html += '</div>';
    html += '<div class="clear"></div>';
    if (globalComments && globalComments.length > 0) {
        for (var i = 0; i < globalComments.length; i++) {
            var isOwner = false;
            if (globalUser) {
                if (globalComments[i].owner === globalUser.username) {
                    isOwner = true;
                }
            }
            html += '<div id="comment_' + globalComments[i].id + '" class="comment">';
            html += '<div id="spinner_' + globalComments[i].id + '" class="commentBodySpinner"></div>';
            html += '<div class="commentBody">';
            html += '<p>';
            html += parseURL(decodeURIComponent(globalComments[i].comment));
            if (isOwner) {
                html += '<p>';
                html += '<a class="editComment" data-comment="' + globalComments[i].id + '">';
                html += i18n.viewer.comments.editComment;
                html += '</a> ';
                html += '<a class="deleteComment" data-comment="' + globalComments[i].id + '">';
                html += i18n.viewer.comments.deleteComment;
                html += '</a> ';
                html += '</p>';
            }
            html += '</p>';
            html += '<div class="smallText">';
            // date object
            var commentDate = new Date(globalComments[i].created);
            // date format for locale
            var dateLocale = dojo.date.locale.format(commentDate, {
                selector: "date",
                datePattern: "MMM d, yyyy"
            });
            html += i18n.viewer.comments.posted + ' ' + dateLocale;
            html += ' ' + i18n.viewer.comments.by + ' ';
            if (configOptions.showProfileUrl) {
                html += '<a target="_blank" href="' + getViewerURL('owner_page', false, globalComments[i].owner) + '">';
            }
            html += globalComments[i].owner;
            if (configOptions.showProfileUrl) {
                html += '</a>.';
            }
            html += '</div>';
            html += '</div>';
            html += '<div class="clear"></div>';
            html += '</div>';
        }
    } else {
        html += '<p>';
        html += i18n.viewer.comments.noComments;
        html += '</p>';
    }
    var commentsNode = dojo.byId("comments");
    setNodeHTML(commentsNode, html);
}
/*------------------------------------*/
// Add Comment
/*------------------------------------*/
function addCommentToItem() {
    // text value
    var text = dojo.byId("commentText").value;
    // if set
    if (text) {
        // sign in
        portalSignIn(function () {
            if (globalItem) {
                // spinner
                addSpinner('commentSpinner');
                // comment
                globalItem.addComment(text).then(function () {
                    // get comments
                    getComments();
                });
            }
        });
    }
}
/*------------------------------------*/
// get comments
/*------------------------------------*/
function getComments() {
    globalItem.getComments().then(function (comments) {
        // remove any spinners
        removeSpinner();
        // set global comments
        globalComments = comments.sort(commentSort);
        // create comments list
        buildComments();
    });
}
/*------------------------------------*/
// Get updated rating
/*------------------------------------*/
function reQueryRating() {
    setGlobalItem({
        // Group Owner
        id: configOptions.webmap,
        // Executed after ajax returned
        callback: function (comments) {
            // set rating
            setRatingInfo();
        }
    });
}
/*------------------------------------*/
// Set Rating Connection
/*------------------------------------*/
function setRatingConnect() {
    // if connect exists
    if (ratingConnect) {
        // disconnect it
        dojo.disconnect(ratingConnect);
    }
    // rating connects
    ratingConnect = dojo.connect(ratingWidget, "onChange", function (value) {
        // clear rating timeout
        clearTimeout(ratingTimer);
        // set timeout
        ratingTimer = setTimeout(function () {
            // if logged in
            if (globalUser) {
                // if value and it's a valid number
                if (value > -1 && value < 6) {
                    // parse value
                    var widgetVal = parseInt(value, 10);
                    // if global item and widget exists
                    if (globalItem && widgetVal) {
                        // rate
                        globalItem.addRating(widgetVal).then(function () {
                            // query new info
                            reQueryRating();
                        },

                        function () {
                            // query new info
                            reQueryRating();
                        });
                    }
                }
            }
        }, 500);
    });
}
/*------------------------------------*/
// Set Rating Information
/*------------------------------------*/
function setRatingInfo() {
    var html = '';
    // if ratings enabled
    if (configOptions.showRatings) {
        // if widget exists
        if (ratingWidget) {
            // destroy it
            ratingWidget.destroy();
        }
        // rating widget
        ratingWidget = new dojox.form.Rating({
            numStars: 5,
            value: globalItem.avgRating
        }, null);
        // connection
        setRatingConnect();
    }
    // rating container
    html += '<div class="ratingCon" id="ratingCon">';
    // if not logged in
    if (!globalUser && configOptions.showRatings) {
        html += '&nbsp;<a id="signInRate">' + i18n.viewer.rating.signIn + '</a> ' + i18n.viewer.rating.toRate;
    }
    var rating = '';
    if (configOptions.showRatings) {
        // Ratings
        if (globalItem.numRatings) {
            var pluralRatings = i18n.viewer.itemInfo.ratingsLabel;
            if (globalItem.numRatings > 1) {
                pluralRatings = i18n.viewer.itemInfo.ratingsLabelPlural;
            }
            rating += dojo.number.format(globalItem.numRatings) + ' ' + pluralRatings;
        }
    }
    if (configOptions.showComments) {
        // comments
        if (globalItem.numComments) {
            if (globalItem.numRatings) {
                rating += i18n.viewer.itemInfo.separator + ' ';
            }
            var pluralComments = i18n.viewer.itemInfo.commentsLabel;
            if (globalItem.numComments > 1) {
                pluralComments = i18n.viewer.itemInfo.commentsLabelPlural;
            }
            rating += dojo.number.format(globalItem.numComments) + ' ' + pluralComments;
        }
    }
    // views
    if (configOptions.showViews && globalItem.numViews) {
        if ((globalItem.numRatings && configOptions.showRatings) || (globalItem.numComments && configOptions.showComments)) {
            rating += i18n.viewer.itemInfo.separator + ' ';
        }
        var pluralViews = i18n.viewer.itemInfo.viewsLabel;
        if (globalItem.numViews > 1) {
            pluralViews = i18n.viewer.itemInfo.viewsLabelPlural;
        }
        rating += dojo.number.format(globalItem.numViews) + ' ' + pluralViews;
    }
    if(rating){
        html += ' (' + rating + ')';
    }
    // close container
    html += '</div>';
    var ratingNode = dojo.byId("rating");
    setNodeHTML(ratingNode, html);
    if (configOptions.showRatings) {
        if (globalUser) {
            // rating widget
            dojo.place(ratingWidget.domNode, dojo.byId("ratingCon"), "first");
        } else {
            // rating widget
            dojo.place(ratingWidget.domNode.innerHTML, dojo.byId("ratingCon"), "first");
        }
    }
}
/*------------------------------------*/
// Init Map
/*------------------------------------*/
function initMap() {
    // set map content
    setDelegations();
    // set map buttons
    setInnerMapButtons();
    // ITEM
    var itemDeferred = esri.arcgis.utils.getItem(configOptions.webmap);
    itemDeferred.addErrback(function (error) {
        // show error dialog
        dialog = new dijit.Dialog({
            title: i18n.viewer.errors.general,
            content: i18n.viewer.errors.createMap + error
        });
        dialog.show();
        // hide all content
        hideAllContent();
    });
    itemDeferred.addCallback(function (itemInfo) {
        // set global portal item
        setGlobalItem({
            // Group Owner
            id: configOptions.webmap,
            // Executed after ajax returned
            callback: function (comments) {
                // set comments
                if (configOptions.showComments) {
                    // get comments
                    getComments();
                }
                // set rating
                setRatingInfo();
            }
        });
        // if it's a webmap
        if (itemInfo && itemInfo.item && itemInfo.item.type === 'Web Map') {
            // insert menu tab html
            insertMenuTabs();
            // insert address html
            setAddressContainer();
            // if no title set in config
            if (!configOptions.mapTitle) {
                configOptions.mapTitle = itemInfo.item.title || "";
            }
            // if no subtitle set in config
            if (!configOptions.mapSnippet) {
                configOptions.mapSnippet = itemInfo.item.snippet || "";
            }
            // if no description set in config
            if (!configOptions.mapItemDescription) {
                configOptions.mapItemDescription = itemInfo.item.description || "";
            }
            // Set title
            var titleNode = dojo.byId("title");
            setNodeHTML(titleNode, configOptions.mapTitle);
            // Set subtitle
            var subTitleNode = dojo.byId("subtitle");
            setNodeHTML(subTitleNode, parseURL(configOptions.mapSnippet));
            var d, dateLocale;
            html = '';
            html += '<h2>' + i18n.viewer.mapPage.moreInformation + '</h2>';
            html += '<ul class="moreInfoList">';
            // Created Date
            if (itemInfo.item.created) {
                // date object
                d = new Date(itemInfo.item.created);
                // date format for locale
                dateLocale = dojo.date.locale.format(d, {
                    selector: "date",
                    datePattern: "MMM d, yyyy"
                });
                html += '<li><strong>' + i18n.viewer.mapPage.createdLabel + '</strong><br />' + dateLocale + '</li>';
            }
            // Modified Date
            if (itemInfo.item.modified) {
                // date object
                d = new Date(itemInfo.item.modified);
                // date format for locale
                dateLocale = dojo.date.locale.format(d, {
                    selector: "date",
                    datePattern: "MMM d, yyyy"
                });
                html += '<li><strong>' + i18n.viewer.itemInfo.modifiedLabel + '</strong><br />' + dateLocale + '</li>';
            }
            // if showMoreInfo is set
            if (configOptions.showMoreInfo) {
                // item page link
                html += '<li>';
                html += '<strong>' + i18n.viewer.mapPage.detailsLabel + '</strong><br />';
                html += '<a id="mapContentsLink" href="' + getViewerURL('item_page') + '" target="_blank">' + i18n.viewer.mapPage.arcgisLink + '</a>';
                html += '</li>';
            }
            html += '</ul>';
            // set html to node
            var mapMoreInfo = dojo.byId("mapMoreInfo");
            setNodeHTML(mapMoreInfo, html);
            // if no license info set in config
            if (!configOptions.mapLicenseInfo) {
                configOptions.mapLicenseInfo = itemInfo.item.licenseInfo || "";
            }
            // Set license info
            var licenseInfo = dojo.byId("licenseInfo");
            if (licenseInfo && configOptions.mapLicenseInfo && configOptions.showLicenseInfo) {
                setNodeHTML(licenseInfo, '<h2>' + i18n.viewer.mapPage.constraintsHeading + '</h2>' + configOptions.mapLicenseInfo);
            }
            // Set description
            var descriptionInfo = configOptions.mapItemDescription || i18n.viewer.mapPage.noDescription;
            var descNode = dojo.byId("descriptionContent");
            setNodeHTML(descNode, '<h2>' + i18n.viewer.mapPage.aboutHeader + '</h2>' + descriptionInfo + '<div class="clear"></div>');
            // set page title
            if (configOptions.mapTitle) {
                document.title = configOptions.siteTitle + ' - ' + configOptions.mapTitle;
            } else {
                document.title = configOptions.siteTitle;
            }
            // add bottom map buttons
            addBottomMapButtons();
            // create map
            var mapDeferred = esri.arcgis.utils.createMap(itemInfo, "map", {
                mapOptions: {
                    slider: true,
                    sliderStyle: "small",
                    wrapAround180: true,
                    showAttribution: configOptions.showAttribution,
                    attributionWidth: 0.40,
                    nav: false
                },
                ignorePopups: false,
                bingMapsKey: configOptions.bingMapsKey,
                geometryServiceURL: configOptions.geometryserviceurl
            });
            // map response
            mapDeferred.addCallback(function (response) {
                // set map
                map = response.map;
                // operation layers
                var layers = response.itemInfo.itemData.operationalLayers;
                var html = '';
                var mapLayersNode = dojo.byId('mapLayers');
                html += '<h2>' + i18n.viewer.mapPage.layersHeader + '</h2>';
                // Layer toggles
                if (configOptions.showLayerToggle && layers.length > 0 && mapLayersNode) {
                    html += '<table id="mapLayerToggle">';
                    html += "<tbody>";
                    for (j = 0; j < layers.length; j++) {
                        var checked;
                        // if feature collection
                        if (layers[j].featureCollection) {
                            html += "<tr>";
                            checked = '';
                            if (layers[j].visibility) {
                                checked = 'checked="checked"';
                            }
                            // check column
                            html += '<td class="checkColumn"><input tabindex="0" class="toggleLayers" id="layerCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
                            // if feature collection layers
                            if (layers[j].featureCollection.layers) {
                                for (k = 0; k < layers[j].featureCollection.layers.length; k++) {
                                    html += layers[j].featureCollection.layers[k].id;
                                    // if not last
                                    if (k !== (layers[j].featureCollection.layers.length - 1)) {
                                        html += ",";
                                    }
                                }
                            }
                            // csv
                            else {
                                html += layers[j].id;
                            }
                            html += '" /></td>';
                            // label column
                            html += '<td><label for="layerCheckbox' + j + '">' + layers[j].title.replace(/[\-_]/g, " ") + '</label></td>';
                            html += "</tr>";
                        } else {
                            html += "<tr>";
                            checked = '';
                            if (layers[j].visibility) {
                                checked = 'checked="checked"';
                            }
                            // check column
                            html += '<td class="checkColumn"><input tabindex="0" class="toggleLayers" id="layerSingleCheckbox' + j + '" ' + checked + ' type="checkbox" data-layers="';
                            html += layers[j].id;
                            html += '" /></td>';
                            // label column
                            html += '<td><label for="layerSingleCheckbox' + j + '">' + layers[j].title.replace(/[\-_]/g, " ") + '</label></td>';
                            html += "</tr>";
                        }
                    }
                    html += "</tbody>";
                    html += '</table>';
                    html += '<div class="clear"></div>';
                } else {
                    html += '<div>' + i18n.viewer.errors.noLayers + '</div>';
                }
                setNodeHTML(mapLayersNode, html);
                // ENDLAYER TOGGLE
                if (map.loaded) {
                    mapNowLoaded(layers);
                } else {
                    dojo.connect(map, "onLoad", function () {
                        mapNowLoaded(layers);
                    });
                }
            });
            mapDeferred.addErrback(function (error) {
                // show error dialog
                var dialog = new dijit.Dialog({
                    title: i18n.viewer.errors.general,
                    content: i18n.viewer.errors.createMap + " : " + error
                });
                dialog.show();
                // hide all content
                hideAllContent();
            });
            itemDeferred.addErrback(function (error) {
                var dialog;
                // don't i18n this. I'ts returned from the server
                if (error && error.message === "BingMapsKey must be provided.") {
                    dialog = new dijit.Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.bingError
                    });
                    dialog.show();
                } else {
                    // show error dialog
                    dialog = new dijit.Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.createMap + " : " + error
                    });
                    dialog.show();
                    // hide all content
                    hideAllContent();
                }
            });
        } else {
            // show error dialog
            dialog = new dijit.Dialog({
                title: i18n.viewer.errors.general,
                content: i18n.viewer.errors.createMap
            });
            dialog.show();
            // hide all content
            hideAllContent();
        }
    });
}
/*------------------------------------*/
// TOGGLE LAYER
/*------------------------------------*/
function toggleLayerSwitch(layerid) {
    var layer = map.getLayer(layerid);
    if (layer) {
        //if visible hide the layer
        if (layer.visible === true) {
            layer.hide();
        }
        //otherwise show
        else {
            layer.show();
        }
    }
}
/*------------------------------------*/
// BUILD LAYERS LIST
/*------------------------------------*/
function buildLayersList(layers) {
    //layers  arg is  response.itemInfo.itemData.operationalLayers;
    var layerInfos = [];
    dojo.forEach(layers, function (mapLayer, index) {
        var layerInfo = {};
        if (mapLayer.featureCollection && mapLayer.type !== "CSV") {
            if (mapLayer.featureCollection.showLegend === true) {
                dojo.forEach(mapLayer.featureCollection.layers, function (fcMapLayer) {
                    if (fcMapLayer.showLegend !== false) {
                        layerInfo = {
                            "layer": fcMapLayer.layerObject,
                            "title": mapLayer.title,
                            "defaultSymbol": false
                        };
                        if (mapLayer.featureCollection.layers.length > 1) {
                            layerInfo.title += " - " + fcMapLayer.layerDefinition.name;
                        }
                        layerInfos.push(layerInfo);
                    }
                });
            }
        } else if (mapLayer.showLegend !== false && mapLayer.layerObject) {
            var showDefaultSymbol = false;
            if (mapLayer.layerObject.version < 10.1 && (mapLayer.layerObject instanceof esri.layers.ArcGISDynamicMapServiceLayer || mapLayer.layerObject instanceof esri.layers.ArcGISTiledMapServiceLayer)) {
                showDefaultSymbol = true;
            }
            layerInfo = {
                "layer": mapLayer.layerObject,
                "title": mapLayer.title,
                "defaultSymbol": showDefaultSymbol
            };
            //does it have layers too? If so check to see if showLegend is false
            if (mapLayer.layers) {
                var hideLayers = dojo.map(dojo.filter(mapLayer.layers, function (lyr) {
                    return (lyr.showLegend === false);
                }), function (lyr) {
                    return lyr.id;
                });
                if (hideLayers.length) {
                    layerInfo.hideLayers = hideLayers;
                }
            }
            layerInfos.push(layerInfo);
        }
    });
    return layerInfos;
}
/*------------------------------------*/
// INIT UI
/*------------------------------------*/
function initUI(layers) {
    // Set legend header
    var node = dojo.byId('legendHeader');
    setNodeHTML(node, i18n.viewer.sidePanel.title);
    // Set basemap gallery
    if (configOptions.showBasemapGallery) {
        createBasemapGallery();
    }
    // Set map background image
    dojo.query("#map").style('background-image', 'none');
    // Setup resize map
    dojo.connect(window, "onresize", resizeMap);
    //add scalebar
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit: i18n.viewer.main.scaleBarUnits
    });
    // Legend Information
    var layerInfo = buildLayersList(layers);
    // Build Legend
    if (layerInfo.length > 0) {
        var legendDijit = new esri.dijit.Legend({
            map: map,
            layerInfos: layerInfo
        }, "legendContent");
        legendDijit.startup();
    } else {
        var legendContentNode = dojo.byId('legendContent');
        setNodeHTML(legendContentNode, i18n.viewer.errors.noLayers);
    }
}
/*------------------------------------*/
// Resize and Reposition Map
/*------------------------------------*/
function mapResizeAndReposition() {
    map.resize();
    map.reposition();
}
/*------------------------------------*/
// Resize Map And Center
/*------------------------------------*/
function resizeMapAndCenter() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        mapResizeAndReposition();
        if (mapCenter.x && mapCenter.y) {
            setTimeout(function () {
                map.centerAt(mapCenter);
                mapResizeAndReposition();
            }, 500);
        }
    }, 500);
}
/*------------------------------------*/
// Resize Map
/*------------------------------------*/
function resizeMap() {
    clearTimeout(resizeTimer);
    if (map) {
        resizeTimer = setTimeout(function () {
            mapResizeAndReposition();
        }, 500);
    }
}