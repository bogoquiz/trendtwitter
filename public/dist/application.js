'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'trend-twitter2';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app 
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('customers', ['ngTable']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		var baseURL='http://lorempixel.com/960/300/';
  	$scope.setInterval=5000;

  	$scope.slides = [
   	{
         title:'trend media beta',
         image:baseURL+'city/',
         text:'Want more people to see your tweets?'
   	},
   	{
         title:'twitter',
         image:baseURL+'abstract/',
         text:'¡tweets seen by the trending topic country you choose!'
   	},
   	
    ]; 	
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            //ioSocket: io.connect('http://localhost:3000')
            ioSocket: io.connect('http://trendmedia.herokuapp.com')
        });
    }
]);
'use strict';


// Configuring the Articles module
angular.module('customers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Customers', 'customers', 'dropdown', '/customers(/create)?');
		Menus.addSubMenuItem('topbar', 'customers', 'Use Trendmedia', 'customers');
		//Menus.addSubMenuItem('topbar', 'customers', 'New Customer', 'customers/create');
	}
]);


//angular.module('customers', 'ngTable');
'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('listCustomers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/list-customers.client.view.html'
		}).
		state('createCustomer', {
			url: '/customers/create',
			templateUrl: 'modules/customers/views/create-customer.client.view.html'
		}).
		state('viewCustomer', {
			url: '/customers/:customerId',
			templateUrl: 'modules/customers/views/view-customer.client.view.html'
		}).
		state('editCustomer', {
			url: '/customers/:customerId/edit',
			templateUrl: 'modules/customers/views/edit-customer.client.view.html'
		});
	}
]);
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

	$scope.Bucle = function(){
		Socket.emit('bucle', Authentication);
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

	$scope.onClick3 = function(data,selectedOpt){
		
		
		var mensagge =  [data,selectedOpt]; //{data,selectedOpt};
		//mensagge.push({data,selectedOpt});
		//console.log(mensagge);
		Socket.emit('sendBucle',mensagge); 
		
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
    //console.log($scope.options);
	//$scope.selectedOption = $scope.options[1];
	$scope.selectedOption = 'Select ';
	

	});

	Socket.on('users.login', function(users) {
    
	$scope.users = users;

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

    /*$scope.changedUser=function(user){

    	console.log(user);
    };*/
    
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
'use strict';

//Customers service used to communicate Customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', { customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);