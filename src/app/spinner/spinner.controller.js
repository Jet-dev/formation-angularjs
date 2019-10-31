(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('SpinnerController', SpinnerController);

    /* @ngInject */
    function SpinnerController ($scope, $http) {

        var vm = this;
        vm.displaySpinner;

        var isLoading = function () {
            return $http.pendingRequests.length > 0;
        };

        $scope.$watch(isLoading, function (loading) {
            vm.displaySpinner = !!loading;
        });

    }

})();
