angular.module('App')
  
	.controller('RatesController', function ($scope, $http, $ionicPopover, Currencies) {

	$scope.currencies = Currencies;

    /**
     * 初始化Popover加载的模板
     */
    $ionicPopover.fromTemplateUrl('views/rates/help-popover.html', {
      scope: $scope,
    }).then(function (popover) {
    	//when popover component has been initialed
      $scope.popover = popover;
    });

    $scope.openHelp = function($event) {
      $scope.popover.show($event);
    };
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    /**
     * rates.html 从后台拉取数据
     */
    $scope.load = function () {
      $http.get('https://api.bitcoinaverage.com/ticker/all').success(function (tickers) {
        angular.forEach($scope.currencies, function (currency) {

            currency.ticker = tickers[currency.code];
            if(currency.ticker!==null&&currency.ticker!==undefined)
            currency.ticker.timestamp = new Date(currency.ticker.timestamp);

        });
      }).finally(function () {
        //tell the ion-refresher component to hide
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.load();
  });
