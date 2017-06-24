app.controller("MainController", ['$scope','feedupdate',function($scope, feedupdate){
    feedupdate.success(function(data) {
        $scope.feed = data;
        console.log(data);
    });
}]);        