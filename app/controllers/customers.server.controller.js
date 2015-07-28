'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash'),
	Twitter = require('twitter'),
	config = require('../../config/config'),
	User = mongoose.model('User'),
	Country = mongoose.model('Country'),
	passport = require('passport');

/**
 * Create a Customer
 */
exports.create = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user;

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

exports.create2 = function(data, user) {

for (var i = data.items.length - 1; i >= 0; i--) {
		//Things[i]
	var customer = new Customer({videos: data.items[i], user: user});
	//customer.user = req.user;
	
	customer.save(function(err) {
		if (err) {
			console.log('pailas',err);
			
		} else {
			console.log('super');
		}
	}
	);

	}	

};
/**
 * Show the current Customer
 */
exports.read = function(req, res) {
	res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
	var customer = req.customer ;

	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
	var customer = req.customer ;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * List of Customers
 */
 /*
exports.list = function(req, res) { 
	Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customers);
		}
	});
};
*/

exports.list = function(req, res) { 

	var sort;
	var sortObject = {};

	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start : (page - 1) * count,
		count: count
	};


	if(req.query.sorting){
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	} else{
		sortObject['desc'] = '_id';
	}


	var sort = {
		sort: sortObject
	};

	Customer
		.find({user: req.user})
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, customers){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else{
					var country = [],
	tokens = [],
	videos = customers;



//User.find({provider: 'twitter'}, function(err, providerData){
              
        
        /*tokens = providerData;
        //console.dir(item);
        //console.log('que pasa ' + country[1].providerData.token);
        
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: tokens[0].providerData.token,
  			access_token_secret: tokens[0].providerData.tokenSecret
			});
      		
			client.get('/trends/available', function(err, payload){
			//console.log(payload);

			if(err){
				throw err;	
			} */
		 	/*var b=0;
 	 		for (i = 0; i < payload.length; i++) { 
    
    		if (payload[i].placeType.name === 'Country' && (payload[i].country) !== null){
       
       		country[b] = {'country': payload[i].country, 'woeid': payload[i].woeid};
    
      		b=b+1;
     		}
     
  			}*/

  			Country.find(function(err, country){
  				var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            	console.log(country);
				socketio.sockets.emit('article.created', country); // emit an event for all connected clients
  			});

        User.find({provider: 'twitter'}, function(err, Users){

          console.log(Users[0].username);
          var users = [];

          for (var i = Users.length - 1; i >= 0; i--) {
            
            console.log(Users[i].username,Users[i]._id);
            users.push({user: Users[i].username, id: Users[i]._id});
            
          }
          var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
                //console.log(country);
        socketio.sockets.emit('users.login', users); // emit an event for all connected clients
          console.log(users);
        });
            //var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            	//console.log(country);
			//	socketio.sockets.emit('article.created', country); // emit an event for all connected clients
					/*
				socketio.on('connection', function(socket) {  
				console.log('esto llego');
				socket.on('countryenv', function(data) {
            		console.log('entro!!!' + data);

            	});
				});*/
				var item = { item1: 'Tweet dupiclate  or more than 140 characters', 
							 item2: 'Tweet dupiclate  or more than 140 characters',
							 item3: 'Tweet dupiclate  or more than 140 characters'};
				for (var i = videos.results.length - 1; i >= 0; i--) {
					videos.results[i].videos.kind = (videos.results[i].videos.kind,item);
				}
							
				//customers.results = {};
				//customers.results = videos.results = customers.results[0].videos.items;
				

				
				//console.log(customers);
				//return customers;
				res.jsonp(videos);
				//return customers;
  				
			//});	
  			//});
					
						}
		});
};


/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) { 
	Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (! customer) return next(new Error('Failed to load Customer ' + id));
		req.customer = customer ;
		next();
	});
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//var country;

exports.countryTwitter = function(data, user, socket) {

	var country = '',
	params = '',
	tokens = [],
	i;



User.find({provider: 'twitter', _id: user}, function(err, providerData){
              
        
        tokens = providerData;
        //console.dir(item);
        //console.log(providerData.providerData.token);
        
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: providerData[0].providerData.token,
  			access_token_secret: providerData[0].providerData.tokenSecret
			});
        
        client.get('/trends/place',{id: data}, function(err, payload){
    	//console.log(payload[0].trends.length);
    	if(err){
				throw err;	
			} else {
    	for (var i = 0 ; i < payload[0].trends.length; i++) {
                //mensaje.text(data[0].trends[i].name);
  
                country =  country + payload[0].trends[i].name + ' ';
                
              }
    		}
    	socket.emit('trendenv',country);
    	//country = payload;
    	//console.log(payload);
    	//console.log(country[0].trends);
    	//module.exports.myObj = country;
    	
 		 }); 

               
    });

	
	
  //return tokens;
};

