(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('editCountryModalController', editCountryModalController);

    /* @ngInject */
    function editCountryModalController($uibModalInstance, country) {

        var vm = this;

        vm.country = country;
        vm.save = save;

        ////////////////////////////////////////////////

        function save () {
            $uibModalInstance.close(vm.country);
        }

    }

})();
