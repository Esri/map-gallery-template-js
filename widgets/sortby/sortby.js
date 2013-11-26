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
        "dojo/text!./templates/sortby.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings",
        "dojo/query",
        "dojo/topic",
        "dojo/Deferred",
        "dojo/dom-construct"
    ],
    function (declare, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, query, topic, Deferred, domConstruct) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,
            postCreate: function () {
                var sortByDate = true;
                var _self = this;
                this.sortByLabel.innerHTML = nls.sortByDateText;
                this.sortByLabel.onclick = function () {
                    if (sortByDate) {
                        dojo.sortBy = "modified";
                        _self._sortPodOrder(dojo.sortBy, this, nls.sortByViewText);
                        sortByDate = false;
                    } else {
                        dojo.sortBy = "numViews";
                        _self._sortPodOrder(dojo.sortBy, this, nls.sortByDateText);
                        sortByDate = true;
                    }
                }
            },

            _sortPodOrder: function (sortOrder, _self, text) {
                var numberOfItems;
                if (dojo.configData.gridView) {
                    numberOfItems = 9;
                } else {
                    numberOfItems = 4;
                }
                var defObj = new Deferred();
                topic.publish("queryGroupItem", dojo.queryString, numberOfItems, sortOrder, "desc", defObj);
                defObj.then(function (data) {
                    _self.innerHTML = text;
                    dojo.nextQuery = data.nextQueryParams;
                    dojo.prevQuery = null;
                    topic.publish("createPods", data.results);
                });
            }
        });
    });