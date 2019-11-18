(function () {
  'use strict';

  angular
    .module('formation-ng')
    .component('planesList', {
      templateUrl: 'app/planes/planes-list/planes-list.html',
      controller: 'PlanesListController as plc',
      bindings: {
        jets: '<'
      }
    });
}());
