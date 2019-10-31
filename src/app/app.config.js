(function() {
    'use strict';

    /*
     * config.js : config script
     * All configurations needs to be put in this file in a separate module for testing purpose
     * @author lmathieu
     */
    //configure the translation service
    angular.module('application-blanche-angularjs-ng').config(function ($translateProvider) {

        //this will load asynchronously the needed languages
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/messages_',
            suffix: '.json'
        });

        //try to find out preferred language and configure fallback to 'en'
        $translateProvider.registerAvailableLanguageKeys(
            ['fr', 'en'],
            {
                'en*': 'en',
                'fr*': 'fr',
                '*': 'en' // must be last!
            }
        );

        $translateProvider.fallbackLanguage('en');
        $translateProvider.determinePreferredLanguage();

        $translateProvider.useSanitizeValueStrategy('escapeParameters');

    });


    //add http inteception for automatically log request/response
    //TODO add language in a header
    angular.module('application-blanche-angularjs-ng').config(function ($provide, $httpProvider) {
        $provide.factory('httpLogInterceptor', function ($q, $log) {
            return {
                request: function (config) {
                    $log.debug('Call ' + config.method + ':' + config.url);
                    return config || $q.when(config);
                },
                response: function (response) {
                    var message = 'Response from ' + response.config.method + ':' + response.config.url + ' -> ' + response.status;
                    if (response.statusText !== undefined) {
                        message += ':' + response.statusText;
                    }
                    $log.debug(message);
                    return response || $q.when(response);
                }
            };
        });

        $httpProvider.interceptors.push('httpLogInterceptor');
    });

    //configure log level
    angular.module('application-blanche-angularjs-ng').config(function ($logProvider, isDebug) {
        if (!isDebug) {
            $logProvider.debugEnabled(false);
        }
    });

    //configure ui bootstrap datepicker
    angular.module('application-blanche-angularjs-ng').config(function (uibDatepickerConfig, uibDatepickerPopupConfig) {
        uibDatepickerConfig.startingDay = 1;
        uibDatepickerConfig.showWeeks = false;

        uibDatepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
        uibDatepickerPopupConfig.showButtonBar = false;
        uibDatepickerPopupConfig.appendToBody = true;
    });

    //add http interceptor for checking the accessToken
    angular.module('application-blanche-angularjs-ng').config(function ($provide, $httpProvider) {
        $provide.factory('httpAccessTokenInterceptor', function ($q, $log, kAuthentification) {
            return {
                request: function (config) {
                    //check the access token (except on application files in order to be able to download them) on each http calls
                    //it also add it to all http calls (except the HTML and i18n files)
                    //if needed the filter and the authorization header inclusion can be split in order not to include it on all calls.
                    var filtered = (config.url.indexOf('i18n/') === 0)  || (config.url.indexOf('.html') >= 0) || (config.url.indexOf('/custom/logout')>=0);
                    if(!filtered) {
                        if (kAuthentification.checkAuthToken()) {
                            config.headers.Authorization = 'Bearer ' + localStorage.getItem('kia.accessToken');
                        }
                    }
                    return config || $q.when(config);
                }
            };
        });

        $httpProvider.interceptors.push('httpAccessTokenInterceptor');

    });

    //configure authentication
    angular.module('application-blanche-angularjs-ng').run(function ($rootScope, $location, $log, kAuthentification) {

        $rootScope.$on('$routeChangeStart', function (event, next) {

            /* eslint-disable angular/no-private-call */
            if(next.$$route != null && (next.$$route.originalPath.indexOf('/access_token') === 0 || next.$$route.originalPath.indexOf('/logout') === 0 ||
                next.$$route.originalPath.indexOf('/error') === 0)){
                //if we are in the access_token route : don't do anything, the access_token route will take care of everything
                //if we are in the logout or error : don't do anything neither
                return;
            }
            /* eslint-enable angular/no-private-call */

            //check authorization
            if (!kAuthentification.authorize(next.access)) {
                $log.debug(next.access + ' is not authorized');
                if (kAuthentification.isLoggedIn()) {
                    //not authorised but logged in : go back to home page
                    $log.error('unauthorized but logged in : hack attemp! => redirect to login page');
                    $location.path('/');
                } else {
                    //not logged in : go to login page
                    kAuthentification.login();
                }
            } else {
                //authorized but we will check the token expires
                if(!kAuthentification.checkAuthToken()){
                    //token expires or not loaded from localStorage : redirect to logout page
                    $location.path('/logout');
                }
            }
        });

        $rootScope.$on('loginSuccessEvent', function () {
            $log.info('Successfully logged in');
        });

        $rootScope.$on('loginExpiresEvent', function() {
            $log.warn('Access token is expired : new login is required');
            $rootScope.timeout = true;
            $location.path('/logout');
        });

        $rootScope.$on('logoutSuccessEvent', function() {
            $log.info('Successfully logged out');
        });

    });

    //configure google charts
    angular.module('googlechart').value('googleChartApiConfig', {
        version: '1',
        optionalSettings: {
            packages: ['corechart', 'map']
        }
    });

})();
