/*global dojo,define,document */
/*jslint sloppy:true */
/** @license
| Version 10.2
| Copyright 2013 Esri
|
| Licensed under the Apache License, Version 2.0 (the "License");
| you may not use this file except in compliance with the License.
| You may obtain a copy of the License at
|
|    http://www.apache.org/licenses/LICENSE-2.0
|
| Unless required by applicable law or agreed to in writing, software
| distributed under the License is distributed on an "AS IS" BASIS,
| WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
| See the License for the specific language governing permissions and
| limitations under the License.
*/
//============================================================================================================================//
define([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dojo/dom",
        "dojo/text!./templates/leftPanel.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings",
        "dojo/topic",
        "dojo/Deferred",
        "widgets/gallery/gallery",
        "dojo/query",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/NodeList-manipulate"
    ],
    function (declare, domConstruct, domAttr, dom, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, topic, Deferred, Gallery, query, domClass, domStyle) {
        declare("collectUniqueTags", null, {
            setNodeValue: function (node, text) {
                if (text) {
                    node.innerHTML = text;
                }
            },

            //This function is used to collect all the tags in array
            collectTags: function (results, geoTag) {
                var groupItemsTagsdata = [];
                var geoTagCollection = [];
                for (var i = 0; i < results.length; i++) {
                    for (var j = 0; j < results[i].tags.length; j++) {
                        var geoTagValue;
                        if (geoTag) {
                            geoTagValue = this._searchGeoTag(results[i].tags[j], geoTag);
                            if (geoTagValue == 0) {
                                if (!geoTagCollection[results[i].tags[j]]) {
                                    geoTagCollection[results[i].tags[j]] = 1;
                                } else {
                                    geoTagCollection[results[i].tags[j]]++;
                                }
                            }
                        }
                        if (geoTagValue != 0) {
                            if (!groupItemsTagsdata[results[i].tags[j]]) {
                                groupItemsTagsdata[results[i].tags[j]] = 1;
                            } else {
                                groupItemsTagsdata[results[i].tags[j]]++;
                            }
                        }
                    }
                }
                geoTagCollection = this._sortArray(geoTagCollection);
                groupItemsTagsdata = this._sortArray(groupItemsTagsdata);
                if (geoTagCollection.length == 0) {
                    geoTagCollection = null;
                }
                if (groupItemsTagsdata.length == 0) {
                    groupItemsTagsdata = null;
                }
                var tagsObj = {
                    "geoTagCollection": geoTagCollection,
                    "groupItemsTagsdata": groupItemsTagsdata
                };

                return tagsObj;
            },
            //This function sorts the the tag cloud array in order
            _sortArray: function (array) {
                var sortedArray = [];
                for (var i in array) {
                    if (array.hasOwnProperty(i)) {
                        sortedArray.push({
                            key: i,
                            value: array[i]
                        });
                    }
                }
                sortedArray.sort(function (a, b) {
                    if (a.value > b.value) {
                        return -1;
                    } else if (a.value < b.value) {
                        return 1;
                    }
                    return 0;
                });
                return sortedArray;
            },
            //This function search for the tags with the geo tag configured
            _searchGeoTag: function (tag, geoTag) {
                var geoTagValue = tag.search(geoTag);
                return geoTagValue;
            }
        });

        declare("tagCloudObj", null, {
            //This function generates the Tag cloud based on the inputs provided
            generateTagCloud: function (tagsCollection, maxTags, fontsRange) {
                if (tagsCollection.length < maxTags) {
                    maxTags = tagsCollection.length;
                }
                var maxUsedTags = this._identifyMaxUsedTags(tagsCollection, maxTags);
                var fontSizeArray = this._generateFontSize(fontsRange.minValue, fontsRange.maxValue, maxUsedTags.length);
                var tagCloudTags = this._mergeTags(maxUsedTags, fontSizeArray);
                return tagCloudTags;
            },
            //This function identifies maximum used tags
            _identifyMaxUsedTags: function (tagsCollection, maxTagsToDisplay) {
                var maxUsedTags = [];
                for (var i = 0; i < maxTagsToDisplay; i++) {
                    maxUsedTags.push(tagsCollection[i]);
                }
                return maxUsedTags;
            },
            //This function generates the required font ranges for each and every tag in tag cloud
            _generateFontSize: function (min, max, count) {
                var diff = ((max - min) / (count - 1));
                var fontSizeArray = [];
                fontSizeArray.push(min);
                for (var i = 1; i < count; i++) {
                    nextValue = fontSizeArray[i - 1] + diff;
                    fontSizeArray.push(nextValue);
                }
                return fontSizeArray.sort(function (a, b) {
                    if (a > b) {
                        return -1;
                    } else if (a < b) {
                        return 1;
                    }
                    return 0;
                });
            },
            //This function merges the display tags and font ranges in single array
            _mergeTags: function (maxUsedTags, fontSizeArray) {
                for (var i = 0; i < maxUsedTags.length; i++) {
                    maxUsedTags[i].fontSize = fontSizeArray[i];
                }
                return maxUsedTags.sort(function (a, b) {
                    if (a.key < b.key) {
                        return -1;
                    } else if (a.key > b.key) {
                        return 1;
                    }
                    return 0;
                });
            }
        });

        declare("leftPanelCollection", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Deferred], {
            templateString: template,
            groupItems: [],
            nls: nls,
            postCreate: function () {
                this._setGroupContent();
                this._expandGroupdescEvent(this.expandGroupDescription, this);
                this._queryGroupItems();
            },

            _queryGroupItems: function (nextQuery) {
                var _self = this;
                var defObj = new Deferred();
                if (!nextQuery) {
                    dojo.queryString = 'group:("' + dojo.configData.ApplicationSettings.group + '")';
                    dojo.sortBy = "numViews";
                    topic.publish("queryGroupItem", dojo.queryString, 100, dojo.sortBy, "desc", defObj);
                } else {
                    topic.publish("queryGroupItem", null, null, null, null, defObj, nextQuery);
                }

                defObj.then(function (data) {
                    if (data.nextQueryParams.start != -1) {
                        for (var i = 0; i < data.results.length; i++) {
                            _self.groupItems.push(data.results[i]);
                        }
                        _self._queryGroupItems(data.nextQueryParams);
                    } else {
                        for (var i = 0; i < data.results.length; i++) {
                            _self.groupItems.push(data.results[i]);
                        }
                        _self._setLeftPanelContent(_self.groupItems);
                    }
                }, function (err) {
                    alert(err.message);
                });
            },

            _setLeftPanelContent: function (results) {
                if (dojo.configData.ApplicationSettings.showCategoriesTagCloud || dojo.configData.ApplicationSettings.showGeographiesTagCloud) {
                    var uniqueTags = new collectUniqueTags();
                    var tagsObj = uniqueTags.collectTags(results, dojo.configData.ApplicationSettings.geographiesTagText);
                    var tagCloud = new tagCloudObj();
                    if (!dojo.configData.ApplicationSettings.tagCloudFontRange.minValue && !dojo.configData.ApplicationSettings.tagCloudFontRange.maxValue && dojo.configData.ApplicationSettings.tagCloudFontRange.units) {
                        dojo.configData.ApplicationSettings.tagCloudFontRange.minValue = 10;
                        dojo.configData.ApplicationSettings.tagCloudFontRange.maxValue = 18;
                        dojo.configData.ApplicationSettings.tagCloudFontRange.units = "px";
                    }
                    if (dojo.configData.ApplicationSettings.tagCloudFontRange.minValue > dojo.configData.ApplicationSettings.tagCloudFontRange.maxValue) {
                        alert(nls.errorMessages.minfontSizeGreater);
                        return;
                    }
                    if (dojo.configData.ApplicationSettings.showCategoriesTagCloud && tagsObj.groupItemsTagsdata) {
                        domStyle.set(this.tagsCategoriesContent, "display", "block");
                        uniqueTags.setNodeValue(this.tagsCategories, this.nls.tagCategoriesHeaderText);
                        uniqueTags.setNodeValue(this.CategoryTagsResetFiltertext, this.nls.resetFilterText);

                        var displayCategoryTags = tagCloud.generateTagCloud(tagsObj.groupItemsTagsdata, dojo.configData.ApplicationSettings.showMaxTopTags, dojo.configData.ApplicationSettings.tagCloudFontRange);
                        this.displayTagCloud(displayCategoryTags, this.tagsCategoriesCloud);
                        this._resetFilter(this.CategoryTagsResetFiltertext);
                    }
                    if (dojo.configData.ApplicationSettings.showGeographiesTagCloud && dojo.configData.ApplicationSettings.geographiesTagText && tagsObj.geoTagCollection) {
                        domStyle.set(this.geographicTagsContent, "display", "block");
                        uniqueTags.setNodeValue(this.geoTagsCloudHeader, this.nls.geographicTagsHeaderText);
                        uniqueTags.setNodeValue(this.geoTagsResetFiltertext, this.nls.resetFilterText);
                        var displaygeoTags = tagCloud.generateTagCloud(tagsObj.geoTagCollection, dojo.configData.ApplicationSettings.showMaxTopTags, dojo.configData.ApplicationSettings.tagCloudFontRange);
                        this.displayTagCloud(displaygeoTags, this.geoTagsCloud);
                        this._resetFilter(this.geoTagsResetFiltertext);
                    }
                    this._appendLeftPanel();
                    var defObj = new Deferred();
                    dojo.queryString = 'group:("' + dojo.configData.ApplicationSettings.group + '")';
                    dojo.sortBy = "numViews";
                    var numberOfItems;
                    if (dojo.configData.gridView) {
                        numberOfItems = 9;
                    } else {
                        numberOfItems = 4;
                    }
                    topic.publish("queryGroupItem", dojo.queryString, numberOfItems, dojo.sortBy, "desc", defObj);
                    defObj.then(function (data) {
                        dojo.nextQuery = data.nextQueryParams;
                        dojo.prevQuery = null;
                        var gallery = new Gallery();
                        gallery.createItemPods(data.results);
                    }, function (err) {
                        alert(err.message);
                    });
                } else {
                    this._appendLeftPanel();
                    var gallery = new Gallery();
                }
            },

            _resetFilter: function (node) {
                node.onclick = function () {
                    var numberOfItems;
                    if (dojo.configData.gridView) {
                        numberOfItems = 9;
                    } else {
                        numberOfItems = 4;
                    }
                    var defObj = new Deferred();
                    dojo.queryString = 'group:("' + dojo.configData.ApplicationSettings.group + '")';
                    topic.publish("queryGroupItem", dojo.queryString, numberOfItems, dojo.sortBy, "desc", defObj);
                    defObj.then(function (data) {
                        dojo.nextQuery = data.nextQueryParams;
                        dojo.prevQuery = null;
                        topic.publish("createPods", data.results);
                        if (data.total <= numberOfItems) {
                            domClass.replace(query(".pagination")[0], "displayNoneAll", "displayBlockAll");
                        } else {
                            domClass.replace(query(".pagination")[0], "displayBlockAll", "displayNoneAll");
                        }
                    }, function (err) {
                        alert(err.message);
                    });
                }
            },

            //This function creates the required HTML for generating the tag cloud
            displayTagCloud: function (displayTags, node) {
                var _self = this;
                for (var i = 0; i < displayTags.length; i++) {
                    var span = domConstruct.place(domConstruct.create('h3'), node);
                    domClass.add(span, "tagCloud");
                    span.style.fontSize = displayTags[i].fontSize + dojo.configData.ApplicationSettings.tagCloudFontRange.units;
                    if (i != (displayTags.length - 1)) {
                        span.innerHTML = displayTags[i].key + ", ";
                    } else {
                        span.innerHTML = displayTags[i].key + ".";
                    }
                    span.onclick = function () {
                        _self._queryRelatedTags(this.innerHTML);
                    }
                }
            },

            _queryRelatedTags: function (tagName) {
                var numberOfItems;
                if (dojo.configData.gridView) {
                    numberOfItems = 9;
                } else {
                    numberOfItems = 4;
                }
                var defObj = new Deferred();
                dojo.queryString = 'group:("' + dojo.configData.ApplicationSettings.group + '")' + ' AND (tags: ("' + tagName + '"))';
                topic.publish("queryGroupItem", dojo.queryString, numberOfItems, dojo.sortBy, "desc", defObj);
                defObj.then(function (data) {
                    dojo.nextQuery = data.nextQueryParams;
                    dojo.prevQuery = null;
                    topic.publish("createPods", data.results);
                    if (data.total <= numberOfItems) {
                        domClass.replace(query(".pagination")[0], "displayNoneAll", "displayBlockAll");
                    } else {
                        domClass.replace(query(".pagination")[0], "displayBlockAll", "displayNoneAll");
                    }
                }, function (err) {
                    alert(err.message);
                });
            },

            //This function shrinks or expands the group description content based on the click event
            _expandGroupdescEvent: function (node, _self) {
                node.onclick = function () {
                    if (this.innerHTML == nls.expandGroupDescText) {
                        this.innerHTML = nls.shrinkGroupDescText;
                    } else {
                        this.innerHTML = nls.expandGroupDescText;
                    }
                    domClass.toggle(_self.groupDesc, "esriCTLeftTextReadLess");
                };
            },

            //This function sets the required group content in the containers
            _setGroupContent: function () {
                var _self = this;
                if (dojo.configData.groupIcon) {
                    _self.groupLogo.src = dojo.configData.groupIcon;
                }
                if (dojo.configData.groupName) {
                    _self.setNodeText(_self.groupName, dojo.configData.groupName);
                }
                if (dojo.configData.homeSideContent) {
                    _self.setNodeText(_self.groupDesc, dojo.configData.homeSideContent);
                    if (query(_self.groupDesc).text().length > 400) {
                        domClass.add(_self.groupDesc, "esriCTLeftTextReadLess");
                        if (_self.nls.expandGroupDescText) {
                            _self.setNodeText(_self.expandGroupDescription, _self.nls.expandGroupDescText);
                        }
                    }
                }
                if (dojo.configData.ApplicationName) {
                    _self.setNodeText(_self.groupDescPanelHeader, dojo.configData.ApplicationName);
                    _self.setNodeText(_self.leftPanelHeader, dojo.configData.ApplicationName);
                }
            },

            //This function is used to set the innerHTML
            setNodeText: function (node, htmlString) {
                if (node) {
                    node.innerHTML = htmlString;
                }
            },

            //This function append the left panel to parent container
            _appendLeftPanel: function () {
                var _self = this;
                var applicationHeaderDiv = dom.byId("esriCTParentDivContainer");
                domConstruct.place(_self.galleryandPannels, applicationHeaderDiv);
            }
        });
    });