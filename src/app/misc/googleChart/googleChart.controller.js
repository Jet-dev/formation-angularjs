(function () {
    'use strict';

    /**
     * Created by lmathieu on 29/10/2014.
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('KiaGoogleChartController', KiaGoogleChartController);

    /* @ngInject */
    function KiaGoogleChartController($log, suppliersChartData, suppliersByType, countriesChartData, magByCountry) {

        var vm = this;

        vm.pieChart;
        vm.columnChart;
        vm.barChart;
        vm.steppedChart;
        vm.treemap;
        vm.gauge;
        vm.map;
        vm.geochart;
        vm.linechart;
        vm.areachart;

        //https://google-developers.appspot.com/chart/interactive/docs/gallery

        ////////////////////////////////////////////////

        activate();

        function activate() {

            //pie chart exemple
            vm.pieChart = {
                type: 'PieChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'typefrs', label: 'Type Frs', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: suppliersChartData
                },
                options: {
                    title: 'Frs by type',
                    width: 600,
                    height: 400
                }
            };

            //column chart exemple
            vm.columnChart = {
                type: 'ColumnChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'typefrs', label: 'Type Frs', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: suppliersChartData
                },
                options: {
                    title: 'Frs by type',
                    width: 600,
                    height: 400
                }
            };

            //bar chart exemple
            vm.barChart = {
                type: 'BarChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'typefrs', label: 'Type Frs', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: suppliersChartData
                },
                options: {
                    title: 'Frs by type',
                    width: 600,
                    height: 400
                }
            };

            //bar chart exemple
            //TODO compute an other value like nbActive/nbInactive
            vm.steppedChart = {
                type: 'SteppedAreaChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'typefrs', label: 'Type Frs', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: suppliersChartData
                },
                options: {
                    title: 'Frs by type',
                    width: 600,
                    height: 400
                }
            };

            //treemap chart exemple
            //we need to define a different data source because it needs to include a parent : we made a fake one!
            var treemapData = [];
            treemapData.push({
                c: [
                    {v: 'Global'},
                    {v: null},
                    {v: 0}
                ]
            });
            var supplierForTreeMap = _(suppliersByType).map(function (suppliers, type) {
                //map to the goole chart api JSON format
                return {
                    c: [
                        {v: type},
                        {v: 'Global'},
                        {v: suppliers.length}
                    ]
                };
            });
            _(supplierForTreeMap).forEach(function (item) {
                treemapData.push(item);
            });
            vm.treemap = {
                type: 'TreeMap',
                displayed: true,
                data: {
                    cols: [
                        {id: 'typefrs', label: 'Type Frs', type: 'string'},
                        {id: 'parent', label: 'Parent', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: treemapData
                },
                options: {
                    title: 'Frs by type',
                    width: 600,
                    height: 400
                }
            };

            $('#loading').hide();

            //gauge exemple :
            //TODO find why label is not displayed correctly
            vm.gauge = {
                type: 'Gauge',
                displayed: true,
                data: {
                    cols: [
                        {id: 'country', label: 'country', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: countriesChartData
                },
                options: {
                    width: 600,
                    height: 400,
                    max: 500,
                    redFrom: 300, redTo: 400,
                    yellowFrom: 100, yellowTo: 300
                }
            };

            //geochart exemple
            vm.geochart = {
                type: 'GeoChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'country', label: 'Country', type: 'string'},
                        {id: 'number', label: 'Number', type: 'number'}
                    ],
                    rows: countriesChartData
                },
                options: {
                    region: '150'
                }
            };

            //map exemple
            var mapData = _(magByCountry).map(function (etabs, country) {
                //map to the goole chart api JSON format
                return {
                    c: [
                        {v: country},
                        {v: country + ' : ' + etabs.length}
                    ]
                };
            });
            $log.info('map data : ' + mapData);
            vm.map = {
                type: 'Map',
                displayed: true,
                data: {
                    cols: [
                        {id: 'country', label: 'Country', type: 'string'},
                        {id: 'label', label: 'Label', type: 'string'}
                    ],
                    rows: mapData
                },
                options: {}
            };

            //play with series
            var chartSeries = _(magByCountry).map(function (etabs, country) {
                var etabByType = _(etabs).groupBy('typeContrat');//should be K, A, F
                var nbSuccursal = etabByType.K ? etabByType.K.length : 0;
                var nbAffilie = etabByType.A ? etabByType.A.length : 0;
                var nbFranchise = etabByType.F ? etabByType.F.length : 0;

                //map to the goole chart api JSON format
                return {
                    c: [
                        {v: country},
                        {v: nbSuccursal},
                        {v: nbAffilie},
                        {v: nbFranchise}
                    ]
                };
            });

            //linechart
            vm.linechart = {
                type: 'LineChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'country', label: 'Country', type: 'string'},
                        {id: 'succursal', label: 'Succursal', type: 'number'},
                        {id: 'affilie', label: 'Affilie', type: 'number'},
                        {id: 'Franchise', label: 'franchise', type: 'number'}
                    ],
                    rows: chartSeries
                },
                options: {
                    width: 600,
                    height: 400
                }
            };

            //areachart
            vm.areachart = {
                type: 'AreaChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'country', label: 'Country', type: 'string'},
                        {id: 'succursal', label: 'Succursal', type: 'number'},
                        {id: 'affilie', label: 'Affilie', type: 'number'},
                        {id: 'Franchise', label: 'franchise', type: 'number'}
                    ],
                    rows: chartSeries
                },
                options: {
                    width: 600,
                    height: 400
                }
            };

            //TODO find a two series exemple to show the following chart :
            //https://google-developers.appspot.com/chart/interactive/docs/gallery/scatterchart
            //https://google-developers.appspot.com/chart/interactive/docs/gallery/bubblechart
        }
    }


})();

//calendar seems to be not possible (version 1.1 not supported?) : https://google-developers.appspot.com/chart/interactive/docs/gallery/calendar
//combo chart enable to mix chart type in a single chart (line + bar for exemple) : https://google-developers.appspot.com/chart/interactive/docs/gallery/combochart
//really statistics based chart to enable dispalying a serie and it's interval (for exemple of convidence) : https://google-developers.appspot.com/chart/interactive/docs/gallery/intervals
//statistics based chart to define a trends in a serie of data : https://google-developers.appspot.com/chart/interactive/docs/gallery/trendlines
//really complex chart : https://google-developers.appspot.com/chart/interactive/docs/gallery/annotationchart
//candlestick : humm complex to use : https://google-developers.appspot.com/chart/interactive/docs/gallery/candlestickchart
//wordtree : duno what we can do with this : https://google-developers.appspot.com/chart/interactive/docs/gallery/wordtree
//timeline : cool if you need to display time based event : https://google-developers.appspot.com/chart/interactive/docs/gallery/timeline
//histogram : https://google-developers.appspot.com/chart/interactive/docs/gallery/histogram
//orgchart : may be cool ... or not ... : https://google-developers.appspot.com/chart/interactive/docs/gallery/orgchart
