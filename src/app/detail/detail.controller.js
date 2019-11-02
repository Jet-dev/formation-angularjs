(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('DetailController', DetailController);

    /** @ngInject */
    function DetailController(jet, $mdDialog, $document, jetsService, $location) {
      var vm = this;

      vm.openDialog = openDialog;
      vm.deleteJet = deleteJet;

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

      function deleteJet (ev) {
        var confirm = $mdDialog.confirm()
          .title('Suppression')
          .textContent('Etes-vous sûr de vouloir supprimer l\'avion '+ vm.jet.name + ' ?' )
          .targetEvent(ev)
          .ok('Oui')
          .cancel('Non');

        $mdDialog.show(confirm).then(function() {
          jetsService.deleteJet(vm.jet.id).then(function (response) {
            // TODO toastr
            $location.path('/');
          });
        }, function() {});
      };
    }
  }
)();
