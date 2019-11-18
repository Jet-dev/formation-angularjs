(function () {
  'use strict';

  angular
    .module('formation-ng')
    .controller('PlanesController', PlanesController);

  /** @ngInject */
  function PlanesController(jetsService) {
    var vm = this;
    vm.jets = [];

    activate();

    function activate() {
      jetsService.getJets().then(function (jets) {
        vm.jets = jets.data;
      });
    }

  }
})();
