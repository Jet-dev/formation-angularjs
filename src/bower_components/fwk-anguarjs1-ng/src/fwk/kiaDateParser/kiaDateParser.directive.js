'use strict';

/*
 * DateParser : parse a date from a timestamp
 * Framework directive : all framework directives needs to be called kia<DirectiveName> @author lmathieu
 */
var kiaDateParser = angular.module('kiaDateParser', []);

kiaDateParser.directive('kiaTimestampToDate', function () {
    var directive = {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            // Default to ISO formatting
            modelCtrl.$formatters.push(function (value) {
                if (value !== null) {
                    return new Date(value);
                }

                return null;
            });

            modelCtrl.$parsers.push(function (value) {
                var patt = new RegExp('[0-9]*/{1}[0-9]*/{1}[0-9]*$');
                if (patt.test(value)) {
                    var from = value.split('/');
                    value = new Date(from[2], from[1] - 1, from[0]);
                }

                if (value !== undefined && value !== null) {
                    return value.getTime();
                }
                return null;
            });
        }
    };
    return directive;
});