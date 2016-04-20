/**
 * Created by outstudio on 16/3/28.
 */
angular.module('App')
    .controller('WeatherController', function ($scope, $http, $stateParams,
                                               Settings,$ionicActionSheet,Locations) {
        $scope.params = $stateParams;
        $scope.settings = Settings;

        $http.get('/api/forecast/' + $stateParams.lat + ',' + $stateParams.lng,
            {params: {units: Settings.units}}).success(function (forecast) {
                $scope.forecast = forecast;
            });

        var barHeight = document.getElementsByTagName
        ('ion-header-bar')[0].clientHeight;
        $scope.getWidth = function () {
            return window.innerWidth + 'px';
        };
        $scope.getTotalHeight = function () {
            return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
        };
        $scope.getHeight = function () {
            return parseInt(window.innerHeight - barHeight) + 'px';
        };

        //展示modal
        $scope.showModal = function () {
            if ($scope.modal) {
                $scope.modal.show();
            } else {
                $ionicModal.fromTemplateUrl('views/weather/modal-chart.html', {
                    scope: $scope
                }).then(function (modal) {//the parameter modal means a controller object
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
        };
        $scope.hideModal = function () {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });



        //展示actionSheet
        $scope.showOptions = function () {
            var sheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Toggle Favorite'},
                    {text: 'Set as Primary'},
                    {text: 'Sunrise Sunset Chart'}
                ],
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index === 0) {
                        Locations.toggle($stateParams);
                    }
                    if (index === 1) {
                        Locations.primary($stateParams);
                    }
                    if (index === 2) {
                        $scope.showModal();
                    }
                    return true;
                }
            });
        };



    });