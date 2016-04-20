/**
 * Created by outstudio on 16/3/27.
 */
angular.module('App')
    .controller('SearchController', function ($scope, $http) {
        $scope.model = {term: ''};
        $scope.search = function () {
            var term=$scope.model.term;
            console.log("term="+term);
            $http.get('https://maps.googleapis.com/maps/api/geocode/json',
                {params: {address: $scope.model.term}}).success(function (response) {
                    $scope.results = response.results;
                });
        };
    });