(function() {
  'use strict';

  angular
    .module('formation-ng')
    .component('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var conponent = {
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return conponent;

    /** @ngInject */
    function NavbarController(moment) {
      var vm = this;

      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
