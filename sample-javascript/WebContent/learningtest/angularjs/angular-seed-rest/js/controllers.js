'use strict';

angular.module('myApp.controllers', [])
	.controller('MyCtrl1', ['$scope', 'AngularIssues', function ($scope, AngularIssues) {
		$scope.myData = {
			currentIssue: null,
			issueList: [],
			issueListState: 'open',
			issueListSort: 'created',
			issueListDirection: 'desc',
			issueListPage: 1
		};
		
		$scope.setIssueList = function () {
			AngularIssues.query({
				state: $scope.myData.issueListState,
				sort: $scope.myData.issueListSort,
				direction: $scope.myData.issueListDirection
			}, function (data) {
				console.log(data);
				
				$scope.myData.issueList = data;
			});
		};
		
		$scope.setIssueList();
	}]);