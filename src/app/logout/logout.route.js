(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {

        $routeProvider.when('/logout', {
            templateUrl: 'app/logout/logout.html',
            controller: function($rootScope, $scope, $http, kAuthentification, kNotification){
                //logout : purge security contect
                kAuthentification.logout();

                //build login URL to put on the login button
                $scope.loginUrl = kAuthentification.buildLoginUrl() + '&skipKerberos=true';

                //add a message in case of timeout
                if($rootScope.timeout === true){
                    kNotification.error('Your session timed out, please login again');
                }
            }
        });
    }

})();
