{
    "configurationSettings": [{
        "category": "<b>Content Options</b>",
        "fields": [{
            "type": "group",
            "label": "Select a group"
        }, {
            "type": "string",
            "fieldName": "siteTitle",
            "label": "Website banner title:",
            "tooltip": "The title of this template&#39;s website.",
            "placeHolder": "My Maps"
        }, {
            "type": "paragraph",
            "value": "The text above will be displayed in the top banner if no banner image is set. Uses group title by default."
        }, {
            "type": "string",
            "fieldName": "siteBannerImage",
            "tooltip": "URL for the navigation header logo image. If empty, Site Title text is used.",
            "placeHolder": "http://www.mysite.com/logo.png",
            "label": "Banner logo:"
        }, {
            "type": "paragraph",
            "value": "Image to display in the top banner. Recommended height of 75 pixels."
        }, {
            "type": "string",
            "fieldName": "addThisProfileId",
            "label": "AddThis.com profile ID:",
            "tooltip": "Account ID for AddThis.com.",
            "placeHolder": "xa-4f3bf72958320e9e"
        }, {
            "type": "paragraph",
            "value": "Register an <a target=\"_blank\" href=\"https:\/\/www.addthis.com\/register\">AddThis.com<\/a> account for social media button analytics."
        }, {
            "type": "string",
            "fieldName": "sourceCountry",
            "label": "Locator Source Country",
            "tooltip": "Locator Source Country",
            "placeHolder": ""
        }, {
            "type": "paragraph",
            "value": "A value representing the country. Providing this value increases geocoding speed."
        }]
    }, {
        "category": "<b>Home page Settings</b>",
        "fields": [{
            "type": "string",
            "fieldName": "homeHeading",
            "label": "Homepage heading:",
            "tooltip": "Heading displayed within the main panel on the index page.",
            "placeHolder": ""
        }, {
            "type": "string",
            "fieldName": "homeSideHeading",
            "label": "Homepage side heading:",
            "tooltip": "Heading displayed within the side panel on the index page.",
            "placeHolder": ""
        }, {
            "type": "string",
            "fieldName": "homeSnippet",
            "label": "Homepage snippet:",
            "tooltip": "Brief text displayed on the index page.",
            "placeHolder": ""
        }, {
            "type": "string",
            "fieldName": "homeSideContent",
            "label": "Homepage side content:",
            "tooltip": "Content displayed within the side panel on the index page.",
            "placeHolder": ""
        }]
    }, {
        "category": "<b>Footer Settings</b>",
        "fields": [{
            "type": "string",
            "fieldName": "footerHeading",
            "label": "Footer heading:",
            "tooltip": "Heading displayed in the footer.",
            "placeHolder": ""
        }, {
            "type": "string",
            "fieldName": "footerDescription",
            "label": "Footer content:",
            "tooltip": "Content description displayed in the footer.",
            "stringFieldOption": "textarea",
            "placeHolder": "Footer Content"
        }, {
            "type": "string",
            "fieldName": "footerLogo",
            "tooltip": "Image to display in the footer. If empty, the group's thumbnail image is used.",
            "placeHolder": "http://www.mysite.com/logo.png",
            "label": "Footer logo:"
        }, {
            "type": "paragraph",
            "value": "Image to display in the footer. If empty, the group's thumbnail image is used."
        }, {
            "type": "string",
            "fieldName": "footerLogoUrl",
            "tooltip": "Link for the image in the footer. If empty, link to the group on ArcGIS Online is used.",
            "placeHolder": "http://www.mysite.com/",
            "label": "Footer logo link:"
        }, {
            "type": "paragraph",
            "value": "Link for the image in the footer. If empty, link to the group on ArcGIS Online is used."
        }]
    }, {
        "category": "<b>General Settings</b>",
        "fields": [{
            "type": "string",
            "fieldName": "theme",
            "tooltip": "Color theme to use.",
            "label": "Color theme:",
            "options": [{
                "label": "Blue",
                "value": "blueTheme"
            }, {
                "label": "Red",
                "value": "redTheme"
            }, {
                "label": "Green",
                "value": "greenTheme"
            }]
        }, {
            "type": "string",
            "fieldName": "defaultLayout",
            "tooltip": "Whether to use grid view or list view as the default layout.",
            "label": "Default layout:",
            "options": [{
                "label": "Grid",
                "value": "grid"
            }, {
                "label": "List",
                "value": "list"
            }]
        }, {
            "type": "string",
            "fieldName": "sortField",
            "tooltip": "Field to sort the group items by.",
            "label": "Group sort field:",
            "options": [{
                "label": "Modified Date",
                "value": "modified"
            }, {
                "label": "Title",
                "value": "title"
            }, {
                "label": "Type",
                "value": "type"
            }, {
                "label": "Owner",
                "value": "owner"
            }, {
                "label": "Average rating",
                "value": "avgRating"
            }, {
                "label": "Number of ratings",
                "value": "numRatings"
            }, {
                "label": "Number of comments",
                "value": "numComments"
            }, {
                "label": "Number of views",
                "value": "numViews"
            }]
        }, {
            "type": "string",
            "fieldName": "sortOrder",
            "tooltip": "Order to sort the group field.",
            "label": "Group sort order:",
            "options": [{
                "label": "Descending",
                "value": "desc"
            }, {
                "label": "Ascending",
                "value": "asc"
            }]
        }, {
            "type": "string",
            "fieldName": "mapViewer",
            "tooltip": "Open maps with this viewer.",
            "label": "Open maps with:",
            "options": [{
                "label": "Simple Viewer",
                "value": "simple"
            }, {
                "label": "Explorer Online",
                "value": "explorer"
            }, {
                "label": "Explorer Presentation",
                "value": "explorer_present"
            }, {
                "label": "Map Viewer",
                "value": "arcgis"
            }]
        }, {
            "type": "string",
            "fieldName": "galleryItemsPerPage",
            "tooltip": "Gallery items to show per page.",
            "label": "Items per page:",
            "options": [{
                "label": "3",
                "value": "3"
            }, {
                "label": "6",
                "value": "6"
            }, {
                "label": "9",
                "value": "9"
            }, {
                "label": "12",
                "value": "12"
            }, {
                "label": "15",
                "value": "15"
            }]
        }, {
            "type": "string",
            "fieldName": "searchString",
            "tooltip": "Default search string for group query.",
            "placeHolder": "",
            "label": "Search string:"
        }, {
            "type": "paragraph",
            "value": "Default search string for group query."
        }]
    }, {
        "category": "<b>Options</b>",
        "fields": [{
            "type": "boolean",
            "fieldName": "openGalleryItemsNewWindow",
            "label": "Open items in new window.",
            "tooltip": "Open group items in a new window."
        }, {
            "type": "paragraph",
            "value": "Open group items in a new window."
        }, {
            "type": "boolean",
            "fieldName": "showProfileUrl",
            "label": "Show profile link.",
            "tooltip": "Links usernames to ArcGIS Online profiles."
        }, {
            "type": "paragraph",
            "value": "Links usernames to ArcGIS Online profiles."
        }, {
            "type": "boolean",
            "fieldName": "showSocialButtons",
            "label": "Show social media buttons.",
            "tooltip": ""
        }, {
            "type": "paragraph",
            "value": "Show social media buttons."
        }, {
            "type": "boolean",
            "fieldName": "showFooter",
            "label": "Show footer.",
            "tooltip": "Show footer on all pages."
        }, {
            "type": "paragraph",
            "value": "Show footer on all pages."
        }, {
            "type": "boolean",
            "fieldName": "showExplorerButton",
            "label": "Show Explorer Online button.",
            "tooltip": "Displays the button to open the webmap in Explorer Online viewer."
        }, {
            "type": "paragraph",
            "value": "Displays the button to open the webmap in Explorer Online viewer."
        }, {
            "type": "boolean",
            "fieldName": "showArcGISOnlineButton",
            "label": "Show Map Viewer button.",
            "tooltip": "Displays the button to open the webmap in ArcGIS Online Map Viewer."
        }, {
            "type": "paragraph",
            "value": "Displays the button to open the webmap in ArcGIS Online Map Viewer."
        }, {
            "type": "boolean",
            "fieldName": "showMobileButtons",
            "label": "Show mobile buttons.",
            "tooltip": "Displays a mobile button to open the webmap in ArcGIS mobile app and a button to download the app."
        }, {
            "type": "paragraph",
            "value": "Displays a mobile button to open the webmap in ArcGIS mobile app and a button to download the app."
        }, {
            "type": "boolean",
            "fieldName": "showAttribution",
            "label": "Show attribution.",
            "tooltip": "Displays credits on the map page."
        }, {
            "type": "paragraph",
            "value": "Displays credits on the map page."
        }, {
            "type": "boolean",
            "fieldName": "showLicenseInfo",
            "label": "Show constraints.",
            "tooltip": "Displays constraints on the map page."
        }, {
            "type": "paragraph",
            "value": "Displays constraints on the map page."
        }, {
            "type": "boolean",
            "fieldName": "showMoreInfo",
            "label": "Show more info links.",
            "tooltip": "Displays More information links to the ArcGIS Online item page."
        }, {
            "type": "paragraph",
            "value": "Displays More information links to the ArcGIS Online item page."
        }, {
            "type": "boolean",
            "fieldName": "showGroupSort",
            "label": "Show group sort bar",
            "tooltip": "Displays group sort bar on the home page."
        }, {
            "type": "paragraph",
            "value": "Displays group sort bar on the home page."
        }, {
            "type": "boolean",
            "fieldName": "showViews",
            "label": "Show Views",
            "tooltip": "Displays view counts for maps"
        }, {
            "type": "paragraph",
            "value": "Displays view counts for maps."
        }, {
            "type": "boolean",
            "fieldName": "showComments",
            "label": "Show comments",
            "tooltip": "Shows comments for items and allows items to be commented on"
        }, {
            "type": "paragraph",
            "value": "Shows comments for items and allows items to be commented on."
        }, {
            "type": "boolean",
            "fieldName": "showRatings",
            "label": "Show ratings",
            "tooltip": "Shows ratings for items and allows items to be rated"
        }, {
            "type": "paragraph",
            "value": "Shows ratings for items and allows items to be rated."
        }]
    }],
    "values": {
        "theme": "blueTheme",
        "siteTitle": "",
        "searchString": "",
        "homeHeading": "",
        "homeSideHeading": "",
        "homeSideContent": "",
        "homeSnippet": "",
        "addThisProfileId": "xa-4f3bf72958320e9e",
        "defaultLayout": "grid",
        "sortField": "modified",
        "sortOrder": "desc",
        "mapViewer": "simple",
        "footerHeading": "",
        "footerDescription": "",
        "footerLogo": "",
        "footerLogoUrl": "",
        "showProfileUrl": true,
        "showSocialButtons": true,
        "showFooter": true,
        "showMoreInfo": false,
        "showComments": false,
        "showRatings": false,
        "showViews": true,
        "showExplorerButton": false,
        "showArcGISOnlineButton": false,
        "showMobileButtons": false,
        "openGalleryItemsNewWindow": false,
        "showAttribution": true,
        "showLicenseInfo": true,
        "showGroupSort": false,
        "galleryItemsPerPage": "9",
        "sourceCountry": "USA"
    }
}