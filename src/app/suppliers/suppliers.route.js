(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {
        $routeProvider.when('/suppliers', {
            templateUrl: 'app/suppliers/suppliers.html',
            controller: 'SuppliersController',
            controllerAs: 'sc',
            access: 'ROLE_USER',
            resolve: {
                /* @ngInject */
                suppliers: function (suppliersService) {
                       return suppliersService.getSuppliers('MARCHANDISES');
                },
                /* @ngInject */
                sites: function ($log, suppliersService) {
                    return suppliersService.getSuppliers('MARCHANDISES').then(function(data) {
                        var sitesTmp = [];
                        _(data).forEach(function(supplier) {
                            _(supplier.sites).forEach(function(site){
                                sitesTmp.push(site);
                            });
                        });
                        //limit site list to avoid displaying a lot of them
                        if(sitesTmp.length > 25){
                            sitesTmp = sitesTmp.slice(0, 25);
                        }
                        $log.debug('Returning ' + _(sitesTmp).size() + ' site(s)');
                        return sitesTmp;
                    });
                }
            }
        });
    }

})();