exports.sendTwitter = function(data, user, socket) {


	User.find({provider: 'twitter', _id: user}, function(err, providerData){
	var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: providerData[0].providerData.token,
  			access_token_secret: providerData[0].providerData.tokenSecret
			});
     //console.log(providerData[1]+' data');   	
	client.post('statuses/update', {status: data },  function(error, data,response){

  				//if(error) throw error; h  º1GVGVGVGVGVGVGVBHGJHJKHJH
  				if(!error){
  					console.log('Tweet enviado',error);  // Tweet body.
  					socket.emit('mensagge','send');
  				}else{
  					socket.emit('mensagge',error);
  					console.log('error',error);		
  					}
  				//console.log(response);
  				//console.log(response);  // Raw response object.

				});

  });

};

exports.twitterBucle = function (user){

	var trend = ' ';
	console.log(user);
	Country.find(function(err, country){

  		console.log(country[0].country[3].woeid);
  		User.find({provider: 'twitter', _id: user}, function(err, providerData){
  			//console.log('EMPEZO');
  			var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: providerData[0].providerData.token,
  			access_token_secret: providerData[0].providerData.tokenSecret
			});

	  		
			var x = 0,
				y = 0,
				z = 0;
				//console.log(y);
			setInterval(function() {

				if (x < country[0].country.length) {
          client.get('/trends/place',{id: country[0].country[x].woeid}, function(err, payload){
          //client.get('/trends/place',{id: 23424757}, function(err, payload){  
            //console.log(payload[0].trends[1].name);
            //console.log(payload[0]);
            if(!err){
              
            //console.log(payload[0].trends[1].name);  // Tweet body.
            for (var i = 0 ; i < 4; i++) {
                    //mensaje.text(data[0].trends[i].name);
  
                    trend =  trend + payload[0].trends[i].name + ' ';
                
                    }
              //client.post('statuses/update', {status: payload[0].trends[1].name },  function(error, data,response){
              //console.log(trend);
              z= trend;

              Customer.find({user: user}, function(err, links){
              if (x<links.length){  
              	  //https://youtu.be/WN0WTXaJzMw
                  trend = trend + ' http://trendmedia.herokuapp.com #fail #funny ' + x + ' http://youtu.be/WN0WTXaJzMw'; // + WN0WTXaJzMw links[66].videos.id.videoId;
                  }else{
                    trend = trend + ' http://youtu.be/WN0WTXaJzMw'; // + links[66].videos.id.videoId;
                    //trend = trend + ' http://trendmedia.herokuapp.com';
                  }
                 // console.log(' post ', trend);
              client.post('statuses/update', {status: trend },  function(error, data,response){ 

                //if(error) throw error; h  º1GVGVGVGVGVGVGVBHGJHJKHJH
                if(!error){
                  //console.log('Tweet enviado',error);  // Tweet body.
                  y=0;
                  //continue
                }else{
                  
                  //console.log('error post',error);    
                  y=0;
                  //continue

                  }

                  
                //console.log(response);
                //console.log(response);  // Raw response object.
                trend = '';

              });

              
              /*for (var i = 1 ; i < 2; i++) {
              	z = payload[0].trends[i].name + ' http://trendmedia.herokuapp.com #FAIL' + x + ' http://youtu.be/WN0WTXaJzMw'; // + links[66].videos.id.videoId;
              client.post('statuses/update', {status: z },  function(error, data,response){ 

                //if(error) throw error; h  º1GVGVGVGVGVGVGVBHGJHJKHJH
                if(!error){
                  //console.log('Tweet enviado',error);  // Tweet body.
                  y=0;
                  //continue
                }else{
                  
                  //console.log('error post',error);    
                  y=0;
                  //continue

                  }

                  
                //console.log(response);
                //console.log(response);  // Raw response object.
                //trend = '';

              });
          	  }*/
          	  
              }); 
            //y = Math.floor(Math.random() * (35-30+1)) + 30;
            
          }else{
            
            //console.log('error get',err); 
            y=0;

           
            }
          });
        }

        //else return; 

				
	    		if(x===country[0].country.length){
	    			x=0;
	    		}

	    		x++;
    			//console.log(x);
			}, 9000 /* (Math.floor(Math.random() * (30-20+1)) + 20)*/);

		});		
	});			
};

