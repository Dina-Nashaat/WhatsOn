app.factory('feedupdate', ['$http', function($http) { 
    
    
    var url = 'http://feeds.feedburner.com/raymondcamdensblog';
    return $http.get(url).success(function(data){return data}).error(function(err){return err});
}]);
