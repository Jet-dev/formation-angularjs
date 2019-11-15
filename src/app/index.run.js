(function() {
  'use strict';

  angular
    .module('formation-ng')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
