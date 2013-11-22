var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope) {
	$scope.greet = function () {
		$scope.message = "Hello, " + $scope.user.name;
	};
});

app.directive('focus', function () {
	return {
		link: function (scope, element, attrs) {
			element[0].focus();
		}
	};
});
