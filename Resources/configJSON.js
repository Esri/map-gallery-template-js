{  
  "configurationSettings":[  
    {  
      "category":"Group",
      "fields":[  
        {  
          "type":"group",
          "label":"Select a group"
        }
      ]
    },
    {  
      "category":"<b>Details</b>",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"Header displayed on the home page."
        },
        {  
          "type":"string",
          "fieldName":"homeHeading",
          "label":"Homepage heading:",
          "tooltip":"Heading displayed within the main panel on the index page.",
          "placeHolder":""
        },
        {  
          "type":"paragraph",
          "value":"Side panel heading for the home page."
        },
        {  
          "type":"string",
          "fieldName":"homeSideHeading",
          "label":"Homepage side heading:",
          "tooltip":"Heading displayed within the side panel on the index page.",
          "placeHolder":""
        },
        {  
          "type":"paragraph",
          "value":"Brief text displayed on the home page."
        },
        {  
          "type":"string",
          "fieldName":"homeSnippet",
          "label":"Homepage snippet:",
          "tooltip":"Brief text displayed on the index page.",
          "placeHolder":""
        },
        {  
          "type":"paragraph",
          "value":"Content displayed within the side panel on the index page."
        },
        {  
          "type":"string",
          "fieldName":"homeSideContent",
          "label":"Homepage side content:",
          "tooltip":"Content displayed within the side panel on the index page.",
          "placeHolder":""
        }
      ]
    },
    {  
      "category":"Banner",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"The following will be displayed in the top banner if no banner image is set. It will use the group title by default if not set."
        },
        {  
          "type":"string",
          "fieldName":"siteTitle",
          "label":"Website banner title:",
          "tooltip":"The title of this template&#39;s website.",
          "placeHolder":"My Maps"
        },
        {  
          "type":"paragraph",
          "value":"Image to display in the top banner. Recommended height of 75 pixels."
        },
        {  
          "type":"string",
          "fieldName":"siteBannerImage",
          "tooltip":"URL for the navigation header logo image. If empty, Site Title text is used.",
          "placeHolder":"http://www.mysite.com/logo.png",
          "label":"Banner logo:"
        },
        {  
          "type":"paragraph",
          "value":"Navigation header link. If empty, Site's index page URL is used."
        },
        {  
          "type":"string",
          "fieldName":"siteBannerUrl",
          "tooltip":"Navigation header link. If empty, Site's index page URL is used.",
          "placeHolder":"http://www.mysite.com/",
          "label":"Banner URL:"
        }
      ]
    },
    {  
      "category":"<b>Footer</b>",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"Heading displayed in the footer."
        },
        {  
          "type":"string",
          "fieldName":"footerHeading",
          "label":"Footer heading:",
          "tooltip":"Heading displayed in the footer.",
          "placeHolder":""
        },
        {  
          "type":"paragraph",
          "value":"Content description displayed in the footer."
        },
        {  
          "type":"string",
          "fieldName":"footerDescription",
          "label":"Footer content:",
          "tooltip":"Content description displayed in the footer.",
          "stringFieldOption":"textarea",
          "placeHolder":"Footer Content"
        },
        {  
          "type":"paragraph",
          "value":"Image to display in the footer. If empty, the group's thumbnail image is used."
        },
        {  
          "type":"string",
          "fieldName":"footerLogo",
          "tooltip":"Image to display in the footer. If empty, the group's thumbnail image is used.",
          "placeHolder":"http://www.mysite.com/logo.png",
          "label":"Footer logo:"
        },
        {  
          "type":"paragraph",
          "value":"Link for the image in the footer. If empty, link to the group on ArcGIS Online is used."
        },
        {  
          "type":"string",
          "fieldName":"footerLogoUrl",
          "tooltip":"Link for the image in the footer. If empty, link to the group on ArcGIS Online is used.",
          "placeHolder":"http://www.mysite.com/",
          "label":"Footer logo link:"
        }
      ]
    },
    {  
      "category":"<b>Display</b>",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"Color theme to use."
        },
        {  
          "type":"string",
          "fieldName":"theme",
          "tooltip":"Color theme to use.",
          "label":"Color theme:",
          "options":[  
            {  
              "label":"Blue",
              "value":"blueTheme"
            },
            {  
              "label":"Red",
              "value":"redTheme"
            },
            {  
              "label":"Green",
              "value":"greenTheme"
            }
          ]
        }
      ]
    },
    {  
      "category":"<b>Gallery Options</b>",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"Whether to use grid view or list view as the default layout."
        },
        {  
          "type":"string",
          "fieldName":"defaultLayout",
          "tooltip":"Whether to use grid view or list view as the default layout.",
          "label":"Default layout:",
          "options":[  
            {  
              "label":"Grid",
              "value":"grid"
            },
            {  
              "label":"List",
              "value":"list"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Field to sort the group items by."
        },
        {  
          "type":"string",
          "fieldName":"sortField",
          "tooltip":"Field to sort the group items by.",
          "label":"Group sort field:",
          "options":[  
            {  
              "label":"Modified Date",
              "value":"modified"
            },
            {  
              "label":"Title",
              "value":"title"
            },
            {  
              "label":"Type",
              "value":"type"
            },
            {  
              "label":"Owner",
              "value":"owner"
            },
            {  
              "label":"Average rating",
              "value":"avgRating"
            },
            {  
              "label":"Number of ratings",
              "value":"numRatings"
            },
            {  
              "label":"Number of comments",
              "value":"numComments"
            },
            {  
              "label":"Number of views",
              "value":"numViews"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Order to sort the group field."
        },
        {  
          "type":"string",
          "fieldName":"sortOrder",
          "tooltip":"Order to sort the group field.",
          "label":"Group sort order:",
          "options":[  
            {  
              "label":"Descending",
              "value":"desc"
            },
            {  
              "label":"Ascending",
              "value":"asc"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Only display items of this type."
        },
        {  
          "type":"string",
          "fieldName":"filterType",
          "tooltip":"Only display items of this type",
          "label":"Only display items of this type:",
          "options":[  
            {  
              "label":"All",
              "value":""
            },
            {  
              "label":"Maps",
              "value":"Maps"
            },
            {  
              "label":"Layers",
              "value":"Layers"
            },
            {  
              "label":"Applications",
              "value":"Applications"
            },
            {  
              "label":"Tools",
              "value":"Tools"
            },
            {  
              "label":"Datafiles",
              "value":"Datafiles"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Gallery items to show per page."
        },
        {  
          "type":"string",
          "fieldName":"galleryItemsPerPage",
          "tooltip":"Gallery items to show per page.",
          "label":"Items per page:",
          "options":[  
            {  
              "label":"3",
              "value":"3"
            },
            {  
              "label":"6",
              "value":"6"
            },
            {  
              "label":"9",
              "value":"9"
            },
            {  
              "label":"12",
              "value":"12"
            },
            {  
              "label":"15",
              "value":"15"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Open maps with this viewer."
        },
        {  
          "type":"string",
          "fieldName":"mapViewer",
          "tooltip":"Open maps with this viewer.",
          "label":"Open maps with:",
          "options":[  
            {  
              "label":"Simple Viewer",
              "value":"simple"
            },
            {  
              "label":"Map Viewer",
              "value":"arcgis"
            },
            {  
              "label":"ArcGIS Item Page",
              "value":"item_page"
            }
          ]
        },
        {  
          "type":"paragraph",
          "value":"Default search string for group query."
        },
        {  
          "type":"string",
          "fieldName":"searchString",
          "tooltip":"Default search string for group query.",
          "placeHolder":"",
          "label":"Search string:"
        }
      ]
    },
    {  
      "category":"<b>Other Configuration</b>",
      "fields":[  
        {  
          "type":"paragraph",
          "value":"Register an <a target=\"_blank\" href=\"https:\/\/www.addthis.com\/register\">AddThis.com<\/a> account for social media button analytics."
        },
        {  
          "type":"string",
          "fieldName":"addThisProfileId",
          "label":"AddThis.com profile ID:",
          "tooltip":"Account ID for AddThis.com.",
          "placeHolder":"xa-4f3bf72958320e9e"
        },
        {  
          "type":"paragraph",
          "value":"A value representing the country. Providing this value increases geocoding speed."
        },
        {  
          "type":"string",
          "fieldName":"sourceCountry",
          "label":"Locator Source Country",
          "tooltip":"Locator Source Country",
          "placeHolder":""
        }
      ]
    },
    {  
      "category":"<b>Enable Features</b>",
      "fields":[  
        {  
          "type":"boolean",
          "fieldName":"openGalleryItemsNewWindow",
          "label":"Open items in new window",
          "tooltip":"Open group items in a new window"
        },
        {  
          "type":"boolean",
          "fieldName":"showProfileUrl",
          "label":"Link usernames to ArcGIS Online profiles",
          "tooltip":"Link usernames to ArcGIS Online profiles"
        },
        {  
          "type":"boolean",
          "fieldName":"showSocialButtons",
          "label":"Show social media buttons",
          "tooltip":"Show social media buttons"
        },
        {  
          "type":"boolean",
          "fieldName":"showFooter",
          "label":"Show footer on all pages",
          "tooltip":"Show footer on all pages"
        },
        {  
          "type":"boolean",
          "fieldName":"showArcGISOnlineButton",
          "label":"Display a button to open the webmap in ArcGIS Online Map Viewer",
          "tooltip":"Display a button to open the webmap in ArcGIS Online Map Viewer"
        },
        {  
          "type":"boolean",
          "fieldName":"showMobileButtons",
          "label":"Display a mobile button to open the webmap in ArcGIS mobile app and a button to download the app",
          "tooltip":"Display a mobile button to open the webmap in ArcGIS mobile app and a button to download the app"
        },
        {  
          "type":"boolean",
          "fieldName":"showAttribution",
          "label":"Show attribution: Displays credits on the map page",
          "tooltip":"Show attribution: Displays credits on the map page"
        },
        {  
          "type":"boolean",
          "fieldName":"showLicenseInfo",
          "label":"Display constraints on the map page",
          "tooltip":"Display constraints on the map page"
        },
        {  
          "type":"boolean",
          "fieldName":"showMoreInfo",
          "label":"Display More information links to the ArcGIS Online item page",
          "tooltip":"Display More information links to the ArcGIS Online item page"
        },
        {  
          "type":"boolean",
          "fieldName":"showGroupSort",
          "label":"Display a group sort bar on the home page",
          "tooltip":"Display a group sort bar on the home page"
        },
        {  
          "type":"boolean",
          "fieldName":"showViews",
          "label":"Display a view count for maps",
          "tooltip":"Display a view count for maps"
        },
        {  
          "type":"boolean",
          "fieldName":"showComments",
          "label":"Shows comments for items and allows items to be commented on",
          "tooltip":"Shows comments for items and allows items to be commented on"
        },
        {  
          "type":"boolean",
          "fieldName":"showRatings",
          "label":"Shows ratings for items and allows items to be rated",
          "tooltip":"Shows ratings for items and allows items to be rated"
        },
        {  
          "type":"boolean",
          "fieldName":"showFilterType",
          "label":"Show a list allowing users to filter items by type.",
          "tooltip":"Shows a list allowing users to filter items by type."
        },
        {  
          "type":"boolean",
          "fieldName":"openLayersInViewer",
          "label":"Open Layers in ArcGIS Map Viewer",
          "tooltip":"Open Layers in ArcGIS Map Viewer"
        },
        {  
          "type":"boolean",
          "fieldName":"showThumbTitle",
          "label":"Display title text over thumbnails in grid view",
          "tooltip":"Display title text over thumbnails in grid view"
        }
      ]
    }
  ],
  "values":{  
    "theme":"blueTheme",
    "siteTitle":"",
    "searchString":"",
    "homeHeading":"",
    "homeSideHeading":"",
    "homeSideContent":"",
    "homeSnippet":"",
    "addThisProfileId":"xa-4f3bf72958320e9e",
    "defaultLayout":"grid",
    "sortField":"modified",
    "sortOrder":"desc",
    "filterType":"",
    "mapViewer":"simple",
    "footerHeading":"",
    "footerDescription":"",
    "footerLogo":"",
    "footerLogoUrl":"",
    "openLayersInViewer":true,
    "showProfileUrl":true,
    "showSocialButtons":true,
    "showFooter":true,
    "showMoreInfo":false,
    "showComments":false,
    "showRatings":false,
    "showViews":false,
    "showArcGISOnlineButton":false,
    "showMobileButtons":false,
    "openGalleryItemsNewWindow":false,
    "showAttribution":true,
    "showLicenseInfo":true,
    "showGroupSort":false,
    "showFilterType":false,
    "showThumbTitle":false,
    "galleryItemsPerPage":"9",
    "sourceCountry":"USA"
  }
}