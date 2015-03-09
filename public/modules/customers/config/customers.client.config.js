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