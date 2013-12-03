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
        "dojo/text!./templates/appHeaderTemplate.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!nls/localizedStrings"
    ],
    function (declare, domConstruct, lang, array, domAttr, dom, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls) {

        //========================================================================================================================//

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,

            /**
            * create header panel
            *
            * @param {string} dojo.configData.ApplicationName Application name specified in configuration file
            *
            * @class
            * @name widgets/appHeader/appHeader
            */
            postCreate: function () {

                /**
                * add applicationHeaderParentContainer to div for header panel and append to esriCTParentDivContainer container
                *
                * applicationHeaderParentContainer container for application header
                * @member {div} applicationHeaderParentContainer
                * @private
                * @memberOf widgets/appHeader/appHeader
                */
                var applicationHeaderDiv = dom.byId("esriCTParentDivContainer");
                domConstruct.place(this.applicationHeaderParentContainer, applicationHeaderDiv);
                this._loadApplicationHeaderIcon();
                /**
                * set browser header and application header to application name
                *
                * applicationHeaderName container for application name
                * @member {div} applicationHeaderName
                * @private
                * @memberOf widgets/appHeader/appHeader
                */
                document["title"] = dojo.configData.ApplicationName;
                domAttr.set(this.applicationHeaderName, "innerHTML", dojo.configData.ApplicationName);
            },

            /**
            * append widgets to header panel
            * @param {object} widgets Contain widgets to be displayed in header panel
            * @memberOf widgets/appHeader/appHeader
            */
            loadHeaderWidgets: function (widgets) {

                /**
                * applicationHeaderWidgetsContainer container for header panel widgets
                * @member {div} applicationHeaderWidgetsContainer
                * @private
                * @memberOf widgets/appHeader/appHeader
                */
                for (var i in widgets) {
                    if (widgets[i].domNode) {
                        domConstruct.place(widgets[i].domNode, this.applicationHeaderWidgetsContainer);
                    }
                }
            },

            /**
            * load Application Header Icon
            * @memberOf widgets/appHeader/appHeader
            */
            _loadApplicationHeaderIcon: function () {
                this._loadIcons("shortcut icon", dojo.configData.ApplicationFavicon);
                this._loadIcons("apple-touch-icon-precomposed", dojo.configData.ApplicationIcon);
                this._loadIcons("apple-touch-icon", dojo.configData.ApplicationIcon);
                /**
                * applicationHeaderIcon contains application icon for header panel widgets
                * @member {img} applicationHeaderIcon
                * @private
                * @memberOf widgets/appHeader/appHeader
                */
                this.applicationHeaderIcon.src = dojoConfig.baseURL + dojo.configData.ApplicationIcon;
            },
            _loadIcons: function (rel, iconPath) {
                var icon = domConstruct.create("link");
                icon.rel = rel;
                icon.type = "image/x-icon";
                icon.href = dojoConfig.baseURL + iconPath;
                document.getElementsByTagName('head')[0].appendChild(icon);
            }
        });
    });