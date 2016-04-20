/**
 * Created by outstudio on 16/3/28.
 */
angular.module('App')
    .controller('SettingsController', function ($scope, Settings, Locations) {
        $scope.settings = Settings;
        $scope.locations = Locations.data;
        $scope.canDelete = false;
        $scope.remove = function (index) {
            Locations.toggle(Locations.data[index]);
        };
    });