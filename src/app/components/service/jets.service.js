(function() {
  'use strict';

  angular
      .module('formation-ng')
      .service('jetsService', jetsService);

  /** @ngInject */
  function jetsService($http) {
    this.getJets = getJets;
    this.getJet = getJet;
    this.updateJet = updateJet;
    this.createJet = createJet;
    this.deleteJet = deleteJet;

    function getJets() {
      return $http.get('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets');
    }

    function getJet(id) {
      return $http.get('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets/' + id);
    }

    function updateJet(jet) {
      return $http.put('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets/' + jet.id, jet);
    }

    function createJet(jet) {
      return $http.post('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets/', jet);
    }

    function deleteJet(id) {
      return $http.delete('https://us-central1-formation-71217.cloudfunctions.net/api/v1/jets/' + id);
    }
  }

})();
