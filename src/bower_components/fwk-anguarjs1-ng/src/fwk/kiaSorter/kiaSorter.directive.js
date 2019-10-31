'use strict';

/* 
 * Column sorter directive : easily sort a list of items based on the header of the column of an HTML tab
 * Framework directive : all framework directives needs to be called kia<DirectiveName>
 * @author lmathieu 
 */
var kiaSorter = angular.module('kiaSorter', []);

kiaSorter.directive('kiaSorter', function () {
    return {
        restrict: 'A',
        scope: true,

        link: function (scope, elt, attrs, ctrl) {
            attrs.$observe('kiaSorterData', function (value) {
                scope.kiaSorterData = value;
            });

            ctrl.sort(attrs.kiaSorterDefault);
        },

        controller: function ($scope) {
            return {
                sort: function (property) {
                    if (angular.isDefined ($scope.kiaSorterProperty) && $scope.kiaSorterProperty === property) {
                        $scope.kiaSorterReverse = !$scope.kiaSorterReverse;
                    } else {
                        $scope.kiaSorterProperty = property;
                        $scope.kiaSorterReverse = false;
                    }
                }
            };
        }
    };
});

kiaSorter.directive('kiaSorterProperty', function () {
    return {
        require: '^kiaSorter',
        restrict: 'A',

        link: function (scope, elt, attrs, kiaSorter) {
            var icon = $('<span class="glyphicon"></span>').appendTo(elt);

            elt.on('click', function () {
                scope.$apply(function () {
                    //sort and add the chevron
                    kiaSorter.sort(attrs.kiaSorterProperty);
                });
            });

            //watch on getSortOrder to remove old class
            scope.$watch('kiaSorterProperty', function (value) {
                if (value !== attrs.kiaSorterProperty) {
                    icon.removeClass('glyphicon-chevron-up');
                    icon.removeClass('glyphicon-chevron-down');
                }
            });

            //watch on kiaSorterReverse and kiaSorterOrder to toggle chevron
            scope.$watch('kiaSorterReverse + kiaSorterProperty', function () {
                if (scope.kiaSorterProperty === attrs.kiaSorterProperty) {
                    icon.toggleClass('glyphicon-chevron-up', !scope.kiaSorterReverse);
                    icon.toggleClass('glyphicon-chevron-down', scope.kiaSorterReverse);
                }
            });
        }
    };
});