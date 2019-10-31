(function() {
    'use strict';

    /*
     * SuppliersController.js : controller for the Suppliers page
     * @author lmathieu
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('SuppliersController', SuppliersController);

    /* @ngInject */
    function SuppliersController($log, suppliers, sites) {

        $log.debug('SuppliersController');

        var vm = this;

        //from resolve
        vm.suppliers = suppliers;
        vm.sites = sites;

    }

})();
