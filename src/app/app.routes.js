(function() {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .config(RouteConfiguration);

    /* @ngInject */
    function RouteConfiguration ($routeProvider) {

        /**
         * This route allow to register an OAuth2 access token given by the Autorization Server.
         * It is used in the OAuth2 implicit flow during the redirection made by the Autorization to our application.
         */
        $routeProvider.when('/access_token=:accessToken&token_type=:token_type&expires_in=:expires_in&jti=:jti',{
            template : '',
            controller : function ($location, $rootScope, $routeParams,$log, kAuthentification){
                kAuthentification.registerToken($routeParams.accessToken);

                var url = localStorage.getItem('kia.landingUrl');
                if(url != null){
                    //deep linking : move to the previous url
                    localStorage.removeItem('kia.landingUrl');
                    $location.url(url);
                } else {
                    $location.url('/');
                }
            }
        })
        /**
         * This route is used in case an error is generated from the autorization server. It should not be used unless the autorization server is crashing!
         */
        .when('/error=:error&error_description=:errorDescription&scope=:scope', {
            templateUrl: 'app/error/error.html',
            controller: function($scope, $routeParams, kAuthentification, kNotification){
                $scope.errorCode = $routeParams.error;

                //build login URL to put on the login button
                $scope.loginUrl = kAuthentification.buildLoginUrl();

                //display the error message
                kNotification.error($routeParams.errorDescription);
            }
        })
        /**
         * This route is an exemple of how we can do an SSO (Single Sign-On) between two application : we just need, from the origin application
         * to make a link to the destination application (this one) using a /sso URL with the origin OAuth2 token => arriving here, the application will initiate a token exchange
         * from the authorization server and register the new token.
         */
        .when('/sso=:ssoToken', {//sso endpoint
            templateUrl: 'app/home/home.html',
            controller : function ($location, $routeParams,$log, kAuthentification, kSso, globalConfig){
                $log.info('Initiating SSO with external token');

                //exchange the token
                kSso.exchangeToken($routeParams.ssoToken).then(function success(response) {
                    $log.info('Receiving the token and registering it');
                    //proceed with standard register token
                    kAuthentification.registerToken(response.data.access_token);

                    //redirect to requested page
                    $location.url('/');
                },
                function error(response){
                    $log.error('Authentication server error while exchanging the token');

                    //redirect to error page
                    $location.url('/error=sso_error&error_description=' + response.data.message + '&scope=' + globalConfig.authScope);
                });
            }
        })
        /**
         * Default route to the homepage.
         * More routes needs to be define in each page/module route configuration file
         */
        .otherwise({
            redirectTo: '/'
        });

    }

})();
