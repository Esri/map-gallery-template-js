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
        "dojo/text!./templates/PortalSignin.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/topic",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/i18n!nls/localizedStrings",
        "dojo/query",
        "widgets/leftPanel/leftPanel",
        "dojo/on",
        "dojo/dom-construct"
    ],
    function (declare, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, topic, lang, Deferred, nls, query, leftPanelContent, on, domConstruct) {

        //========================================================================================================================//

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            nls: nls,
            postCreate: function () {
                this.signInLabel.innerHTML = nls.signInText;
                this.own(on(this.signInContainer, "click", lang.hitch(this, function () {
                    var defObj = new Deferred();
                    topic.publish("signIn", defObj);
                    defObj.then(function (data) {
                        domConstruct.destroy(query(".esriCTContentdiv")[0]);
                        var leftPanelObj = new leftPanelCollection();
                    }, function (err) {
                        alert(err.message);
                    });
                })));
            }
        });
    });