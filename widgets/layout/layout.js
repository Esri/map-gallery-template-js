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
        "dojo/text!./templates/layout.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings",
        "dojo/Deferred",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/topic",
        "dojo/query",
        "dojo/dom-attr"
    ],
    function (declare, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, Deferred, domClass, domStyle, topic, query, domAttr) {

        //========================================================================================================================//

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,
            postCreate: function () {
                this.layoutLabel.innerHTML = nls.layoutText;
                var _self = this;
                this.toggleLayout.onclick = function () {
                    var numberOfItems;
                    if (!dojo.configData.gridView) {
                        dojo.configData.gridView = true;
                        numberOfItems = 9;
                        domAttr.set(_self.layoutTitle, "title", nls.gridViewTitle);
                        domClass.replace(_self.layoutTitle, "icon-grid", "icon-list");
                    } else {
                        dojo.configData.gridView = false;
                        numberOfItems = 4;
                        domAttr.set(_self.layoutTitle, "title", nls.listViewTitle);
                        domClass.replace(_self.layoutTitle, "icon-list", "icon-grid");
                    }
                    var defObj = new Deferred();
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
            }
        });
    });