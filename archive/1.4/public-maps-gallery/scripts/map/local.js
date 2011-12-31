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
else if(pmgConfig.defaultWebmap){
	webmap = pmgConfig.defaultWebmap;
}
else {
	webmap = '1a581e0ef5254264804a9c438d8e95ff';
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
		$('#fullScreen').attr('title',buttonText);
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
		$('#fullScreen').attr('title',buttonText);
		// TOGGLE GLOBAL VARIABLE
		mapFullscreen = 0;
	}
	resizeMap();
}
/*------------------------------------*/
// Tabs
/*------------------------------------*/
function tabMenu(menuObj, buttonObj){
	$('.tabMenu').hide();
	$('#tabMenu .toggleButton').removeClass('buttonSelected');
	$(menuObj).show();
	$(buttonObj).addClass('buttonSelected');
}
/*------------------------------------*/
// SEARCH BOX JAVASCRIPT
/*------------------------------------*/
// CLEAR ADDRESS FUNCTION THAT REMOVES BUTTON AS WELL
function clearAddress(obj){
	$(obj).val('');
	var iconReset = $(obj).prev('.iconReset');
	iconReset.removeClass('resetActive');
	$(obj).addClass('default');
}
// CHECKS TO SEE IF ADDRESS IS POPULATED
function checkAddressStatus(obj){
	var cAVal = $(obj).val();
	var iconReset = $(obj).prev('.iconReset');
	if(cAVal !== ''){
		iconReset.addClass('resetActive');
	}
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	if(pmgConfig.showMoreInfo){
		// SET MAP CONTENTS URL
		var mapURL = 'http://www.arcgis.com/home/item.html?id=' + webmap;
		// SHOW AND SET HREF
		$('#mapMoreInfo').append('<h2>More Information</h2><a id="mapContentsLink" href="'+mapURL+'" target="_blank">ArcGIS Map Contents</a>');
	}
    /*------------------------------------*/
    // BUTTONS
    /*------------------------------------*/
	$(document).on('click','#showAbout',function(event) {
        tabMenu('#aboutMenu',this);
    });
	$(document).on('click','#showLegend',function(event) {
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
	$(document).on('click','#fullScreen',function(event) {
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
	$(document).on('click','#zoomSliderMinus',function(event) {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue - 1);
    });
	$(document).on('click','#zoomSliderPlus',function(event) {
		var currentValue = customMapSlider.slider("option", "value");
		customMapSlider.slider("option", "value", currentValue + 1);
    });
	/*------------------------------------*/
	// ZOOM SLIDER BUTTONS
	/*------------------------------------*/
	$(document).on('click','#zoomSliderMinus2',function(event) {
		var currentValue = customMapSlider2.slider("option", "value");
		customMapSlider2.slider("option", "value", currentValue - 1);
    });
	$(document).on('click','#zoomSliderPlus2',function(event) {
		var currentValue = customMapSlider2.slider("option", "value");
		customMapSlider2.slider("option", "value", currentValue + 1);
    });
	// IF GELOCATION IS AVAILABLE
	if(Modernizr.geolocation){
		$('#map').append('<span id="geoButton" title="Use Current Location"></a>');
		$(document).on('click','#geoButton',function(event) {
			navigator.geolocation.getCurrentPosition(geoLocateMap);
		});
	}
	// IF USER IS ON AN IOS DEVICE
	if(pmgConfig.agent_ios){
		var itemURL = 'arcgis://www.arcgis.com/sharing/content/items/' + webmap + '/data';
		$('#mapButtons').prepend('<a id="iOSButton" href="' + itemURL + '" class="mapButton buttonSingle">Open in iOS App</a>');
		
		document.getElementById("iOSButton").onclick = applink(pmgConfig.iosAppURL);
	}
	// SEARCH
	$('#searchAddress').bind('keypress', function(e){
		if(e.keyCode==13){
			locate();
			$('#autoComplete').hide();
		}
	});
	// BUTTON
	$(document).on('click','#searchAddressButton',function(event) {
		locate();
		$('#autoComplete').hide();
	});
	/*------------------------------------*/
	// SEARCH BOX JAVASCRIPT
	/*------------------------------------*/
	$(document).on('focusin','.iconInput input',function(event) {
		var cAVal2 = $(this).val();
		var $searchDefault = $(this).attr('placeholder');
		if(cAVal2 == $searchDefault){
			clearAddress(this);
		}
	});
	$(document).on('focusout','.iconInput input',function(event) {
		var cAVal2 = $(this).val();
		var $searchDefault = $(this).attr('placeholder');
		if(cAVal2 === ''){
			clearAddress(this);
			$(this).val($searchDefault);
		}
	});
	// LISTENER FOR ADDRESS KEY UP
	$('.iconInput input').keyup(function(e) {
		checkAddressStatus(this);
	});
	$(document).on('click','.iconInput .iconReset',function(event) {
		var obj = $(this).nextAll('input');
		clearAddress(obj);
	});
	/*------------------------------------*/
	// AUTO COMPLETE && ADDRESS SPECIFIC ACTION LISTENERS
	/*------------------------------------*/
	$('#searchAddress').keyup(function(e){
		var aquery = $(this).val();
		var alength = aquery.length;
		var $searchDefault = $(this).attr('placeholder');
		if(e.keyCode == 13 && $(this).val()!==$searchDefault && $(this).val()!=='') {
			clearTimeout (timer);
			clearLocate();
			locate();
			$('#autoComplete').hide();
		}
		else if(e.keyCode == 38) {
			$('#autoComplete li:last').focus();
		}
		else if(e.keyCode == 40) {
			$('#autoComplete li:first').focus();
		}
		else if(alength >= 2){
			delay(function(){
				autoComplete(aquery);
			},250);
		}
		else{
			$('#autoComplete').hide();
		}
	});
	$(document).on('click','#autoComplete ul li',function(event) {
		var locTxt = $(this).text();
		var locNum = $('#autoComplete ul li').index(this);
		$('#searchAddress').val(locTxt);
		showResults(ACObj, locNum);
		$('#autoComplete').hide();
	});
	$(document).on('keypress','#autoComplete ul li',function(e) {
		if(e.type == 'keypress' && e.keyCode == 13) {
			var locTxt = $(this).text();
			var locNum = $('#autoComplete ul li').index(this);
			$('#searchAddress').val(locTxt);
			showResults(ACObj, locNum);
			$('#autoComplete').hide();
		}
		else if(e.type == 'keypress' && e.keyCode == 40) {
			$(this).next('li').focus();
		}
		else if(e.type == 'keypress' && e.keyCode == 38) {
			$(this).prev('li').focus();
		}
	});
	$(document).on('click','#clearAddress',function(event) {
		clearLocate();
		$('#autoComplete').hide();
	});
});
/*------------------------------------*/
// INSERT EMBED HIDDEN
/*------------------------------------*/
function insertEmbedHidden(){
	var html = '';
	html += '<div id="embedHidden" class="embedHidden">';
	html += '<h3>Customize</h3>';
	html += '<div id="videoSizes">';
	html += '<div id="smallBox" class="boxSize">';
	html += '<div class="Title">480x270</div>';
	html += '<div class="Box">';
	html += '<div class="Checked"></div>';
	html += '</div>';
	html += '</div>';
	html += '<div id="mediumBox" class="boxSize selected">';
	html += '<div class="Title">720x405</div>';
	html += '<div class="Box">';
	html += '<div class="Checked"></div>';
	html += '</div>';
	html += '</div>';
	html += '<div id="largeBox" class="boxSize">';
	html += '<div class="Title">960x540</div>';
	html += '<div class="Box">';
	html += '<div class="Checked"></div>';
	html += '</div>';
	html += '</div>';
	html += '<div id="customBox" class="boxSize customSize">';
	html += '<div class="Title">Custom</div>';
	html += '<div class="Box">';
	html += '<div id="widthDiv"><span>Width:</span>';
	html += '<input type="text" maxlength="3" size="5" value="720" id="embedWidth">';
	html += '</div>';
	html += '<div id="heightDiv"><span>Height:</span>';
	html += '<input type="text" maxlength="3" size="5" value="405" id="embedHeight">';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<ul class="embedOptions">';
	html += '<li>';
	html += '<input id="showLegendEmbed" type="checkbox" checked>';
	html += '<label for="showLegendEmbed">Show Legend</label>';
	html += '</li>';
	html += '<li>';
	html += '<input id="showAboutEmbed" type="checkbox" checked>';
	html += '<label for="showAboutEmbed">Show About this Map</label>';
	html += '</li>';
	html += '<li>';
	html += '<select id="laGroup" name="laGroup">';
	html += '<option value="0" selected>Left</option>';
	html += '<option value="1">Right</option>';
	html += '</select>';
	html += '<label for="laGroup">Align</label>';
	html += '</li>';
	html += '</ul>';
	html += '<div class="Clear"></div>';
	html += '<div id="previewContainer">';
	html += '<div id="mapPreview">';
	html += '<div class="zoomSliderBG" id="zoomSliderBG2">';
	html += '<div class="zoomSliderPlus" id="zoomSliderPlus2" title="Zoom in"></div>';
	html += '<div class="zoomSliderCustom" id="zoomSliderCustom2" title="Drag to zoom"></div>';
	html += '<div class="zoomSliderMinus" id="zoomSliderMinus2" title="Zoom out"></div>';
	html += '</div>';
	html += '</div>';
	html += '<div id="exampleInfo" class="isLeft">';
	html += '<div class="Scroll">';
	html += '<div class="Pad">';
	html += '<div class="menuHeading" id="AboutHeading">About this Map</div>';
	html += '<div class="menuHeading" id="LegendHeading">Legend</div>';
	html += '<div class="alignCenter" id="previewMenu"><span id="legend_btn_preview" class="toggleButton buttonLeft buttonSelected">Legend</span><span id="about_btn_preview" class="toggleButton buttonRight">About</span> </div>';
	html += '<div id="legendDivPreview"></div>';
	html += '<div id="descriptionPreview"><span>Map Description</span></div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="Clear"></div>';
	html += '<div class="dragHelper"> Drag to resize<span class="dragToResize"></span> </div>';
	html += '<h3 id="embedTitle">Embed Code</h3>';
	html += '<p>Copy and paste the following HTML to embed the map on your website.</p>';
	html += '<div id="embedScript">';
	html += '<textarea cols="60" rows="2" readonly="readonly" id="embedCode"></textarea>';
	html += '</div>';
	html += '</div>';
	$('#embedMap').append(html);	
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function(){
	// embed
	if(pmgConfig.showEmbedButton){
		insertEmbedHidden();
		$('#mapButtons').append('<span id="embedButton" class="mapButton buttonSingle">&lt;Embed&gt;</span>');
	}
	// placeholder
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		  }
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  $(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
			  input.val('');
			}
		  })
		});
	}
});