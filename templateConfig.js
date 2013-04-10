var templateConfig = {
    "bingMapsKey":"Akt3ZoeZ089qyG3zWQZSWpwV3r864AHStal7Aon21-Fyxwq_KdydAH32LTwhieA8",   
    helperServices: {
       geometry:{
        url: location.protocol + "//tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
       },
       printTask: {
        url: location.protocol + "//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
       },
       geocode: {
        url: location.protocol + "//geocode.arcgis.com/arcgis/rest/servcies/World/GeocodeServer"
       }
    }
};