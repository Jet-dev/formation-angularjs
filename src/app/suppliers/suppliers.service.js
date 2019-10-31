(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .service('suppliersService', suppliersService);

    /* @ngInject */
    function suppliersService($http, globalConfig) {

        this.getSuppliers = getSuppliers;
        this.getAllSuppliers = getAllSuppliers;

        ////////////////////////////

        function getSuppliers(type) {
            return $http.get(globalConfig.rootUrl + '/v1/suppliers', {params: {type: type}}).then(function (response) {
                return response.data;
            });
        }

        function getAllSuppliers() {
            return $http.get(globalConfig.rootUrl + '/v1/suppliers').then(function (response) {
                return response.data;
            });
        }

    }

})();
