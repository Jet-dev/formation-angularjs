(function() {
    'use strict';

    angular.module('templates', []);

    angular.module('application-blanche-angularjs-ng', [
        'templates',
        'properties',
        'ngRoute',
        'ngResource',
        'ui.date',
        'ui.bootstrap',
        'pascalprecht.translate',
        'kiabi',
        'kiaPaginator',
        'kiaSorter',
        'kiaAuthorize',
        'kiaDateParser',
        'googlechart',
        'ngMaterial'
    ]);

})();
