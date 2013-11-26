/*global define, document, Modernizr */
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
        "dojo/dom-style",
        "dojo/dom-attr",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/text!./templates/locatorTemplate.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/topic",
        "dojo/dom-class"
    ],
    function (declare, domStyle, domAttr, lang, on, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Deferred, domConstruct, topic, domClass) {

        //========================================================================================================================//

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            lastSearchString: null,
            stagedSearch: null,
            mapPoint: null,

            /**
            * display locator widget
            *
            * @class
            * @name widgets/locator/locator
            */
            postCreate: function () {
                /**
                * close locator widget if any other widget is opened
                * @param {string} widget Key of the newly opened widget
                */
                this.own(on(this.domNode, "click", lang.hitch(this, function () {

                    /**
                    * minimize other open header panel widgets and show locator widget
                    */
                    topic.publish("toggleWidget", "locator");
                })));
                domStyle.set(this.divAddressContainer, "display", "block");
                this._setDefaultTextboxValue();
                this.txtItemSearch.value = domAttr.get(this.txtItemSearch, "defaultItem");
                this._attachItemSearchEvents();
            },

            _attachItemSearchEvents: function () {
                /**
                * tdSearchActivity Tab for Activity search
                * @member {span} tdSearchActivity
                * @private
                * @memberOf widgets/locator/locator
                */
                this.own(on(this.itemSearchIcon, "click", lang.hitch(this, function (evt) {
                    this._locateItems(this.autoResults);
                })));
                this.own(on(this.txtItemSearch, "keyup", lang.hitch(this, function (evt) {
                    this._submitSearchedItem(evt);
                })));
                this.own(on(this.txtItemSearch, "dblclick", lang.hitch(this, function (evt) {
                    this._clearDefaultText(evt);
                })));
                this.own(on(this.divAddressContainer, "blur", lang.hitch(this, function () {
                    domClass.replace(this.autoResults, "displayNoneAll", "displayBlockAll");
                })));
            },
            /**
            * search address on every key press
            * @param {object} evt Keyup event
            * @memberOf widgets/locator/locator
            */
            _submitSearchedItem: function (evt) {
                if (evt) {
                    if (evt.keyCode == dojo.keys.ENTER) {
                        if (this.txtItemSearch.value != '') {
                            domClass.replace(this.autoResults, "displayBlockAll", "displayNoneAll");
                            this._locateItems(this.autoResults);
                        }
                    }
                    if (dojo.configData.ApplicationSettings.enableAutoComplete) {

                        /**
                        * do not perform auto complete search if alphabets,
                        * numbers,numpad keys,comma,ctl+v,ctrl +x,delete or
                        * backspace is pressed
                        */
                        if ((!((evt.keyCode >= 46 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91) || (evt.keyCode > 95 && evt.keyCode < 106) || evt.keyCode == 8 || evt.keyCode == 110 || evt.keyCode == 188)) || (evt.keyCode == 86 && evt.ctrlKey) || (evt.keyCode == 88 && evt.ctrlKey)) {
                            evt = (evt) ? evt : event;
                            evt.cancelBubble = true;
                            evt.stopPropagation && evt.stopPropagation();
                            return;
                        }
                        if (lang.trim(this.txtItemSearch.value) != '') {
                            if (this.lastSearchString != lang.trim(this.txtItemSearch.value)) {
                                this.lastSearchString = lang.trim(this.txtItemSearch.value);
                                var _self = this;

                                /**
                                * clear any staged search
                                */
                                clearTimeout(this.stagedSearch);
                                if (lang.trim(this.txtItemSearch.value).length > 0) {

                                    /**
                                    * stage a new search, which will launch if no new searches show up
                                    * before the timeout
                                    */
                                    this.stagedSearch = setTimeout(function () {

                                        _self._locateItems(_self.autoResults);
                                    }, 500);
                                }
                            }
                        } else {
                            this.lastSearchString = lang.trim(this.txtItemSearch.value);
                            domConstruct.empty(this.autoResults);
                            domClass.replace(this.autoResults, "displayNoneAll", "displayBlockAll");
                        }
                    }
                }
            },

            _locateItems: function (node) {
                var _self = this;
                var defObj = new Deferred();
                topic.publish("queryGroupItem", this.txtItemSearch.value + ' AND group:("' + dojo.configData.ApplicationSettings.group + '")', 100, "numViews", "desc", defObj);
                defObj.then(function (data) {
                    domConstruct.empty(_self.autoResults);
                    if (data.results.length > 0) {
                        domClass.replace(_self.autoResults, "displayBlockAll", "displayNoneAll");
                        for (var i in data.results) {
                            var spanResults = domConstruct.create('div', { "innerHTML": data.results[i].title }, node);
                            _self.own(on(spanResults, "click", function () {
                                domAttr.set(_self.txtItemSearch, "value", this.innerHTML);
                                domAttr.set(_self.txtItemSearch, "defaultItem", this.innerHTML);
                                domConstruct.empty(_self.autoResults);
                                domClass.replace(_self.autoResults, "displayNoneAll", "displayBlockAll");
                            }));
                        }
                    } else {
                        domClass.replace(_self.autoResults, "displayNoneAll", "displayBlockAll");
                    }
                }, function (err) {
                    alert(err.message);
                });
            },

            /**
            * clear default value from search textbox
            * @param {object} evt Dblclick event
            * @memberOf widgets/locator/locator
            */
            _clearDefaultText: function (evt) {
                var target = window.event ? window.event.srcElement : evt ? evt.target : null;
                if (!target) return;
                domStyle.set(target, "color", "#000");
                target.value = '';
            },
            /**
            * set default value to search textbox
            * @param {object} evt Blur event
            * @memberOf widgets/locator/locator
            */
            _replaceDefaultText: function (evt) {
                var target = window.event ? window.event.srcElement : evt ? evt.target : null;
                if (!target) return;
                this._resetTargetValue(target, "defaultItem", "gray");
            },
            /**
            * set default value to search textbox
            * @param {object} target Textbox dom element
            * @param {string} title Default value
            * @param {string} color Background color of search textbox
            * @memberOf widgets/locator/locator
            */
            _resetTargetValue: function (target, title, color) {
                if (target.value == '' && domAttr.get(target, title)) {
                    domAttr.set(target, "value", domAttr.get(target, title));
                    if (target.title == "") {
                        target.value = domAttr.get(target, title);
                    }
                }
                if (domClass.contains(target, "esriCTColorChange")) {
                    domClass.remove(target, "esriCTColorChange");
                }
                domClass.add(target, "esriCTBlurColorChange");
                this.lastSearchString = lang.trim(this.txtItemSearch.value);
            },
            /**
            * set default value of locator textbox as specified in configuration file
            * @param {array} dojo.configData.LocatorSettings.Locators Locator settings specified in configuration file
            * @memberOf widgets/locator/locator
            */
            _setDefaultTextboxValue: function () {
                var itemLocatorSettings = dojo.configData.LocatorSettings.itemsLocator;
                /**
                * txtAddress Textbox for search text
                * @member {textbox} txtAddress
                * @private
                * @memberOf widgets/locator/locator
                */
                domAttr.set(this.txtItemSearch, "defaultItem", itemLocatorSettings[0].LocatorDefaultAddress);
            }
        });
    });