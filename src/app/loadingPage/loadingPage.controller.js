(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('LoadingPageController', LoadingPageController);

    /* @ngInject */
    function LoadingPageController ($scope) {

        var vm = this;

        vm.applicationLoaded = false;
        vm.requestsCounter = 0;
        vm.responsesCounter = 0;
        vm.progress = '0 %';
        vm.progressDisplayed = 0;

        $scope.$on('application_loaded', function () {
            vm.applicationLoaded = true;
        });

        $scope.$on('application_loading', function (event, counts) {
            vm.requestsCounter = counts.requests;
            vm.responsesCounter = counts.responses;

            vm.progress = (vm.responsesCounter / vm.requestsCounter * 100).toFixed(0);
            vm.progressDisplayed = vm.progress + ' %';
        });

    }

})();
