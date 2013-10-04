define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/query",
    "dojo/i18n!./nls/template.js",
    "dojo/io/script",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/number",
    "esri/request",
    "esri/config",
    "esri/arcgis/utils",
    "esri/tasks/GeometryService",
    "esri/urlUtils",
    "esri/geometry/webMercatorUtils",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/arcgis/Portal",
    "templateConfig/commonConfig",
    "dijit/Dialog",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/on"
],
function(require, declare, lang, array, Deferred, dom, query, i18n, ioScript, domStyle, domGeom, number, esriRequest, config, arcgisUtils, GeometryService, urlUtils, webMercatorUtils, GraphicsLayer, Point, PictureMarkerSymbol, Graphic, esriPortal, commonConfig, Dialog, domAttr, domClass, domConstruct, on) {
    return declare(null, {
        queryOrganization: function() {
            var deferred = new Deferred();
            //templates can be at /apps or /home/webmap/templates
            var appLocation = location.pathname.indexOf("/apps/");
            if (appLocation === -1) {
                appLocation = location.pathname.indexOf("/home/");
            }
            if (appLocation !== -1) { //hosted or portal  
                var instance = location.pathname.substr(0, appLocation);
                this._options.sharingurl = location.protocol + "//" + location.host + instance;
                this._options.proxyUrl = location.protocol + '//' + location.host + instance + "/sharing/proxy";
                var req = esriRequest({
                    url: this._options.sharingurl + "/sharing/rest/portals/self",
                    content: {
                        "f": "json"
                    },
                    callbackParamName: "callback"
                });
                req.then(lang.hitch(this, function(response) {
                    //look for helper services and if they exist set them
                    if (response.isPortal && response.portalMode === "single tenant") {
                        this._options.sharingurl = response.portalHostname;
                        this._options.portalurl = this._options.sharingurl;
                        arcgisUtils.arcgisUrl = response.portalHostname + "/sharing/rest/content/items";
                    }
                    lang.mixin(this._options.helperServices, response.helperServices);
                    //update geometry service (note: replaced the setDefaults call again)
                    if (this._options.helperServices && this._options.helperServices.geometry && this._options.helperServices.geometry.url) {
                        config.defaults.geometryService = new GeometryService(this._options.helperServices.geometry.url);
                    }
                    deferred.resolve(true);
                }));
            } else {
                deferred.resolve(true);
            }
            return deferred.promise;
        },
        /*------------------------------------*/
        // clip text to desired length
        /*------------------------------------*/
        truncate: function(text, length, ellipsis) {
            if (!ellipsis) {
                ellipsis = i18n.viewer.pagination.helip;
            }
            if (!length || length <= 0 || text.length < length) {
                return text;
            } else {
                return text.substr(0, length) + ellipsis;
            }
        },
        /*------------------------------------*/
        // Add Spinner
        /*------------------------------------*/
        addSpinner: function(id) {
            var html = '<span class="spinnerRemove"><span class="loadingAjax"></span></span>';
            var node = dom.byId(id);
            this.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Reverse sort order
        /*------------------------------------*/
        reverseSortOrder: function(order) {
            if (order === 'desc') {
                return 'asc';
            }
            // else
            return 'desc';
        },
        /*------------------------------------*/
        // Remove Spinner
        /*------------------------------------*/
        removeSpinner: function() {
            query(".spinnerRemove").forEach(domConstruct.destroy);
        },
        /*------------------------------------*/
        // Hide all content
        /*------------------------------------*/
        hideAllContent: function() {
            var node = dom.byId('content');
            this.setNodeHTML(node, '');
        },
        /*------------------------------------*/
        // App ID Settings
        /*------------------------------------*/
        setAppIdSettings: function() {
            var def = new Deferred();
            if (this._options.appid) {
                esriRequest({
                    url: arcgisUtils.arcgisUrl + "/" + this._options.appid + "/data",
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback",
                    // on load
                    load: lang.hitch(this, function(response) {
                        // check for false value strings
                        var appSettings = this.setFalseValues(response.values);
                        // set other config options from app id
                        lang.mixin(this._options, appSettings);
                        // callback function
                        def.resolve();
                    }),
                    // on error
                    error: lang.hitch(this, function(response) {
                        var error = response.message;
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: error
                        });
                        dialog.show();
                        // hide all content
                        this.hideAllContent();
                    })
                });
            } else {
                def.resolve();
            }
            return def;
        },
        /*------------------------------------*/
        // Clear address function
        /*------------------------------------*/
        clearAddress: function(obj, iconReset) {
            // empty value
            domAttr.set(obj, 'value', '');
            // remove active class
            domClass.remove(iconReset, 'resetActive');
            // add default class
            domClass.add(obj, 'default');
        },
        /*------------------------------------*/
        // Checks to see if address is populated
        /*------------------------------------*/
        checkAddressStatus: function(obj, iconReset) {
            // get value of node
            var cAVal = domAttr.get(obj, 'value');
            // if value is not empty
            if (cAVal !== '') {
                // add reset class
                domClass.add(iconReset, 'resetActive');
            }
        },
        /*------------------------------------*/
        // Set default options for the template
        /*------------------------------------*/
        setDefaultOptions: function() {
            // set user agent
            this.setUserAgent();
            // set up params
            this.configUrlParams();
            // set defaults
            this.setDefaults();
            // if RTL
            if (window.dojoConfig.locale && window.dojoConfig.locale.indexOf("ar") !== -1) {
                //right now checking for Arabic only, to generalize for all RTL languages
                this._options.isRightToLeft = true; // Options.isRightToLeft property setting to true when the locale is 'ar'
            }
            // credential name
            this._options.cred = "esri_jsapi_id_manager_data";
            // ArcGIS Rest Version
            this._options.arcgisRestVersion = 1;
            // row items
            this._options.galleryPerRow = 3;
            // set default group search keywords
            if (!this._options.searchString) {
                this._options.searchString = '';
            }
            // lowercase layout
            if (this._options.defaultLayout) {
                this._options.defaultLayout = this._options.defaultLayout.toLowerCase();
            }
            // if no theme is set at all
            if (!this._options.theme) {
                this._options.theme = "blueTheme";
            }
            // if no point symbol set
            if (!this._options.hasOwnProperty('pointGraphic')) {
                this._options.pointGraphic = "images/ui/bluepoint-21x25.png";
            }
            // if no gallery per page set
            if (!this._options.hasOwnProperty('galleryItemsPerPage')) {
                this._options.galleryItemsPerPage = 9;
            }
            // if no gallery per page set
            if (!this._options.hasOwnProperty('mapViewer')) {
                this._options.mapViewer = 'simple';
            }
            // if no sort order set
            if (!this._options.hasOwnProperty('sortOrder')) {
                this._options.sortOrder = 'desc';
            }
            // if no sort field set
            if (!this._options.hasOwnProperty('sortField')) {
                this._options.sortField = 'modified';
            }
            // if no default layout
            if (!this._options.hasOwnProperty('defaultLayout')) {
                this._options.defaultLayout = 'grid';
            }
        },
        setDefaults: function() {
            if (commonConfig) {
                lang.mixin(this._options, commonConfig);
            }
            //Check to see if the app is hosted or a portal. In those cases set the sharing url and the proxy. Otherwise use
            //the sharing url set it to arcgis.com. We know app is hosted (or portal) if it has /apps/ in the url 
            //templates can be at /apps or /home/webmap/templates
            var appLocation = location.pathname.indexOf("/apps/");
            if (appLocation === -1) {
                appLocation = location.pathname.indexOf("/home/");
            }
            this._options.isOrg = false;
            if (this._options.sharingurl) { //sharing url specified 
                this._options.mobilePortalUrl = 'arcgis:' + '//' + location.host;
                //sharing url set in config file so use default services 
            } else if (appLocation !== -1) { //hosted or portal 
                this._options.isOrg = true;
                var instance = location.pathname.substr(0, appLocation);
                this._options.sharingurl = location.protocol + "//" + location.host + instance;
                this._options.proxyurl = location.protocol + '//' + location.host + instance + "/sharing/proxy";
                this._options.mobilePortalUrl = 'arcgis:' + '//' + location.host;
            } else { //default to arcgis.com 
                this._options.sharingurl = location.protocol + "//" + "www.arcgis.com";
                this._options.mobilePortalUrl = "arcgis://www.arcgis.com";
            }
            arcgisUtils.arcgisUrl = this._options.sharingurl + "/sharing/rest/content/items";
            this._options.portalurl = this._options.sharingurl;
            //Set the proxy. If the app is hosted use the default proxy. 
            if (this._options.proxyurl) {
                config.defaults.io.proxyUrl = this._options.proxyurl;
                config.defaults.io.alwaysUseProxy = false;
            }
            //setup any helper services (geometry, print, routing, geocoding)
            if (this._options.helperServices && this._options.helperServices.geometry && this._options.helperServices.geometry.url) {
                config.defaults.geometryService = new GeometryService(this._options.helperServices.geometry.url);
            }
        },
        /*------------------------------------*/
        // query group
        /*------------------------------------*/
        queryGroup: function() {
            var def = new Deferred();
            // query group info
            this.queryArcGISGroupInfo({
                // Settings
                id_group: this._options.group
            }).then(lang.hitch(this, function(data) {
                if (data.results.length > 0) {
                    // set group content
                    this.setGroupContent(data.results[0]);
                    def.resolve();
                } else {
                    // show error dialog
                    var dialog = new Dialog({
                        title: i18n.viewer.errors.general,
                        content: i18n.viewer.errors.noGroupResults
                    });
                    dialog.show();
                    def.resolve();
                }
            }));
            return def;
        },
        /*------------------------------------*/
        // Set group information to template
        /*------------------------------------*/
        setGroupContent: function(groupInfo) {
            // set group id
            if (!this._options.group) {
                this._options.group = groupInfo.id;
            }
            // Set owner
            if (!this._options.groupOwner) {
                this._options.groupOwner = groupInfo.owner || "";
            }
            // Set group title
            if (!this._options.siteTitle) {
                this._options.siteTitle = groupInfo.title || "";
            }
            // Set group title
            if (!this._options.groupTitle) {
                this._options.groupTitle = groupInfo.title || "";
            }
            // Set home snippet
            if (!this._options.homeSnippet) {
                this._options.homeSnippet = groupInfo.snippet || "";
            }
            // Set home side content
            if (!this._options.homeSideContent) {
                this._options.homeSideContent = groupInfo.description || "";
            }
            // set footer image
            if (!this._options.footerLogo) {
                this._options.footerLogo = groupInfo.thumbnailUrl || "";
            }
            // set footer image link
            if (!this._options.footerLogoUrl) {
                this._options.footerLogoUrl = this.getViewerURL('group_page');
            }
            // set page title
            document.title = groupInfo.title || "";
            // insert all the group content
            this.insertContent();
        },
        /*------------------------------------*/
        // Set false url param strings to false
        /*------------------------------------*/
        setFalseValues: function(obj) {
            // for each key
            for (var key in obj) {
                // if not a prototype
                if (obj.hasOwnProperty(key)) {
                    // if is a false value string
                    if (typeof obj[key] === 'string' && (obj[key].toLowerCase() === 'false' || obj[key].toLowerCase() === 'null' || obj[key].toLowerCase() === 'undefined')) {
                        // set to false bool type
                        obj[key] = false;
                    }
                }
            }
            // return object
            return obj;
        },
        /*------------------------------------*/
        // Set URL params such as group, theme, webmap and more
        /*------------------------------------*/
        configUrlParams: function() {
            // set url object
            this.urlObject = urlUtils.urlToObject(document.location.href);
            // make sure it's an object
            this.urlObject.query = this.urlObject.query || {};
            // check for false value strings
            this.urlObject.query = this.setFalseValues(this.urlObject.query);
            // mix in settings
            lang.mixin(this._options, this.urlObject.query);
        },
        /*------------------------------------*/
        // is user on supported mobile device
        /*------------------------------------*/
        isMobileUser: function() {
            // if ios or android
            if (this._options.agent_ios || this._options.agent_android) {
                return true;
            } else {
                return false;
            }
        },
        /*------------------------------------*/
        // Set user agent
        /*------------------------------------*/
        setUserAgent: function() {
            // set agent
            this._options.agent = navigator.userAgent.toLowerCase();
            // if iOS
            this._options.agent_ios = this._options.agent.match(/(iphone|ipod|ipad)/);
            // if Android
            this._options.agent_android = this._options.agent.match(/(android)/);
        },
        /*------------------------------------*/
        // Insert social media html
        /*------------------------------------*/
        insertSocialHTML: function() {
            var html = '';
            if (this._options.showSocialButtons) {
                html += '<div class="addthis_toolbox addthis_default_style">';
                html += '<a class="addthis_button_facebook"></a>';
                html += '<a class="addthis_button_twitter"></a>';
                html += '<a class="addthis_button_google_plusone_share"></a>';
                html += '<a class="addthis_button_linkedin"></a>';
                html += '<a class="addthis_button_email"></a>';
                html += '<a class="addthis_button_compact"></a>';
                html += '<a class="addthis_counter addthis_bubble_style"></a>';
                html += '</div>';
                // addthis url
                var addthisURL = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=";
                // https support
                if (addthisURL && location.protocol === "https:") {
                    addthisURL = addthisURL.replace('http:', 'https:');
                }
                // load share script
                ioScript.get({
                    url: addthisURL + this._options.addThisProfileId
                });
            } else {
                html += '&nbsp;';
            }
            // if social HTML
            var node = dom.byId('socialHTML');
            this.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Insert footer HTML
        /*------------------------------------*/
        insertFooterHTML: function() {
            var html = '';
            html += '<div id="footerCon">';
            html += '<div class="container_12">';
            html += '<div class="grid_6">';
            html += '<div class="Pad">';
            // Set footer heading
            if (this._options.footerHeading) {
                html += '<h2 id="footerHeading">';
                html += this._options.footerHeading;
                html += '</h2>';
            }
            // if footer description
            if (this._options.footerDescription) {
                html += '<div id="footerDescription">';
                html += this._options.footerDescription;
                html += '</div>';
            }
            // if neither is set just put a space.
            if (!this._options.footerHeading && !this._options.footerDescription) {
                html += '&nbsp;';
            }
            html += '</div>';
            html += '</div>';
            html += '<div class="prefix_3 grid_3">';
            html += '<div id="footerLogoDiv" class="logoDiv footBorder">';
            // Set footer logo
            if (this._options.footerLogo && this._options.showFooter) {
                html += '<div>';
                // if logo url
                if (this._options.footerLogoUrl) {
                    html += '<a id="yourLogo" href="' + this._options.footerLogoUrl + '" title="' + this._options.siteTitle + '">';
                }
                html += '<img src="' + this._options.footerLogo + '" alt="' + this._options.siteTitle + '" title="' + this._options.siteTitle + '" />';
                // if logo url
                if (this._options.footerLogoUrl) {
                    html += '</a>';
                }
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
            html += '<div class="clear"></div>';
            html += '</div>';
            html += '</div>';
            // if Footer
            var node = dom.byId('footer');
            this.setNodeHTML(node, html);
            // set Background Color
            var bodyNode = dom.byId('galleryBody');
            // if body
            if (bodyNode) {
                domStyle.set(bodyNode, {
                    'background': '#4d4d4d'
                });
            }
        },
        /*------------------------------------*/
        // Insert Navigation/Banner
        /*------------------------------------*/
        insertHeaderContent: function() {
            var html = '';
            var node = dom.byId('templateNav');
            html += '<li id="homeItem"><a tabindex="0" title="' + this._options.siteTitle + '" href="' + this.getViewerURL('index_page') + '" id="siteTitle">';
            // if banner image
            if (this._options.siteBannerImage) {
                html += '<img alt="' + this._options.siteTitle + '" title="' + this._options.siteTitle + '" src="' + this._options.siteBannerImage + '" />';
            } else {
                html += this._options.siteTitle;
            }
            html += '</a></li>';
            // copy if any current lists are in there that users may have set
            if (node) {
                html += node.innerHTML;
            }
            // insert HTML
            this.setNodeHTML(node, html);
            // set selected class
            array.forEach(query('#templateNav li a'), lang.hitch(this, function(obj) {
                // if link HREF equals page HREF
                if (obj.href === location.href) {
                    // add selected class
                    domClass.add(obj, 'activeLink');
                }
            }));
            // top header background set
            var topHeader = dom.byId('topHeader');
            // if header and bg image set
            if (topHeader && this._options.bannerBackground) {
                // set BG image
                domStyle.set(topHeader, {
                    'background': 'url(' + this._options.bannerBackground + ') no-repeat top left'
                });
            }
        },
        /*------------------------------------*/
        // Insert HTML to node reference function
        /*------------------------------------*/
        setNodeHTML: function(node, htmlString) {
            if (node) {
                // update HTML
                node.innerHTML = htmlString;
                // set sidebar height
                this.setSidebarHeight();
            }
        },
        /*------------------------------------*/
        // Set sidebar height
        /*------------------------------------*/
        setSidebarHeight: function() {
            // vars
            var mainHeight = 0,
                mainNode = dom.byId('mainPanel'),
                sideNode = dom.byId('sidePanel');
            // if nodes
            if (mainNode && sideNode) {
                // get inner height of main node
                mainHeight = domGeom.getContentBox(mainNode).h;
                // if inner height is less than 750. make that the default.
                if (mainHeight < 750) {
                    mainHeight = 750;
                }
                // set style for sidenode
                domStyle.set(sideNode, {
                    'height': mainHeight + 'px',
                    'minHeight': mainHeight + 'px'
                });
            }
        },
        /*------------------------------------*/
        // Insert content
        /*------------------------------------*/
        insertContent: function() {
            // add direction tag to HTML
            var dirNode = query("html")[0];
            // if RTL
            if (this._options.isRightToLeft) {
                // Set direction class
                domClass.add(dirNode, 'esriRtl');
                // direction attribute
                domAttr.set(dirNode, 'dir', 'rtl');
            } else {
                // Set direction class
                domClass.add(dirNode, 'esriLtr');
                // direction attribute
                domAttr.set(dirNode, 'dir', 'ltr');
            }
            // add sidepanel class
            domClass.add(dom.byId('sidePanel'), 'dataLayers');
            // add main panel class
            domClass.add(dom.byId('mainPanel'), 'contentLeft');
            // Set Theme
            domClass.add(dirNode, this._options.theme);
            // Insert banner and navigation
            this.insertHeaderContent();
            // Set social media buttons
            this.insertSocialHTML();
            // Set footer
            if (this._options.showFooter) {
                this.insertFooterHTML();
            }
        },
        /*------------------------------------*/
        // query arcgis group info
        /*------------------------------------*/
        queryArcGISGroupInfo: function(obj) {
            var def = new Deferred();
            // default values
            var settings = {
                // set group id for web maps
                id_group: '',
                // format
                dataType: 'json'
            };
            // If options exist, lets merge them with our default settings
            if (obj) {
                lang.mixin(settings, obj);
            }
            // first, request the group to see if it's public or private
            esriRequest({
                // group rest URL
                url: this._options.sharingurl + '/sharing/rest/community/groups/' + settings.id_group,
                content: {
                    'f': settings.dataType
                },
                callbackParamName: 'callback',
                load: lang.hitch(this, function(response) {
                    // sign-in flag
                    var signInRequired = (response.access !== 'public') ? true : false;
                    // if sign-in is required
                    if (signInRequired) {
                        this.portalSignIn().then(lang.hitch(this, function() {
                            // query
                            var q = 'id:"' + settings.id_group + '"';
                            var params = {
                                q: q,
                                v: this._options.arcgisRestVersion,
                                f: settings.dataType
                            };
                            this._portal.queryGroups(params).then(lang.hitch(this, function(data) {
                                def.resolve(data);
                            }));
                        }));
                    } else {
                        // query
                        var q = 'id:"' + settings.id_group + '"';
                        var params = {
                            q: q,
                            v: this._options.arcgisRestVersion,
                            f: settings.dataType
                        };
                        this._portal.queryGroups(params).then(lang.hitch(this, function(data) {
                            def.resolve(data);
                        }));
                    }
                }),
                error: lang.hitch(this, function(response) {
                    var error = response.message;
                    // show error dialog
                    var dialog = new Dialog({
                        title: i18n.viewer.errors.general,
                        content: error
                    });
                    dialog.show();
                    // hide all content
                    this.hideAllContent();
                    def.resolve();
                })
            });
            return def;
        },
        /*------------------------------------*/
        // Create portal and proceed
        /*------------------------------------*/
        createPortal: function() {
            var def = new Deferred();
            // create portal
            this._portal = new esriPortal.Portal(this._options.sharingurl);
            // portal loaded
            on(this._portal, 'ready', lang.hitch(this, function() {
                def.resolve();
            }));
            return def;
        },
        /*------------------------------------*/
        // Signs a user into the portal
        /*------------------------------------*/
        portalSignIn: function() {
            var def = new Deferred();
            this._portal.signIn().then(lang.hitch(this, function(loggedInUser) {
                if (loggedInUser) {
                    this.globalUser = loggedInUser;
                    def.resolve();
                }
            }));
            return def;
        },
        /*------------------------------------*/
        // Query arcgis items
        /*------------------------------------*/
        queryArcGISGroupItems: function(obj) {
            var def = new Deferred();
            // default values
            var settings = {
                // set group id for web maps
                id_group: '',
                // type of item
                searchType: '',
                // filter these items
                filterType: '',
                // access type
                searchAccess: '',
                // format
                dataType: 'json',
                // sorting column: The allowed field names are title, modified, type, owner, avgRating, numRatings, numComments and numViews.
                sortField: 'modified',
                // sorting order: Values: asc | desc
                sortOrder: 'desc',
                // if pagination
                pagination: true,
                // how many links to show on each side of pagination
                paginationSize: 1,
                // show first and last links on pagination
                paginationShowFirstLast: true,
                // show previous and next links
                paginationShowPrevNext: true,
                // search limit
                perPage: '',
                // maps per row
                perRow: '',
                // offset
                searchStart: 0,
                // search keywords
                keywords: '',
                // style of layout for the results
                layout: 'grid'
            };
            // If options exist, lets merge them with our default settings
            if (obj) {
                lang.mixin(settings, obj);
            }
            var q = '';
            q += 'group:"' + settings.id_group + '"';
            if (settings.keywords) {
                q += ' AND (';
                q += ' title:' + settings.keywords;
                q += ' OR tags:' + settings.keywords;
                q += ' OR typeKeywords:' + settings.keywords;
                q += ' OR snippet:' + settings.keywords;
                q += ' ) ';
            }
            if (settings.searchType) {
                q += ' AND type:' + settings.searchType;
            }
            if (settings.searchType && settings.filterType) {
                q += ' -type:' + settings.filterType;
            }
            if (settings.searchAccess) {
                q += ' AND access:' + settings.searchAccess;
            }
            var params = {
                q: q,
                v: this._options.arcgisRestVersion,
                f: settings.dataType
            };
            if (settings.sortField) {
                params.sortField = settings.sortField;
            }
            if (settings.sortOrder) {
                params.sortOrder = settings.sortOrder;
            }
            if (settings.perPage) {
                params.num = settings.perPage;
            } else {
                params.num = 0;
            }
            if (settings.searchStart > 1) {
                params.start = (((settings.searchStart - 1) * settings.perPage) + 1);
            }
            this._portal.queryItems(params).then(lang.hitch(this, function(data) {
                def.resolve(data);
            }));
            return def;
        },
        /*------------------------------------*/
        // create pagination function
        /*------------------------------------*/
        createPagination: function(obj, totalItems, pagObject) {
            // creates middle pagination item HTML

            function createMiddleItem(i, current) {
                // class
                var selectedClass = 'enabled';
                if (i === current) {
                    // if selected
                    selectedClass = 'selected';
                }
                // page list item
                return '<li tabindex="0" title="' + i18n.viewer.pagination.page + ' ' + number.format(i) + '" data-offset="' + i + '" class="default ' + selectedClass + '">' + number.format(i) + '</li>';
            }
            // variables
            var html = '',
                startHTML = '',
                middleHTML = '',
                endHTML = '',
                current, first, previous, next, last, middleCount = 0,
                lastMiddle = 0,
                firstMiddle = 0,
                remainderStart, helipText = i18n.viewer.pagination.helip,
                paginationCount, npCount = 0;
            // if pagination is necessary
            if (obj.pagination && obj.perPage && totalItems > obj.perPage) {
                // create pagination list
                html += '<ul>';
                // determine offset links
                if (obj.searchStart) {
                    current = parseInt(obj.searchStart, 10);
                } else {
                    current = 1;
                }
                // first link
                first = 1;
                // previous link
                previous = current - 1;
                // next link
                next = current + 1;
                // last link
                last = Math.ceil(totalItems / obj.perPage);
                // determine next and previous count
                if (obj.paginationShowPrevNext) {
                    npCount = 2;
                }
                // determine pagination total size
                paginationCount = 1 + npCount + (2 * obj.paginationSize);
                // if pages matches size of pagination
                if (last === paginationCount) {
                    helipText = '';
                }
                // pagination previous
                if (obj.paginationShowPrevNext) {
                    var firstClass = 'disabled',
                        firstOffset = '';
                    if (current > 1) {
                        firstClass = 'enabled';
                        firstOffset = 'data-offset="' + previous + '"';
                    }
                    startHTML += '<li tabindex="0" title="' + i18n.viewer.pagination.previous + '" class="silverButton buttonLeft previous ' + firstClass + '" ' + firstOffset + '><span>&nbsp;</span></li>';
                }
                // pagination first page
                if (obj.paginationShowFirstLast && current > (obj.paginationSize + 1)) {
                    startHTML += '<li tabindex="0" class="default enabled" title="' + i18n.viewer.pagination.first + '" data-offset="' + first + '">' + number.format(first) + helipText + '</li>';
                } else {
                    middleCount = middleCount - 1;
                }
                // pagination last page
                if (obj.paginationShowFirstLast && current < (last - obj.paginationSize)) {
                    endHTML += '<li tabindex="0" class="default enabled" title="' + i18n.viewer.pagination.last + '" data-offset="' + last + '">' + helipText + number.format(last) + '</li>';
                } else {
                    middleCount = middleCount - 1;
                }
                // pagination next
                if (obj.paginationShowPrevNext) {
                    var lastClass = 'disabled',
                        lastOffset = '';
                    if (current < last) {
                        lastClass = 'enabled';
                        lastOffset = 'data-offset="' + next + '"';
                    }
                    endHTML += '<li tabindex="0" title="' + i18n.viewer.pagination.next + '" class="silverButton buttonRight next ' + lastClass + '" ' + lastOffset + '><span>&nbsp;</span></li>';
                }
                // create each pagination item
                for (var i = 1; i <= last; i++) {
                    if (i <= (current + obj.paginationSize) && i >= (current - obj.paginationSize)) {
                        if (firstMiddle === 0) {
                            firstMiddle = i;
                        }
                        middleHTML += createMiddleItem(i, current);
                        middleCount++;
                        lastMiddle = i;
                    }
                }
                // if last middle is last page
                if (lastMiddle === last) {
                    // get remainderStart start
                    remainderStart = firstMiddle - 1;
                    // while not enough remainders
                    while (middleCount < (obj.paginationSize * 2) + 1) {
                        // if remainder start is less or equal to first page
                        if (remainderStart <= first) {
                            // end while
                            break;
                        }
                        // add item to beginning of middle html
                        middleHTML = createMiddleItem(remainderStart, current) + middleHTML;
                        // increase middle count
                        middleCount++;
                        // decrease remainder start
                        remainderStart--;
                    }
                }
                // if first middle is first page
                else if (firstMiddle === first) {
                    // get remainderStart start
                    remainderStart = lastMiddle + 1;
                    // while not enough remainders
                    while (middleCount < (obj.paginationSize * 2) + 1) {
                        // if remainder start is greater or equal to last page
                        if (remainderStart >= last) {
                            // end while
                            break;
                        }
                        // add item to end of middle html
                        middleHTML += createMiddleItem(remainderStart, current);
                        // increase middle count
                        middleCount++;
                        // increase remainder start
                        remainderStart++;
                    }
                }
                // add up HTML
                html += startHTML + middleHTML + endHTML;
                // Pagination Spinner Container
                html += '<li id="paginationSpinner" class="spinnerCon"></li>';
                // end pagination
                html += '</ul>';
            } else {
                html += '&nbsp;';
            }
            html += '<div class="clear"></div>';
            // insert into html
            var node = dom.byId(pagObject);
            // insert pagination html
            this.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Parse text for URLs
        /*------------------------------------*/
        parseURL: function(text) {
            return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&~\?\/.=]+/g, function(url) {
                return '<a target="_blank" href="' + url + '">' + url + '</a>';
            });
        },
        /*------------------------------------*/
        // Configure viewer URL to use
        /*------------------------------------*/
        getViewerURL: function(viewer, webmap, owner) {
            // if not defined
            if (!viewer) {
                // set to default in config
                viewer = this._options.mapViewer;
            }
            // lowercase viewer string
            viewer = viewer.toLowerCase();
            // return url and vars
            var retUrl = '',
                queryString = '',
                firstParamFlag;
            // if webmap is set
            if (webmap) {
                // set webmap in query object
                this.urlObject.query.webmap = webmap;
            } else {
                // if webmap set
                if (this.urlObject.query.webmap) {
                    // unset it
                    delete this.urlObject.query.webmap;
                }
            }
            // for each query param
            for (var key in this.urlObject.query) {
                // if url has property
                if (this.urlObject.query.hasOwnProperty(key)) {
                    // if flag not set
                    if (!firstParamFlag) {
                        // prepend ?
                        queryString += '?';
                        // flag for first query param
                        firstParamFlag = 1;
                    } else {
                        // prepend &
                        queryString += '&';
                    }
                    // append to query string
                    queryString += key + '=' + encodeURIComponent(this.urlObject.query[key]);
                }
            }
            // return correct url
            switch (viewer) {
            case 'item_data':
                // item data url
                // http://www.arcgis.com/sharing/rest/content/items/af01df44bf36437fa8daed01407138ab/data
                return this._options.sharingurl + '/sharing/rest/content/items/' + webmap + "/data";
                // home page link
            case 'index_page':
                retUrl = 'index.html' + queryString;
                return retUrl;
                // portal viewer link
            case 'cityengine':
                return this._options.sharingurl + '/apps/CEWebViewer/viewer.html?3dWebScene=' + webmap;
            case 'arcgis':
                return this._options.sharingurl + '/home/webmap/viewer.html?webmap=' + webmap;
                // arcgis explorer link
            case 'explorer':
                retUrl = "http://explorer.arcgis.com/?open=" + webmap;
                if (retUrl && location.protocol === "https:") {
                    retUrl = retUrl.replace('http:', 'https:');
                }
                return retUrl;
                // arcgis explorer presentation mode link
            case 'explorer_present':
                retUrl = "http://explorer.arcgis.com/?present=" + webmap;
                if (retUrl && location.protocol === "https:") {
                    retUrl = retUrl.replace('http:', 'https:');
                }
                return retUrl;
                // portal sign up link
            case 'signup_page':
                retUrl = this._options.sharingurl + '/home/createaccount.html';
                return retUrl;
                // portal owner page link
            case 'owner_page':
                if (this._options.groupOwner || owner) {
                    if (owner) {
                        retUrl = this._options.sharingurl + '/home/user.html?user=' + encodeURIComponent(owner);
                    } else {
                        retUrl = this._options.sharingurl + '/home/user.html?user=' + encodeURIComponent(this._options.groupOwner);
                    }
                }
                return retUrl;
                // portal item page
            case 'item_page':
                if (this._options.webmap) {
                    retUrl = this._options.sharingurl + '/home/item.html?id=' + this._options.webmap;
                }
                return retUrl;
                // portal group page
            case 'group_page':
                if (this._options.groupOwner && this._options.groupTitle) {
                    retUrl = this._options.sharingurl + '/home/group.html?owner=' + encodeURIComponent(this._options.groupOwner) + '&title=' + encodeURIComponent(this._options.groupTitle);
                }
                return retUrl;
                // portal mobile URL data
            case 'mobile':
                if (this._options.agent_ios) {
                    retUrl = this._options.mobilePortalUrl + '/sharing/rest/content/items/' + webmap + '/data';
                } else if (this._options.agent_android) {
                    retUrl = this._options.mobilePortalUrl + '?webmap=' + webmap;
                }
                return retUrl;
            case 'mobile_app':
                // if iOS Device
                if (this._options.agent_ios && this._options.iosAppUrl) {
                    retUrl = this._options.iosAppUrl;
                }
                // if Android Device
                else if (this._options.agent_android && this._options.androidAppUrl) {
                    retUrl = this._options.androidAppUrl;
                }
                return retUrl;
                // simple viewer
            case 'simple':
                retUrl = 'map.html' + queryString;
                return retUrl;
            default:
                return '';
            }
        }
    });
});