(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('DetailController', DetailController);

    /** @ngInject */
    function DetailController(jet) {
      var vm = this;
      vm.jet = jet.data;

      activate();

      function activate() {
      }
    }
  }
)();
