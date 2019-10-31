(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .component('spinner', {
            templateUrl: 'app/spinner/spinner.html',
            controller: 'SpinnerController as spinc',
            bindings: {
            }
        }
    );

})();
