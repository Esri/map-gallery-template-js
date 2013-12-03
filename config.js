/*global dojo */
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
define([], function () {
    return {

        // This file contains various configuration settings for esri template
        //
        // Use this file to perform the following:
        //
        // 1.  Specify application Name                      - [ Tag(s) to look for: ApplicationName ]
        // 2.  Set path for application icon                 - [ Tag(s) to look for: ApplicationIcon ]
        // 3.  Set path for application favicon              - [ Tag(s) to look for: ApplicationFavicon ]
        // 4.  Customize application settings here           - [ Tag(s) to look for: ApplicationSettings ]
        // 5.  Specify header widget settings                - [ Tag(s) to look for: AppHeaderWidgets ]
        // 6.  Customize address search settings             - [ Tag(s) to look for: LocatorSettings]
        // ------------------------------------------------------------------------------------------------------------------------
        // GENERAL SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set application title
        ApplicationName: "Map Gallery",

        // Set application icon path
        ApplicationIcon: "/themes/images/logo.png",

        // Set application Favicon path
        ApplicationFavicon: "/themes/images/favicon.ico",

        //------------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //------------------------------------------------------------------------------------------------------------------------
        // Set the Group id for the application
        // Set the application theme. If blank, default blue theme will be loaded
        // Set this variable to enable or disable categories tag cloud
        // Set this variable to enable or disable geographies tag cloud
        // Set this variable to search text for search in tags in geographies tag cloud. If set to blank,
        //             geographies tag cloud will not be displayed irrespective of the value for showGeographiesTagCloud
        // tagCloudFontRange:
        //                minValue: Set min value of the tag cloud font,
        //                maxValue: set the max value of the tag cloud font,
        //                units: Set the units for the text in tag cloud. UI will be distorted if font sizes have inappropriate values
        // Set this variable to the maximum number of results to be displayed in geographies and categories tag clouds
        // Set the portal URL
        ApplicationSettings: {
            group: "6abf8abeb3e4436eb4ae0053be3fcbe0",
            theme: "",
            showCategoriesTagCloud: true,
            showGeographiesTagCloud: true,
            geographiesTagText: "C",
            enableAutoComplete:true,
            tagCloudFontRange: {
                minValue: 15,
                maxValue: 20,
                units: "px"
            },
            showMaxTopTags: 10,
            portalURL: "http://www.arcgis.com"
        },
        //------------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //------------------------------------------------------------------------------------------------------------------------
        // Set widgets settings such as widget title, widgetPath, mapInstanceRequired to be displayed in header panel
        // Title: Name of the widget, will displayed as title of widget in header panel
        // WidgetPath: path of the widget respective to the widgets package.

        AppHeaderWidgets: [{
            Title: "Settings",
            WidgetPath: "widgets/settings/settings"
        }, {
            Title: "Item Search",
            WidgetPath: "widgets/locator/locator"
        }, {
            Title: "Info",
            WidgetPath: "widgets/info/info"
        }, {
            Title: "Sort By",
            WidgetPath: "widgets/sortby/sortby"
        }, {
            Title: "Layout",
            WidgetPath: "widgets/layout/layout"
        }, {
            Title: "Sign In",
            WidgetPath: "widgets/portalSignin/portalSignin"
        }, {
            Title: "",
            WidgetPath: "widgets/SearchAGOLGroupItems/SearchAGOLGroupItems"
        }],
        // ------------------------------------------------------------------------------------------------------------------------
        // ADDRESS SEARCH SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set locator settings such as locator symbol, size, display fields
        LocatorSettings: {
            DefaultLocatorSymbol: "/themes/images/redpushpin.png",
            MarkupSymbolSize: {
                width: 35,
                height: 35
            },
            itemsLocator: [{
                DisplayText: "Items Search",
                LocatorDefaultAddress: "Search"
            }]
        }

    }
});