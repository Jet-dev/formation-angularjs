/**
 * Created by lmathieu on 18/01/2016.
 */
(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('SuppliersListController', SuppliersListController);

    /* @ngInject */
    function SuppliersListController ($log) {

        $log.debug('SuppliersListController');

        var vm = this;

    }

})();
