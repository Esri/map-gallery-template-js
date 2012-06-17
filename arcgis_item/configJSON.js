{
   "configurationSettings":[
      {
         "category":"<b>Content Options</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"group",
               "label":"Group ID:",
               "tooltip":"ID of the group.",
               "placeHolder":""
            },
            {
               "type":"paragraph",
               "value":"<a target=\"_blank\" href=\"http:\/\/help.arcgis.com\/en\/webapi\/javascript\/arcgis\/demos\/portal\/portal_getgroup.html\">Find your group&#39;s ID<\/a>."
            },
            {
               "type":"string",
               "fieldName":"siteTitle",
               "label":"Website Title:",
               "tooltip":"The title of this template&#39;s website.",
               "placeHolder":"My Gallery"
            },
            {
               "type":"paragraph",
               "value":"The text above will be displayed in the top banner if no banner image is set."
            },
            {
               "type":"string",
               "fieldName":"siteBannerImage",
               "tooltip":"URL for the navigation header logo image. If empty, Site Title text is used.",
               "placeHolder":"http://www.mysite.com/logo.png",
               "label":"Banner Logo:"
            },
            {
               "type":"paragraph",
               "value":"Image to display in the top banner. Recommended height of 75 pixels."
            },
            {
               "type":"string",
               "fieldName":"addThisProfileId",
               "label":"AddThis.com Profile Id:",
               "tooltip":"Account ID for AddThis.com.",
               "placeHolder":"xa-4f3bf72958320e9e"
            },
            {
               "type":"paragraph",
               "value":"Register an <a target=\"_blank\" href=\"https:\/\/www.addthis.com\/register\">AddThis.com<\/a> account for social media button analytics."
            }
         ]
      },
      {
         "category":"<b>Home page Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"homeSideHeading",
               "label":"Homepage Side Heading:",
               "tooltip":"Heading displayed within the side panel on the index page.",
               "placeHolder":""
            }
         ]
      },
      {
         "category":"<b>Footer Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"footerHeading",
               "label":"Footer Heading:",
               "tooltip":"Heading displayed in the footer.",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"footerDescription",
               "label":"Footer Content:",
               "tooltip":"Content description displayed in the footer.",
               "stringFieldOption":"textarea",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"footerLogo",
               "tooltip":"Image to display in the footer. If empty, the group's thumbnail image is used.",
               "placeHolder":"http://www.mysite.com/logo.png",
               "label":"Footer Logo:"
            },
            {
               "type":"paragraph",
               "value":"Image to display in the footer. If empty, the group's thumbnail image is used."
            },
            {
               "type":"string",
               "fieldName":"footerLogoUrl",
               "tooltip":"Link for the image in the footer. If empty, link to the group on ArcGIS Online is used.",
               "placeHolder":"http://www.mysite.com/",
               "label":"Footer Logo Link:"
            },
            {
               "type":"paragraph",
               "value":"Link for the image in the footer. If empty, link to the group on ArcGIS Online is used."
            }
         ]
      },
      {
         "category":"<b>General Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"theme",
               "tooltip":"Color theme to use.",
               "label":"Color Theme:",
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
            },
            {
               "type":"string",
               "fieldName":"defaultLayout",
               "tooltip":"Whether to use grid view or list view as the default layout.",
               "label":"Default Layout:",
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
               "type":"string",
               "fieldName":"sortField",
               "tooltip":"Field to sort the group items by.",
               "label":"Group Sort Field:",
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
               "type":"string",
               "fieldName":"sortOrder",
               "tooltip":"Order to sort the group field.",
               "label":"Group Sort Order:",
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
               "type":"string",
               "fieldName":"mapViewer",
               "tooltip":"Open maps with this viewer.",
               "label":"Open Maps With:",
               "options":[
                  {
                     "label":"Simple Viewer",
                     "value":"simple"
                  },
                  {
                     "label":"Explorer Online",
                     "value":"explorer"
                  },
                  {
                     "label":"Explorer Presentation",
                     "value":"explorer_present"
                  },
                  {
                     "label":"Map Viewer",
                     "value":"arcgis"
                  }
               ]
            },
            {
               "type":"string",
               "fieldName":"galleryItemsPerPage",
               "tooltip":"Gallery items to show per page.",
               "label":"Items Per Page:",
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
            }
         ]
      },
      {
         "category":"<b>Options</b>",
         "fields":[
            {
               "type":"boolean",
               "fieldName":"openGalleryItemsNewWindow",
               "label":"Open items in new window.",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showProfileUrl",
               "label":"Show Profile Link.",
               "tooltip":"Links usernames to ArcGIS Online profiles."
            },
            {
               "type":"paragraph",
               "value":"Links usernames to ArcGIS Online profiles."
            },
            {
               "type":"boolean",
               "fieldName":"showAboutPage",
               "label":"Show About Page.",
               "tooltip":"Show about page in top navigation."
            },
            {
               "type":"boolean",
               "fieldName":"showSocialButtons",
               "label":"Show social media buttons.",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showFooter",
               "label":"Show footer.",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showExplorerButton",
               "label":"Show Explorer Online Button.",
               "tooltip":"Displays the button to open the webmap in Explorer Online viewer."
            },
            {
               "type":"paragraph",
               "value":"Displays the button to open the webmap in Explorer Online viewer."
            },
            {
               "type":"boolean",
               "fieldName":"showArcGISOnlineButton",
               "label":"Show Map Viewer Button.",
               "tooltip":"Displays the button to open the webmap in ArcGIS Online Map Viewer."
            },
            {
               "type":"paragraph",
               "value":"Displays the button to open the webmap in ArcGIS Online Map Viewer."
            },
            {
               "type":"boolean",
               "fieldName":"showMobileButtons",
               "label":"Show Mobile Buttons.",
               "tooltip":"Displays a mobile button to open the webmap in ArcGIS mobile app and a button to download the app."
            },
            {
               "type":"paragraph",
               "value":"Displays a mobile button to open the webmap in ArcGIS mobile app and a button to download the app."
            },
            {
               "type":"boolean",
               "fieldName":"showCredits",
               "label":"Show Credits.",
               "tooltip":"Displays credits on the map page."
            },
            {
               "type":"boolean",
               "fieldName":"showLicenseInfo",
               "label":"Show Credits.",
               "tooltip":"Displays License info on the map page."
            },
            {
               "type":"boolean",
               "fieldName":"showMoreInfo",
               "label":"Show More Info Links.",
               "tooltip":"Displays More information links to the ArcGIS Online item page."
            },
            {
               "type":"paragraph",
               "value":"Displays More information links to the ArcGIS Online item page."
            },
            {
               "type":"boolean",
               "fieldName":"showGroupSort",
               "label":"Show group sort bar",
               "tooltip":"Displays group sort bar on the home page."
            },
            {
               "type":"paragraph",
               "value":"Displays group sort bar on the home page."
            }
         ]
      }
   ],
   "values":{
      "theme":"blueTheme",
      "siteTitle":"My Maps",
      "homeSideHeading":"",
      "addThisProfileId":"xa-4f3bf72958320e9e",
      "defaultLayout":"grid",
      "sortField":"modified",
      "sortOrder":"desc",
      "mapViewer":"simple",
      "footerHeading":"",
      "footerDescription":"",
      "footerLogo":"",
      "footerLogoUrl":"",
      "showProfileUrl":true,
      "showAboutPage":false,
      "showSocialButtons":true,
      "showFooter":true,
      "showMoreInfo":false,
      "showExplorerButton":false,
      "showArcGISOnlineButton":false,
      "showMobileButtons":false,
      "openGalleryItemsNewWindow":false,
      "showCredits":true,
      "showLicenseInfo":true,
      "showGroupSort":false,
      "galleryItemsPerPage":"9"
   }
}