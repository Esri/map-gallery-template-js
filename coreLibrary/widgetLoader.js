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
        "dijit/_WidgetBase",
        "widgets/appHeader/appHeader",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/promise/all",
        "dojo/i18n!nls/localizedStrings",
        "dojo/query",
        "dojo/dom-class"
    ],
    function (declare, _WidgetBase, appHeader, array, lang, Deferred, all, nls, Query, domClass) {

        //========================================================================================================================//

        return declare([_WidgetBase], {
            nls: nls,

            /**
            * load widgets specified in Header Widget Settings of configuration file
            *
            * @class
            * @name coreLibrary/widgetLoader
            */
            startup: function () {
                var widgets = {},
                    deferredArray = [];
                /**
                * create an object with widgets specified in Header Widget Settings of configuration file
                * @param {array} dojo.configData.AppHeaderWidgets Widgets specified in configuration file
                */
                this._applicationThemeLoader();
                array.forEach(dojo.configData.AppHeaderWidgets, function (widgetConfig, index) {
                    var deferred = new Deferred();
                    widgets[widgetConfig.WidgetPath] = null;
                    require([widgetConfig.WidgetPath], function (widget) {

                        widgets[widgetConfig.WidgetPath] = new widget({
                            title: widgetConfig.Title
                        });

                        deferred.resolve(widgetConfig.WidgetPath);
                    });
                    deferredArray.push(deferred.promise);
                });
                all(deferredArray).then(lang.hitch(this, function () {

                    try {
                        /**
                        * create application header
                        */
                        this._createApplicationHeader(widgets);

                    } catch (ex) {
                        alert(nls.errorMessages.widgetNotLoaded);
                    }
                }));
            },


            /**
            * create application header
            * @param {object} widgets Contain widgets to be displayed in header panel
            * @memberOf coreLibrary/widgetLoader
            */
            _createApplicationHeader: function (widgets) {
                var applicationHeader = new appHeader();
                applicationHeader.loadHeaderWidgets(widgets);
            },
            _applicationThemeLoader: function () {
                var rootNode = Query("html")[0];
                if (!dojo.configData.ApplicationSettings.theme) {
                    dojo.configData.ApplicationSettings.theme = "blueTheme";
                }
                domClass.add(rootNode, dojo.configData.ApplicationSettings.theme);
            }

        });
    });