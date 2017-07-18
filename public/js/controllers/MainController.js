app.controller("MainController", ['$scope','feedupdate',function($scope, feedupdate){
    feedupdate.success(function(data) {
        $scope.feeds = data;
        console.log(data);
    })     
}]);
