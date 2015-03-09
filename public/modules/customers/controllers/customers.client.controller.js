'use strict';
//angular.module('customers', ['ngTable', 'ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io']);
//angular.module('customers', ['ngTable']);
// Customers controller
angular.module('customers').controller('CustomersController', ['$http', '$scope', '$stateParams', '$location', 'Socket', 'Authentication', 'Customers',  'ngTableParams', 
	function($http, $scope, $stateParams, $location, Socket, Authentication, Customers,  ngTableParams) {
		$scope.authentication = Authentication;
/*
	    $scope.countryTwitter = function(){

		$scope.selectedItem={
      woeid:1,
      country:"mundial"
    };
		console.log('mundial' + $scope.country);
	};
	*/
	var youtube = ' http://youtu.be/',
		index1 = 'null',
		tweetText = '';
		$scope.messageerror = 'ooo';

	$scope.onYoutube = function(){
		
			
		window.location.href='/auth/google';
		
		
	};

	$scope.onClick = function(){
		
		Socket.emit('user', Authentication);
		Socket.emit('updatetw', $scope.tweetText);
		
		
	};

	$scope.onClick2 = function(data,customer,index){
		
		Socket.emit('user', Authentication);
		Socket.emit('updatetw', data);
		index1 = index;
			 
		
	}; 

	Socket.on('mensagge', function(mensagge){
		if (mensagge === 'send'){
			if (index1 !== 'null'){
				$scope.tableParams.data[index1].videos.kind.item1 = 'send';
				$scope.tableParams.data[index1].videos.kind.item2 = mensagge;
				index1 = 'null';
		    	
			}else{
				
				$scope.messageerror = 'send';
				$scope.mensagge = mensagge[0].message;
				
			}
		}else {
			//$scope.tableParams.data[index1].videos.kind.item1 = true;
			//console.log($scope.tableParams.data[index1].videos.kind.item1);
			if (index1 !== 'null'){
				$scope.tableParams.data[index1].videos.kind.item1 = 'error';
				console.log(mensagge[0].message);
				$scope.tableParams.data[index1].videos.kind.item2 = mensagge[0].message;
				console.log(mensagge);
				index1 = 'null';
				
			}else{
				$scope.messageerror = 'error';
				$scope.mensagge = mensagge[0].message;
				
			}
			//$scope.messageerror = 'error';
		}
	});

	
	Socket.on('trendenv', function(data){

		
		$scope.tweetText = data;
		for (var i = $scope.tableParams.data.length - 1; i >= 0; i--) {
			//$scope.tableParams.data[i].videos.etag=data;
			$scope.tableParams.data[i].videos.etag= data + ' http://youtu.be/' + $scope.tableParams.data[i].videos.id.videoId;
			$scope.tableParams.data[i].videos.kind.item1 = '';
			$scope.tableParams.data[i].videos.kind.item2 = '';
		}
		
					
	});

		

	Socket.on('article.created', function(customers) {
    

    //$scope.options = [{ name: "a", id: 1 }, { name: "b", id: 2 }];
    customers[0].country.push({country: 'World', woeid: 1});
    $scope.options = customers[0].country;
    console.log($scope.options);
	//$scope.selectedOption = $scope.options[1];
	$scope.selectedOption = 'Select ';


	});

	var item = {
      woeid:1,
      country:'mundial'
    };



	var params = {
		page: 1,
		count: 5
	};

	var settings = {
		total: 0,
		counts: [5,10,15],
	    getData: function($defer, params) {
            // ajax request to api
            
            Customers.get(params.url(), function(response) {
            	params.total(response.total);
            	//$defer.resolve(response.results[0].videos.items);
            	//console.log(typeof myVar != 'undefined');
            	for (var i = response.results.length - 1; i >= 0; i--) {
				//$scope.tableParams.data[i].videos.etag=data;
				//console.log($scope.tweetText);
				if ($scope.tableParams.data.length  !== 0 ){
					if($scope.tweetText){
					 response.results[i].videos.etag= $scope.tweetText + ' http://youtu.be/' + response.results[i].videos.id.videoId;
					}else{
						response.results[i].videos.etag= '';	
					}

					} else {
						response.results[i].videos.etag= '';
					}
				}

            	$defer.resolve(response.results);
            	            	
            });
            
        } 
	};
	
	$scope.changedValue=function(item){
		 
    
    			Socket.emit('user', Authentication);	
            	Socket.emit('countryenv',item.woeid);
            	
            	        	           
    }; 
    
	$scope.tableParams = new ngTableParams(params, settings);
	

		// Create new Customer
		$scope.create = function() {
			// Create new Customer object
			var customer = new Customers ({
				name: this.name,
				address: this.address,
				state: this.state,
				country: this.country
			});

			// Redirect after save
			customer.$save(function(response) {
				$location.path('customers/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.address = '';
				$scope.state = '';
				$scope.country = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Customer
		$scope.remove = function(customer) {
			if ( customer ) { 
				customer.$remove();

				for (var i in $scope.customers) {
					if ($scope.customers [i] === customer) {
						$scope.customers.splice(i, 1);
					}
				}
			} else {
				$scope.customer.$remove(function() {
					$location.path('customers');
				});
			}
		};

		// Update existing Customer
		$scope.update = function() {
			var customer = $scope.customer;

			customer.$update(function() {
				$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Customers
		$scope.find = function() {
			$scope.customers = Customers.query();
		};

		// Find existing Customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({ 
				customerId: $stateParams.customerId
			});
		};
	}
]);