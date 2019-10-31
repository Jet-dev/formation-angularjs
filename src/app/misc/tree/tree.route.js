(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {
        $routeProvider.when('/misc/tree', {
            templateUrl: 'app/misc/tree/tree.html',
            controller: 'TreeController',
            controllerAs: 'tc',
            access: 'ROLE_USER',
            resolve: {
                /* @ngInject */
                suppliersTree: function ($log, suppliersService) {
                    return suppliersService.getAllSuppliers().then(function(data) {
                        $log.debug('TreeRoute - loading data successfull : ' + data.length);

                        //prepare data by grouping by typeFrsCpta
                        var suppliersByType = _(data).groupBy('typeFrsCpta');
                        $log.debug('Computed ' + _(suppliersByType).size() + ' types');

                        //prepare data for the tree
                        $log.debug('map for tree');
                        var treeDataTmp = _(suppliersByType).map(function (suppliers, type) {//map each type to a new object
                            return {
                                title: type,
                                folder: true, //folder : exist children
                                children: _(suppliers).map(function (supplier) {//map each children to a leaf object
                                    return {
                                        title: supplier.nomFrs,
                                        data: supplier//we put the complete supplier here to be able to access it on click
                                    };
                                })
                            };
                        });
                        return treeDataTmp;
                    });
                }
            }
        });
    }

})();
