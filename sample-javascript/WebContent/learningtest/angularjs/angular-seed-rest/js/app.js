'use strict';

angular.module('myApp', ['ngRoute', 'myApp.services', 'myApp.controllers'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
	}]);
