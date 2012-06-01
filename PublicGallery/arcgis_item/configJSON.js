{
   "configurationSettings":[
      {
         "category":"<b>Site Information</b>",
         "fields":[
            {
               "type":"string",
               "fieldName":"group",
               "label":"Group ID:",
               "tooltip":"ID of the group.",
               "placeHolder":""
            },
            {
               "type":"string",
               "fieldName":"siteTitle",
               "label":"Website Title:",
               "tooltip":"The title of this template's website.",
               "placeHolder":"My Gallery"
            },
            {
               "type":"string",
               "fieldName":"siteBannerImage",
               "tooltip":"URL for the navigation header logo image. If empty, Site Title text is used.",
               "placeHolder":"http://www.mysite.com/logo.png",
               "label":"Banner Logo:"
            },
            {
               "type":"string",
               "fieldName":"addThisProfileId",
               "label":"AddThis.com Profile Id:",
               "tooltip":"Account ID for AddThis.com.",
               "placeHolder":"xa-4f3bf72958320e9e"
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
               "type":"paragraph",
               "fieldName":"footerDescription",
               "label":"Footer Content:",
               "tooltip":"Content description displayed in the footer.",
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
               "tooltip":"Gallery items to show per page.",
               "label":"Items Per Page:",
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
      }
   ],
   "values":{
      "theme":"blueTheme",
      "addThisProfileId":"xa-4f3bf72958320e9e",
      "defaultLayout":"grid",
      "sortField":"modified",
      "sortOrder":"desc",
      "mapViewer":"simple",
      "galleryItemsPerPage":9
   }
}