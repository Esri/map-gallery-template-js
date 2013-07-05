define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/i18n!./nls/template.js",
    "dojo/dom-style",
    "dojo/number",
    "config/options",
    "application/common",
    "dojo/date/locale",
    "dojo/ready",
    "dojox/form/Rating",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/keys"
],
function(require, declare, array, dom, on, query, i18n, domStyle, number, Options, Common, locale, ready, Rating, domAttr, domClass, keys) {
    return declare("application.home", [Common], {
        constructor: function() {
            var _self = this;
            ready(function() {
                _self._options = Options;
                // set default configuration options
                _self.setDefaultOptions();
                _self.queryOrganization().then(function() {
                    // set app ID settings and call init after
                    _self.setAppIdSettings().then(function() {
                        // create portal
                        _self.createPortal().then(function() {
                            _self.init();
                        });
                    });
                });
            });
        },
        /*------------------------------------*/
        // On sort button click
        /*------------------------------------*/
        buildSortingMenu: function() {
            var _self = this;
            // sorting fields
            var sortFields = [{
                "title": i18n.viewer.sortFields.modified,
                "field": "modified",
                "defaultOrder": "desc"
            }, {
                "title": i18n.viewer.sortFields.title,
                "field": "title",
                "defaultOrder": "asc"
            }, {
                "title": i18n.viewer.sortFields.type,
                "field": "type",
                "defaultOrder": "asc"
            }, {
                "title": i18n.viewer.sortFields.numRatings,
                "field": "numRatings",
                "defaultOrder": "desc"
            }, {
                "title": i18n.viewer.sortFields.avgRating,
                "field": "avgRating",
                "defaultOrder": "desc"
            }, {
                "title": i18n.viewer.sortFields.numComments,
                "field": "numComments",
                "defaultOrder": "desc"
            }, {
                "title": i18n.viewer.sortFields.numViews,
                "field": "numViews",
                "defaultOrder": "desc"
            }];
            // html variable
            var html = '';
            html += '<div class="grid_9 sigma">';
            html += '<ul id="sortGallery">';
            html += '<li class="label"><span>' + i18n.viewer.sortFields.sortBy + '</span></li>';
            // for each sort field
            for (var i = 0; i < sortFields.length; i++) {
                // variables
                var selectedClass = '',
                    buttonClass = '',
                    dataSortOrder = '';
                // if first button
                if (i === 0) {
                    buttonClass = ' buttonLeft';
                }
                // if last button
                if (i === (sortFields.length - 1)) {
                    buttonClass = ' buttonRight';
                }
                // if default selected button
                if (sortFields[i].field === _self._options.sortField) {
                    selectedClass = ' ' + sortFields[i].defaultOrder + ' active';
                    dataSortOrder = 'data-sort-order="' + _self._options.sortOrder + '"';
                }
                // button html
                html += '<li class="sort' + selectedClass + '" data-default-order="' + sortFields[i].defaultOrder + '" ' + dataSortOrder + ' data-sort-field="' + sortFields[i].field + '"><span tabindex="0" class="silverButton' + buttonClass + '">' + sortFields[i].title + '<span class="arrow">&nbsp;</span></span></li>';
            }
            html += '</ul>';
            html += '</div>';
            html += '<div class="clear"></div>';
            // html node
            var node = dom.byId('groupSortOptions');
            // insert html
            _self.setNodeHTML(node, html);
            // sort map gallery bar
            on(dom.byId("sortGallery"), ".sort:click, .sort:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    _self.addSpinner("groupSpinner");
                    // variables for attributes
                    var sortColumn = domAttr.get(this, "data-sort-field");
                    var defaultOrder = domAttr.get(this, "data-default-order");
                    var sortOrder = domAttr.get(this, "data-sort-order");
                    // sort field
                    _self._options.sortField = sortColumn;
                    // sort order
                    if (sortOrder) {
                        _self._options.sortOrder = _self.reverseSortOrder(sortOrder);
                    } else {
                        _self._options.sortOrder = defaultOrder;
                    }
                    // remove classes and data sort order
                    query("#sortGallery .sort").forEach(function(entry) {
                        domClass.remove(entry, 'asc desc active');
                        domAttr.set(entry, 'data-sort-order', '');
                    });
                    // set sort order
                    domAttr.set(this, "data-sort-order", _self._options.sortOrder);
                    // set current to active
                    domClass.add(this, _self._options.sortOrder + ' active');
                    // get maps
                    _self.queryMaps();
                }
            });
        },
        /*------------------------------------*/
        // QUERY FEATURED MAPS
        /*------------------------------------*/
        queryMaps: function(data_offset) {
            var _self = this;
            var settings = {
                // Settings
                id_group: _self._options.group,
                searchType: _self._options.searchType,
                sortField: _self._options.sortField,
                sortOrder: _self._options.sortOrder,
                pagination: _self._options.showPagination,
                paginationShowFirstLast: true,
                paginationShowPrevNext: true,
                keywords: _self._options.searchString,
                perPage: parseInt(_self._options.galleryItemsPerPage, 10),
                perRow: parseInt(_self._options.galleryPerRow, 10),
                layout: _self._options.defaultLayout,
                searchStart: data_offset
            };
            // Call featured maps
            _self.queryArcGISGroupItems(settings).then(function(data) {
                // Build featured items
                _self.buildMapPlaylist(settings, data);
            });
        },
        /*------------------------------------*/
        // Insert Home Content
        /*------------------------------------*/
        insertHomeContent: function() {
            var _self = this;
            var node;
            // Set home heading
            if (_self._options.homeHeading) {
                node = dom.byId('homeHeading');
                _self.setNodeHTML(node, _self._options.homeHeading);
            }
            // Set home intro text
            if (_self._options.homeSnippet) {
                node = dom.byId('homeSnippet');
                _self.setNodeHTML(node, _self._options.homeSnippet);
            }
            var html = '';
            // Set home right heading
            if (_self._options.homeSideHeading) {
                html += '<h2>' + _self._options.homeSideHeading + '</h2>';
            }
            // Set home right content
            if (_self._options.homeSideContent) {
                html += _self._options.homeSideContent;
            }
            node = dom.byId('homeSideContent');
            _self.setNodeHTML(node, html);
        },
        /*------------------------------------*/
        // Group auto-complete search
        /*------------------------------------*/
        groupAutoComplete: function(acQuery) {
            var _self = this;
            var settings = {
                // Settings
                id_group: _self._options.group,
                searchType: _self._options.searchType,
                sortField: _self._options.sortField,
                // SORTING COLUMN: The allowed field names are title, modified, type, owner, avgRating, numRatings, numComments and numViews.
                sortOrder: _self._options.sortOrder,
                // SORTING ORDER: Values: asc | desc
                keywords: acQuery,
                perPage: 10,
                searchStart: 1
            };
            // Called when searching (Autocomplete)
            _self.queryArcGISGroupItems(settings).then(function(data) {
                // Show auto-complete
                _self.showGroupAutoComplete(settings, data);
            });
        },
        /*------------------------------------*/
        // Hide auto-complete
        /*------------------------------------*/
        hideGroupAutoComplete: function() {
            query("#searchListUL").forEach(function(entry) {
                domClass.remove(entry, 'autoCompleteOpen');
            });
            query("#groupAutoComplete").forEach(function(entry) {
                domStyle.set(entry, 'display', 'none');
            });
        },
        /*------------------------------------*/
        // Show auto-complete
        /*------------------------------------*/
        showGroupAutoComplete: function(obj, data) {
            var _self = this;
            var aResults = '';
            var node;
            var partialMatch = domAttr.get(dom.byId('searchGroup'), 'value');
            var regex = new RegExp('(' + partialMatch + ')', 'gi');
            if (data.results !== null) {
                query(".searchList").forEach(function(entry) {
                    domClass.add(entry, 'autoCompleteOpen');
                });
                _self.ACObj = data.results;
                aResults += '<ul class="zebraStripes">';
                for (var i = 0; i < data.results.length; i++) {
                    var layerClass = '';
                    if (i % 2 === 0) {
                        layerClass = '';
                    } else {
                        layerClass = 'stripe';
                    }
                    aResults += '<li tabindex="0" class="' + layerClass + '">' + data.results[i].title.replace(regex, '<span>' + partialMatch + '</span>') + '</li>';
                }
                aResults += '</ul>';
                node = dom.byId('groupAutoComplete');
                if (node) {
                    if (data.results.length > 0) {
                        _self.setNodeHTML(node, aResults);
                    } else {
                        _self.setNodeHTML(node, '<p>' + i18n.viewer.errors.noMatches + '</p>');
                        clearTimeout(_self.ACTimeout);
                        _self.ACTimeout = setTimeout(function() {
                            _self.hideGroupAutoComplete();
                        }, 3000);
                    }
                    domStyle.set(node, 'display', 'block');
                }
            }
        },
        /*------------------------------------*/
        // Build Map Playlist
        /*------------------------------------*/
        buildMapPlaylist: function(obj, data) {
            var _self = this;
            // hide auto complete
            _self.hideGroupAutoComplete();
            // Remove Spinner
            _self.removeSpinner();
            // Clear Pagination
            var node = dom.byId('maps_pagination');
            _self.setNodeHTML(node, '');
            // HTML Variable
            var html = '';
            // Get total results
            var totalItems = data.total;
            var totalResults = data.results.length;
            var layout;
            // If we have items
            if (totalItems > 0) {
                layout = 'mapsGrid';
                if (obj.layout === 'list') {
                    layout = 'mapsList';
                }
                // If perpage is more than total
                var forTotal;
                if (obj.pagination && obj.perPage && obj.perPage < totalResults) {
                    // Use per page
                    forTotal = obj.perPage;
                } else {
                    // Use total
                    forTotal = totalResults;
                }
                // Create list items
                for (var i = 0; i < forTotal; i++) {
                    // variables
                    var itemTitle;
                    var thumb;
                    var itemURL;
                    var snippet;
                    var linkTarget;
                    var externalLink = false;
                    // If item has URL
                    if (data.results[i].url && data.results[i].type === "Web Mapping Application") {
                        itemURL = data.results[i].url;
                        externalLink = true;
                    } else if (data.results[i].type === "CityEngine Web Scene") {
                        itemURL = _self.getViewerURL('cityengine', data.results[i].id);
                        externalLink = true;
                    } else {
                        // url variable
                        itemURL = _self.getViewerURL(_self._options.mapViewer, data.results[i].id);
                    }
                    if (obj.layout === 'list') {
                        itemTitle = data.results[i].title;
                        snippet = '';
                        if (data.results[i].snippet) {
                            snippet = data.results[i].snippet;
                        }
                        linkTarget = '';
                        if (_self._options.openGalleryItemsNewWindow || externalLink) {
                            linkTarget = 'target="_blank"';
                        }
                        // Build list item
                        html += '<div class="grid_9 sigma">';
                        html += '<div class="item">';
                        html += '<a ' + linkTarget + ' class="block" id="mapItem' + i + '" title="' + itemTitle + '" href="' + itemURL + '">';
                        thumb = data.results[i].thumbnailUrl;
                        if (!thumb) {
                            thumb = 'images/defaultThumb.png';
                        }
                        html += '<img alt="' + itemTitle + '" src="' + thumb + '" width="200" height="133" />';
                        html += '</a>';
                        html += '<div class="itemInfo">';
                        html += '<strong><a ' + linkTarget + ' class="title" id="mapItemLink' + i + '" title="' + snippet + '" href="' + itemURL + '">' + itemTitle + '</a></strong>';
                        // vars
                        var modifiedDate, modifiedLocalized;
                        // modified date
                        if (data.results[i].modified) {
                            // date object
                            modifiedDate = new Date(data.results[i].modified);
                            // date format for locale
                            modifiedLocalized = locale.format(modifiedDate, {
                                selector: "date",
                                datePattern: i18n.viewer.main.datePattern
                            });
                        }
                        // html
                        html += '<p class="dateInfo">';
                        html += data.results[i].type + ' ';
                        html += i18n.viewer.itemInfo.by + ' ';
                        if (_self._options.showProfileUrl) {
                            html += '<a href="' + _self.getViewerURL('owner_page', false, data.results[i].owner) + '">';
                        }
                        html += data.results[i].owner;
                        if (_self._options.showProfileUrl) {
                            html += '</a>';
                        }
                        html += '. ';
                        if (modifiedLocalized) {
                            html += 'Last modified ' + modifiedLocalized + '. ';
                        }
                        html += '</p>';
                        html += '<p>' + snippet + '</p>';
                        var widget;
                        if (_self._options.showRatings) {
                            // rating widget
                            widget = new Rating({
                                numStars: 5,
                                value: data.results[i].avgRating
                            }, null);
                        }
                        // rating container
                        html += '<div class="ratingCon">';
                        if (_self._options.showRatings) {
                            html += widget.domNode.outerHTML;
                        }
                        var rating = '';
                        if (_self._options.showRatings) {
                            // Ratings
                            if (data.results[i].numRatings) {
                                var pluralRatings = i18n.viewer.itemInfo.ratingsLabel;
                                if (data.results[i].numRatings > 1) {
                                    pluralRatings = i18n.viewer.itemInfo.ratingsLabelPlural;
                                }
                                rating += number.format(data.results[i].numRatings) + ' ' + pluralRatings;
                            }
                        }
                        if (_self._options.showComments) {
                            // comments
                            if (data.results[i].numComments) {
                                if (data.results[i].numRatings) {
                                    rating += i18n.viewer.itemInfo.separator + ' ';
                                }
                                var pluralComments = i18n.viewer.itemInfo.commentsLabel;
                                if (data.results[i].numComments > 1) {
                                    pluralComments = i18n.viewer.itemInfo.commentsLabelPlural;
                                }
                                rating += number.format(data.results[i].numComments) + ' ' + pluralComments;
                            }
                        }
                        // views
                        if (_self._options.showViews && data.results[i].numViews) {
                            if ((data.results[i].numRatings && _self._options.showRatings) || (data.results[i].numComments && _self._options.showComments)) {
                                rating += i18n.viewer.itemInfo.separator + ' ';
                            }
                            var pluralViews = i18n.viewer.itemInfo.viewsLabel;
                            if (data.results[i].numViews > 1) {
                                pluralViews = i18n.viewer.itemInfo.viewsLabelPlural;
                            }
                            rating += number.format(data.results[i].numViews) + ' ' + pluralViews;
                        }
                        if (rating) {
                            html += ' (' + rating + ')';
                        }
                        if (externalLink) {
                            html += '<span class="iconCon"><span class="icon external"></span>';
                        }
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="clear"></div>';
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="clear"></div>';
                    } else {
                        var endRow = false,
                            frontRow = false;
                        var itemClass = '';
                        itemTitle = data.results[i].title;
                        snippet = '';
                        if (data.results[i].snippet) {
                            snippet = data.results[i].snippet;
                        }
                        linkTarget = '';
                        if (_self._options.openGalleryItemsNewWindow || externalLink) {
                            linkTarget = 'target="_blank"';
                        }
                        // Last row item
                        if ((i + 1) % obj.perRow === 0) {
                            itemClass = ' omega';
                            endRow = true;
                        }
                        // First row item
                        if ((i + 3) % obj.perRow === 0) {
                            itemClass = ' alpha';
                            frontRow = true;
                        }
                        // Build grid item
                        html += '<div class="grid_3' + itemClass + '">';
                        html += '<a class="item" ' + linkTarget + ' id="mapItem' + i + '" href="' + itemURL + '">';
                        html += '<span class="summaryHidden"><strong>' + itemTitle + '</strong>' + _self.truncate(snippet, 120) + '</span>';
                        thumb = data.results[i].thumbnailUrl;
                        if (!thumb) {
                            thumb = 'images/defaultThumb.png';
                        }
                        html += '<img alt="' + itemTitle + '" class="gridImg" src="' + thumb + '" width="200" height="133" />';
                        html += '<span class="itemCounts">';
                        if (externalLink) {
                            html += '<span class="iconCon"><span class="icon external"></span>';
                        }
                        if (_self._options.showViews) {
                            html += '<span class="iconCon"><span class="icon views"></span><span class="iconText">' + number.format(data.results[i].numViews) + '</span></span>';
                        }
                        if (_self._options.showComments) {
                            html += '<span class="iconCon"><span class="icon comments"></span><span class="iconText">' + number.format(data.results[i].numComments) + '</span></span>';
                        }
                        if (_self._options.showRatings) {
                            html += '<span class="iconCon"><span class="icon ratings"></span><span class="iconText">' + number.format(data.results[i].numRatings) + '</span></span>';
                        }
                        html += '</span>';
                        html += '</a>';
                        html += '</div>';
                        if (endRow) {
                            html += '<div class="clear"></div>';
                        }
                    }
                }
                // Close
                html += '<div class="clear"></div>';
            } else {
                // No results
                html += '<div class="grid_5 suffix_4 sigma"><p class="alert error">' + i18n.viewer.errors.noMapsFound + ' <a tabindex="0" id="resetGroupSearch">' + i18n.viewer.groupPage.showAllMaps + '</a></p></div>';
                html += '<div class="clear"></div>';
            }
            // Insert HTML
            node = dom.byId('featuredMaps');
            if (node) {
                domClass.remove(node, 'mapsGrid mapsList');
                domClass.add(node, layout);
                _self.setNodeHTML(node, html);
            }
            // Create pagination
            _self.createPagination(obj, totalItems, 'maps_pagination');
        },
        /*------------------------------------*/
        // Enalbe layout and search options
        /*------------------------------------*/
        configLayoutSearch: function() {
            var _self = this;
            // if show search or show layout switch
            if (_self._options.showGroupSearch || _self._options.showLayoutSwitch) {
                // create HTML
                var html = '',
                    listClass, gridClass;
                // if show search
                html += '<div id="searchListCon" class="grid_5 alpha">';
                if (_self._options.showGroupSearch) {
                    html += '<ul id="searchListUL" class="searchList">';
                    html += '<li id="mapSearch" class="iconInput">';
                    html += '<input placeholder="' + i18n.viewer.groupPage.searchPlaceholder + '" id="searchGroup" title="' + i18n.viewer.groupPage.searchTitle + '" value="' + _self._options.searchString + '" autocomplete="off" type="text" tabindex="0" />';
                    html += '<div tabindex="0" title="' + i18n.viewer.main.clearSearch + '" class="iconReset" id="clearAddress"></div>';
                    html += '</li>';
                    html += '<li title="' + i18n.viewer.groupPage.searchTitleShort + '" class="searchButtonLi">';
                    html += '<span tabindex="0" id="searchGroupButton" class="silverButton buttonRight">';
                    html += '<span class="searchButton">&nbsp;</span></span>';
                    html += '</li>';
                    html += '<li id="groupSpinner" class="spinnerCon"></li>';
                    html += '</ul>';
                    html += '<div class="clear"></div>';
                    html += '<div id="acCon"><div id="groupAutoComplete" class="autoComplete"></div></div><div class="clear"></div>';
                } else {
                    html += '&nbsp;';
                }
                html += '</div>';
                // if show switch
                html += '<div class="grid_4 omega">';
                if (_self._options.showLayoutSwitch) {
                    if (_self._options.defaultLayout === "list") {
                        listClass = 'active';
                        gridClass = '';
                    } else {
                        listClass = '';
                        gridClass = 'active';
                    }
                    html += '<div class="toggleLayout">';
                    html += '<ul>';
                    html += '<li id="layoutList" class="' + listClass + '" title="' + i18n.viewer.groupPage.listSwitch + '">';
                    html += '<span tabindex="0" class="silverButton buttonRight"><span class="listView">&nbsp;</span></span>';
                    html += '<li id="layoutGrid" class="' + gridClass + '" title="' + i18n.viewer.groupPage.gridSwitch + '">';
                    html += '<span tabindex="0" class="silverButton buttonLeft"><span class="gridView">&nbsp;</span></span>';
                    html += '</li>';
                    html += '<li id="layoutSpinner" class="spinnerCon"></li>';
                    html += '</li>';
                    html += '</ul>';
                    html += '<div class="clear"></div>';
                    html += '</div>';
                    html += '<div class="clear"></div>';
                } else {
                    html += '&nbsp;';
                }
                html += '</div>';
                html += '<div class="clear"></div>';
                // if node, insert HTML
                var node = dom.byId('layoutAndSearch');
                _self.setNodeHTML(node, html);
                _self.checkAddressStatus(dom.byId("searchGroup"), dom.byId('clearAddress'));
            }
        },
        /*------------------------------------*/
        // Event Delegations
        /*------------------------------------*/
        setDelegations: function() {
            var _self = this;
            // Featured maps pagination onclick function
            on(dom.byId('maps_pagination'), ".enabled:click, .enabled:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // clicked
                    domClass.add(this, 'clicked');
                    // add loading spinner
                    _self.addSpinner("paginationSpinner");
                    // get offset number
                    var data_offset = domAttr.get(this, 'data-offset');
                    _self.dataOffset = data_offset;
                    // query maps function
                    _self.queryMaps(data_offset);
                }
            });
            // search button
            on(dom.byId("mainPanel"), "#searchGroupButton:click, #searchGroupButton:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var textVal = domAttr.get(dom.byId('searchGroup'), 'value');
                    if (textVal !== _self.prevVal) {
                        _self._options.searchString = textVal;
                        _self.addSpinner("groupSpinner");
                        _self.queryMaps();
                        _self.prevVal = textVal;
                    }
                }
            });
            // search reset button
            on(dom.byId("mainPanel"), "#resetGroupSearch:click, #resetGroupSearch:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    domClass.remove(dom.byId('clearAddress'), 'resetActive');
                    domAttr.set(dom.byId('searchGroup'), 'value', '');
                    var textVal = '';
                    _self._options.searchString = textVal;
                    _self.addSpinner("groupSpinner");
                    _self.queryMaps();
                    _self.prevVal = textVal;
                    _self.hideGroupAutoComplete();
                }
            });
            // list view
            on(dom.byId("mainPanel"), "#layoutList:click, #layoutList:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    if (_self._options.defaultLayout !== 'list') {
                        _self._options.defaultLayout = 'list';
                        query('.toggleLayout li').forEach(function(entry) {
                            domClass.remove(entry, 'active');
                        });
                        domClass.add(this, 'active');
                        _self.addSpinner("layoutSpinner");
                        _self.queryMaps(_self.dataOffset);
                    }
                }
            });
            // grid view
            on(dom.byId("mainPanel"), "#layoutGrid:click, #layoutGrid:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    if (_self._options.defaultLayout !== 'grid') {
                        _self._options.defaultLayout = 'grid';
                        query('.toggleLayout li').forEach(function(entry) {
                            domClass.remove(entry, 'active');
                        });
                        domClass.add(this, 'active');
                        _self.addSpinner("layoutSpinner");
                        _self.queryMaps(_self.dataOffset);
                    }
                }
            });
            // Reset X click
            on(dom.byId('mainPanel'), ".iconReset:click, .iconReset:keyup", function(e) {
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    var obj = dom.byId('searchGroup');
                    _self.clearAddress(obj, this);
                    var textVal = '';
                    _self._options.searchString = textVal;
                    _self.addSpinner("groupSpinner");
                    _self.queryMaps();
                    _self.prevVal = textVal;
                    _self.hideGroupAutoComplete();
                }
            });
            // auto complete && address specific action listeners
            on(dom.byId("mainPanel"), "#searchGroup:keyup", function(e) {
                _self.checkAddressStatus(this, dom.byId('clearAddress'));
                var aquery = domAttr.get(this, 'value');
                var all = query('#groupAutoComplete li');
                var locNum = array.indexOf(all, this);
                var alength = aquery.length;
                if (e.keyCode === keys.ENTER) {
                    clearTimeout(_self.timer);
                    var textVal = domAttr.get(this, 'value');
                    if (textVal !== _self.prevVal) {
                        _self._options.searchString = textVal;
                        _self.addSpinner("groupSpinner");
                        _self.queryMaps();
                        _self.prevVal = textVal;
                    }
                    _self.hideGroupAutoComplete();
                } else if (e.keyCode === keys.UP_ARROW) {
                   if (all[locNum - 1]) {
                        all[locNum - 1].focus();
                    } else {
                        all[all.length - 1].focus();
                    }
                } else if (e.keyCode === keys.DOWN_ARROW) {
                    if (all[locNum + 1]) {
                        all[locNum + 1].focus();
                    } else {
                        all[0].focus();
                    }
                } else if (alength >= 2) {
                    clearTimeout(_self.timer);
                    _self.timer = setTimeout(function() {
                        _self.groupAutoComplete(aquery);
                    }, 250);
                } else {
                    _self.hideGroupAutoComplete();
                }
            });
            // Autocomplete key up and click
            on(dom.byId("mainPanel"), "#groupAutoComplete li:click, #groupAutoComplete li:keyup", function(e) {
                var all = query('#groupAutoComplete li');
                // get result number
                var locNum = array.indexOf(all, this);
                if (e.type === 'click' || (e.keyCode === keys.ENTER)) {
                    // hide auto complete
                    _self.hideGroupAutoComplete();
                    // if map has a url
                    var mapURL;
                    if (_self.ACObj[locNum].url && _self.ACObj[locNum].type === "Web Mapping Application") {
                        mapURL = _self.ACObj[locNum].url;
                    } else if (_self.ACObj[locNum].type === "CityEngine Web Scene") {
                        mapURL = _self.getViewerURL('cityengine', _self.ACObj[locNum].id);
                    } else {
                        // item url
                        mapURL = _self.getViewerURL(_self._options.mapViewer, _self.ACObj[locNum].id);
                    }
                    // load map
                    window.location = mapURL;
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
        },
        /*------------------------------------*/
        // Init
        /*------------------------------------*/
        init: function() {
            var _self = this;
            // set default data offset
            if (!_self.dataOffset) {
                _self.dataOffset = 0;
            }
            // set loading text
            var node = dom.byId('featuredLoading');
            _self.setNodeHTML(node, i18n.viewer.groupPage.loadingText);
            // Query group and then query maps
            _self.queryGroup().then(function() {
                // insert home items
                _self.insertHomeContent();
                // Configure grid/list and search
                _self.configLayoutSearch();
                if (_self._options.showGroupSort) {
                    // build sorting menu
                    _self.buildSortingMenu();
                }
                // query for maps
                _self.queryMaps();
            });
            // set up event delegations
            _self.setDelegations();
        }
    });
});