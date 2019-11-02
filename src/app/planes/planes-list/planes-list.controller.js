(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('PlanesListController', PlanesListController);

    /** @ngInject */
    function PlanesListController(jetsService, $mdDialog, $document, $location) {
      var vm = this;
      vm.createJet = createJet;

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
              // TODO toastr
              $location.path('/' + response.data.id);
            })}, function () {
          });
      }
    }
  }
)();
