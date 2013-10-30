var path_location = location.pathname.replace(/\/[^/]+$/, '');
var path_location_tc = path_location + '/config';
if (path_location.search(/\/apps\/|\/home\//) !== -1) {
    path_location_tc = path_location.substr(0, path_location.lastIndexOf('/PublicGallery'));
}
// Dojo Config
var dojoConfig = {
    parseOnLoad: true,
    //locale: 'ar',
    packages: [{
        name: "esriTemplate",
        location: path_location
    }, {
        name: "application",
        location: path_location + '/javascript'
    }, {
        name: "templateConfig",
        location: path_location_tc
    }, {
        name: "config",
        location: path_location + '/config'
    }]
};