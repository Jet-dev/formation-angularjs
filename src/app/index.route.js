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
        controllerAs: 'psc'
      })
      .when('/:id', {
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailController',
        controllerAs: 'dc',
        resolve: {
          jet: function($route, jetsService) {
            return jetsService.getJet($route.current.params.id);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
