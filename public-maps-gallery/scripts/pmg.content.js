/*------------------------------------*/
// INSERT CONTENT
/*------------------------------------*/
// SET PAGE TITLE
function setPageTitle(){
	if(pmgConfig.pmgSubTitle){
		document.tile = pmgConfig.siteTitle + ' - ' + pmgConfig.pmgSubTitle;
	}
	else{
		document.tile = pmgConfig.siteTitle;
	}
}
// INSERT CONTENT
function insertPMGContent(){
	// THEME
	switch(pmgConfig.theme){
		case 'bluePMG':
			$('body').addClass(pmgConfig.theme);
			break;
		case 'redPMG':
			$('body').addClass(pmgConfig.theme);
			break;
		case 'greenPMG':
			$('body').addClass(pmgConfig.theme);
			break;
		case 'custom':
			$('body').addClass(pmgConfig.theme);
			break;
		default:
			$('body').addClass('redPMG');
	}
	// SITE TITLE
	if(pmgConfig.siteTitle){
		if(pmgConfig.showVersion){
			$('#siteTitle').html(pmgConfig.siteTitle + ' <span>v'+pmgConfig.version + '</span>');
		}
		else{
			$('#siteTitle').html(pmgConfig.siteTitle);
		}
		setPageTitle();
	}
	// SITE HEADING
	if(pmgConfig.siteHeading){
		$('#siteHeading').html(pmgConfig.siteHeading);
	}
	// SITE INTRO TEXT
	if(pmgConfig.siteIntro){
		$('#siteIntro').html(pmgConfig.siteIntro);
	}
	// FOOTER HEADING
	if(pmgConfig.footerHeading){
		$('#footerHeading').html(pmgConfig.footerHeading);
	}
	// FOOTER DESCRIPTION
	if(pmgConfig.footerDescription){
		$('#footerDescription').html(pmgConfig.footerDescription);
	}
	// FOOTER EMAIL
	if(pmgConfig.footerEmail){
		$('#footerLogoDiv').append('<a id="footerEmail" href="mailto:' + pmgConfig.footerEmail + '?subject=' + encodeURIComponent(pmgConfig.footerEmailSubject) + '&body=' + encodeURIComponent(pmgConfig.footerEmailBody) + '">' + pmgConfig.footerEmail + '</a>');
	}
	// NAVIGATION
	if(pmgConfig.showNavLinks && pmgConfig.navLinks){
		for(i=0;i<pmgConfig.navLinks.length;i++){
			$('#pmgNav').append('<li><a href="' + pmgConfig.navLinks[i].url + '">' + pmgConfig.navLinks[i].title + '</a></li>');
		}
	}
	// FOOTER LOGO
	if(pmgConfig.footerLogo){
		var footerhtml = '';
		footerhtml += '<a id="yourLogo" ';
		if(pmgConfig.footerLogoURL){
			footerhtml += 'href="' + pmgConfig.footerLogoURL + '"';
		}
		footerhtml += 'title="'+pmgConfig.siteTitle+'" ';
		footerhtml += '>';
		footerhtml += '<img src="' + pmgConfig.footerLogo+'" alt="' + pmgConfig.siteTitle + '" title="' + pmgConfig.siteTitle + '" />';
		footerhtml += '</a>';
		$('#footerLogoDiv').prepend(footerhtml);
	}
	// RIGHT BAR TITLE
	if(pmgConfig.rightHeading){
		$('#rightHeading').html(pmgConfig.rightHeading);
	}
	// RIGHT BAR CONTENT
	if(pmgConfig.rightContent){
		$('#rightContent').html(pmgConfig.rightContent);
	}
	// RIGHT SIDE TITLE
	if(pmgConfig.rightSideLinksTitle){
		$('#rightSideLinksTitle').html(pmgConfig.rightSideLinksTitle);
	}
	// RIGHT SIDE LINKS
	if(pmgConfig.showRightSideLinks && pmgConfig.rightLinks){
		var html = '<ul id="rightLinksUL">';
		for(i=0; i<pmgConfig.rightLinks.length; i++){
			html += '<li><a href="' + pmgConfig.rightLinks[i].url + '">' + pmgConfig.rightLinks[i].title + '</a></li>';
		}
		html += '</ul>';
		$('#rightSideLinks').append(html);
	}
	// RIGHT BAR TITLE
	if(pmgConfig.rightHeading2){
		$('#rightHeading2').html(pmgConfig.rightHeading2);
	}
	// RIGHT BAR CONTENT
	if(pmgConfig.rightContent2){
		$('#rightContent2').html(pmgConfig.rightContent2);
	}
	// END
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	insertPMGContent();
});