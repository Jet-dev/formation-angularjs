'use strict';

/*
 * kAuthentification : manage authentification of the application
 * When login, broadcast the event 'loginSuccessEvent' on $rootScope if success otherwise broadcast 'loginErrorEvent
 * When logout, broadcast the event 'logoutSuccessEvent' on $rootScope otherwise broadcast 'logoutErrorEvent'
 *
 * @author : lmathieu
 */
var kiabi = angular.module('kiabi');

kiabi.factory('kAuthentification', function ($rootScope, $http, $log, $location, $timeout, Base64) {
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

        login: function (userName, password) {
            //make a call to the backend to retrieve user informations
            //this will also trigger an authentication on the server and secure the endpoint
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(userName + ':' + password);// jshint ignore:line
            $http.post('rs/securityws/login', {userName: userName}).success(function (user) {
                $log.debug('Authentification successfull roles : ' + user.roles);
                $rootScope.user = user;
                $rootScope.user.password = password;//we keep the password for reuse

                //redirect to previous page if any
                if($rootScope.preloginUrl != null){//if we have a preloginurl, we redirect to it
                    $location.path($rootScope.preloginUrl);
                    $rootScope.preloginUrl = null;
                }
                else {
                    $location.path('/');
                }

                //broadcast event
                $rootScope.$broadcast('loginSuccessEvent');
            })
                .error(function (data, status) {
                    $rootScope.$broadcast('loginErrorEvent');
                    $log.error('Unable to login : ' + status + ' - ' + data);
                    $location.path('/login');
                });
        },

        logout: function () {
            $rootScope.user = undefined;

            $http.post('rs/securityws/logout').success(function () {
                delete $http.defaults.headers.common['Authorization'];// jshint ignore:line
                $rootScope.preloginUrl = null;
                $rootScope.$broadcast('logoutSuccessEvent');//TODO ajouter des arguments avec login/mdp/error msg/...
            })
            .error(function (data, status) {
                //almost silently failing
                $http.defaults.headers.common['Authorization'] = null;// jshint ignore:line
                $rootScope.$broadcast('logoutErrorEvent');
                $log.error('Unable to logout : ' + status + ' - ' + data);
            });
        }
    };
});//end kAuthentification

kiabi.factory('Base64', function ($log) {//a remplacer par https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa ?
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = '';
            var chr1, chr2, chr3 = '';
            var enc1, enc2, enc3, enc4 = '';
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                /* jshint ignore:start */
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                /* jshint ignore:end */
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = '';
            var chr1, chr2, chr3 = '';
            var enc1, enc2, enc3, enc4 = '';
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                $log.error('There were invalid base64 characters in the input text.\n' +
                    'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' +
                    'Expect errors in decoding.');
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                /* jshint ignore:start */
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                /* jshint ignore:end */

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';

            } while (i < input.length);

            return output;
        }
    };
});