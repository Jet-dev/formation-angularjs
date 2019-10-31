(function() {
    'use strict';
    /*
     * HomeController.js : home controller, do nothing else than basic navigation active/inactive
     * @author lmathieu
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('HomeController', homeController);

    /* @ngInject */
    function homeController ($log) {

        $log.info('HomeCtrl - not a much to do');

    }

})();
