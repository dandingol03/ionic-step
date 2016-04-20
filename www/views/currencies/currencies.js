/**
 * Created by outstudio on 16/3/27.
 */
angular.module('App')
  .controller('CurrenciesController', function ($scope, Currencies) {
    $scope.currencies = Currencies;



    $scope.state = {
      reordering: false
    };
    $scope.$on('$stateChangeStart', function () {
      $scope.state.reordering = false;
    });
    /**
     * this function would be invoked then on-reorder complete
     * @param currency
     * @param fromIndex
     * @param toIndex
     */
    $scope.move = function(currency, fromIndex, toIndex) {
      $scope.currencies.splice(fromIndex, 1);
      $scope.currencies.splice(toIndex, 0, currency);
    };
  });
