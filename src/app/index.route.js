(function() {
  'use strict';

  angular
    .module('formation-ng')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/planes/planes.html',
        controller: 'PlanesController',
        controllerAs: 'pc'
      })
      .when('/:id', {
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailController',
        controllerAs: 'dc'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
