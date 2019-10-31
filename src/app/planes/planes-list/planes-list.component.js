(function () {
  'use strict';

  angular
    .module('formation-ng')
    .component('planesList', {
      templateUrl: 'app/planes/planes-list/planes-list.html',
      controller: 'PlanesListController',
      controllerAs: 'plc',
      bindings: {
        jets: '<'
      }
    });
}());
