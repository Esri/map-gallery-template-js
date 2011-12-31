function showGroupResults(data){
	// CLEAR PAGINATION
	$('#groupResults').html('');
	// HTML VARIABLE
	var html = '';
	// GET TOTAL RESULTS
	var totalItems = data.total;
	var totalResults = data.results.length;
	// IF WE HAVE ITEMS
	if(totalItems > 0){
		// START OF UNORDERED LIST
		html += '<h2>Group Results</h2><ul>';
		// CREATE LIST ITEMS
		for(var i=0; i < totalResults; ++i) {
			// BUILD LIST ITEM
			html += '<li><a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '"><img width="50" height="50" alt="' + data.results[i].title + '" src="http://www.arcgis.com/sharing/community/groups/'+data.results[i].id+'/info/'+data.results[i].thumbnail+'" /></a><strong>Group:</strong>&nbsp;<a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '">' + data.results[i].title + '</a><br><strong>Snippet:</strong>&nbsp;'+data.results[i].snippet+'<br><strong>ID:</strong>&nbsp;<input size="50" type="text" value="'+data.results[i].id+'" /></li>';
		}
		// CLOSE LIST
		html += '</ul>';	
	}
	else{
		// NO RESULTS
		html += '<h2>Group Results</h2><p>No groups were found.</p>';	
	}
	// INSERT TO HTML
	$('#groupResults').html(html);
}

function findArcGISGroup(owner,title){
	// BUILD DATA STRING
	var dataString = '';
	dataString += 'q=';
	dataString += 'owner:' + owner,
	dataString += ' AND title:' + title,
	dataString += '&f=json';
	// JQUERY AJAX FUNCTION CALL
	$.ajax({
		// AJAX URL
		url: 'http://www.arcgis.com/sharing/community/groups',
		// DATA STRING WITH PARAMETERS
		data: dataString,
		// DATA TYPE
		dataType: 'jsonp',
		success: function(data, textStatus, jqXHR){
			// IF CALLBACK IS A FUNCTION
			showGroupResults(data);
		}
	});
}
/*------------------------------------*/
// GETS URL PARAMETER FROM URL STRING
/*------------------------------------*/
function getUrlItem(source, name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec(source);
    if (results === null) {
        return "";
    }
	return results[1];
}
/*------------------------------------*/
// SUBMIT GROUP FINDER
/*------------------------------------*/
function submitGroupFinder(){
	var inputVal = $('#groupFinder').val();
	var owner = getUrlItem(inputVal,'owner');
	var title = getUrlItem(inputVal,'title');
	findArcGISGroup(owner,title);
}
/*------------------------------------*/
// JQUERY READY
/*------------------------------------*/
$(document).ready(function() {
	// SUBMIT BUTTON
	$('#groupFinderSubmit').live('click',function(){
		submitGroupFinder();
	});
	// SUBMIT BUTTON
	$('#groupFinderReset').live('click',function(){
		$('#groupFinder').val('');
		$('#groupResults').html('');
	});
	// ENTER KEY
	$('#groupFinder').bind('keypress', function(e){
		if(e.keyCode==13){
			submitGroupFinder();
		}
	});
});