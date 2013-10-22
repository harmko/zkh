/*
	Main application script
*/

var loginUrl    = 'https://test.salesforce.com/';
var clientId    = '3MVG9ahGHqp.k2_yJ0MeOrZTMJbZ1VEJ96R4DDz5cfxrDxM60kgd131HXymlpUsUzkEN3hSUl5DMt5QFVbOJJ';
var redirectUri = "https://test.salesforce.com/services/oauth2/success";
var client = new forcetk.Client(clientId, loginUrl);

// We use $j rather than $ for jQuery
if (window.$j === undefined) {
	$j = $;
}

$j(document).ready(function() {
	try {
		var cb = window.plugins.childBrowser;
		SAiOSKeychainPlugin.install();
		window.plugins.keychain.getForKey('refresh_token',
			'forcetk',
			function(key, value) {
				$j.mobile.pageLoading();
				client.setRefreshToken(value);
				client.refreshAccessToken(sessionCallback,
				function(jqXHR, textStatus, errorThrown) {
					alert('Error getting refresh token: ' + errorThrown);
				});
			},
			function(key, error) {
				// No refresh token - do OAuth
				cb.onLocationChange = function(loc) {
					if (loc.indexOf(redirectUri) > -1) {
						cb.close();
						oauthCallback(unescape(loc));
					}
				};
				cb.showWebPage(getAuthorizeUrl(loginUrl, clientId, redirectUri));
			}
		);
	}
	catch(err) {
		alert(err);
	}
);


function getAuthorizeUrl(loginUrl, clientId, redirectUri) {
	return loginUrl + 'services/oauth2/authorize?display=touch'
	+ '&response_type=token&client_id=' + escape(clientId)
	+ '&redirect_uri=' + escape(redirectUri);
}
function oauthCallback(loc) {
	var oauthResponse = {};

	var fragment = loc.split("#")[1];

	if (fragment) {
		var nvps = fragment.split('&');
		for (var nvp in nvps) {
			var parts = nvps[nvp].split('=');
			oauthResponse[parts[0]] = unescape(parts[1]);
		}
	}

	if (typeof oauthResponse === 'undefined'
			|| typeof oauthResponse['access_token'] === 'undefined') {
			errorCallback({
				status: 0,
				statusText: 'Unauthorized',
				responseText: 'No OAuth response'
			});
	} else {
		window.plugins.keychain.setForKey('refresh_token',
			oauthResponse.refresh_token,
			'forcetk',
			null,
			function(key, error) {
				alert("Error storing OAuth refresh token!");
			}
		 );

		alert(oauthResponse);
		$('.btn').button('Completed!');
	}
}
