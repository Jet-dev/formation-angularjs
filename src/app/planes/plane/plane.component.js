(function () {
  'use strict';

  angular
    .module('formation-ng')
    .component('plane', {
      templateUrl: 'app/planes/plane/plane.html',
      controller: 'PlaneController',
      controllerAs: 'pc',
      bindings: {
        jet: '<'
      }
    });
}());
