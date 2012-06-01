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
		html += '<h2>Group Results</h2><table><tbody>';
		// CREATE LIST ITEMS
		for(var i=0; i < totalResults; ++i) {
			// BUILD LIST ITEM
			html += '<tr><td><a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '">';
			if(data.results[i].thumbnail){
				html += '<img width="50" height="50" alt="' + data.results[i].title + '" src="http://www.arcgis.com/sharing/community/groups/'+data.results[i].id+'/info/'+data.results[i].thumbnail+'" />';
			}
			html += '</a></td>';
			html += '<td><ul><li><strong>Group:</strong>&nbsp;<a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '">' + data.results[i].title + '</a></li><li><strong>Snippet:</strong>&nbsp;'+data.results[i].snippet+'</li><li><strong>ID:</strong>&nbsp;<input size="50" type="text" value="'+data.results[i].id+'" /></li></ul></tr></td>';
		}
		// CLOSE LIST
		html += '</tbody></table>';	
	}
	else{
		// NO RESULTS
		html += '<h2>Group Results</h2><p>No groups were found. Make sure that your group is set to Public and you copy the full link with the user and group title.</p>';	
	}
	// INSERT TO HTML
	$('#groupResults').html(html);
}

function findArcGISGroup(owner){
	// BUILD DATA
	var dataObj = {
		'f': 'json',
		'q':  'owner:' + owner
	};
	// JQUERY AJAX FUNCTION CALL
	$.ajax({
		// AJAX URL
		url: 'http://www.arcgis.com/sharing/community/groups',
		// DATA STRING WITH PARAMETERS
		data: dataObj,
		// DATA TYPE
		dataType: 'jsonp',
		success: function(data, textStatus, jqXHR){
			// IF CALLBACK IS A FUNCTION
			showGroupResults(data);
		}
	});
}
/*------------------------------------*/
// SUBMIT GROUP FINDER
/*------------------------------------*/
function submitGroupFinder(){
	var inputVal = $('#groupFinder').val();
	findArcGISGroup(inputVal);
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