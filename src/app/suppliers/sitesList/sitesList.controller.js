/**
 * Created by lmathieu on 18/01/2016.
 */
(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('SitesListController', SitesListController);

    /* @ngInject */
    function SitesListController ($log) {

        $log.debug('SitesListController');

        var vm = this;

    }

})();
