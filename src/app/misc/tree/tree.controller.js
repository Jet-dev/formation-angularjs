(function() {
    'use strict';

    /**
     * TreeController : controlleur for an exemple usage of a tree (with fancytree)
     * Created by lmathieu on 29/10/2014.
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('TreeController', TreeController);

    /* @ngInject */
    function TreeController ($scope, $log, suppliersTree) {

        var vm = this;

        vm.suppliersTree = suppliersTree;
        vm.currentSupplier = null;

        ////////////////////////////////////////////////

        activate();

        function activate(){

            //compute display of tree
            $('#tree').fancytree({
                source: suppliersTree, //here are the data
                activate: function (event, data) { //here are the handler for the click
                    $log.debug('click on : ' + data.node.title);
                    $log.debug('data is : ' + data.node.data.codeFrs);
                    vm.currentSupplier = data.node.data;
                    $('#supplierInfo').show();
                    $scope.$apply();//don't forget to call $apply() on the scope in order to refresh the template
                }
            });

            $('#loading').hide();
        }

    }

})();

