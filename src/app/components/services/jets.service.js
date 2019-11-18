(function () {
  'use strict';

  angular
    .module('formation-ng')
    .service('jetsService', jetsService);

  /** @ngInject */
  function jetsService($http) {
    this.getJets = getJets;

   function getJets() {
     return $http.get('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets');
   }
  }
})();
