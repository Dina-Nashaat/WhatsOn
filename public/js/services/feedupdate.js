app.factory('feedupdate', ['$http', function ($http) {

    return $http.get('/feedTitles').success(function (response) {return response;})
                                   .error(function(err){return err;});
}]);
