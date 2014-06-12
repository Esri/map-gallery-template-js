define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/i18n!./nls/template.js",
    "dojo/dom-style",
    "dojo/number",
    "esri/arcgis/utils",
    "config/options",
    "dijit/Dialog",
    "application/common",
    "dojo/date/locale",
    "dojo/ready",
    "dojox/form/Rating",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "esri/dijit/OverviewMap",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Scalebar",
    "esri/dijit/Legend",
    "dojo/keys",
    "esri/dijit/Geocoder",
    "esri/dijit/LocateButton",
    "esri/dijit/HomeButton",
    "esri/lang"
],
function(declare, lang, array, Deferred, dom, on, query, i18n, domStyle, number, arcgisUtils, Options, Dialog, Common, locale, ready, Rating, domAttr, domClass, domConstruct, OverviewMap, BasemapGallery, Scalebar, Legend, keys, Geocoder, LocateButton, HomeButton, esriLang) {
    return declare("application.map", [Common], {
        constructor: function() { /*------------------------------------*/
            // on dojo load
            /*------------------------------------*/
            ready(lang.hitch(this, function() {
                this._options = Options;
                // set default options
                this.setDefaultOptions();
                this.queryOrganization().then(lang.hitch(this, function() {
                    // set app ID settings and call setWebmap after
                    this.setAppIdSettings().then(lang.hitch(this, function() {
                        // create portal
                        this.createPortal().then(lang.hitch(this, function() {
                            // query group info
                            this.queryGroup().then(lang.hitch(this, function() {
                                // set webmap info
                                this.setWebmap();
                            }));
                        }));
                    }));
                }));
            }));
        },
        /*------------------------------------*/
        // Sets the webmap to load
        /*------------------------------------*/
        setWebmap: function() {
            // if webmap set
            if (this._options.webmap) {
                // init map page
                this.initMap();
            }
            // get first map in group if no webmap is set
            else {
                // call featured maps function to get 1 webmap
                this.queryArcGISGroupItems({
                    // settings
                    id_group: this._options.group,
                    searchType: "Web Map",
                    filterType: "Web Mapping Application",
                    sortField: this._options.sortField,
                    sortOrder: this._options.sortOrder,
                    perPage: 1
                }).then(lang.hitch(this, function(obj, data) {
                    // if group has at least 1 webmap
                    if (data.results.length > 0) {
                        // set webmap
                        this._options.webmap = data.results[0].id;
                        // init map page
                        this.initMap();
                    } else {
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: i18n.viewer.errors.noSearchResults
                        });
                        dialog.show();
                    }
                }));
            }
        },
        /*------------------------------------*/
        // Toggle full screen map view
        /*------------------------------------*/
        toggleFullscreenMap: function(value) {
            var buttonText;
            // Record center of map
            this.mapCenter = this.map.extent.getCenter();
            // if true, fullscreen
            if (value) {
                // button text
                buttonText = i18n.viewer.mapPage.exitFullscreen;
                // change html class
                domClass.add(query("html")[0], 'fullScreen');
                // set buttton classes and text
                domAttr.set(dom.byId('fullScreen'), 'title', buttonText);
                // toggle global variable
                this.mapFullscreen = true;
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
                this.mapFullscreen = false;
            }
            // reset center of map
            this.resizeMapAndCenter();
        },
        /*------------------------------------*/
        // Tabs
        /*------------------------------------*/
        tabMenu: function(menuObj, buttonObj) {
            // hide all tabs
            query('.tabMenu').forEach(lang.hitch(this, function(entry) {
                domStyle.set(entry, 'display', 'none');
            }));
            // remove selected button class
            query('#tabMenu .toggleButton').forEach(lang.hitch(this, function(entry) {
                domClass.remove(entry, 'buttonSelected');
            }));
            // show new tab
            domStyle.set(menuObj, 'display', 'block');
            // set new tab button to selected
            domClass.add(buttonObj, 'buttonSelected');
        },
        /*------------------------------------*/
        // Map Buttons
        /*------------------------------------*/
        setInnerMapButtons: function() {
            var html = '';
            // fullscreen button
            html += '<div tabindex="0" title="' + i18n.viewer.mapPage.enterFullscreen + '" class="mapButton buttonSingle" id="fullScreen"><span class="fullScreenButton">&nbsp;</span></div>';
            // insert html
            domConstruct.place(html, "map", "last");
            // fullscreen button
            on(dom.byId("fullScreen"), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // if currently in full screen
                    if (!this.mapFullscreen) {
                        // enter fullscreen
                        this.toggleFullscreenMap(true);
                    } else {
                        // exit fullscreen
                        this.toggleFullscreenMap(false);
                    }
                }
            }));
        },
        // add edit comment box
        editCommentBox: function(i) {
            // get text of comment
            var text = this.globalComments[i].comment;
            // set HTML for comment area
            var html = '';
            html += '<div class="editArea">';
            html += '<div><textarea id="editcomment_' + this.globalComments[i].id + '" rows="5">' + text + '</textarea></div>';
            html += '<div><span class="silverButton buttonSingle editCommentCancel" data-comment="' + this.globalComments[i].id + '">' + i18n.viewer.buttons.cancel + '</span>&nbsp;<span class="mapButton buttonSingle editCommentSubmit" data-comment="' + this.globalComments[i].id + '">' + i18n.viewer.buttons.submit + '</span></div>';
            html += '</div>';
            // find node to add edit text area
            var commentBody = query('#comment_' + this.globalComments[i].id + ' .commentBody')[0];
            // insert it before body
            domConstruct.place(html, commentBody, "before");
            // hide comment
            domStyle.set(commentBody, 'display', 'none');
            // edit comment submit
            on(query('.editCommentSubmit', dom.byId("mainPanel")), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(e.currentTarget, 'data-comment');
                    for (var i = 0; i < this.globalComments.length; i++) {
                        if (this.globalComments[i].id === comment && this.globalItem) {
                            this.editCommentSubmit(i, comment);
                        }
                    }
                }
            }));
            // cancel edit comment
            on(query('.editCommentCancel', dom.byId("mainPanel")), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(e.currentTarget, 'data-comment');
                    for (var i = 0; i < this.globalComments.length; i++) {
                        if (this.globalComments[i].id === comment && this.globalItem) {
                            this.cancelEditComment(i);
                        }
                    }
                }
            }));
        },
        // submit edited comment
        editCommentSubmit: function(i, commentid) {
            // get text of edit comment box
            var text = dom.byId("editcomment_" + commentid).value;
            // set global comment number to new text
            this.globalComments[i].comment = text;
            // spinner
            this.addSpinner('commentSpinner');
            // spinner
            this.addSpinner('spinner_' + commentid);
            // edit comment
            this.globalItem.updateComment(this.globalComments[i]).then(lang.hitch(this, function() {
                // requery comments
                this.getComments();
            }), lang.hitch(this, function() {
                // requery comments
                this.getComments();
            }));
        },
        // cancel editing of a comment
        cancelEditComment: function(i) {
            // get comment body
            var commentBody = query('#comment_' + this.globalComments[i].id + ' .commentBody')[0];
            // show it
            domStyle.set(commentBody, 'display', 'block');
            // remove editing comment node area
            query('#comment_' + this.globalComments[i].id + ' .editArea').forEach(domConstruct.destroy);
        },
        /*------------------------------------*/
        // Set map content
        /*------------------------------------*/
        setDelegations: function() {
            // escape button when in full screen view
            on(document, "keyup", lang.hitch(this, function(e) {
                // if esc key and map is fullscreen
                if (e.keyCode === keys.ESCAPE && this.mapFullscreen) {
                    // exit fullscreen
                    this.toggleFullscreenMap(false);
                }
            }));
        },
        /*------------------------------------*/
        // map now loaded
        /*------------------------------------*/
        mapNowLoaded: function(response) {
            // Map Loaded Class
            domClass.add(dom.byId('map'), 'mapLoaded');
            // if overview map
            if (this._options.showOverviewMap) {
                //add the overview map
                var overviewMapDijit = new OverviewMap({
                    map: this.map,
                    attachTo: "bottom-left",
                    visible: false
                });
                overviewMapDijit.startup();
            }
            this.initUI(response);
            // add popup theme
            domClass.add(this.map.infoWindow.domNode, this._options.theme);
        },
        /*------------------------------------*/
        // Basemap Gallery
        /*------------------------------------*/
        createBasemapGallery: function() {
            var html = '';
            // insert HTML for basemap
            html += '<div tabindex="0" class="silverButton buttonSingle" id="basemapButton"><span class="basemapArrowButton">&nbsp;</span>' + i18n.viewer.mapPage.switchBasemap + '</div>';
            html += '<div class="clear"></div>';
            html += '<div id="basemapGallery"></div>';
            // if node exists
            var node = dom.byId("basemapContainer");
            this.setNodeHTML(node, html);
            //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: this._options.showArcGISBasemaps,
                basemapsGroup: this._options.basemapsGroup,
                map: this.map
            }, domConstruct.create("div"));
            dom.byId("basemapGallery").appendChild(basemapGallery.domNode);
            // start it up!
            basemapGallery.startup();
            // if something bad happened
            on(basemapGallery, "error", lang.hitch(this, function(msg) {
                // show error dialog
                var dialog = new Dialog({
                    title: i18n.viewer.errors.general,
                    content: msg
                });
                dialog.show();
            }));
            on(basemapGallery, "selection-change", lang.hitch(this, function() {
                // show error dialog
                domClass.remove(dom.byId('basemapButton'), 'buttonSelected open');
                domStyle.set(dom.byId('basemapGallery'), 'display', 'none');
            }));
            // toggle basemap button
            on(dom.byId("basemapButton"), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // get nodes
                    var node = dom.byId('basemapGallery');
                    // if they exist
                    if (node) {
                        // remove classes
                        domClass.remove(e.currentTarget, 'buttonSelected open');
                        // if already shown
                        if (domStyle.get(node, 'display') === 'block') {
                            // hide
                            domStyle.set(node, 'display', 'none');
                        } else {
                            // show and add class
                            domStyle.set(node, 'display', 'block');
                            domClass.add(e.currentTarget, 'buttonSelected open');
                        }
                    }
                }
            }));
        },
        /*------------------------------------*/
        // Set search address html
        /*------------------------------------*/
        setAddressContainer: function() {
            var html = '';
            html += '<div class="grid_4 alpha searchListCon">';
            if (this._options.helperServices.geocode[0].url && this._options.showMapSearch) {
                html += '<div id="gc_search""></div>';
            } else {
                html += '&nbsp;';
            }
            html += '</div>';
            html += '<div class="grid_5 omega basemapConRel"><div id="basemapContainer">&nbsp;</div>';
            html += '</div>';
            html += '<div class="clear"></div>';
            // Set
            var node = dom.byId("addressContainer");
            this.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Insert Menu Tab HTML
        /*------------------------------------*/
        insertMenuTabs: function() {
            var html = '';
            html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.legendButtonTitle + '" id="showLegend" class="toggleButton buttonLeft buttonSelected"><span class="icon"></span></div>';
            if (this._options.showLayerToggle) {
                html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.layersButton + '" id="showLayers" class="toggleButton buttonCenter"><span class="icon"></span></div>';
            }
            html += '<div tabindex="0" title="' + i18n.viewer.sidePanel.aboutButtonTitle + '" id="showAbout" class="toggleButton buttonRight"><span class="icon"></span></div>';
            html += '<div class="clear"></div>';
            // Set
            var node = dom.byId("tabMenu");
            this.setNodeHTML(node, html);
            // show about button click
            on(dom.byId("showAbout"), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    this.tabMenu(dom.byId('aboutMenu'), e.currentTarget);
                }
            }));
            // show legend button click
            on(dom.byId("showLegend"), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    this.tabMenu(dom.byId('legendMenu'), e.currentTarget);
                }
            }));
            // show legend button click
            on(dom.byId("showLayers"), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    this.tabMenu(dom.byId('layersMenu'), e.currentTarget);
                }
            }));
        },
        /*------------------------------------*/
        // Add bottom map buttons
        /*------------------------------------*/
        addBottomMapButtons: function() {
            var html = '';
            if (this._options.showArcGISOnlineButton) {
                // add open in arcgis button
                html += '<a tabindex="0" target="_blank" href="' + this.getViewerURL('arcgis', this._options.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInArcGIS + '</a>';
            }
            // If mobile user
            if (this.isMobileUser() && this._options.showMobileButtons) {
                // add button
                html += '<a tabindex="0" href="' + this.getViewerURL('mobile', this._options.webmap) + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.openInMobile + '</a>';
                // add app button
                html += '<a tabindex="0" href="' + this.getViewerURL('mobile_app') + '" class="mapButton buttonSingle">' + i18n.viewer.mapPage.getMobileApp + '</a>';
            }
            if (html === '') {
                html = '&nbsp;';
            }
            // insert
            var node = dom.byId("mapButtons");
            this.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // global item creation
        /*------------------------------------*/
        setGlobalItem: function(obj) {
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
                v: this._options.arcgisRestVersion,
                f: settings.dataType
            };
            this._portal.queryItems(params).then(lang.hitch(this, function(result) {
                // set global item
                this.globalItem = result.results[0];
                def.resolve(settings);
            }));
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
            // html
            var html = '';
            html += '<h2>' + i18n.viewer.comments.commentsHeader + ' (' + number.format(this.globalComments.length) + ') <span id="commentSpinner"></span></h2>';
            html += '<div class="addCommentBlock">';
            if (this.globalUser) {
                html += '<div><textarea id="commentText" rows="5"></textarea></div>';
                html += '<div><span id="addComment" class="silverButton buttonSingle">' + i18n.viewer.comments.addCommentButton + '</span></div>';
            } else {
                html += '<div><a id="signInPortal">' + i18n.viewer.comments.signIn + '</a> ' + i18n.viewer.comments.or + ' <a target="_blank" href="' + this.getViewerURL('signup_page') + '">' + i18n.viewer.comments.register + '</a> ' + i18n.viewer.comments.toPost + '</div>';
            }
            html += '</div>';
            html += '<div class="clear"></div>';
            if (this.globalComments && this.globalComments.length > 0) {
                for (var i = 0; i < this.globalComments.length; i++) {
                    var isOwner = false;
                    if (this.globalUser) {
                        if (this.globalComments[i].owner === this.globalUser.username) {
                            isOwner = true;
                        }
                    }
                    html += '<div id="comment_' + this.globalComments[i].id + '" class="comment">';
                    html += '<div id="spinner_' + this.globalComments[i].id + '" class="commentBodySpinner"></div>';
                    html += '<div class="commentBody">';
                    html += '<p>';
                    html += this.parseURL(decodeURIComponent(this.globalComments[i].comment));
                    if (isOwner) {
                        html += '<p>';
                        html += '<a class="editComment" data-comment="' + this.globalComments[i].id + '">';
                        html += i18n.viewer.comments.editComment;
                        html += '</a> ';
                        html += '<a class="deleteComment" data-comment="' + this.globalComments[i].id + '">';
                        html += i18n.viewer.comments.deleteComment;
                        html += '</a> ';
                        html += '</p>';
                    }
                    html += '</p>';
                    html += '<div class="smallText">';
                    // date object
                    var commentDate = new Date(this.globalComments[i].created);
                    // date format for locale
                    var dateLocale = locale.format(commentDate, {
                        selector: "date",
                        datePattern: i18n.viewer.main.datePattern
                    });
                    html += i18n.viewer.comments.posted + ' ' + dateLocale;
                    html += ' ' + i18n.viewer.comments.by + ' ';
                    if (this._options.showProfileUrl) {
                        html += '<a target="_blank" href="' + this.getViewerURL('owner_page', false, this.globalComments[i].owner) + '">';
                    }
                    html += this.globalComments[i].owner;
                    if (this._options.showProfileUrl) {
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
            this.setNodeHTML(commentsNode, html);
            if (dom.byId("addComment")) {
                // add comment button
                on(dom.byId("addComment"), "click, keyup", lang.hitch(this, function(e) {
                    if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                        this.addCommentToItem();
                    }
                }));
            }
            if (dom.byId("signInPortal")) {
                // sign in button
                on(dom.byId("signInPortal"), "click, keyup", lang.hitch(this, function(e) {
                    if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                        this.portalSignIn().then(lang.hitch(this, function() {
                            this.getComments();
                            this.setRatingInfo();
                        }));
                    }
                }));
            }
            // delete comment
            on(query('.deleteComment', dom.byId("mainPanel")), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(e.currentTarget, 'data-comment');
                    var refreshComments = function() {
                            this.getComments();
                            this.setRatingInfo();
                        };
                    for (var i = 0; i < this.globalComments.length; i++) {
                        if (this.globalComments[i].id === comment && this.globalItem) {
                            // spinner
                            this.addSpinner('commentSpinner');
                            // spinner
                            this.addSpinner('spinner_' + comment);
                            // delete comment
                            this.globalItem.deleteComment(this.globalComments[i]).then(refreshComments, refreshComments);
                        }
                    }
                }
            }));
            // edit comment
            on(query('.editComment', dom.byId("mainPanel")), "click, keyup", lang.hitch(this, function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var comment = domAttr.get(e.currentTarget, 'data-comment');
                    for (var i = 0; i < this.globalComments.length; i++) {
                        if (this.globalComments[i].id === comment && this.globalItem) {
                            this.editCommentBox(i);
                        }
                    }
                }
            }));
        },
        /*------------------------------------*/
        // Add Comment
        /*------------------------------------*/
        addCommentToItem: function() {
            // text value
            var text = dom.byId("commentText").value;
            // if set
            if (text) {
                // sign in
                this.portalSignIn().then(lang.hitch(this, function() {
                    if (this.globalItem) {
                        // spinner
                        this.addSpinner('commentSpinner');
                        // comment
                        this.globalItem.addComment(text).then(lang.hitch(this, function() {
                            // get comments
                            this.getComments();
                        }));
                    }
                }));
            }
        },
        /*------------------------------------*/
        // get comments
        /*------------------------------------*/
        getComments: function() {
            if (this._options.showComments) {
                this.globalItem.getComments().then(lang.hitch(this, function(comments) {
                    // remove any spinners
                    this.removeSpinner();
                    // set global comments
                    this.globalComments = comments.sort(this.commentSort);
                    // create comments list
                    this.buildComments();
                }));
            }
        },
        /*------------------------------------*/
        // Get updated rating
        /*------------------------------------*/
        reQueryRating: function() {
            this.setGlobalItem({
                // Group Owner
                id: this._options.webmap
            }).then(lang.hitch(this, function() {
                // set rating
                this.setRatingInfo();
            }));
        },
        /*------------------------------------*/
        // Set Rating Connection
        /*------------------------------------*/
        setRatingConnect: function() {
            // if connect exists
            if (this.ratingConnect) {
                // disconnect it
                this.ratingConnect.remove();
            }
            // rating connects
            this.ratingConnect = on(this.ratingWidget, "change", lang.hitch(this, function(value) {
                // clear rating timeout
                clearTimeout(this.ratingTimer);
                // set timeout
                this.ratingTimer = setTimeout(lang.hitch(this, function() {
                    // if logged in
                    if (this.globalUser) {
                        // if value and it's a valid number
                        if (value > -1 && value < 6) {
                            // parse value
                            var widgetVal = parseInt(value, 10);
                            // if global item and widget exists
                            if (this.globalItem && widgetVal) {
                                // rate
                                this.globalItem.addRating(widgetVal).then(lang.hitch(this, function() {
                                    // query new info
                                    this.reQueryRating();
                                }), lang.hitch(this, function() {
                                    // query new info
                                    this.reQueryRating();
                                }));
                            }
                        }
                    }
                }), 500);
            }));
        },
        /*------------------------------------*/
        // Set Rating Information
        /*------------------------------------*/
        setRatingInfo: function() {
            var html = '';
            // if ratings enabled
            if (this._options.showRatings) {
                // if widget exists
                if (this.ratingWidget) {
                    // destroy it
                    this.ratingWidget.destroy();
                }
                // rating widget
                this.ratingWidget = new Rating({
                    numStars: 5,
                    value: this.globalItem.avgRating
                }, null);
                // connection
                this.setRatingConnect();
            }
            // rating container
            html += '<div class="ratingCon" id="ratingCon">';
            // if not logged in
            if (!this.globalUser && this._options.showRatings) {
                html += '&nbsp;<a id="signInRate">' + i18n.viewer.rating.signIn + '</a> ' + i18n.viewer.rating.toRate;
            }
            var rating = '';
            if (this._options.showRatings) {
                // Ratings
                if (this.globalItem.numRatings) {
                    var pluralRatings = i18n.viewer.itemInfo.ratingsLabel;
                    if (this.globalItem.numRatings > 1) {
                        pluralRatings = i18n.viewer.itemInfo.ratingsLabelPlural;
                    }
                    rating += number.format(this.globalItem.numRatings) + ' ' + pluralRatings;
                }
            }
            if (this._options.showComments) {
                // comments
                if (this.globalItem.numComments) {
                    if (this.globalItem.numRatings) {
                        rating += i18n.viewer.itemInfo.separator + ' ';
                    }
                    var pluralComments = i18n.viewer.itemInfo.commentsLabel;
                    if (this.globalItem.numComments > 1) {
                        pluralComments = i18n.viewer.itemInfo.commentsLabelPlural;
                    }
                    rating += number.format(this.globalItem.numComments) + ' ' + pluralComments;
                }
            }
            // views
            if (this._options.showViews && this.globalItem.numViews) {
                if ((this.globalItem.numRatings && this._options.showRatings) || (this.globalItem.numComments && this._options.showComments)) {
                    rating += i18n.viewer.itemInfo.separator + ' ';
                }
                var pluralViews = i18n.viewer.itemInfo.viewsLabel;
                if (this.globalItem.numViews > 1) {
                    pluralViews = i18n.viewer.itemInfo.viewsLabelPlural;
                }
                rating += number.format(this.globalItem.numViews) + ' ' + pluralViews;
            }
            if (rating) {
                html += ' (' + rating + ')';
            }
            // close container
            html += '</div>';
            var ratingNode = dom.byId("rating");
            this.setNodeHTML(ratingNode, html);
            if (dom.byId("signInRate")) {
                // sign in button
                on(dom.byId("signInRate"), "click, keyup", lang.hitch(this, function(e) {
                    if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                        this.portalSignIn().then(lang.hitch(this, function() {
                            this.getComments();
                            this.setRatingInfo();
                        }));
                    }
                }));
            }
            if (this._options.showRatings) {
                if (this.globalUser) {
                    // rating widget
                    domConstruct.place(this.ratingWidget.domNode, dom.byId("ratingCon"), "first");
                } else {
                    // rating widget
                    domConstruct.place(this.ratingWidget.domNode.innerHTML, dom.byId("ratingCon"), "first");
                }
            }
        },
        /*------------------------------------*/
        // Init Map
        /*------------------------------------*/
        initMap: function() {
            // set map content
            this.setDelegations();
            // set map buttons
            this.setInnerMapButtons();
            // ITEM
            var itemDeferred = arcgisUtils.getItem(this._options.webmap);
            itemDeferred.addErrback(lang.hitch(this, function(error) {
                // show error dialog
                var dialog = new Dialog({
                    title: i18n.viewer.errors.general,
                    content: i18n.viewer.errors.createMap + error
                });
                dialog.show();
                // hide all content
                this.hideAllContent();
            }));
            itemDeferred.addCallback(lang.hitch(this, function(itemInfo) {
                // set global portal item
                this.setGlobalItem({
                    // Group Owner
                    id: this._options.webmap
                }).then(lang.hitch(this, function() {
                    // get comments
                    this.getComments();
                    // set rating
                    this.setRatingInfo();
                }));
                // if it's a webmap
                if (itemInfo && itemInfo.item && itemInfo.item.type === 'Web Map') {
                    // insert menu tab html
                    this.insertMenuTabs();
                    // insert address html
                    this.setAddressContainer();
                    // if no title set in config
                    if (!this._options.mapTitle) {
                        this._options.mapTitle = itemInfo.item.title || "";
                    }
                    // if no subtitle set in config
                    if (!this._options.mapSnippet) {
                        this._options.mapSnippet = itemInfo.item.snippet || "";
                    }
                    // if no description set in config
                    if (!this._options.mapItemDescription) {
                        this._options.mapItemDescription = itemInfo.item.description || "";
                    }
                    // Set title
                    var titleNode = dom.byId("title");
                    this.setNodeHTML(titleNode, this._options.mapTitle);
                    // Set subtitle
                    var subTitleNode = dom.byId("subtitle");
                    this.setNodeHTML(subTitleNode, this.parseURL(this._options.mapSnippet));
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
                    if (this._options.showMoreInfo) {
                        // item page link
                        html += '<li>';
                        html += '<strong>' + i18n.viewer.mapPage.detailsLabel + '</strong><br />';
                        html += '<a id="mapContentsLink" href="' + this.getViewerURL('item_page', this._options.webmap) + '" target="_blank">' + i18n.viewer.mapPage.arcgisLink + '</a>';
                        html += '</li>';
                    }
                    html += '</ul>';
                    // set html to node
                    var mapMoreInfo = dom.byId("mapMoreInfo");
                    this.setNodeHTML(mapMoreInfo, html);
                    // if no license info set in config
                    if (!this._options.mapLicenseInfo) {
                        this._options.mapLicenseInfo = itemInfo.item.licenseInfo || "";
                    }
                    // Set license info
                    var licenseInfo = dom.byId("licenseInfo");
                    if (licenseInfo && this._options.mapLicenseInfo && this._options.showLicenseInfo) {
                        this.setNodeHTML(licenseInfo, '<h2>' + i18n.viewer.mapPage.constraintsHeading + '</h2>' + this._options.mapLicenseInfo);
                    }
                    // Set description
                    var descriptionInfo = this._options.mapItemDescription || i18n.viewer.mapPage.noDescription;
                    var descNode = dom.byId("descriptionContent");
                    this.setNodeHTML(descNode, '<h2>' + i18n.viewer.mapPage.aboutHeader + '</h2>' + descriptionInfo + '<div class="clear"></div>');
                    // set page title
                    if (this._options.mapTitle) {
                        document.title = this._options.siteTitle + ' - ' + this._options.mapTitle;
                    } else {
                        document.title = this._options.siteTitle;
                    }
                    // add bottom map buttons
                    this.addBottomMapButtons();
                    // create map
                    var mapDeferred = arcgisUtils.createMap(itemInfo, "map", {
                        mapOptions: {
                            slider: true,
                            sliderStyle: "small",
                            wrapAround180: true,
                            showAttribution: this._options.showAttribution,
                            attributionWidth: 0.40,
                            nav: false
                        },
                        usePopupManager: true,
                        ignorePopups: false,
                        bingMapsKey: this._options.bingMapsKey,
                        geometryServiceURL: this._options.helperServices.geometry.url
                    });
                    // map response
                    mapDeferred.addCallback(lang.hitch(this, function(response) {
                        // set map
                        this.map = response.map;
                        // operation layers
                        var layers = response.itemInfo.itemData.operationalLayers;
                        var html = '';
                        var mapLayersNode = dom.byId('mapLayers');
                        var lb = new LocateButton({
                            map: this.map
                        },"locateButton");
                        lb.startup();
                        var hb = new HomeButton({
                            map: this.map
                        },"homeButton");
                        hb.startup();
                        html += '<h2>' + i18n.viewer.mapPage.layersHeader + '</h2>';
                        // Layer toggles
                        if (this._options.showLayerToggle && layers.length > 0 && mapLayersNode) {
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
                        this.setNodeHTML(mapLayersNode, html);
                        // toggle legend layers
                        on(query('.toggleLayers', dom.byId("sidePanel")), "click, keyup", lang.hitch(this, function(e) {
                            if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                                var dataAttr = domAttr.get(e.currentTarget, 'data-layers').split(',');
                                for (var i = 0; i < dataAttr.length; i++) {
                                    this.toggleLayerSwitch(dataAttr[i]);
                                }
                            }
                        }));
                        // ENDLAYER TOGGLE
                        if (this.map.loaded) {
                            this.mapNowLoaded(response);
                        } else {
                            on(this.map, "load", lang.hitch(this, function() {
                                this.mapNowLoaded(response);
                            }));
                        }
                    }));
                    mapDeferred.addErrback(lang.hitch(this, function(error) {
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: i18n.viewer.errors.createMap + " : " + error
                        });
                        dialog.show();
                        // hide all content
                        this.hideAllContent();
                    }));
                    itemDeferred.addErrback(lang.hitch(this, function(error) {
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
                            this.hideAllContent();
                        }
                    }));
                } else {
                    // show error dialog
                    var dialog = new Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.createMap
                    });
                    dialog.show();
                    // hide all content
                    this.hideAllContent();
                }
            }));
        },
        /*------------------------------------*/
        // TOGGLE LAYER
        /*------------------------------------*/
        toggleLayerSwitch: function(layerid) {
            var layer = this.map.getLayer(layerid);
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
        createOptions: function() {
            var hasEsri = false,
                geocoders = lang.clone(this._options.helperServices.geocode);
            array.forEach(geocoders, function(geocoder, index) {
                if (geocoder.url.indexOf(".arcgis.com/arcgis/rest/services/World/GeocodeServer") > -1) {
                    hasEsri = true;
                    geocoder.name = "Esri World Geocoder";
                    geocoder.outFields = "Match_addr, stAddr, City";
                    geocoder.singleLineFieldName = "Single Line";
                    geocoder.placeholder = i18n.viewer.mapPage.findPlaceholder;
                    geocoder.esri = true;
                    geocoder.placefinding = true;
                }
            });
            //only use geocoders with a singleLineFieldName that allow placefinding
            geocoders = array.filter(geocoders, function(geocoder) {
                return (esriLang.isDefined(geocoder.singleLineFieldName) && esriLang.isDefined(geocoder.placefinding) && geocoder.placefinding);
            });
            var esriIdx;
            if (hasEsri) {
                for (var i = 0; i < geocoders.length; i++) {
                    if (esriLang.isDefined(geocoders[i].esri) && geocoders[i].esri === true) {
                        esriIdx = i;
                        break;
                    }
                }
            }
            var options = {
                map: this.map,
                theme: "simpleGeocoder",
                autoComplete:hasEsri
            };
            //If the World geocoder is primary enable auto complete 
            if (hasEsri && esriIdx === 0) {
                options.autoComplete = true;
                options.minCharacters = 0;
                options.maxLocations = 5;
                options.searchDelay = 100;
                options.arcgisGeocoder = geocoders.splice(0, 1)[0]; //geocoders[0];
                if (geocoders.length > 0) {
                    options.geocoders = geocoders;
                }
            } else {
                options.arcgisGeocoder = false;
                options.geocoders = geocoders;
            }
            return options;
        },
        /*------------------------------------*/
        // INIT UI
        /*------------------------------------*/
        initUI: function(response) {
            var options = this.createOptions();
            var gc = new Geocoder(options, "gc_search");
            gc.startup();
            // Set legend header
            var node = dom.byId('legendHeader');
            this.setNodeHTML(node, i18n.viewer.sidePanel.title);
            // Set basemap gallery
            if (this._options.showBasemapGallery) {
                this.createBasemapGallery();
            }
            // Set map background image
            domStyle.set(dom.byId('map'), 'background-image', 'none');
            // Setup resize map
            on(window, "resize", this.resizeMap);
            //add scalebar
            this.scalebar = new Scalebar({
                map: this.map,
                scalebarUnit: this._options.units || i18n.viewer.main.scaleBarUnits
            });
            // Legend Information
            var layerInfo = arcgisUtils.getLegendLayers(response);
            // Build Legend
            if (layerInfo.length > 0) {
                var legendDijit = new Legend({
                    map: this.map,
                    layerInfos: layerInfo
                }, "legendContent");
                legendDijit.startup();
            } else {
                var legendContentNode = dom.byId('legendContent');
                this.setNodeHTML(legendContentNode, i18n.viewer.errors.noLayers);
            }
        },
        /*------------------------------------*/
        // Resize and Reposition Map
        /*------------------------------------*/
        mapResizeAndReposition: function() {
            this.map.resize();
            this.map.reposition();
        },
        /*------------------------------------*/
        // Resize Map And Center
        /*------------------------------------*/
        resizeMapAndCenter: function() {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(lang.hitch(this, function() {
                this.mapResizeAndReposition();
                if (this.mapCenter.x && this.mapCenter.y) {
                    setTimeout(lang.hitch(this, function() {
                        this.map.centerAt(this.mapCenter);
                        this.mapResizeAndReposition();
                    }), 500);
                }
            }), 500);
        },
        /*------------------------------------*/
        // Resize Map
        /*------------------------------------*/
        resizeMap: function() {
            clearTimeout(this.resizeTimer);
            if (this.map) {
                this.resizeTimer = setTimeout(lang.hitch(this, function() {
                    if (typeof this.mapResizeAndReposition === 'function') {
                        this.mapResizeAndReposition();
                    }
                }), 500);
            }
        }
    });
});