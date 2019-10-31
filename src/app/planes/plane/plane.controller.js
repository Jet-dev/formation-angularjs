(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('PlaneController', PlaneController);

    /** @ngInject */
    function PlaneController() {
      var vm = this;

      vm.toto = 'toto';
      activate();

      function activate() {
      }
    }
  }
)();
