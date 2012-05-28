// Dojo Config
var dojoConfig = {
    parseOnLoad: true,
    packages: [{
        name: "esriTemplate",
        location: location.pathname.replace(/\/[^/]+$/, '')
    }, {
        name: "myModules",
        location: location.pathname.replace(/\/[^/]+$/, '') + '/javascript'
    }, {
        name: "apl",
        location: location.pathname.replace(/\/[^/]+$/, '') + '/apl'
    }]
};

// Global Variables
var i18n, searchVal = '', dataOffset, prevVal = "", ACObj, ACTimeout, timer, mobileDialog, urlObject, portal, map, locateResultLayer, aoGeocoder, aoGeoCoderAutocomplete, mapFullscreen, resizeTimer, mapCenter;