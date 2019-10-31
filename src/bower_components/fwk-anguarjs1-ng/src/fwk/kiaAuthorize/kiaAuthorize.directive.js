'use strict';

/*
 * Authorization directive : hide an element from the DOM is the user is not authorized for the role. Multiple roles can be defined, separated by a coma.
 * Framework directive : all framework directives needs to be called kia<DirectiveName>
 * @author lmathieu
 */
var kiaAuthorize = angular.module('kiaAuthorize', []);

kiaAuthorize.directive('kiaAuthorize', function (kAuthentification, $rootScope) {

    function computeAutorization(authListAsStr) {
        if (authListAsStr == null) {
            return false;
        }

        var authzs = authListAsStr.split(',');
        var authorized = false;

        _(authzs).forEach(function (elt) {
            if (kAuthentification.authorize(elt.trim())) {
                authorized = true;
            }
        });
        return authorized;
    }

    return {
        restrict: 'A',

        link: function (scope, elt, attrs) {

            var authorized = false;
            if (attrs.kiaAuthorize === '') {
                //here we simply want to authorized or un-authorized regardless of the role
                authorized = kAuthentification.isLoggedIn();
            }
            else {
                //here we realy check on role authorization
                authorized = computeAutorization(attrs.kiaAuthorize);
            }

            if (authorized) {
                elt.show();
            }
            else {
                elt.hide();
            }

            $rootScope.$on('loginSuccessEvent', function (event, e) {
                var authorizedOn = false;
                if (attrs.kiaAuthorize === '') {
                    //here we simply want to authorized or un-authorized regardless of the role
                    authorizedOn = kAuthentification.isLoggedIn();
                }
                else {
                    //here we realy check on role authorization
                    authorizedOn = computeAutorization(attrs.kiaAuthorize);
                }

                if (authorizedOn) {
                    elt.show();
                }
                else {
                    elt.hide();
                }
            });

            $rootScope.$on('logoutSuccessEvent', function (event, e) {
                //on logout, all the restricted tag shoud be invisible
                elt.hide();
            });
        }
    };
});
