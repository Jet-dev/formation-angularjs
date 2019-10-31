(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {
        $routeProvider.when('/misc/googlechart', {
            templateUrl: 'app/misc/googleChart/googleChart.html',
            controller: 'KiaGoogleChartController',
            controllerAs: 'kgcc',
            access: 'ROLE_USER',
            resolve: {
                /* @ngInject */
                suppliersByType: function ($log, suppliersService) {
                    return suppliersService.getAllSuppliers().then(function(data) {
                        $log.debug('ChartRoute - loading data successfull : ' + data.length);
                        //prepare data by grouping by typeFrsCpta
                        var suppliersByType = _(data).groupBy('typeFrsCpta');
                        return suppliersByType;
                    });
                },
                /* @ngInject */
                suppliersChartData: function ($log, suppliersService) {
                    return suppliersService.getAllSuppliers().then(function(data) {
                        $log.debug('ChartRoute - loading data successfull : ' + data.length);
                        //prepare data by grouping by typeFrsCpta
                        var tmp = _(data).groupBy('typeFrsCpta');
                        $log.debug('Computed ' + _(tmp).size() + ' types');

                        //prepare data for the chart
                        $log.debug('map for chart');
                        var chartDataTmp = _(tmp).map(function (suppliers, type) {
                            return {
                                typefrs: type,
                                number: suppliers.length
                            };
                        });
                        return chartDataTmp;
                    });
                },
                /* @ngInject */
                magByCountry: function ($log, countriesService) {
                    return countriesService.getCountries().then(function(data) {
                        $log.info('load etablishements : ' + data.length);
                        //var mag =_(data).filter(function(item){
                        //    return item.typeEtab === 'M' && item.flagOuverture === "1";
                        //});
                        //$log.info('Defining mags : ' + mag.length);
                        //var tmp = _(mag).groupBy('codePays');
                        var tmp = _(data).groupBy('codePays');
                        return tmp;
                    });
                },
                /* @ngInject */
                countriesChartData: function ($log, countriesService) {
                   return countriesService.getCountries().then(function(data) {
                        $log.info('load etablishements : ' + data.length);
                        //var mag =_(data).filter(function(item){
                        //    return item.typeEtab === 'M' && item.flagOuverture === "1";
                        //});
                        //$log.info('Defining mags : ' + mag.length);

                        //var tmp = _(mag).groupBy('codePays');
                        var tmp = _(data).groupBy('codePays');

                        var chartDataTmp = _(tmp).map(function (etabs, country) {
                            //map to the goole chart api JSON format
                            return {c: [
                                {v: country},
                                {v: etabs.length}
                            ]};
                        });
                        return chartDataTmp;
                    });
                }
            }
        });
    }

})();


