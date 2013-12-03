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
        "dojo/dom-style",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom",
        "dojo/dom-class",
        "dojo/dom-geometry",
        "dojo/string",
        "dojo/_base/html",
        "dojo/text!./templates/shareTemplate.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings",
        "dojo/topic"
    ],
    function (declare, domConstruct, domStyle, lang, array, on, dom, domClass, domGeom, string, html, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, topic) {

        //========================================================================================================================//

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,

            /**
            * create share widget
            *
            * @class
            * @name widgets/share/share
            */
            postCreate: function () {

                /**
                * close share panel if any other widget is opened
                * @param {string} widget Key of the newly opened widget
                */
                topic.subscribe("toggleWidget", lang.hitch(this, function (widgetID) {
                    if (widgetID != "share") {
                        /**
                        * divAppContainer Sharing Options Container
                        * @member {div} divAppContainer
                        * @private
                        * @memberOf widgets/share/share
                        */
                        if (html.coords(this.divAppContainer).h > 0) {
                            domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMedia-select");
                            domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                            domClass.replace(this.divAppContainer, "esriCTZeroHeight", "esriCTFullHeight");
                        }
                    }
                }));

                this.domNode = domConstruct.create("div", {
                    "title": this.title,
                    "class": "esriCTImgSocialMedia"
                }, null);

                this.own(on(this.domNode, "click", lang.hitch(this, function () {

                    /**
                    * minimize other open header panel widgets and show share panel
                    */
                    topic.publish("toggleWidget", "share");
                    this._shreLink();
                })));
            },

            /**
            * display sharing panel
            * @param {array} dojo.configData.MapSharingOptions Sharing option settings specified in configuration file
            * @memberOf widgets/share/share
            */
            _shreLink: function () {
                /**
                * get current map extent to be shared
                */
                var mapExtent = this._getMapExtent(),
                    url = esri.urlToObject(window.location.toString()),
                    urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
                try {
                    /**
                    * call tinyurl service to generate share URL
                    */
                    url = string.substitute(dojo.configData.MapSharingOptions.TinyURLServiceURL, [urlStr]);
                    dojo.io.script.get({
                        url: url,
                        callbackParamName: "callback",
                        load: lang.hitch(this, function (data) {
                            var tinyUrl = data;
                            var attr = dojo.configData.MapSharingOptions.TinyURLResponseAttribute.split(".");
                            for (var x = 0; x < attr.length; x++) {
                                tinyUrl = tinyUrl[attr[x]];
                            }

                            var applicationHeaderDiv = domConstruct.create("div", {
                                "class": "esriCTApplicationShareicon"
                            }, dom.byId("esriCTParentDivContainer"));
                            applicationHeaderDiv.appendChild(this.divAppContainer);

                            if (html.coords(this.divAppContainer).h > 0) {
                                /**
                                * when user clicks on share icon in header panel, close the sharing panel if it is open
                                */
                                domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMedia-select");
                                domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                                domClass.replace(this.divAppContainer, "esriCTZeroHeight", "esriCTFullHeight");
                            } else {
                                /**
                                * when user clicks on share icon in header panel, open the sharing panel if it is closed
                                */
                                domClass.replace(this.domNode, "esriCTImgSocialMedia-select", "esriCTImgSocialMedia");
                                domClass.replace(this.divAppContainer, "esriCTShowContainerHeight", "esriCTHideContainerHeight");
                                domClass.replace(this.divAppContainer, "esriCTFullHeight", "esriCTZeroHeight");
                            }

                            /**
                            * set images of each sharing options
                            */
                            this.imgFacebook.src = dojoConfig.baseURL + "/themes/images/img_facebook.png";
                            this.imgTwitter.src = dojoConfig.baseURL + "/themes/images/img_twitter.png";
                            this.imgMail.src = dojoConfig.baseURL + "/themes/images/img_email.png";

                            /**
                            * remove event handlers from sharing options
                            */
                            if (this.facebookHandle) {
                                this.facebookHandle.remove();
                                this.twitterHandle.remove();
                                this.emailHandle.remove();
                            }
                            /**
                            * add event handlers to sharing options
                            */
                            this.facebookHandle = on(this.tdFacebook, "click", lang.hitch(this, function () {
                                this._Share("facebook", tinyUrl, urlStr);
                            }));
                            this.twitterHandle = on(this.tdTwitter, "click", lang.hitch(this, function () {
                                this._Share("twitter", tinyUrl, urlStr);
                            }));
                            this.emailHandle = on(this.tdMail, "click", lang.hitch(this, function () {
                                this._Share("email", tinyUrl, urlStr);
                            }));
                        }),
                        error: function (error) {
                            domClass.replace(this.domNode, "esriCTImgSocialMedia-select", "esriCTImgSocialMedia");
                            alert(nls.errorMessages.shareLoadingFailed);
                        }
                    });
                } catch (err) {
                    alert(nls.errorMessages.shareLoadingFailed);
                }
            },

            /**
            * return current map extent
            * @return {string} Current map extent
            * @memberOf widgets/share/share
            */
            _getMapExtent: function () {
                var extents = Math.round(this.map.extent.xmin).toString() + "," + Math.round(this.map.extent.ymin).toString() + "," + Math.round(this.map.extent.xmax).toString() + "," + Math.round(this.map.extent.ymax).toString();
                return (extents);
            },

            /**
            * share application detail with selected share option
            * @param {string} site Selected share option
            * @param {string} tinyUrl Tiny URL for sharing
            * @param {string} urlStr Long URL for sharing
            * @memberOf widgets/share/share
            */
            _Share: function (site, tinyUrl, urlStr) {
                /*        
                * hide share panel once any of the sharing options is selected
                */
                if (html.coords(this.divAppContainer).h > 0) {
                    domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                    domClass.add(this.divAppContainer, "esriCTZeroHeight");
                }
                try {
                    if (tinyUrl) {
                        this._shareOptions(site, tinyUrl);
                    } else {
                        domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMedia-select");
                        this._shareOptions(site, urlStr);
                    }
                } catch (err) {
                    alert(nls.errorMessages.shareFailed);
                }
            },

            /**
            * generate sharing URL and share with selected share option
            * @param {string} site Selected share option
            * @param {string} url URL for sharing
            * @memberOf widgets/share/share
            */
            _shareOptions: function (site, url) {
                switch (site) {
                    case "facebook":
                        window.open(string.substitute(dojo.configData.MapSharingOptions.FacebookShareURL, [url]));
                        break;
                    case "twitter":
                        window.open(string.substitute(dojo.configData.MapSharingOptions.TwitterShareURL, [url]));
                        break;
                    case "email":
                        parent.location = string.substitute(dojo.configData.MapSharingOptions.ShareByMailLink, [url]);
                }
            }
        });
    });