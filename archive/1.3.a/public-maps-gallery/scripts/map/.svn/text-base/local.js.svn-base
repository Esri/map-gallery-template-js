/*------------------------------------*/
// GLOBAL FULLSCREEN VARIABLE
/*------------------------------------*/
var mapFullscreen = 0;
/*------------------------------------*/
// SET WEBMAP
/*------------------------------------*/
var IDfromURL = URLLookup('webmap');
if(IDfromURL) {
	webmap = IDfromURL;
}
else {
	webmap = ymConfig.defaultWebmap;
}
/*------------------------------------*/
// TOGGLE FULL SCREEN VIEW FUNCTION
/*------------------------------------*/
function toggleFullscreenMap(value){
	var buttonText;
	// IF TRUE, FULLSCREEN
	if(value){
		// BUTTON TEXT
		buttonText = "Exit Fullscreen";
		// CHANGE HTML CLASS
		$('html').addClass('fullScreen');
		// SET BUTTTON CLASSES AND TEXT
		$('#fullScreen').addClass('mapActionButton').children('.title').text(buttonText);
		// TOGGLE GLOBAL VARIABLE
		mapFullscreen = 1;
	}
	// EXIT FULLSCREEN
	else{
		// BUTTON TEXT
		buttonText = "Fullscreen View";
		// CHANGE HTML CLASS
		$('html').removeClass('fullScreen');
		// SET BUTTTON CLASSES AND TEXT
		$('#fullScreen').removeClass('mapActionButton').children('.title').text(buttonText);
		// TOGGLE GLOBAL VARIABLE
		mapFullscreen = 0;
	}
	resizeMap();
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	// SET MAP CONTENTS URL
	var mapURL = 'http://www.arcgis.com/home/item.html?id=' + webmap;
	// SHOW AND SET HREF
	$('#mapContentsLink').show().attr('href',mapURL);
	/*------------------------------------*/
    // Tabs
    /*------------------------------------*/
    function tabMenu(menuObj, buttonObj){
        $('.tabMenu').hide();
        $('#tabMenu .mapButton').removeClass('buttonSelected');
        $(menuObj).show();
        $(buttonObj).addClass('buttonSelected');
    }
    /*------------------------------------*/
    // BUTTONS
    /*------------------------------------*/
    $('#showAbout').live('click',function() {
        tabMenu('#aboutMenu',this);
    });
	$('#showLegend').live('click',function() {
		tabMenu('#legendMenu',this);
	});
	/*------------------------------------*/
	// ESCAPE BUTTON WHEN IN FULL SCREEN VIEW
	/*------------------------------------*/
	$(document).keyup(function(e) {
		// IF ESC KEY AND MAP IS FULLSCREEN
		if(e.keyCode == 27 && mapFullscreen == 1) {
			// EXIT FULLSCREEN
			toggleFullscreenMap(false);
		}
	});
    /*------------------------------------*/
    // BUTTONS
    /*------------------------------------*/
    $('#fullScreen').live('click',function() {
		// IF CURRENTLY IN FULL SCREEN
		if(mapFullscreen == 0){
			// ENTER FULLSCREEN
			toggleFullscreenMap(true);
		}
		else{
			// EXIT FULLSCREEN
			toggleFullscreenMap(false);
		}
    });
	/*------------------------------------*/
	// ZOOM SLIDER BUTTONS
	/*------------------------------------*/
	$('#zoomSliderMinus').live('click',function() {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue - 1);
    });
	$('#zoomSliderPlus').live('click',function() {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue + 1);
    });
	/*------------------------------------*/
	// ZOOM SLIDER BUTTONS
	/*------------------------------------*/
	$('#zoomSliderMinus2').live('click',function() {
		var currentValue = customMapSlider2.slider("option", "value");
		customMapSlider2.slider("option", "value", currentValue - 1);
    });
	$('#zoomSliderPlus2').live('click',function() {
		var currentValue = customMapSlider2.slider("option", "value");
		customMapSlider2.slider("option", "value", currentValue + 1);
    });
	// IF GELOCATION IS AVAILABLE
	if(Modernizr.geolocation){
		$('#map').append('<span id="geoButton" title="Use Current Location"></a>');
		$('#geoButton').live('click',function(){
			navigator.geolocation.getCurrentPosition(geoLocateMap);
		});
	}
	// IF USER IS ON AN IOS DEVICE
	if(ymConfig.agent_ios){
		var itemURL = 'arcgis://www.arcgis.com/sharing/content/items/' + webmap + '/data';
		$('#mapButtons').prepend('<a id="iOSButton" href="' + itemURL + '" class="mapButton buttonSingle selected">Open in iOS App</a>');
		
		document.getElementById("iOSButton").onclick = applink(ymConfig.iosAppURL);
	}
});
/*------------------------------------*/
// END
/*------------------------------------*/