'use strict';

var kiabi = angular.module('kiabi');

/**
 * kAuthentification : manage authentification of the application
 * When login, broadcast the event 'loginSuccessEvent' on $rootScope if success otherwise broadcast 'loginErrorEvent
 * When logout, broadcast the event 'logoutSuccessEvent' on $rootScope otherwise broadcast 'logoutErrorEvent'
 * When authenticated session is expired (auth token expired), broadcast the event 'loginExpiresEvent' on $rootScope
 *
 * @author : lmathieu
 */
kiabi.factory('kAuthentification', function ($rootScope, $log, $location, globalConfig, $injector) {

    var $http;
    var localStorageAccessTokenKey = 'kia.' + globalConfig.authClientId + '.accessToken';
    var localStorageLandingUrlKey = 'kia.' + globalConfig.authClientId + '.landingUrl';

    function nowInSeconds() {
        return Math.round(Date.now() / 1000);
    }

    return {
        authorize: function (role) {
            if (role === undefined) {
                //public page
                return true;
            }

            if ($rootScope.user === undefined) {
                //not logged in
                return false;
            }

            // need to be logged but not with specific role
            if(role === 'IS_AUTHENTICATED') {
                return true;
            }

            var authorized = false;
            _($rootScope.user.roles).forEach(function (item) {
                if (item === role) {
                    authorized = true;
                }
            });

            return authorized;
        },

        isLoggedIn: function () {
            return $rootScope.user !== undefined;
        },

        login: function () {
            //check the localStorage for remember me
            if(localStorage.getItem(localStorageAccessTokenKey) != null){
                $log.info('loading the token from the localStorage');
                var accessToken = localStorage.getItem(localStorageAccessTokenKey);
                this.registerToken(accessToken);
            }
            else {
                //keep the current URL to redirect in case of deep linking and not logout
                if($location.path().indexOf('/logout') < 0){
                    localStorage.setItem(localStorageLandingUrlKey, $location.url());
                }

                //redirect to the authorization server
                var url = this.buildLoginUrl();
                $log.info(url);
                window.location.replace(url);
            }
        },

        buildLoginUrl : function() {
            //compute the redirect URL : the root URL of the app (without the # part)
            var currentUrl = $location.absUrl();
            currentUrl = currentUrl.substring(0, currentUrl.indexOf('#'));
            var redirectUrl = encodeURI(currentUrl);

            var url = globalConfig.authServerUrl + '/oauth/authorize?response_type=token&client_id=' + globalConfig.authClientId + '&redirect_uri=' + redirectUrl;
            if(globalConfig.authScope != null && globalConfig.authScope !== ''){
                url += '&scope=' + globalConfig.authScope;
            }

            return url;
        },

        registerToken: function(accessToken) {
            var jwtToken = accessToken;
            if(jwtToken.indexOf('.') > 0) {
                jwtToken = jwtToken.split('.')[1];
            }
            var jsonToken = JSON.parse(atob(jwtToken));
            $log.debug(JSON.stringify(jsonToken));

            var now = nowInSeconds();
            var sec = jsonToken.exp - now;
            $log.info('Date is : ' + now + ' and token expires is :' + jsonToken.exp);
            if(now > jsonToken.exp){
                $log.warn('Token is expired : redirect to login');
                //we try to register an expired token : cancel the operation and make a new login
                localStorage.removeItem(localStorageAccessTokenKey);
                this.login();
            }
            else {
                $log.info('Token is still valide for ' + sec + 's -> register it');
                $log.debug('Authentification successfull roles : ' + jsonToken.authorities);
                localStorage.setItem(localStorageAccessTokenKey, accessToken);

                $rootScope.user = {
                    login : jsonToken.sub,
                    roles : jsonToken.authorities,
                    displayName : jsonToken.user.displayName,
                    firstName : jsonToken.user.firstName,
                    lastName : jsonToken.user.lastName,
                    country : jsonToken.user.country,
                    languageCode : jsonToken.user.languageCode,
                    establishementcode : jsonToken.user.establishementCode
                };
                $rootScope.expires = jsonToken.exp;

                //broadcast success event
                $rootScope.$broadcast('loginSuccessEvent');
            }
        },

        logout: function () {
            //recherche de dependance pour evite les cycle
            $http = $http || $injector.get('$http');

            //clear all auth stuff
            $rootScope.user = undefined;
            $rootScope.expires = undefined;

            //also clear the localStorage
            var accessToken = localStorage.getItem(localStorageAccessTokenKey);
            localStorage.clear();

            //logout sur l'auth server
            var logoutUrl = globalConfig.authServerUrl + '/custom/logout?token=' + accessToken;
            $http({method: 'GET',url: logoutUrl, headers: {'Autorization': undefined}}).success(function(){
                $log.debug('Logged out from the auth server done');
            });

            //broadcast success event
            $rootScope.$broadcast('logoutSuccessEvent');
        },

        checkAuthToken: function() {
            if($rootScope.expires == null){
                //not already loggued : go to login page
                this.login();
            }

            var now = nowInSeconds();
            $log.debug('Checking the token : Date is : ' + now + ' and token expires is :' +  $rootScope.expires);
            if(now >  $rootScope.expires){
                $log.warn('Token is expired !');
                //broadcast expire event
                $rootScope.$broadcast('loginExpiresEvent');
                return false;
            }
            return true;
        },

        getAccessToken: function() {
            return localStorage.getItem(localStorageAccessTokenKey);
        },

        getLandingUrl: function() {
            return localStorage.getItem(localStorageLandingUrlKey);
        },

        clearLandingUrl: function(){
            localStorage.removeItem(localStorageLandingUrlKey);
        }
    };
});//end kAuthentification


/**
 * kSso : allow to exchange an authorization token from an application to an other to implement an OAuth SSO
 *
 * @author lmathieu
 */
kiabi.factory('kSso', function (globalConfig, $http) {
    return {
        exchangeToken : function(ssoToken) {
            var exchangeTokenUrl = globalConfig.authServerUrl + '/external/oauth/token?client_id=' + globalConfig.authClientId;
            return $http({
                method: 'POST',
                url: exchangeTokenUrl,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj) {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                    return str.join('&');
                },
                data: {access_token: ssoToken, grant_type: 'kiabi:exchange-token'}
            });
        }
    };
});//end kAuthentification
