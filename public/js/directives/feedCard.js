app.directive('feedCard', function(){
    return {
        restrict    : 'E',
        scope       : {
            info: '='
        },
        templateUrl : 'js/directives/feedCard.html'
    };
});