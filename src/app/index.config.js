(function() {
  'use strict';

  angular
    .module('formation-ng')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $translateProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/messages_',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('fr');
  }

})();
