/*------------------------------------*/
// GLOBAL VARIABLES
/*------------------------------------*/
var $embed_xmin = 0;
var $embed_ymin = 0;
var $embed_xmax = 0;
var $embed_ymax = 0;
var $med_width = 720;
var $med_height = 405;
var $sml_width = 480;
var $sml_height = 270;
var $lrg_width = 960;
var $lrg_height = 540;
var $width = $med_width;
var $height =  $med_height;
var $showLegend = 1;
var $showAbout = 1;
var $laGroup = 0;
var $embedButton = $('#embedButton');
var $embedHidden = $('#embedHidden');
var $embedCode = $('#embedCode');
var $embedWidth = $('#embedWidth');
var $embedHeight = $('#embedHeight');
var $embedScript;
var $embedURL;
var $embed_wkid = 0;
var $group_width = 170;
var $first = 0;
var $dragHelper = 1;
var $embed_scalebar = 1;
var embedLoaded = false;
/*------------------------------------*/
// UPDATE EMBED
/*------------------------------------*/
function updateEmbed(){
	$embedScript = '';
	$embedScript += '<iframe frameborder="0" scrolling="no" width="'+$width+'" height="'+$height+'" src="' + pmgConfig.baseURL + 'embed.html?';
	$embedScript += 'webmap=' + webmap + '&';
	$embedScript += 'width=' + $width + '&';
	$embedScript += 'height=' + $height + '&';
	$embedScript += 'legend=' + $showLegend + '&';
	$embedScript += 'about=' + $showAbout + '&';
	$embedScript += 'lagroup=' + $laGroup + '&';
	$embedScript += 'xmin=' + $embed_xmin + '&';
	$embedScript += 'ymin=' + $embed_ymin + '&';
	$embedScript += 'xmax=' + $embed_xmax + '&';
	$embedScript += 'ymax=' + $embed_ymax + '&';
	$embedScript += 'wkid=' + $embed_wkid + '&';
	$embedScript += 'scalebar=' + $embed_scalebar + '&';
	$embedScript += 'groupwidth=' + $group_width;
	$embedScript += '"><\/iframe>';
	$embedCode.val($embedScript);
}
/*------------------------------------*/
// FIX GROUP
/*------------------------------------*/
function fixGroup(){
	if($laGroup == 1){
		$('#exampleInfo').css('left',"auto").css('right','0').addClass('isRight').removeClass('isLeft');
		$('#mapPreview').css('right',"auto").css('left','0');
		$('.dragHelper').addClass('dragRight');
	}
	else{
		$('#exampleInfo').css('right',"auto").css('left','0').addClass('isLeft').removeClass('isRight');
		$('#mapPreview').css('left',"auto").css('right','0');
		$('.dragHelper').removeClass('dragRight');
	}	
}
/*------------------------------------*/
// FIX DIALOG SIZE
/*------------------------------------*/
function fixDialogSize(){
	$embedHidden.dialog( "option" , 'position', 'center' );	
}
/*------------------------------------*/
// EMBED
/*------------------------------------*/
function showEmbed(){
	$embedHidden.dialog({
		height: 'auto',
		width: 'auto',
		autoOpen: false,
		modal: true,
		resizable:false,
		position:'center',
		draggable:true,
		dialogClass:'embedMap',
		closeOnEscape:true,
		title:'Embed Map',
		open: function(event, ui) {
			updateEmbed();
			if($first == 0){
				$('#previewContainer').width($width).height($height);
				$('#mapPreview').width($width-$group_width).height($height);
				fixDialogSize();
				if(mapPreviewLoaded == 1){
					mapPreview.resize();
					mapPreview.reposition();
					$first = 1;
				}
			}
		}
	});
}
/*------------------------------------*/
// SHOW RESIZE INFO
/*------------------------------------*/
function showResizeInfo(){
	$("#exampleInfo").resizable({
		containment: "#previewContainer",
		maxHeight:'100%',
		minHeight:'100%',
		handles:'e,w',
		start: function(event, ui) {
			$('#mapPreview').hide();
		},
		stop: function(event, ui) {
			$dragHelper = 0;
			$('.dragHelper').hide();
			$('#embedTitle').css('margin-top','33px');
			$('#mapPreview').show();
			$group_width = ui.size.width;
			$('#mapPreview').width($width - $group_width);
			updateEmbed();
			if(mapPreviewLoaded == 1){
				mapPreview.resize();
				mapPreview.reposition();
			}
		}
	});
}
/*------------------------------------*/
// UPDATE INFO
/*------------------------------------*/
function updateInfo(){
	if($showLegend == 0 && $showAbout == 0){
		$('#exampleInfo').hide();
		$('#mapPreview').width($width);
		if(mapPreviewLoaded == 1){
			mapPreview.resize();
			mapPreview.reposition();
		}
		if($dragHelper == 1){
			$('.dragHelper').hide();
			$('#embedTitle').css('margin-top','33px');
		}
	}
	else{
		$('#exampleInfo').show();
		$('#mapPreview').width($width-$group_width);
		if(mapPreviewLoaded == 1){
			mapPreview.resize();
			mapPreview.reposition();
		}
		if($dragHelper == 1){
			$('.dragHelper').show();
			$('#embedTitle').css('margin-top','10px');
		}
	}
	if($showLegend == 1 && $showAbout == 1){
		$('#previewMenu').show();
		$('#previewMenu .toggleButton').removeClass('buttonSelected');
		$('#legend_btn_preview').addClass('buttonSelected');
		$('#descriptionPreview').hide();
		$('#legendDivPreview').show();
		$('.menuHeading').hide();
	}
	else{
		$('#previewMenu').hide();
	}
	if($showLegend == 1 && $showAbout == 0){
		$('#descriptionPreview').hide();
		$('#legendDivPreview').show();
		$('.menuHeading').hide();
		$('#LegendHeading').show();
	}
	else if($showLegend == 0 && $showAbout == 1){
		$('#descriptionPreview').show();
		$('#legendDivPreview').hide();
		$('.menuHeading').hide();
		$('#AboutHeading').show();
	}
}
/*------------------------------------*/
// CHECKBOX SIZES
/*------------------------------------*/
function checkBoxSizes(){
	$('#videoSizes .boxSize').removeClass('selected');
	if($width == $sml_width && $height == $sml_height){
		$('#smallBox').addClass('selected');
	}
	else if($width == $med_width && $height == $med_height){
		$('#mediumBox').addClass('selected');
	}
	else if($width == $lrg_width && $height == $lrg_height){
		$('#largeBox').addClass('selected');
	}
	else{
		$('#customBox').addClass('selected');
	}
}
/*------------------------------------*/
// READY
/*------------------------------------*/
$(document).ready(function() {
	$embedButton = $('#');
	$embedHidden = $('#embedHidden');
	$embedCode = $('#embedCode');
	$embedWidth = $('#embedWidth');
	$embedHeight = $('#embedHeight');
	showEmbed();
	showResizeInfo();
	$(document).on('click','#embedButton',function(event) {
		if(!embedLoaded){
			initMapPreview();
			embedLoaded = true;
		}
		$embedHidden.dialog( "open" );
	});
	/*------------------------------------*/
	// SELECT ALL
	/*------------------------------------*/
	$(document).on('click','#embedWidth, #embedCode, #embedHeight',function(event) {
		$(this).select();
	});
	/*------------------------------------*/
	// PREVIEW INFO MENU
	/*------------------------------------*/
	$(document).on('click','#legend_btn_preview',function(event) {
		$('#previewMenu .toggleButton').removeClass('buttonSelected');
		$(this).addClass('buttonSelected');
		$('#descriptionPreview').hide();
		$('#legendDivPreview').show();
	});
	$(document).on('click','#about_btn_preview',function(event) {
		$('#previewMenu .toggleButton').removeClass('buttonSelected');
		$(this).addClass('buttonSelected');
		$('#legendDivPreview').hide();
		$('#descriptionPreview').show();
	});
	/*------------------------------------*/
	// MAP SIZE KEYUP
	/*------------------------------------*/
	$(document).on('keyup','#embedWidth',function(event) {
		$width = $(this).val();
		if(isNaN($width)){
			$width = $med_width;
		}
		checkBoxSizes();
		updateEmbed();
		$('#previewContainer').width($width);
		if($showLegend == 0 && $showAbout == 0){
			$('#mapPreview').width($width);
		}
		else{
			$('#mapPreview').width($width-$group_width);
		}
		$('#exampleInfo').css('height','100%');
		fixDialogSize();
		fixGroup();
		if(mapPreviewLoaded == 1){
			mapPreview.resize();
			mapPreview.reposition();
		}
	});
	/*------------------------------------*/
	// MAP SIZE KEYUP
	/*------------------------------------*/
	$(document).on('keyup','#embedHeight',function(event) {
		$height = $(this).val();
		if(isNaN($height)){
			$height = $med_height;
		}
		checkBoxSizes();
		updateEmbed();
		$('#previewContainer, #mapPreview').height($height);
		$('#exampleInfo').css('height','100%');
		fixDialogSize();
		fixGroup();
		if(mapPreviewLoaded == 1){
			mapPreview.resize();
			mapPreview.reposition();
		}
	});
	/*------------------------------------*/
	// EMBED SIZE CLICK
	/*------------------------------------*/
	$(document).on('click','#videoSizes .boxSize',function(event) {
		$('#videoSizes div').removeClass('selected');
		$(this).addClass('selected');
		var boxID = $(this).attr('id');
		if(boxID == 'largeBox'){
			$width = $lrg_width;
			$height = $lrg_height;
		}
		else if(boxID == 'mediumBox'){
			$width = $med_width;
			$height = $med_height;
		}
		else if(boxID == 'smallBox'){
			$width = $sml_width;
			$height = $sml_height;
		}
		$embedWidth.val($width);
		$embedHeight.val($height);
		updateEmbed();
		$('#previewContainer').width($width).height($height);
		if($showLegend == 0 && $showAbout == 0){
			$('#mapPreview').width($width).height($height);
		}
		else{
			$('#mapPreview').width($width-$group_width).height($height);
		}
		$('#exampleInfo').css('height','100%');
		fixDialogSize();
		fixGroup();
		if(mapPreviewLoaded == 1){
			mapPreview.resize();
			mapPreview.reposition();
		}
	});
	/*------------------------------------*/
	// RADIO CHANGE BUTTONS
	/*------------------------------------*/
	$("#showLegendEmbed").change(function () {
		if($(this).is(':checked')){
			$showLegend  = 1;
			$('#legendDivPreview').show();
		}
		else{
			$showLegend  = 0;
			$('#legendDivPreview').hide();
		}
		updateInfo();
		updateEmbed();
	});
	$("#showAboutEmbed").change(function () {
		if($(this).is(':checked')){
			$showAbout  = 1;
			$('#descriptionPreview').show();
		}
		else{
			$showAbout  = 0;
			$('#descriptionPreview').hide();
		}
		updateInfo();
		updateEmbed();
	});
	$("#laGroup").change(function () {
		$laGroup= $(this).val();
		fixGroup();
		updateEmbed();
	});
	/*------------------------------------*/
	// END JQUERY READY
	/*------------------------------------*/
});