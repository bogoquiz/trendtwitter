'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	Twitter = require('twitter'),
	users = require('../../app/controllers/users.server.controller'),
	customers = require('../../app/controllers/customers.server.controller');


module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;
			
			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};
			console.log(token, tokenSecret);
			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
			users.countryTwitter(config,token, tokenSecret);
	
}
	));
};
