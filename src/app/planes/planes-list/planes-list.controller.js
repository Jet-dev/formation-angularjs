(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('PlanesListController', PlanesListController);

    /** @ngInject */
    function PlanesListController(jetsService, $mdDialog, $document, $location, toastr) {
      var vm = this;
      vm.createJet = createJet;
      vm.search = {};

      activate();

      function activate() {
      }

      function createJet() {
        $mdDialog.show({
          controller: 'JetDialogController',
          controllerAs: 'jdc',
          templateUrl: 'app/components/jet-dialog/jet-dialog.html',
          parent: angular.element($document.body),
          clickOutsideToClose: true,
          locals: {
            jet: {}
          }
        })
          .then(function (jetToCreate) {
            jetsService.createJet(jetToCreate).then(function(response) {
              toastr.success('Le jet ' + jetToCreate.name + ' a été ajouté !', 'Ajout');
              $location.path('/' + response.data.id);
            })}, function () {
          });
      }
    }
  }
)();
