(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('DetailController', DetailController);

    /** @ngInject */
    function DetailController(jet, $mdDialog, $document, jetsService) {
      var vm = this;

      vm.openDialog = openDialog;

      vm.jet = jet.data;

      activate();

      function activate() {
      }

      function openDialog(ev) {
        $mdDialog.show({
          controller: 'JetDialogController',
          controllerAs: 'jdc',
          templateUrl: 'app/components/jet-dialog/jet-dialog.html',
          parent: angular.element($document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            jet: vm.jet
          }
        })
          .then(function (jetUpdated) {
            jetsService.updateJet(jetUpdated).then(function(response) {
              // TODO toastr
            })}, function () {
          });
      }
    }
  }
)();
