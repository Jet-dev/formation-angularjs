(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {
        $routeProvider.when('/misc/highchart', {
            templateUrl: 'app/misc/highchart/highchart.html',
            controller: 'HighchartController',
            controllerAs: 'hcc',
            access: 'ROLE_USER',
            resolve: {
                /* @ngInject */
                suppliersChartData: function ($log, suppliersService) {
                    return suppliersService.getAllSuppliers().then(function(data) {
                        $log.debug('ChartRoute - loading data successfull : ' + data.length);
                        //prepare data by grouping by typeFrsCpta
                        var suppliersByType = _(data).groupBy('typeFrsCpta');
                        $log.debug('Computed ' + _(suppliersByType).size() + ' types');

                        //prepare data for the chart
                        $log.debug('map for chart');
                        var chartDataTmp = _(suppliersByType).map(function (suppliers, type) {
                            return {
                                name: type,
                                y: suppliers.length
                            };
                        });
                        return chartDataTmp;
                    });
                }
            }
        });
    }

})();