exports.bucleVideo = function (data){

  var trend = ' ';
  console.log(data[0]);
  Country.find(function(err, country){

      console.log(country[0].country[3].woeid);
      User.find({provider: 'twitter', _id: data[1].id}, function(err, providerData){
        //console.log('EMPEZO');
        var client = new Twitter({
        consumer_key: config.twitter.clientID,
        consumer_secret: config.twitter.clientSecret,
        access_token_key: providerData[0].providerData.token,
        access_token_secret: providerData[0].providerData.tokenSecret
      });

        
      var x = 0,
        y = 0,
        z = 0;
        //console.log(y);
      setInterval(function() {

        if (x < country[0].country.length) {
          client.get('/trends/place',{id: country[0].country[x].woeid}, function(err, payload){
          //client.get('/trends/place',{id: 23424757}, function(err, payload){  
            //console.log(payload[0].trends[1].name);
            //console.log(payload[0]);
            if(!err){
              
            //console.log(payload[0].trends[1].name);  // Tweet body.
            for (var i = 0 ; i < 4; i++) {
                    //mensaje.text(data[0].trends[i].name);
  
                    trend =  trend + payload[0].trends[i].name + ' ';
                
                    }
              //client.post('statuses/update', {status: payload[0].trends[1].name },  function(error, data,response){
              //console.log(trend);
              z= trend;

              Customer.find({user: data[1].id}, function(err, links){
              if (x<links.length){  
                  trend = trend + ' http://trendmedia.herokuapp.com ' + data[0]; //' http://youtu.be/' + links[x].videos.id.videoId;
                  }else{
                    trend = trend + ' http://trendmedia.herokuapp.com ' + data[0];
                    //trend = trend + ' http://trendmedia.herokuapp.com';
                  }
                 // console.log(' post ', trend);
              client.post('statuses/update', {status: trend },  function(error, data,response){ 

                //if(error) throw error; h  º1GVGVGVGVGVGVGVBHGJHJKHJH
                if(!error){
                  //console.log('Tweet enviado',error);  // Tweet body.
                  y=0;
                  //continue
                }else{
                  
                  //console.log('error post',error);    
                  y=0;
                  //continue

                  }

                  
                //console.log(response);
                //console.log(response);  // Raw response object.
                trend = '';

              });

              
             
              
              }); 
            //y = Math.floor(Math.random() * (35-30+1)) + 30;
            
          }else{
            
            //console.log('error get',err); 
            y=0;

           
            }
          });
        }

        //else return; 

        
          if(x===country[0].country.length){
            x=0;
          }

          x++;
          //console.log(x);
      }, 9000 /* (Math.floor(Math.random() * (30-20+1)) + 20)*/);

    });   
  });     
};
/*
exports.countryTwitter = function(req, res) { 
//console.info('XXXXX ' + TwitterStrategy);


//console.log('kkkkkk' + users);

//User.find({provider: 'twitter'}).limit(1);

var country = [],
	tokens = [],
	i;



User.find({provider: 'twitter'}, function(err, providerData){
              
        //console.log('Find: ' + providerData);
        tokens = providerData;
        //console.dir(item);
        //console.log('que pasa ' + country[1].providerData.token);
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: tokens[1].providerData.token,
  			access_token_secret: tokens[1].providerData.tokenSecret
			});
      		
			client.get('/trends/available', function(err, payload){
			
		 	var b=0;
 	 		for (i = 0; i < payload.length; i++) { 
    
    		if (payload[i].placeType.name === 'Country' && (payload[i].country) !== null){
       
       		country[b] = {"country": payload[i].country, "woeid": payload[i].woeid};
    //country.country[i] = {'country' : payload[i].country, 'woeid' : payload[i].woeid};
    //country.woeid[i] = payload[i].woeid;
      		b=b+1;
     		}
     
  			}
            console.info(country);
  			res.jsonp(country);
			});	
  			});

};*/
