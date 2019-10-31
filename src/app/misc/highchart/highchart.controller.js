(function() {
    'use strict';

    /*
     * HighchartCtrl : controller for the chart page
     * @author lmathieu
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('HighchartController', HighchartController);

    /* @ngInject */
    function HighchartController (suppliersChartData) {

        var vm = this;

        vm.suppliersChartData = suppliersChartData;

        ////////////////////////////////////////////////

        activate();

        function activate(){

            //compute display of the chart
            $('#bi').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>',
                    changeDecimals: 2
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                            }
                        }
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: 'Number of suppliers',
                        data: vm.suppliersChartData //here are the data
                    }
                ]
            });

            $('#loading').hide();
        }

    }

})();
