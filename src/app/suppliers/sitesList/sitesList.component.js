/**
 * Created by lmathieu on 18/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .component('sitesList', {
            templateUrl: 'app/suppliers/sitesList/sitesList.html',
            controller: 'SitesListController as slc',
            bindings: {
                sites: '='
            }
        }
    );

})();
