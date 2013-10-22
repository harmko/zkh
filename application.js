/*
	Main application script
*/

var loginUrl    = 'https://test.salesforce.com/';
var clientId    = '3MVG9ahGHqp.k2_yJ0MeOrZTMJbZ1VEJ96R4DDz5cfxrDxM60kgd131HXymlpUsUzkEN3hSUl5DMt5QFVbOJJ';
var redirectUri = "https://test.salesforce.com/services/oauth2/success";
var client = new forcetk.Client(clientId, loginUrl);

document.addEventListener("deviceready", startApp, false);

function startApp() {
	client.setSessionToken(oauthResponse.access_token, null, oauthResponse.instance_url);
	
	var cb = window.plugins.childBrowser;
		
}

//
// Salesforce login stuff
function getAuthorizeUrl(loginUrl, clientId, redirectUri) {
	return loginUrl + 'services/oauth2/authorize?display=touch'
	+ '&response_type=token&client_id=' + escape(clientId)
	+ '&redirect_uri=' + escape(redirectUri);
}
