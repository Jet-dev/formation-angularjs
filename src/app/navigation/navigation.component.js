(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .component('navigation', {
            templateUrl: 'app/navigation/navigation.html',
            controller: 'NavigationController as nc',
            bindings: {
            }
        }
    );

})();
