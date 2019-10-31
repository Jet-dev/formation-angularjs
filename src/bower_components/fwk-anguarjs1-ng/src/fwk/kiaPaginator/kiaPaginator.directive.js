'use strict';

/* 
 * Pagination directive.
 * Framework directive : all framework directives needs to be called kia<DirectiveName>
 * @author lmathieu 
 */
var kiaPaginator = angular.module('kiaPaginator', ['pascalprecht.translate']);


kiaPaginator.directive('kiaPaginator', function ($translate, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            kiaPaginatorItems: '&'
        },
        templateUrl: 'bower_components/fwk-angularjs1-ng/src/fwk/kiaPaginator/kia-paginator.html',
        replace: false,

        link: function (scope) {
            scope.pageSizeList = [5, 10, 20, 50];

            scope.kiaPaginator = {
                pageSize: 20,
                currentPage: 0,
                pageSizeLabel: '!Items!'
            };

            //manage translation of items_per_page label
            $rootScope.$on('$translateChangeSuccess', function () {
                $translate('kiaPaginator.items_per_page').then(function (translation) {
                    scope.kiaPaginator.pageSizeLabel = translation;
                });
            });
            $translate('kiaPaginator.items_per_page').then(function (translation) {
                scope.kiaPaginator.pageSizeLabel = translation;
            });

            scope.isFirstPage = function () {
                return scope.kiaPaginator.currentPage === 0;
            };
            scope.isLastPage = function () {
                if (scope.kiaPaginatorItems() === undefined) {
                    return false;
                }

                return scope.kiaPaginator.currentPage >= scope.kiaPaginatorItems().length / scope.kiaPaginator.pageSize - 1;
            };
            scope.incPage = function () {
                if (!scope.isLastPage()) {
                    scope.kiaPaginator.currentPage++;
                }
            };
            scope.decPage = function () {
                if (!scope.isFirstPage()) {
                    scope.kiaPaginator.currentPage--;
                }
            };
            scope.firstPage = function () {
                scope.kiaPaginator.currentPage = 0;
            };
            scope.lastPage = function () {
                if (scope.kiaPaginatorItems() === undefined) {
                    return false;
                }

                scope.kiaPaginator.currentPage = Math.ceil(scope.kiaPaginatorItems().length / scope.kiaPaginator.pageSize - 1);
            };
            scope.numberOfPages = function () {
                if (scope.kiaPaginatorItems() === undefined) {
                    return 0;
                }

                return Math.ceil(scope.kiaPaginatorItems().length / scope.kiaPaginator.pageSize);
            };
            scope.$watch('kiaPaginator.pageSize', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.firstPage();
                }
            });

            // ---- Functions available in parent scope -----
            scope.$parent.firstPage = function () {
                scope.firstPage();
            };

            // Function that returns the reduced items list, to use in ng-repeat
            scope.$parent.pageItems = function () {
                if (scope.kiaPaginatorItems() === undefined) {
                    return [];
                }

                var start = scope.kiaPaginator.currentPage * scope.kiaPaginator.pageSize;
                var limit = scope.kiaPaginator.pageSize;
                return scope.kiaPaginatorItems().slice(start, start + limit);
            };
        }
    };
});