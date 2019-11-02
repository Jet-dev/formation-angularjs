(function () {
  'use strict';

  angular
    .module('formation-ng')
    .controller('JetDialogController', JetDialogController);

  /** @ngInject */
  function JetDialogController($mdDialog, jet) {
    var vm = this;

    vm.save = save;
    vm.cancel = cancel;
    vm.answer = anwser;

    vm.jet = jet;

    function save() {
      $mdDialog.hide(vm.jet);
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function anwser(answer) {
      $mdDialog.hide(answer);
    }
  }
})();
