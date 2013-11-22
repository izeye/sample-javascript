var app = angular.module('app', []);

app.factory('UserInformation', function () {
	var user = {
		name: "Angular.js"
	};
	
	return user;
});

app.controller('MainCtrl', function ($scope, UserInformation) {
	$scope.user = UserInformation;
});

app.controller('SecondCtrl', function ($scope, UserInformation) {
	$scope.user = UserInformation;
});
