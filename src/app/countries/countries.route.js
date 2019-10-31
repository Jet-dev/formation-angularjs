(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {
        $routeProvider.when('/countries', {
            templateUrl: 'app/countries/countries.html',
            controller: 'CountriesController',
            controllerAs: 'cc',
            access: 'ROLE_USER',
            resolve: {
                /* @ngInject */
                countries: function (countriesService) {
                    return countriesService.getCountries();
                }
            }
        });
    }

})();
