/**
 * Created by lmathieu on 18/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .component('suppliersList', {
            templateUrl: 'app/suppliers/suppliersList/suppliersList.html',
            controller: 'SuppliersListController as sulc',
            bindings: {
                suppliers: '='
            }
        }
    );

})();
