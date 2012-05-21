The Public Maps Gallery template (version 2.0) is the newest version of this particular template. It includes changes and enhancements suggested by users of the 1.4.1 version of the template (see below).

Please post your questions and suggestions about this template by replying to the Public Maps Gallery (PMG) template version 2 --Opening post in the ArcGIS Online forum.

Steps for getting started with this template: 

    Download the code for the template. There's a Download link below as well.
    Unzip the download file, then open the template folder, and double-click the index.html file to launch the gallery in your default browser. Note: that the gallery is populated with sample maps and layers that are stored in groups on ArcGIS Online. The gallery requires a web server to run correctly.
    Use the readme.html to find and copy your group ID that has the content (maps & layers) that you want to showcase in your gallery.
    Replace the group ID in the /config/config.js file with your group ID, save the file, and refresh the gallery in your browser.

The Public Maps Gallery (PMG) template is designed for anyone who wants to showcase their ArcGIS Online maps, layers, and mobile apps in a dynamic web gallery. The template allows you to control the content that fills the gallery using tools available in your ArcGIS Online account. This means that once you deploy a gallery, keeping gallery content up-to-date is as simple as sharing or un-sharing items in your ArcGIS Online group.
The PMG template is also easily configurable. A complete list of features and enhancements is included with the template as is a quick start guide. 

Public Maps Gallery Template Changes

Version 2.0 Changes
	
	Available as an official ArcGIS template.
	Configurable on ArcGIS.com and can be hosted.
	Template has been localized to support different languages.
	Now uses ArcGIS Portal API and version 3.0 of the ArcGIS Javascript API.
	Uses Dojo 1.7 only. jQuery converted to Dojo.
	Ability to add logo in banner.
	Pagination usability improvements and style adjustments.
	Uses 960 Grid for gallery layout.
	Uses ArcGIS Online user group description for home page content and site information.
	About page added to showcase user information.
	Footer now shows group image and user link.
	Basemap gallery moved to a different position and looks more native to the template.
	Now uses simple zoom bar.
	Added buttons to open map in ArcGIS.com and ArcGIS Explorer Online.
	Fullscreen Fixes and layout improvements.
	Info Windows now use theme colors.
	Owner now displayed in about panel.
	Various fixes and style improvements.

Version 1.4.1 Changes

    Support for using the template with private ArcGIS.com groups and items.
    Configuration option to hide footer.
    Configuration option to hide social media icons.
    Configuration option to open explorer view in presentation mode.
    Social media sharing icons are now using Addthis.com.
    ArcGIS JavaScript API updated to version 2.7.
    jQuery  Library updated to version 1.7.1.
    Created a tool for generating ArcGIS.com tokens.
    Various minor bug fixes.

Version 1.4 Changes

    All configuration files are now located in the ‘config’ folder:
        settings.content.js
        settings.optional.js
        settings.required.js
    Anything to do with template content (e.g. descriptive text, logo, email, links, etc) is now available for editing through the configuration files.
    You can edit the configuration files to:
        Set a theme which defines all colors used throughout the template
        Choose which map viewer to load. By default the map.html is loaded but you can now set it to load ArcGIS online or ArcGIS explorer instead.
        Show the basemap gallery. This feature can be turned off
        Show group search for homepage that can filter maps for large groups. This can be turned off
        Group search has an auto-complete dropdown as well.
        Search for locations on the map page view.
        Address location has auto-complete dropdown too.
        Turn off embedding on the map page.
        Show a layer toggle option in the About section on a map view. This can be turned off.
        Choose between list or grid view. This toggle can be turned off.
        Set default layout (e.g. Grid or List).
        Show overview of the map. This can be turned off.
        Turn off the more information option in the about tab on the map page.
        Turn off pagination.

     Other Enhancements

    Removed banner background images. The gradient is achieved using CSS now.
    Removed carousel view. The carousel may be made into a separate template.
    Removed Group ID finder page from the template and made it into its own web page.
        The Group ID finder tool just uses username now to avoid ampersand bug.
    Fixed bug with legend items not showing correctly.
    New fullscreen button on map page.
    Added Geolocation to map.
    Fullscreen view now shows legend if legend is showing already.
    Fullscreen view shows locate box as well.
    Updated to use API version 2.5 and jquery 1.6.4
    Favicon changed to a generic grey color.
    Banner image is transparent generic overlay. 
    It is now easier to use a portal site instead of arcgis.com from the config using the arcgisURL property.