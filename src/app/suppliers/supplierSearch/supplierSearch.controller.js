/**
 * Created by lmathieu on 18/01/2016.
 */
(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('SupplierSearchController', SupplierSearchController);

    /* @ngInject */
    function SupplierSearchController ($log) {

        $log.debug('SupplierSearchController');

        var vm = this;

        vm.typeFrs = ['PUBLICITE', 'TRANSITAIRES', 'PRESTATAIRE', 'REAL TECHNIQUE', 'MARCHANDISES', 'TRANSPORTEUR', 'APPRO', 'BIENS MOBILIERS', 'PREST DE SERVICE'];
        vm.selectedType = 'MARCHANDISES';

        vm.suppliers = [];

        //functions
        vm.searchSuppliers = searchSuppliers;

        ////////////////////////////////////////////////

        // Retrieve Suppliers by criteria
        function searchSuppliers () {
            // non implemente
        };

    }

})();
