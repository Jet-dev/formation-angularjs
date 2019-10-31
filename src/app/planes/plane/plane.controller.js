(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('PlaneController', PlaneController);

    /** @ngInject */
    function PlaneController($location) {
      var vm = this;

      vm.goToDetail = goToDetail;

      activate();

      function activate() {
      }

      function goToDetail() {
        $location.path('/' + vm.jet.id);
      }
    }
  }
)();
