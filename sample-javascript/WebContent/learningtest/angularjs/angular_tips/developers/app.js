var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope) {
	$scope.developers = [
		{
			name: "Jesus", country: "Spain"
		},
		{
			name: "Dave", country: "Canada"
		},
		{
			name: "Wesley", country: "USA"
		},
		{
			name: "Krzysztof", country: "Poland"
		}
	];
});