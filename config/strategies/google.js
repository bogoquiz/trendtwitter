'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller'),
	customers = require('../../app/controllers/customers.server.controller');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;
			var videos = {};


			var google = require('googleapis'),
        			yt = google.youtube('v3');
        			yt.search.list({part: 'snippet',
									forMine: true,
									type: 'video',
									access_token: accessToken,
									refresh_token: refreshToken,
									maxResults: 50
				}, function(error, data){
        if(error){
            console.log(error);
        } else {
            console.log(data);
            videos = data;
			//console.log('videos',videos);
			customers.create2(videos, req.user);
        }
    });

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};