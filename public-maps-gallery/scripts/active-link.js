/*------------------------------------*/
// GETS FILE NAME OF CURRENT URL
/*------------------------------------*/
function getFileName() {
	//this gets the full url
	var url = document.location.href;
	//this removes the anchor at the end, if there is one
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	//this removes the query after the file name, if there is one
	//url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	//this removes everything before the last slash in the path
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	// IF THERE IS NO FILE NAME OR IT'S INDEX
	if(url == '' || url == 'index.html'){
		// RETURN FALSE
		url = false;
	}
	//return
	return url;
}
/*------------------------------------*/
// WHEN DOCUMENT IS LOADED
/*------------------------------------*/
$(document).ready(function() {
	// GET CURRENT URL
	var currentURL = getFileName();
	// IF CURRENT URL
	if(currentURL){
		// SET ACTIVE NAVIGATION ITEM (header link that matches current url that isn't the logo)
		$('#header ul li a[href*="' + currentURL + '"]').addClass('activeLink');
	}
});