// dojo requires
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.arcgis.Portal");
dojo.require("dojo.NodeList-manipulate");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojox.NodeList.delegate");

// show results from username
function showGroupResults(data){
	// clear results
	dojo.query('#groupResults')[0].innerHTML = '';
	// html var
	var html = '';
	// total results
	var totalItems = data.total;
	var totalResults = data.results.length;
	// if items were returned
	if(totalItems > 0){
		// create table
		html += '<h2>Group Results</h2>';
		html += '<table>';
		html += '<tbody>';
		// Create table rows
		for(var i = 0; i < totalResults; ++i){
			// build table row
			html += '<tr>';
			html += '<td>';
			html += '<a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '">';
			if(data.results[i].thumbnailUrl){
				html += '<img width="50" height="50" alt="' + data.results[i].title + '" src="' + data.results[i].thumbnailUrl + '" />';
			}
			html += '</a>';
			html += '</td>';
			html += '<td>';
			html += '<ul>';
			html += '<li>';
			html += '<strong>Group:</strong>&nbsp;<a target="_blank" href="http://www.arcgis.com/home/group.html?owner=' + data.results[i].owner + '&title=' + data.results[i].title + '">' + data.results[i].title + '</a></li>';
			html += '<li><strong>Snippet:</strong>&nbsp;'+data.results[i].snippet+'</li>';
			html += '<li><strong>ID:</strong>&nbsp;<input size="50" type="text" value="'+data.results[i].id+'" /></li>';
			html += '</ul>';
			html += '</tr>';
			html += '</td>';
		}
		// close table
		html += '</tbody>';
		html += '</table>';	
	}
	else{
		// NO RESULTS
		html += '<h2>Group Results</h2>';
		html += '<p>No groups were found. Make sure that your group is set to Public and you copy the full link with the user and group title.</p>';	
	}
	// INSERT TO HTML
	dojo.query('#groupResults')[0].innerHTML = html;
}

// find owner's groups
function findArcGISGroup(owner){	
	// first, request the group to see if it's public or private
	esri.request({
		// group rest URL
		url: 'http://www.arcgis.com/sharing/rest/community/users/' + owner,
		content: {
			'f':'json'
		},
		callbackParamName: 'callback',
		load: function (response) {
			// sign-in flag
			//var signInRequired = (response.access !== 'public') ? true : false;
			// if sign-in is required
			//if(signInRequired){
			//	portal.signIn();
			//}
			// query
			var q = 'owner:"' + owner + '"';
			var params = {
				q: q,
				v: 1,
				f: 'json'
			};
			// create portal
			var portal = new esri.arcgis.Portal('http://www.arcgis.com/');
			// portal loaded
			dojo.connect(portal, 'onLoad', function(){
				portal.queryGroups(params).then(function(data){
					showGroupResults(data);
				});
			});
			
		}
	});
	
	
}

// submit group finder function
function submitGroupFinder(){
	var inputVal = dojo.query('#groupFinder').attr('value')[0];
	if(inputVal){
		findArcGISGroup(inputVal);
	}
}

// dojo ready
dojo.addOnLoad(function(){
	// Group Finder Submit Button
	dojo.query(document).delegate('#groupFinderSubmit', "onclick", function(){
		submitGroupFinder();
	});
	// Group Finder Reset Button
	dojo.query(document).delegate('#groupFinderReset', "onclick", function(){
		dojo.query('#groupFinder').attr('value', '');
		dojo.query('#groupResults')[0].innerHTML = '';
	});
	// Group Finder Enter Key Button
	dojo.query(document).delegate("#groupFinder", "onkeyup", function(e){
		if(e.keyCode === 13){
			submitGroupFinder();
		}
	});
});