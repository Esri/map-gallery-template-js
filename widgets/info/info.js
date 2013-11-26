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
        "dojo/_base/lang",
        "dojo/on",
        "dojo/text!./templates/info.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/query",
        "dojo/dom-class"
    ],
    function (declare, lang, on, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,  query, domClass) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            postCreate: function () {
                var _self = this;
                this.own(on(this.infoIcon, "click", lang.hitch(this, function () {
                    _self._slideRightPanel();
                })));
            },
            _slideRightPanel: function () {
                if (query(".esriCTMenuTab")[0]) {
                    domClass.toggle(query(".esriCTMenuTab")[0], "esriCTShiftLeft");
                }
                if (query(".esriCTContentdiv")[0]) {
                    domClass.toggle(query(".esriCTRightPanel")[0], "esriCTShiftLeft");
                }
                if (query(".esriCTLeftPanel")[0]) {
                    domClass.toggle(query(".esriCTLeftPanel")[0], "esriCTShiftLeftPanel");
                }
                if (domClass.contains(query(".esriCTRightPanel")[0], "esriCTShiftLeft")) {
                    domClass.replace(query(".esriCTInnerLeftPanelTop")[0], "displayBlock", "displayNone");
                } else {
                    domClass.replace(query(".esriCTInnerLeftPanelTop")[0], "displayNone", "displayBlock");
                }
                if (query(".esriCTMenuTabLeft")[0]) {
                    if (domClass.contains(query(".esriCTMenuTabLeft")[0], "displayBlock")) {
                        domClass.replace(query(".esriCTMenuTabLeft")[0], "displayNone", "displayBlock");
                        domClass.replace(query(".esriCTSignIn")[0], "displayNone", "displayBlock");
                    } else {
                        domClass.replace(query(".esriCTMenuTabLeft")[0], "displayBlock", "displayNone");
                        domClass.replace(query(".esriCTSignIn")[0], "displayBlock", "displayNone");
                    }
                }
            }
        });
    });