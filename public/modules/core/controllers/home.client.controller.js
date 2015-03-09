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