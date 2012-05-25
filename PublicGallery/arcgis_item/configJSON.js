{
   "configurationSettings":[
      {
         "category":"<b>Site Information</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"group.id",
               "label":"Group ID:",
               "tooltip":"ID of the group",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"group.title",
               "label":"Group Title:",
               "tooltip":"Title of the group",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"group.owner",
               "label":"Group Owner:",
               "tooltip":"The owner of the group",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"siteTitle",
               "label":"Website Title:",
               "tooltip":"The name of your website",
               "placeHolder":"My Gallery"
            },
            {
               "type":"string",
               "fieldName":"siteBannerImage",
               "tooltip":"Url for logo image. If empty, Site Title text is used.",
               "placeHolder":"URL to image",
               "label":"Logo on top navigation."
            },
            {
               "type":"string",
               "fieldName":"addThisProfileId",
               "label":"Addthis profile Id",
               "tooltip":"Account ID for AddThis.com",
               "placeHolder":"xa-4f3bf72958320e9e"
            }
         ]
      },
      {
         "category":"<b>Home page Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"homeHeading",
               "label":"Heading displayed on the index page",
               "tooltip":"Defaults to group title",
               "placeHolder":""
            },
            {
               "type":"paragraph",
               "fieldName":"homeSnippet",
               "label":"Content displayed on the index page below the heading",
               "tooltip":"Defaults to group snippet",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"homeSideHeading",
               "label":"Homepage right side heading",
               "tooltip":"Heading displayed on the right side content on the index page",
               "placeHolder":""
            },
            {
               "type":"paragraph",
               "fieldName":"homeSideContent",
               "label":"Homepage right side content",
               "tooltip":"Defaults to group description",
               "placeHolder":""
            }
         ]
      },
      {
         "category":"<b>Map Page Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"mapTitle",
               "label":"Title Text:",
               "tooltip":"",
               "placeHolder":"Defaults to map name"
            },
            {
               "type":"paragraph",
               "fieldName":"mapSnippet",
               "label":"Subtitle Text:",
               "tooltip":"",
               "placeHolder":"Defaults to map snippet"
            },
            {
               "type":"paragraph",
               "fieldName":"mapItemDescription",
               "label":"Map about Text:",
               "tooltip":"",
               "placeHolder":"Defaults to map description"
            }
         ]
      },
      {
         "category":"<b>Footer Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"footerHeading",
               "label":"Footer heading",
               "tooltip":"Heading displayed in the footer",
               "placeHolder":""
            },
            {
               "type":"paragraph",
               "fieldName":"footerDescription",
               "label":"Footer content",
               "tooltip":"Content displayed in the footer",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"footerLogo",
               "label":"Image displayed in the footer",
               "tooltip":"Defaults to group image",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"footerLogoUrl",
               "label":"Link used for the footer image",
               "tooltip":"Defaults to group link",
               "placeHolder":""
            }
         ]
      },
      {
         "category":"<b>General Settings</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"theme",
               "tooltip":"Color theme to use",
               "label":"Color Scheme:",
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
               "tooltip":"Grid or List view",
               "label":"Default layout to use:",
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
               "tooltip":"Order of the group items",
               "label":"Group Sort Field:",
               "options":[
                  {
                     "label":"Created Date",
                     "value":"created"
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
               "tooltip":"Order of sort field",
               "label":"Sort order:",
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
               "tooltip":"Opens maps in this viewer",
               "label":"Open maps in:",
               "options":[
                  {
                     "label":"Simple Viewer",
                     "value":"simple"
                  },
                  {
                     "label":"ArcGIS Explorer Online",
                     "value":"explorer"
                  },
                  {
                     "label":"ArcGIS Explorer Online Presentation Mode",
                     "value":"explorer_present"
                  },
                  {
                     "label":"ArcGIS Online",
                     "value":"arcgis"
                  }
               ]
            },
            {
               "type":"string",
               "fieldName":"galleryItemsPerPage",
               "tooltip":"Gallery items to show per page",
               "label":"Items per page:",
               "options":[
                  {
                     "label":"3",
                     "value":3
                  },
                  {
                     "label":"6",
                     "value":6
                  },
                  {
                     "label":"9",
                     "value":9
                  },
                  {
                     "label":"12",
                     "value":12
                  },
                  {
                     "label":"15",
                     "value":15
                  }
               ]
            }
         ]
      },
      {
         "category":"<b>Boolean Options</b>",
         "fields":[
            {
               "type":"boolean",
               "fieldName":"openGalleryItemsNewWindow",
               "label":"Open gallery items in new window",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showProfileUrl",
               "label":"Show Profile Link",
               "tooltip":"Show profile link in footer"
            },
            {
               "type":"boolean",
               "fieldName":"showAboutPage",
               "label":"Show About Page",
               "tooltip":"Show about page in top navigation"
            },
            {
               "type":"boolean",
               "fieldName":"showSocialButtons",
               "label":"Show social media buttons",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showFooter",
               "label":"Show footer",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showBasemapGallery",
               "label":"Show basemap gallery on map",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showGroupSearch",
               "label":"Show group search on index page",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showMapSearch",
               "label":"Show address search on map page",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showLayerToggle",
               "label":"Show layer toggle in legend tab on map page",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showLayoutSwitch",
               "label":"Show layout switch on index page",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showOverviewMap",
               "label":"Show overview on map",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showMoreInfo",
               "label":"Show more info under about on map page",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"mobileAppUrl",
               "label":"Use mobile links for mobile devices",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showMobileDialog",
               "label":"Show mobile dialog box",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showPagination",
               "label":"Show pagination",
               "tooltip":""
            },
            {
               "type":"boolean",
               "fieldName":"showExplorerButton",
               "label":"Show ArcGIS Explorer Button",
               "tooltip":"Display's the button to open the webmap in ArcGIS Explorer"
            },
            {
               "type":"boolean",
               "fieldName":"showArcGISOnlineButton",
               "label":"Show ArcGIS Online Button",
               "tooltip":"Display's the button to open the webmap in ArcGIS Online"
            }
         ]
      }
   ],
   "values":{
      "theme":"blueTheme",
      "siteTitle":"My Gallery",
      "showProfileUrl":true,
      "showAboutPage":true,
      "homeSideHeading":"Description",
      "addThisProfileId":"xa-4f3bf72958320e9e",
      "defaultLayout":"grid",
      "sortField":"created",
      "sortOrder":"desc",
	  "searchType":"Web Map",
      "mapViewer":"simple",
      "galleryItemsPerPage":9,
      "openGalleryItemsNewWindow":false,
      "showSocialButtons":true,
      "showFooter":true,
      "showBasemapGallery":true,
      "showGroupSearch":true,
      "showMapSearch":true,
      "showLayerToggle":true,
      "showLayoutSwitch":true,
      "showOverviewMap":true,
      "showMoreInfo":true,
      "mobileAppUrl":true,
      "showMobileDialog":true,
      "showPagination":true,
      "showExplorerButton":true,
      "showArcGISOnlineButton":true
   }
}