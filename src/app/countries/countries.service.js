(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .service('countriesService', countriesService);

    /* @ngInject */
    function countriesService($http, globalConfig) {

        this.getCountries = getCountries;
        this.createCountry = createCountry;
        this.updateCountry = updateCountry;
        this.removeCountry = removeCountry;

        ////////////////////////////

        function getCountries() {
            return $http.get(globalConfig.rootUrl + '/v1/countries').then(function (response) {
                return response.data;
            });
        }

        function createCountry(country) {
            return $http.post(globalConfig.rootUrl + '/v1/countries', country);
        }

        function updateCountry(country) {
            return $http.put(globalConfig.rootUrl + '/v1/countries/' + country.code, country);
        }

        function removeCountry(country) {
            return $http.delete(globalConfig.rootUrl + '/v1/countries/' + country.code);
        }

    }

})();
