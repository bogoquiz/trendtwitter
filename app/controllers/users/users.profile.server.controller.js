'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Twitter = require('twitter'),
	Country = mongoose.model('Country'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

exports.countryTwitter = function(config,token, tokenSecret){
	var country = [],
		countryt;
	//console.log(req.query);
	//User.find({provider: 'twitter', _id: req.user}, function(err, providerData){
              
        
        		//tokens = providerData;
       			//console.dir(item);
        		//console.log(providerData);
    Country.find(function(err, data) {
    	console.log(err, data[0]);
    if (data[0]) {   		
        		
        		console.log(country,'ooo');

        					
		
	} else
		{
				var client = new Twitter({
  					consumer_key: config.twitter.clientID,
  					consumer_secret: config.twitter.clientSecret,
  					access_token_key: token,
  					access_token_secret: tokenSecret
					});
      		
					client.get('/trends/available', function(err, payload){
					//console.log(payload);
		 			var b=0;
 	 				for (var i = 0; i < payload.length; i++) { 
    
    				if (payload[i].placeType.name === 'Country' && (payload[i].country) !== null){
       
     		  		country[b] = {'country': payload[i].country, 'woeid': payload[i].woeid};
    				//country.country[i] = {'country' : payload[i].country, 'woeid' : payload[i].woeid};
    				//country.woeid[i] = payload[i].woeid;
    				
  	    			
      				b=b+1;
     				}
     				
     
  			}
  			countryt = new Country({country: country});
  			countryt.save(function(err) {
  	    				
							console.log(err);
						
						});
		});

		}
	

    });
 	//});
				
};