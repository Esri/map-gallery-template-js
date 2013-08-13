define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/i18n!./nls/template.js",
    "dojo/dom-style",
    "dojo/number",
    "esri/request",
    "esri/arcgis/utils",
    "esri/geometry/webMercatorUtils",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "config/options",
    "dijit/Dialog",
    "application/common",
    "dojo/date/locale",
    "dojo/ready",
    "dojox/form/Rating",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/_base/event",
    "dojo/dom-construct",
    "esri/dijit/OverviewMap",
    "esri/geometry/Extent",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Scalebar",
    "esri/dijit/Legend",
    "dojo/keys"
],
function(require, declare, connect, lang, array, Deferred, dom, on, query, i18n, domStyle, number, esriRequest, arcgisUtils, webMercatorUtils, GraphicsLayer, Point, PictureMarkerSymbol, Graphic, Options, Dialog, Common, locale, ready, Rating, domAttr, domClass, event, domConstruct, OverviewMap, Extent, BasemapGallery, Scalebar, Legend, keys) {
    return declare("application.map", [Common], {
        constructor: function() {
            var _self = this; /*------------------------------------*/
            // on dojo load
            /*------------------------------------*/
            ready(function() {
                _self._options = Options;
                // set default options
                _self.setDefaultOptions();
                _self.queryOrganization().then(function() {
                    // set app ID settings and call setWebmap after
                    _self.setAppIdSettings().then(function() {
                        // create portal
                        _self.createPortal().then(function() {
                            // query group info
                            _self.queryGroup().then(function() {
                                // set webmap info
                                _self.setWebmap();
                            });
                        });
                    });
                });
            });
        },
        /*------------------------------------*/
        // Sets the webmap to load
        /*------------------------------------*/
        setWebmap: function() {
            var _self = this;
            // if webmap set
            if (_self._options.webmap) {
                // init map page
                _self.initMap();
            }
            // get first map in group if no webmap is set
            else {
                // call featured maps function to get 1 webmap
                _self.queryArcGISGroupItems({
                    // settings
                    id_group: _self._options.group,
                    searchType: "Web Map",
                    filterType: "Web Mapping Application",
                    sortField: _self._options.sortField,
                    sortOrder: _self._options.sortOrder,
                    perPage: 1
                }).then(function(obj, data) {
                    // if group has at least 1 webmap
                    if (data.results.length > 0) {
                        // set webmap
                        _self._options.webmap = data.results[0].id;
                        // init map page
                        _self.initMap();
                    } else {
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: i18n.viewer.errors.noSearchResults
                        });
                        dialog.show();
                    }
                });
            }
        },
        /*------------------------------------*/
        // Toggle full screen map view
        /*------------------------------------*/
        toggleFullscreenMap: function(value) {
            var _self = this;
            var buttonText;
            // Record center of map
            _self.mapCenter = _self.map.extent.getCenter();
            // if true, fullscreen
            if (value) {
                // button text
                buttonText = i18n.viewer.mapPage.exitFullscreen;
                // change html class
                domClass.add(query("html")[0], 'fullScreen');
                // set buttton classes and text
                domAttr.set(dom.byId('fullScreen'), 'title', buttonText);
                // toggle global variable
                _self.mapFullscreen = true;
            }
            // exit fullscreen
            else {
                // button text
                buttonText = i18n.viewer.mapPage.enterFullscreen;
                // change html class
                domClass.remove(query("html")[0], 'fullScreen');
                // set buttton classes and text
                domAttr.set(dom.byId('fullScreen'), 'title', buttonText);
                // toggle global variable
                _self.mapFullscreen = false;
            }
            // reset center of map
            _self.resizeMapAndCenter();
        },
        /*------------------------------------*/
        // Tabs
        /*------------------------------------*/
        tabMenu: function(menuObj, buttonObj) {
            // hide all tabs
            query('.tabMenu').forEach(function(entry) {
                domStyle.set(entry, 'display', 'none');
            });
            // remove selected button class
            query('#tabMenu .toggleButton').forEach(function(entry) {
                domClass.remove(entry, 'buttonSelected');
            });
            // show new tab
            domStyle.set(menuObj, 'display', 'block');
            // set new tab button to selected
            domClass.add(buttonObj, 'buttonSelected');
        },
        /*------------------------------------*/
        // Map Buttons
        /*------------------------------------*/
        setInnerMapButtons: function() {
            var _self = this;
            var html = '';
            // fullscreen button
            html += '<div tabindex="0" title="' + i18n.viewer.mapPage.enterFullscreen + '" class="mapButton buttonSingle" id="fullScreen"><span class="fullScreenButton">&nbsp;</span></div>';
            // if gelocation is available
            if (navigator.geolocation) {
                html += '<div tabindex="0" id="geoButton" title="' + i18n.viewer.mapPage.geoLocateTitle + '" class="mapButton buttonSingle"><span class="geoLocateButton">&nbsp;</span></div>';
            }
            // insert html
            domConstruct.place(html, "map", "last");
            // fullscreen button
            on(dom.byId("fullScreen"), "click, keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // if currently in full screen
                    if (!_self.mapFullscreen) {
                        // enter fullscreen
                        _self.toggleFullscreenMap(true);
                    } else {
                        // exit fullscreen
                        _self.toggleFullscreenMap(false);
                    }
                }
            });
            // if gelocation is available
            if (navigator.geolocation) {
                on(dom.byId("geoButton"), "click, keyup", function(e) {
                    if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            _self.geoLocateMap(position);
                        });
                    }
                });
            }
        },
        /*------------------------------------*/
        // Hide auto-complete
        /*------------------------------------*/
        hideAutoComplete: function() {
            query(".searchList").forEach(function(entry) {
                domClass.remove(entry, 'autoCompleteOpen');
            });
            domStyle.set(dom.byId('autoComplete'), 'display', 'none');
        },
        // add edit comment box
        editCommentBox: function(i) {
            var _self = this;
            // get text of comment
            var text = _self.globalComments[i].comment;
            // set HTML for comment area
            var html = '';
            html += '<div class="editArea">';
            html += '<div><textarea id="editcomment_' + _self.globalComments[i].id + '" rows="5">' + text + '</textarea></div>';
            html += '<div><span class="silverButton buttonSingle editCommentCancel" data-comment="' + _self.globalComments[i].id + '">' + i18n.viewer.buttons.cancel + '</span>&nbsp;<span class="mapButton buttonSingle editCommentSubmit" data-comment="' + _self.globalComments[i].id + '">' + i18n.viewer.buttons.submit + '</span></div>';
            html += '</div>';
            // find node to add edit text area
            var commentBody = query('#comment_' + _self.globalComments[i].id + ' .commentBody')[0];
            // insert it before body
            domConstruct.place(html, commentBody, "before");
            // hide comment
            domStyle.set(commentBody, 'display', 'none');
        },
        // submit edited comment
        editCommentSubmit: function(i, commentid) {
            var _self = this;
            // get text of edit comment box
            var text = dom.byId("editcomment_" + commentid).value;
            // set global comment number to new text
            _self.globalComments[i].comment = text;
            // spinner
            _self.addSpinner('commentSpinner');
            // spinner
            _self.addSpinner('spinner_' + commentid);
            // edit comment
            _self.globalItem.updateComment(_self.globalComments[i]).then(function() {
                // requery comments
                _self.getComments();
            }, function() {
                // requery comments
                _self.getComments();
            });
        },
        // cancel editing of a comment
        cancelEditComment: function(i) {
            var _self = this;
            // get comment body
            var commentBody = query('#comment_' + _self.globalComments[i].id + ' .commentBody')[0];
            // show it
            domStyle.set(commentBody, 'display', 'block');
            // remove editing comment node area
            query('#comment_' + _self.globalComments[i].id + ' .editArea').forEach(domConstruct.destroy);
        },
        /*------------------------------------*/
        // Set map content
        /*------------------------------------*/
        setDelegations: function() {
            var _self = this;
            // show about button click
            on(dom.byId("sidePanel"), "#showAbout:click, #showAbout:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.tabMenu(dom.byId('aboutMenu'), this);
                }
            });
            // show legend button click
            on(dom.byId("sidePanel"), "#showLegend:click, #showLegend:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.tabMenu(dom.byId('legendMenu'), this);
                }
            });
            // show legend button click
            on(dom.byId("sidePanel"), "#showLayers:click, #showLayers:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.tabMenu(dom.byId('layersMenu'), this);
                }
            });
            // escape button when in full screen view
            on(document, "keyup", function(e) {
                // if esc key and map is fullscreen
                if (e.keyCode === keys.ESCAPE && _self.mapFullscreen) {
                    // exit fullscreen
                    _self.toggleFullscreenMap(false);
                }
            });
            // Search Button
            on(dom.byId("mainPanel"), "#searchAddressButton:click, #searchAddressButton:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.locate().then(function(data) {
                        _self.showResults(data);
                    });
                    _self.hideAutoComplete();
                }
            });
            // Clear address button
            on(dom.byId("mainPanel"), ".iconReset:click, .iconReset:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var obj = dom.byId('searchAddress');
                    _self.clearAddress(obj, this);
                }
            });
            // auto complete && address specific action listeners
            on(dom.byId("mainPanel"), "#searchAddress:keyup", function(e) {
                _self.checkAddressStatus(this, dom.byId('clearAddress'));
                var all = query('#autoComplete li');
                var locNum = array.indexOf(all, this);
                var aquery = domAttr.get(this, 'value');
                var alength = aquery.length;
                // enter key
                if (e.keyCode === keys.ENTER && aquery !== '') {
                    clearTimeout(_self.timer);
                    _self.clearLocate();
                    _self.locate().then(function(data) {
                        _self.showResults(data);
                    });
                    _self.hideAutoComplete();
                }
                // up arrow key
                else if (e.keyCode === keys.UP_ARROW) {
                    if (all[locNum - 1]) {
                        all[locNum - 1].focus();
                    } else {
                        all[all.length - 1].focus();
                    }
                }
                // down arrow key
                else if (e.keyCode === keys.DOWN_ARROW) {
                    if (all[locNum + 1]) {
                        all[locNum + 1].focus();
                    } else {
                        all[0].focus();
                    }
                }
                // more than 3 chars
                else if (alength >= 2) {
                    clearTimeout(_self.timer);
                    _self.timer = setTimeout(function() {
                        _self.locate().then(function(data) {
                            _self.showAutoComplete(data);
                        });
                    }, 250);
                } else {
                    _self.hideAutoComplete();
                }
            });
            // autocomplete result key up
            on(dom.byId("mainPanel"), "#autoComplete li:click, #autoComplete li:keyup", function(e) {
                var all = query('#autoComplete li');
                var locNum = array.indexOf(all, this);
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var locTxt = domAttr.get(this, 'data-text');
                    domAttr.set(dom.byId('searchAddress'), 'value', locTxt);
                    _self.showResults(_self.ACObj, locNum);
                    _self.hideAutoComplete();
                } else if (e.keyCode === keys.DOWN_ARROW) {
                    if (all[locNum + 1]) {
                        all[locNum + 1].focus();
                    } else {
                        all[0].focus();
                    }
                } else if (e.keyCode === keys.UP_ARROW) {
                    if (all[locNum - 1]) {
                        all[locNum - 1].focus();
                    } else {
                        all[all.length - 1].focus();
                    }
                }
            });
            // clear address
            on(dom.byId("mainPanel"), "#clearAddress:click, #clearAddress:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.clearLocate();
                    _self.hideAutoComplete();
                }
            });
            // toggle legend layers
            on(dom.byId("sidePanel"), ".toggleLayers:click, .toggleLayers:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var dataAttr = domAttr.get(this, 'data-layers').split(',');
                    for (var i = 0; i < dataAttr.length; i++) {
                        _self.toggleLayerSwitch(dataAttr[i]);
                    }
                }
            });
            // add comment button
            on(dom.byId("mainPanel"), "#addComment:click, #addComment:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.addCommentToItem();
                }
            });
            // sign in button
            on(dom.byId("mainPanel"), "#signInPortal:click, #signInPortal:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.portalSignIn().then(function() {
                        _self.getComments();
                        _self.setRatingInfo();
                    });
                }
            });
            // delete comment
            on(dom.byId("mainPanel"), ".deleteComment:click, .deleteComment:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(this, 'data-comment');
                    var refreshComments = function() {
                            _self.getComments();
                            _self.setRatingInfo();
                        };
                    for (var i = 0; i < _self.globalComments.length; i++) {
                        if (_self.globalComments[i].id === comment && _self.globalItem) {
                            // spinner
                            _self.addSpinner('commentSpinner');
                            // spinner
                            _self.addSpinner('spinner_' + comment);
                            // delete comment
                            _self.globalItem.deleteComment(_self.globalComments[i]).then(refreshComments, refreshComments);
                        }
                    }
                }
            });
            // edit comment submit
            on(dom.byId("mainPanel"), ".editCommentSubmit:click, .editCommentSubmit:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(this, 'data-comment');
                    for (var i = 0; i < _self.globalComments.length; i++) {
                        if (_self.globalComments[i].id === comment && _self.globalItem) {
                            _self.editCommentSubmit(i, comment);
                        }
                    }
                }
            });
            // cancel edit comment
            on(dom.byId("mainPanel"), ".editCommentCancel:click, .editCommentCancel:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(this, 'data-comment');
                    for (var i = 0; i < _self.globalComments.length; i++) {
                        if (_self.globalComments[i].id === comment && _self.globalItem) {
                            _self.cancelEditComment(i);
                        }
                    }
                }
            });
            // edit comment
            on(dom.byId("mainPanel"), ".editComment:click, .editComment:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(this, 'data-comment');
                    for (var i = 0; i < _self.globalComments.length; i++) {
                        if (_self.globalComments[i].id === comment && _self.globalItem) {
                            _self.editCommentBox(i);
                        }
                    }
                }
            });
            // sign in button
            on(dom.byId("mainPanel"), "#signInRate:click, #signInRate:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.portalSignIn().then(function() {
                        _self.getComments();
                        _self.setRatingInfo();
                    });
                }
            });
        },
        /*------------------------------------*/
        // show autocomplete
        /*------------------------------------*/
        showAutoComplete: function(results) {
            var _self = this;
            var aResults = '';
            var partialMatch = domAttr.get(dom.byId('searchAddress'), 'value');
            var regex = new RegExp('(' + partialMatch + ')', 'gi');
            if (results && results.candidates.length > 0) {
                query(".searchList").forEach(function(entry) {
                    domClass.add(entry, 'autoCompleteOpen');
                });
                _self.ACObj = results;
                aResults += '<ul class="zebraStripes">';
                for (var i = 0; i < results.candidates.length && i < 6; i++) {
                    var layerClass = '';
                    if (i % 2 === 0) {
                        layerClass = '';
                    } else {
                        layerClass = 'stripe';
                    }
                    aResults += '<li tabindex="0" class="' + layerClass + '" data-text="' + results.candidates[i].address + '">' + results.candidates[i].address.replace(regex, '<span>' + partialMatch + '</span>') + '</li>';
                }
                aResults += '</ul>';
                var node = dom.byId('autoComplete');
                if (node) {
                    _self.setNodeHTML(node, aResults);
                    domStyle.set(node, 'display', 'block');
                }
            } else {
                _self.hideAutoComplete();
            }
        },
        /*------------------------------------*/
        // map now loaded
        /*------------------------------------*/
        mapNowLoaded: function(layers, response) {
            var _self = this;
            // Map Loaded Class
            domClass.add(dom.byId('map'), 'mapLoaded');
            // if overview map
            if (_self._options.showOverviewMap) {
                //add the overview map
                var overviewMapDijit = new OverviewMap({
                    map: _self.map,
                    attachTo: "bottom-left",
                    visible: false
                });
                overviewMapDijit.startup();
            }
            _self.initUI(layers, response);
            // add popup theme
            domClass.add(_self.map.infoWindow.domNode, _self._options.theme);
        },
        /*------------------------------------*/
        // clear the locate graphic
        /*------------------------------------*/
        clearLocate: function() {
            var _self = this;
            // if locate layer exists
            if (_self.locateResultLayer) {
                // clear it
                _self.locateResultLayer.clear();
            }
            // reset locate string
            _self.locateString = "";
        },
        /*------------------------------------*/
        // Locate
        /*------------------------------------*/
        locate: function() {
            var _self = this;
            var def = new Deferred();
            var query = dom.byId("searchAddress").value;
            if (query && _self.map) {
                var queryContent = {
                    "SingleLine": query,
                    "outSR": _self.map.spatialReference.wkid,
                    "outFields": "*",
                    "f": "json"
                };
                // send request
                esriRequest({
                    url: _self._options.helperServices.geocode[0].url + '/findAddressCandidates',
                    content: queryContent,
                    handleAs: 'json',
                    callbackParamName: 'callback',
                    // on load
                    load: function(data) {
                        def.resolve(data);
                    }
                });
            }
            return def;
        },
        /*------------------------------------*/
        // Show search results
        /*------------------------------------*/
        showResults: function(results, resultNumber) {
            var _self = this;
            // remove spinner
            _self.removeSpinner();
            // hide autocomplete
            _self.hideAutoComplete();
            var candidates = results.candidates;
            // if result found
            if (candidates.length > 0 && _self.map) {
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
                    extent = new Extent({
                        "xmin": candidates[numResult].attributes.Xmin,
                        "ymin": candidates[numResult].attributes.Ymin,
                        "xmax": candidates[numResult].attributes.Xmax,
                        "ymax": candidates[numResult].attributes.Ymax,
                        "spatialReference": results.spatialReference
                    });
                    // set map extent to location
                    _self.map.setExtent(webMercatorUtils.geographicToWebMercator(extent));
                } else if (
                candidates[numResult].attributes.hasOwnProperty('westLon') && candidates[numResult].attributes.hasOwnProperty('southLat') && candidates[numResult].attributes.hasOwnProperty('eastLon') && candidates[numResult].attributes.hasOwnProperty('northLat')) {
                    // result has lat/lon extent attributes
                    // new extent
                    extent = new Extent({
                        "xmin": candidates[numResult].attributes.westLon,
                        "ymin": candidates[numResult].attributes.southLat,
                        "xmax": candidates[numResult].attributes.eastLon,
                        "ymax": candidates[numResult].attributes.northLat,
                        "spatialReference": results.spatialReference
                    });
                    // set map extent to location
                    _self.map.setExtent(webMercatorUtils.geographicToWebMercator(extent));
                } else {
                    // use point
                    _self.map.centerAndZoom(candidates[numResult].location, 14);
                }
                point = new Point({
                    "x": candidates[numResult].location.x,
                    "y": candidates[numResult].location.y,
                    " spatialReference": results.spatialReference
                });
                // if point graphic set
                if (_self._options.pointGraphic) {
                    // if locate results
                    if (_self.locateResultLayer) {
                        connect.disconnect(_self.resultConnect);
                        _self.map.removeLayer(_self.locateResultLayer);
                        _self.locateResultLayer = false;
                    }
                    _self.locateResultLayer = new GraphicsLayer();
                    _self.resultConnect = connect.connect(_self.locateResultLayer, 'onClick', function(evt) {
                        // stop overriding events
                        event.stop(evt);
                        // clear popup
                        _self.map.infoWindow.clearFeatures();
                        // set popup content
                        _self.map.infoWindow.setContent('<strong>' + evt.graphic.attributes.address + '</strong>');
                        // set popup title
                        _self.map.infoWindow.setTitle('Address');
                        // set popup geometry
                        _self.map.infoWindow.show(evt.mapPoint);
                    });
                    _self.map.addLayer(_self.locateResultLayer);
                    // create point marker
                    var pointSymbol = new PictureMarkerSymbol(_self._options.pointGraphic, 21, 25).setOffset(0, 12);
                    // create point graphic
                    var locationGraphic = new Graphic(point, pointSymbol);
                    // graphic with address
                    locationGraphic.setAttributes({
                        "address": candidates[numResult].address
                    });
                    _self.locateResultLayer.add(locationGraphic);
                }
            } else {
                // show error dialog
                var dialog = new Dialog({
                    title: i18n.viewer.errors.general,
                    content: i18n.viewer.errors.noSearchResults
                });
                dialog.show();
            }
        },
        /*------------------------------------*/
        // Basemap Gallery
        /*------------------------------------*/
        createBasemapGallery: function() {
            var _self = this;
            var html = '';
            // insert HTML for basemap
            html += '<div tabindex="0" class="silverButton buttonSingle" id="basemapButton"><span class="basemapArrowButton">&nbsp;</span>' + i18n.viewer.mapPage.switchBasemap + '</div>';
            html += '<div class="clear"></div>';
            html += '<div id="basemapGallery"></div>';
            // if node exists
            var node = dom.byId("basemapContainer");
            _self.setNodeHTML(node, html);
            //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: _self._options.showArcGISBasemaps,
                basemapsGroup: _self._options.basemapsGroup,
                map: _self.map
            }, domConstruct.create("div"));
            dom.byId("basemapGallery").appendChild(basemapGallery.domNode);
            // start it up!
            basemapGallery.startup();
            // if something bad happened
            connect.connect(basemapGallery, "onError", function(msg) {
                // show error dialog
                var dialog = new Dialog({
                    title: i18n.viewer.errors.general,
                    content: msg
                });
                dialog.show();
            });
            connect.connect(basemapGallery, "onSelectionChange", function() {
                // show error dialog
                domClass.remove(dom.byId('basemapButton'), 'buttonSelected open');
                domStyle.set(dom.byId('basemapGallery'), 'display', 'none');
            });
            // toggle basemap button
            on(dom.byId("basemapButton"), "click, keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // get nodes
                    var node = dom.byId('basemapGallery');
                    // if they exist
                    if (node) {
                        // remove classes
                        domClass.remove(this, 'buttonSelected open');
                        // if already shown
                        if (domStyle.get(node, 'display') === 'block') {
                            // hide
                            domStyle.set(node, 'display', 'none');
                        } else {
                            // show and add class
                            domStyle.set(node, 'display', 'block');
                            domClass.add(this, 'buttonSelected open');
                        }
                    }
                }
            });
        },
        /*------------------------------------*/
        // Set search address html
        /*------------------------------------*/
        setAddressContainer: function() {
            var _self = this;
            var html = '';
            html += '<div class="grid_4 alpha searchListCon">';
            if (_self._options.helperServices.geocode[0].url && _self._options.showMapSearch) {
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
            var node = dom.byId("addressContainer");
            _self.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Insert Menu Tab HTML
        /*------------------------------------*/
        insertMenuTabs: function() {
            var _self = this;
            var html = '';
            html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.legendButtonTitle + '" id="showLegend" class="toggleButton buttonLeft buttonSelected"><span class="icon"></span></div>';
            if (_self._options.showLayerToggle) {
                html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.layersButton + '" id="showLayers" class="toggleButton buttonCenter"><span class="icon"></span></div>';
            }
            html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.aboutButtonTitle + '" id="showAbout" class="toggleButton buttonRight"><span class="icon"></span></div>';
            html += '<div class="clear"></div>';
            // Set
            var node = dom.byId("tabMenu");
            _self.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Add bottom map buttons
        /*------------------------------------*/
        addBottomMapButtons: function() {
            var _self = this;
            var html = '';
            if (_self._options.showExplorerButton && !_self.isMobileUser()) {
                // add open in explorer button
                html += '<a tabindex="0" target="_blank" href="' + _self.getViewerURL('explorer', _self._options.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInExplorer + '</a>';
            }
            if (_self._options.showArcGISOnlineButton) {
                // add open in arcgis button
                html += '<a tabindex="0" target="_blank" href="' + _self.getViewerURL('arcgis', _self._options.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInArcGIS + '</a>';
            }
            // If mobile user
            if (_self.isMobileUser() && _self._options.showMobileButtons) {
                // add button
                html += '<a tabindex="0" href="' + _self.getViewerURL('mobile', _self._options.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInMobile + '</a>';
                // add app button
                html += '<a tabindex="0" href="' + _self.getViewerURL('mobile_app') + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.getMobileApp + '</a>';
            }
            if (html === '') {
                html = '&nbsp;';
            }
            // insert
            var node = dom.byId("mapButtons");
            _self.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // global item creation
        /*------------------------------------*/
        setGlobalItem: function(obj) {
            var _self = this;
            var def = new Deferred();
            // default values
            var settings = {
                // Group Owner
                id: '',
                // format
                dataType: 'json'
            };
            // If options exist, lets merge them with our default settings
            if (obj) {
                lang.mixin(settings, obj);
            }
            var q = 'id:' + settings.id;
            var params = {
                q: q,
                v: _self._options.arcgisRestVersion,
                f: settings.dataType
            };
            _self._portal.queryItems(params).then(function(result) {
                // set global item
                _self.globalItem = result.results[0];
                def.resolve(settings);
            });
            return def;
        },
        /*------------------------------------*/
        // Sort comments by date
        /*------------------------------------*/
        commentSort: function(a, b) {
            if (a.created > b.created) {
                return -1;
            } else if (a.created === b.created) {
                return 0;
            } else {
                return 1;
            }
        },
        /*------------------------------------*/
        // Builds listing of comments
        /*------------------------------------*/
        buildComments: function() {
            var _self = this;
            // html
            var html = '';
            html += '<h2>' + i18n.viewer.comments.commentsHeader + ' (' + number.format(_self.globalComments.length) + ') <span id="commentSpinner"></span></h2>';
            html += '<div class="addCommentBlock">';
            if (_self.globalUser) {
                html += '<div><textarea id="commentText" rows="5"></textarea></div>';
                html += '<div><span id="addComment" class="silverButton buttonSingle">' + i18n.viewer.comments.addCommentButton + '</span></div>';
            } else {
                html += '<div><a id="signInPortal">' + i18n.viewer.comments.signIn + '</a> ' + i18n.viewer.comments.or + ' <a target="_blank" href="' + _self.getViewerURL('signup_page') + '">' + i18n.viewer.comments.register + '</a> ' + i18n.viewer.comments.toPost + '</div>';
            }
            html += '</div>';
            html += '<div class="clear"></div>';
            if (_self.globalComments && _self.globalComments.length > 0) {
                for (var i = 0; i < _self.globalComments.length; i++) {
                    var isOwner = false;
                    if (_self.globalUser) {
                        if (_self.globalComments[i].owner === _self.globalUser.username) {
                            isOwner = true;
                        }
                    }
                    html += '<div id="comment_' + _self.globalComments[i].id + '" class="comment">';
                    html += '<div id="spinner_' + _self.globalComments[i].id + '" class="commentBodySpinner"></div>';
                    html += '<div class="commentBody">';
                    html += '<p>';
                    html += _self.parseURL(decodeURIComponent(_self.globalComments[i].comment));
                    if (isOwner) {
                        html += '<p>';
                        html += '<a class="editComment" data-comment="' + _self.globalComments[i].id + '">';
                        html += i18n.viewer.comments.editComment;
                        html += '</a> ';
                        html += '<a class="deleteComment" data-comment="' + _self.globalComments[i].id + '">';
                        html += i18n.viewer.comments.deleteComment;
                        html += '</a> ';
                        html += '</p>';
                    }
                    html += '</p>';
                    html += '<div class="smallText">';
                    // date object
                    var commentDate = new Date(_self.globalComments[i].created);
                    // date format for locale
                    var dateLocale = locale.format(commentDate, {
                        selector: "date",
                        datePattern: i18n.viewer.main.datePattern
                    });
                    html += i18n.viewer.comments.posted + ' ' + dateLocale;
                    html += ' ' + i18n.viewer.comments.by + ' ';
                    if (_self._options.showProfileUrl) {
                        html += '<a target="_blank" href="' + _self.getViewerURL('owner_page', false, _self.globalComments[i].owner) + '">';
                    }
                    html += _self.globalComments[i].owner;
                    if (_self._options.showProfileUrl) {
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
            var commentsNode = dom.byId("comments");
            _self.setNodeHTML(commentsNode, html);
        },
        /*------------------------------------*/
        // Add Comment
        /*------------------------------------*/
        addCommentToItem: function() {
            var _self = this;
            // text value
            var text = dom.byId("commentText").value;
            // if set
            if (text) {
                // sign in
                _self.portalSignIn().then(function() {
                    if (_self.globalItem) {
                        // spinner
                        _self.addSpinner('commentSpinner');
                        // comment
                        _self.globalItem.addComment(text).then(function() {
                            // get comments
                            _self.getComments();
                        });
                    }
                });
            }
        },
        /*------------------------------------*/
        // get comments
        /*------------------------------------*/
        getComments: function() {
            var _self = this;
            if (_self._options.showComments) {
                _self.globalItem.getComments().then(function(comments) {
                    // remove any spinners
                    _self.removeSpinner();
                    // set global comments
                    _self.globalComments = comments.sort(_self.commentSort);
                    // create comments list
                    _self.buildComments();
                });
            }
        },
        /*------------------------------------*/
        // Get updated rating
        /*------------------------------------*/
        reQueryRating: function() {
            var _self = this;
            _self.setGlobalItem({
                // Group Owner
                id: _self._options.webmap
            }).then(function() {
                // set rating
                _self.setRatingInfo();
            });
        },
        /*------------------------------------*/
        // Set Rating Connection
        /*------------------------------------*/
        setRatingConnect: function() {
            var _self = this;
            // if connect exists
            if (_self.ratingConnect) {
                // disconnect it
                connect.disconnect(_self.ratingConnect);
            }
            // rating connects
            _self.ratingConnect = connect.connect(_self.ratingWidget, "onChange", function(value) {
                // clear rating timeout
                clearTimeout(_self.ratingTimer);
                // set timeout
                _self.ratingTimer = setTimeout(function() {
                    // if logged in
                    if (_self.globalUser) {
                        // if value and it's a valid number
                        if (value > -1 && value < 6) {
                            // parse value
                            var widgetVal = parseInt(value, 10);
                            // if global item and widget exists
                            if (_self.globalItem && widgetVal) {
                                // rate
                                _self.globalItem.addRating(widgetVal).then(function() {
                                    // query new info
                                    _self.reQueryRating();
                                }, function() {
                                    // query new info
                                    _self.reQueryRating();
                                });
                            }
                        }
                    }
                }, 500);
            });
        },
        /*------------------------------------*/
        // Set Rating Information
        /*------------------------------------*/
        setRatingInfo: function() {
            var _self = this;
            var html = '';
            // if ratings enabled
            if (_self._options.showRatings) {
                // if widget exists
                if (_self.ratingWidget) {
                    // destroy it
                    _self.ratingWidget.destroy();
                }
                // rating widget
                _self.ratingWidget = new Rating({
                    numStars: 5,
                    value: _self.globalItem.avgRating
                }, null);
                // connection
                _self.setRatingConnect();
            }
            // rating container
            html += '<div class="ratingCon" id="ratingCon">';
            // if not logged in
            if (!_self.globalUser && _self._options.showRatings) {
                html += '&nbsp;<a id="signInRate">' + i18n.viewer.rating.signIn + '</a> ' + i18n.viewer.rating.toRate;
            }
            var rating = '';
            if (_self._options.showRatings) {
                // Ratings
                if (_self.globalItem.numRatings) {
                    var pluralRatings = i18n.viewer.itemInfo.ratingsLabel;
                    if (_self.globalItem.numRatings > 1) {
                        pluralRatings = i18n.viewer.itemInfo.ratingsLabelPlural;
                    }
                    rating += number.format(_self.globalItem.numRatings) + ' ' + pluralRatings;
                }
            }
            if (_self._options.showComments) {
                // comments
                if (_self.globalItem.numComments) {
                    if (_self.globalItem.numRatings) {
                        rating += i18n.viewer.itemInfo.separator + ' ';
                    }
                    var pluralComments = i18n.viewer.itemInfo.commentsLabel;
                    if (_self.globalItem.numComments > 1) {
                        pluralComments = i18n.viewer.itemInfo.commentsLabelPlural;
                    }
                    rating += number.format(_self.globalItem.numComments) + ' ' + pluralComments;
                }
            }
            // views
            if (_self._options.showViews && _self.globalItem.numViews) {
                if ((_self.globalItem.numRatings && _self._options.showRatings) || (_self.globalItem.numComments && _self._options.showComments)) {
                    rating += i18n.viewer.itemInfo.separator + ' ';
                }
                var pluralViews = i18n.viewer.itemInfo.viewsLabel;
                if (_self.globalItem.numViews > 1) {
                    pluralViews = i18n.viewer.itemInfo.viewsLabelPlural;
                }
                rating += number.format(_self.globalItem.numViews) + ' ' + pluralViews;
            }
            if (rating) {
                html += ' (' + rating + ')';
            }
            // close container
            html += '</div>';
            var ratingNode = dom.byId("rating");
            _self.setNodeHTML(ratingNode, html);
            if (_self._options.showRatings) {
                if (_self.globalUser) {
                    // rating widget
                    domConstruct.place(_self.ratingWidget.domNode, dom.byId("ratingCon"), "first");
                } else {
                    // rating widget
                    domConstruct.place(_self.ratingWidget.domNode.innerHTML, dom.byId("ratingCon"), "first");
                }
            }
        },
        /*------------------------------------*/
        // Init Map
        /*------------------------------------*/
        initMap: function() {
            var _self = this;
            // set map content
            _self.setDelegations();
            // set map buttons
            _self.setInnerMapButtons();
            // ITEM
            var itemDeferred = arcgisUtils.getItem(_self._options.webmap);
            itemDeferred.addErrback(function(error) {
                // show error dialog
                var dialog = new Dialog({
                    title: i18n.viewer.errors.general,
                    content: i18n.viewer.errors.createMap + error
                });
                dialog.show();
                // hide all content
                _self.hideAllContent();
            });
            itemDeferred.addCallback(function(itemInfo) {
                // set global portal item
                _self.setGlobalItem({
                    // Group Owner
                    id: _self._options.webmap
                }).then(function() {
                    // get comments
                    _self.getComments();
                    // set rating
                    _self.setRatingInfo();
                });
                // if it's a webmap
                if (itemInfo && itemInfo.item && itemInfo.item.type === 'Web Map') {
                    // insert menu tab html
                    _self.insertMenuTabs();
                    // insert address html
                    _self.setAddressContainer();
                    // if no title set in config
                    if (!_self._options.mapTitle) {
                        _self._options.mapTitle = itemInfo.item.title || "";
                    }
                    // if no subtitle set in config
                    if (!_self._options.mapSnippet) {
                        _self._options.mapSnippet = itemInfo.item.snippet || "";
                    }
                    // if no description set in config
                    if (!_self._options.mapItemDescription) {
                        _self._options.mapItemDescription = itemInfo.item.description || "";
                    }
                    // Set title
                    var titleNode = dom.byId("title");
                    _self.setNodeHTML(titleNode, _self._options.mapTitle);
                    // Set subtitle
                    var subTitleNode = dom.byId("subtitle");
                    _self.setNodeHTML(subTitleNode, _self.parseURL(_self._options.mapSnippet));
                    var d, dateLocale;
                    var html = '';
                    html += '<h2>' + i18n.viewer.mapPage.moreInformation + '</h2>';
                    html += '<ul class="moreInfoList">';
                    // Created Date
                    if (itemInfo.item.created) {
                        // date object
                        d = new Date(itemInfo.item.created);
                        // date format for locale
                        dateLocale = locale.format(d, {
                            selector: "date",
                            datePattern: i18n.viewer.main.datePattern
                        });
                        html += '<li><strong>' + i18n.viewer.mapPage.createdLabel + '</strong><br />' + dateLocale + '</li>';
                    }
                    // Modified Date
                    if (itemInfo.item.modified) {
                        // date object
                        d = new Date(itemInfo.item.modified);
                        // date format for locale
                        dateLocale = locale.format(d, {
                            selector: "date",
                            datePattern: i18n.viewer.main.datePattern
                        });
                        html += '<li><strong>' + i18n.viewer.itemInfo.modifiedLabel + '</strong><br />' + dateLocale + '</li>';
                    }
                    // if showMoreInfo is set
                    if (_self._options.showMoreInfo) {
                        // item page link
                        html += '<li>';
                        html += '<strong>' + i18n.viewer.mapPage.detailsLabel + '</strong><br />';
                        html += '<a id="mapContentsLink" href="' + _self.getViewerURL('item_page') + '" target="_blank">' + i18n.viewer.mapPage.arcgisLink + '</a>';
                        html += '</li>';
                    }
                    html += '</ul>';
                    // set html to node
                    var mapMoreInfo = dom.byId("mapMoreInfo");
                    _self.setNodeHTML(mapMoreInfo, html);
                    // if no license info set in config
                    if (!_self._options.mapLicenseInfo) {
                        _self._options.mapLicenseInfo = itemInfo.item.licenseInfo || "";
                    }
                    // Set license info
                    var licenseInfo = dom.byId("licenseInfo");
                    if (licenseInfo && _self._options.mapLicenseInfo && _self._options.showLicenseInfo) {
                        _self.setNodeHTML(licenseInfo, '<h2>' + i18n.viewer.mapPage.constraintsHeading + '</h2>' + _self._options.mapLicenseInfo);
                    }
                    // Set description
                    var descriptionInfo = _self._options.mapItemDescription || i18n.viewer.mapPage.noDescription;
                    var descNode = dom.byId("descriptionContent");
                    _self.setNodeHTML(descNode, '<h2>' + i18n.viewer.mapPage.aboutHeader + '</h2>' + descriptionInfo + '<div class="clear"></div>');
                    // set page title
                    if (_self._options.mapTitle) {
                        document.title = _self._options.siteTitle + ' - ' + _self._options.mapTitle;
                    } else {
                        document.title = _self._options.siteTitle;
                    }
                    // add bottom map buttons
                    _self.addBottomMapButtons();
                    // create map
                    var mapDeferred = arcgisUtils.createMap(itemInfo, "map", {
                        mapOptions: {
                            slider: true,
                            sliderStyle: "small",
                            wrapAround180: true,
                            showAttribution: _self._options.showAttribution,
                            attributionWidth: 0.40,
                            nav: false
                        },
                        ignorePopups: false,
                        bingMapsKey: _self._options.bingMapsKey,
                        geometryServiceURL: _self._options.helperServices.geometry.url
                    });
                    // map response
                    mapDeferred.addCallback(function(response) {
                        // set map
                        _self.map = response.map;
                        // operation layers
                        var layers = response.itemInfo.itemData.operationalLayers;
                        var html = '';
                        var mapLayersNode = dom.byId('mapLayers');
                        html += '<h2>' + i18n.viewer.mapPage.layersHeader + '</h2>';
                        // Layer toggles
                        if (_self._options.showLayerToggle && layers.length > 0 && mapLayersNode) {
                            html += '<table id="mapLayerToggle">';
                            html += "<tbody>";
                            for (var j = 0; j < layers.length; j++) {
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
                                        for (var k = 0; k < layers[j].featureCollection.layers.length; k++) {
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
                        _self.setNodeHTML(mapLayersNode, html);
                        // ENDLAYER TOGGLE
                        if (_self.map.loaded) {
                            _self.mapNowLoaded(layers, response);
                        } else {
                            connect.connect(_self.map, "onLoad", function() {
                                _self.mapNowLoaded(layers);
                            });
                        }
                    });
                    mapDeferred.addErrback(function(error) {
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: i18n.viewer.errors.createMap + " : " + error
                        });
                        dialog.show();
                        // hide all content
                        _self.hideAllContent();
                    });
                    itemDeferred.addErrback(function(error) {
                        var dialog;
                        // don't i18n this. I'ts returned from the server
                        if (error && error.message === "BingMapsKey must be provided.") {
                            dialog = new Dialog({
                                title: i18n.viewer.errors.general,
                                content: i18n.viewer.errors.bingError
                            });
                            dialog.show();
                        } else {
                            // show error dialog
                            dialog = new Dialog({
                                title: i18n.viewer.errors.general,
                                content: i18n.viewer.errors.createMap + " : " + error
                            });
                            dialog.show();
                            // hide all content
                            _self.hideAllContent();
                        }
                    });
                } else {
                    // show error dialog
                    var dialog = new Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.createMap
                    });
                    dialog.show();
                    // hide all content
                    _self.hideAllContent();
                }
            });
        },
        /*------------------------------------*/
        // TOGGLE LAYER
        /*------------------------------------*/
        toggleLayerSwitch: function(layerid) {
            var _self = this;
            var layer = _self.map.getLayer(layerid);
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
        },
        /*------------------------------------*/
        // INIT UI
        /*------------------------------------*/
        initUI: function(layers, response) {
            var _self = this;
            // Set legend header
            var node = dom.byId('legendHeader');
            _self.setNodeHTML(node, i18n.viewer.sidePanel.title);
            // Set basemap gallery
            if (_self._options.showBasemapGallery) {
                _self.createBasemapGallery();
            }
            // Set map background image
            domStyle.set(dom.byId('map'), 'background-image', 'none');
            // Setup resize map
            connect.connect(window, "onresize", _self.resizeMap);
            //add scalebar
            _self.scalebar = new Scalebar({
                map: _self.map,
                scalebarUnit: i18n.viewer.main.scaleBarUnits
            });
            // Legend Information
            var layerInfo = arcgisUtils.getLegendLayers(response);
            // Build Legend
            if (layerInfo.length > 0) {
                var legendDijit = new Legend({
                    map: _self.map,
                    layerInfos: layerInfo
                }, "legendContent");
                legendDijit.startup();
            } else {
                var legendContentNode = dom.byId('legendContent');
                _self.setNodeHTML(legendContentNode, i18n.viewer.errors.noLayers);
            }
        },
        /*------------------------------------*/
        // Resize and Reposition Map
        /*------------------------------------*/
        mapResizeAndReposition: function() {
            var _self = this;
            _self.map.resize();
            _self.map.reposition();
        },
        /*------------------------------------*/
        // Resize Map And Center
        /*------------------------------------*/
        resizeMapAndCenter: function() {
            var _self = this;
            clearTimeout(_self.resizeTimer);
            _self.resizeTimer = setTimeout(function() {
                _self.mapResizeAndReposition();
                if (_self.mapCenter.x && _self.mapCenter.y) {
                    setTimeout(function() {
                        _self.map.centerAt(_self.mapCenter);
                        _self.mapResizeAndReposition();
                    }, 500);
                }
            }, 500);
        },
        /*------------------------------------*/
        // Resize Map
        /*------------------------------------*/
        resizeMap: function() {
            var _self = this;
            clearTimeout(_self.resizeTimer);
            if (_self.map) {
                _self.resizeTimer = setTimeout(function() {
                    if (typeof _self.mapResizeAndReposition === 'function') {
                        _self.mapResizeAndReposition();
                    }
                }, 500);
            }
        },
        /*------------------------------------*/
        // ZOOM TO LOCATION: ZOOMS MAP TO LOCATION POINT
        /*------------------------------------*/
        zoomToLocation: function(x, y) {
            var _self = this;
            // calculate lod
            var lod = 16;
            // set point
            var pt = webMercatorUtils.geographicToWebMercator(new Point(x, y));
            // if point graphic set
            if (Options.pointGraphic) {
                // If locate layer
                if (_self.locateResultLayer) {
                    // clear layer
                    _self.locateResultLayer.clear();
                } else {
                    // Create layer for result
                    _self.locateResultLayer = new GraphicsLayer();
                    // Add layer to map
                    _self.map.addLayer(_self.locateResultLayer);
                }
                // Create point symbol
                var pointSymbol = new PictureMarkerSymbol(Options.pointGraphic, 21, 25).setOffset(0, 12);
                // Set graphic
                var locationGraphic = new Graphic(pt, pointSymbol);
                // Add graphic to layer
                _self.locateResultLayer.add(locationGraphic);
            }
            // zoom and center
            _self.map.centerAndZoom(pt, lod);
        },
        /*------------------------------------*/
        // GEOLOCATE FUNCTION: SETS MAP LOCATION TO USERS LOCATION
        /*------------------------------------*/
        geoLocateMap: function(position) {
            var _self = this;
            // Get lattitude
            var latitude = position.coords.latitude;
            // Get longitude
            var longitude = position.coords.longitude;
            // Zoom to location
            _self.zoomToLocation(longitude, latitude);
        }
    });
});