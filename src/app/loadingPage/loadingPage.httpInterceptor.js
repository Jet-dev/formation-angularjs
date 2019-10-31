(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(addInterceptor);

    /* @ngInject */
    function addInterceptor ($httpProvider) {
        $httpProvider.interceptors.push(applicationLoadedHttpInterceptor);
    }

    /* @ngInject */
    function applicationLoadedHttpInterceptor ($q, $rootScope, $timeout) {

        var applicationLoaded = false,
            requestsCounter = 0,
            responsesCounter = 0,
            applicationSeemsToBeLoaded;

        return {

            request: function(config) {

                if (!applicationLoaded) {

                    requestsCounter++;

                    if (applicationSeemsToBeLoaded) {
                        $timeout.cancel(applicationSeemsToBeLoaded);
                    }

                    $rootScope.$broadcast('application_loading', {
                        requests: requestsCounter,
                        responses: responsesCounter
                    });

                }

                return config || $q.when(config);
            },

            requestError: function (rejection) {

                if (!applicationLoaded) {

                    requestsCounter++;

                    if (applicationSeemsToBeLoaded) {
                        $timeout.cancel(applicationSeemsToBeLoaded);
                    }

                    $rootScope.$broadcast('application_loading', {
                        requests: requestsCounter,
                        responses: responsesCounter
                    });

                }

                return $q.reject(rejection);

            },

            response: function(response) {

                if (!applicationLoaded) {

                    responsesCounter++;

                    $rootScope.$broadcast('application_loading', {
                        requests: requestsCounter,
                        responses: responsesCounter
                    });

                    if (requestsCounter - responsesCounter < 1) {
                        applicationSeemsToBeLoaded = $timeout(function () {
                            $rootScope.$broadcast('application_loaded');
                            applicationLoaded = true;
                        }, 200);
                    }

                }

                return response || $q.when(response);
            },

            responseError: function (rejection) {

                if (!applicationLoaded) {

                    responsesCounter++;

                    $rootScope.$broadcast('application_loading', {
                        requests: requestsCounter,
                        responses: responsesCounter
                    });

                    if (requestsCounter - responsesCounter < 1) {
                        applicationSeemsToBeLoaded = $timeout(function () {
                            $rootScope.$broadcast('application_loaded');
                            applicationLoaded = true;
                        }, 200);
                    }

                }

                return $q.reject(rejection);

            }

        };

    }

})();
