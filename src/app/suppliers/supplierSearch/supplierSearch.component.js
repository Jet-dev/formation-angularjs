/**
 * Created by lmathieu on 18/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .component('supplierSearch', {
            templateUrl: 'app/suppliers/supplierSearch/supplierSearch.html',
            controller: 'SupplierSearchController as ssc',
            bindings: {
            }
        }
    );

})();
