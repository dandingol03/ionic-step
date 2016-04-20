/**
 * Created by outstudio on 16/3/27.
 */
angular.module('App', ['ionic','highcharts-ng'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: '/tabs',
        templateUrl: 'views/tabs/tabs.html'
      })
      .state('tabs.rates', {//nested state in state tabs
        url: '/rates',
        views:{//views在匹配多个view的情况菜才有用,如url:'/{contactId:[0]}',则根据contactId的数据情况,view的匹配也会发生变化
          'rates-tab': {
            templateUrl: 'views/rates/rates.html',
            controller:"RatesController"
          }
        }
      })
      .state('tabs.detail',{
        url: '/detail/:currency',
        views: {
          'rates-tab': {
            templateUrl: 'views/detail/detail.html',
            controller: 'DetailController'
          }
        }
      })
      .state('tabs.history', {//nested state in state tabs
        url: '/history?currency',
        views: {
          'history-tab': {
            templateUrl: 'views/history/history.html',
            controller:'HistoryController'
          }
        }
      })
      .state('tabs.currencies', {//nested state in state tabs
        url: '/currencies',
        views: {
          'currencies-tab': {
            templateUrl: 'views/currencies/currencies.html',
            controller:'CurrenciesController'
          }
        }
      });
    $urlRouterProvider.otherwise('/tabs');
  })

  .factory('Currencies', function () {
    return [
      { code: 'AUD', text: 'Australian Dollar', selected: true },
      { code: 'BRL', text: 'Brazilian Real', selected: false },
      { code: 'CAD', text: 'Canadian Dollar', selected: true },
      { code: 'CHF', text: 'Swiss Franc', selected: false },
      { code: 'CNY', text: 'Chinese Yuan', selected: true},
      { code: 'EUR', text: 'Euro', selected: true },
      { code: 'GBP', text: 'British Pound Sterling', selected: true },
      { code: 'IDR', text: 'Indonesian Rupiah', selected: false },
      { code: 'ILS', text: 'Israeli New Sheqel', selected: false },
      { code: 'MXN', text: 'Mexican Peso', selected: true },
      { code: 'NOK', text: 'Norwegian Krone', selected: false },
      { code: 'NZD', text: 'New Zealand Dollar', selected: false },
      { code: 'PLN', text: 'Polish Zloty', selected: false },
      { code: 'RON', text: 'Romanian Leu', selected: false },
      { code: 'RUB', text: 'Russian Ruble', selected: true },
      { code: 'SEK', text: 'Swedish Krona', selected: false },
      { code: 'SGD', text: 'Singapore Dollar', selected: false },
      { code: 'USD', text: 'United States Dollar', selected: true },
      { code: 'ZAR', text: 'South African Rand', selected: false }
    ];
  });
