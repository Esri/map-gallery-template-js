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
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-attr",
        "dojo/dom",
        "dojo/text!./templates/gallery.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings",
        "dojo/query",
        "dojo/dom-class",
        "dojo/on",
        "dojo/Deferred",
        "dojo/number",
        "dojo/topic"
    ],
    function (declare, domConstruct, lang, array, domAttr, dom, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, query, domClass, on, Deferred, number, topic) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,
            postCreate: function () {
                var applicationHeaderDiv = dom.byId("esriCTParentDivContainer");
                domConstruct.place(this.galleryView, query(".esriCTContentdiv")[0]);
                this.own(topic.subscribe("createPods", lang.hitch(this, this.createItemPods)));
                this.own(on(this.galleryPrevious, "click", lang.hitch(this, function () {
                    var defObj = new Deferred();
                    if (!dojo.prevQuery) {
                        return;
                    }
                    var _self = this;
                    topic.publish("queryGroupItem", null, null, null, null, defObj, dojo.prevQuery);
                    defObj.then(function (data) {
                        dojo.nextQuery = data.nextQueryParams;
                        _self._prevItem(data);
                        _self.createItemPods(data.results);
                    }, function (err) {
                        alert(err.message);
                    });
                })));

                this.own(on(this.galleryNext, "click", lang.hitch(this, function () {
                    var defObj = new Deferred();
                    var _self = this;
                    if (dojo.nextQuery.start == -1) {
                        return;
                    }
                    topic.publish("queryGroupItem", null, null, null, null, defObj, dojo.nextQuery);
                    defObj.then(function (data) {
                        dojo.nextQuery = data.nextQueryParams;
                        _self._prevItem(data);
                        _self.createItemPods(data.results);
                    }, function (err) {
                        alert(err.message);
                    });
                })));
            },

            _prevItem: function (data) {
                dojo.prevQuery = {
                    num: data.queryParams.num,
                    q: data.queryParams.q,
                    sortField: data.queryParams.sortField,
                    sortOrder: data.queryParams.sortOrder,
                    start: data.queryParams.start - data.queryParams.num
                }
            },

            createItemPods: function (itemResults) {
                domConstruct.empty(this.itemPodsList);
                currentSetOfPods = 0;
                for (var i = 0; i < itemResults.length; i++) {
                    if (!dojo.configData.gridView) {
                        var divPodParent = domConstruct.create('div', { "class": "esriCTApplicationListBox" }, this.itemPodsList);
                        this._createThumbnails(itemResults[i], divPodParent);
                        this._createItemOverviewPanel(itemResults[i], divPodParent);
                    } else {
                        var divPodParent = domConstruct.create('div', { "class": "esriCTApplicationBox" }, this.itemPodsList);
                        this._createThumbnails(itemResults[i], divPodParent);
                        this._createGridItemOverview(itemResults[i], divPodParent);
                    }
                }
            },

            _createGridItemOverview: function (itemResult, divPodParent) {
                var divItemWatchEye = domConstruct.create('div', { "class": "esriCTEyewatch" }, divPodParent);
                var spanItemWatchEye = domConstruct.create('span', { "class": "eye icon-eye" }, divItemWatchEye);
                var spanItemWatchEye = domConstruct.create('span', { "class": "view" }, divItemWatchEye);

                spanItemWatchEye.innerHTML = (itemResult.numViews) ? (number.format(parseInt(itemResult.numViews, 10))) : (nls.showNullValue);
                var divItemReadMore = domConstruct.create('span', { "class": "readmore readmoreGrid" }, divPodParent);
                divItemReadMore.innerHTML = nls.readMoreDisplayText;
            },

            _createThumbnails: function (itemResult, divPodParent) {
                if (!dojo.configData.gridView) {
                    var divThumbnail = domConstruct.create('div', { "class": "esriCTImageContainerList" }, divPodParent);
                } else {
                    var divThumbnail = domConstruct.create('div', { "class": "esriCTImageContainer" }, divPodParent);
                }

                var divThumbnailImage = domConstruct.create('div', { "class": "esriCTAppImage" }, divThumbnail);
                if (itemResult.thumbnailUrl) {
                    divThumbnailImage.style.background = 'url(' + itemResult.thumbnailUrl + ') no-repeat center center';
                } else {
                    divThumbnailImage.style.background = "url(./themes/images/NotAvailable.png) no-repeat center center";
                }
                var divThumbnailTopPanel = domConstruct.create('div', { "class": "esriCTImageTopPanel" }, divThumbnailImage);

                var divItemName = domConstruct.create('div', { "class": "esriCTAppTitle" }, divThumbnailTopPanel);
                divItemName.innerHTML = (itemResult.title) ? (itemResult.title) : (nls.showNullValue);
                divItemName.title = (itemResult.title) ? (itemResult.title) : (nls.showNullValue);

                var divTagContainer = domConstruct.create('div', { "class": "esriCTTagbg" }, divThumbnailTopPanel);
                var divTagContent = domConstruct.create('div', { "class": "esriCTTag" }, divTagContainer);
                this._accessLogoType(itemResult, divTagContent);
                var divItemType = domConstruct.create('div', { "class": "esriCTApplicationType" }, divThumbnail);
                divItemType.innerHTML = (itemResult.type) ? (itemResult.type) : (nls.showNullValue);
                if (dojo.configData.gridView) {
                    var divItemContent = domConstruct.create('div', { "class": "esriCTAppcontent" }, divPodParent);
                }
            },

            _accessLogoType: function (itemResult, divTagContent) {
                var title;
                if (itemResult.access == "public") {
                    title = nls.allText;
                } else if (itemResult.access == "org") {
                    title = nls.orgText;
                } else {
                    title = nls.grpText;
                }
                if (divTagContent) {
                    divTagContent.innerHTML = title;
                }
            },

            _createItemOverviewPanel: function (itemResult, divPodParent) {
                var divContent = domConstruct.create('div', { "class": "esriCTListContent" }, divPodParent);
                var divTitle = domConstruct.create('div', { "class": "esriCTAppListTitle" }, divContent);
                var divAppIcon = domConstruct.create('div', { "class": "esriCTListAppIcon" }, divTitle);

                var divItemTitle = domConstruct.create('div', { "class": "esriCTAppListTitleRight" }, divTitle);
                var divItemTitleRight = domConstruct.create('div', { "class": "divclear" }, divItemTitle);
                var divItemTitleText = domConstruct.create('div', { "class": "esriCTListAppTitle" }, divItemTitleRight);
                divItemTitleText.innerHTML = (itemResult.title) ? (itemResult.title) : (nls.showNullValue);

                var divItemWatchEye = domConstruct.create('div', { "class": "esriCTEyewatch" }, divItemTitleRight);
                var spanItemWatchEye = domConstruct.create('span', { "class": "eye icon-eye" }, divItemWatchEye);
                var spanItemWatchEye = domConstruct.create('span', { "class": "view" }, divItemWatchEye);
                spanItemWatchEye.innerHTML = (itemResult.numViews) ? (number.format(parseInt(itemResult.numViews, 10))) : (nls.showNullValue);

                var divModifiedDate = domConstruct.create('div', { "class": "esriCTListMdfDate" }, divItemTitle);
                divModifiedDate.innerHTML = ((itemResult.type) ? (itemResult.type) : (nls.showNullValue)) +
                    " by " + ((itemResult.owner) ? (itemResult.owner) : (nls.showNullValue)) +
                    " Last modified " + ((itemResult.modified) ? (itemResult.modified.toLocaleDateString()) : (nls.showNullValue)) + ".";

                var divItemContent = domConstruct.create('div', { "class": "esriCTListAppcontent" }, divContent);
                var divItemSnippet = domConstruct.create('div', { "class": "esriCTAppHeadline" }, divItemContent);

                var spanItemReadMore = domConstruct.create('span', {}, divItemSnippet);
                spanItemReadMore.innerHTML = (itemResult.snippet) ? (itemResult.snippet) : (nls.showNullValue);

                var divItemReadMore = domConstruct.create('span', { "class": "readmore" }, divItemSnippet);
                divItemReadMore.innerHTML = nls.readMoreDisplayText;
            }
        });
    });