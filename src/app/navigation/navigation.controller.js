(function () {
    'use strict';

    angular
        .module('application-blanche-angularjs-ng')
        .controller('NavigationController', NavigationController);

    /* @ngInject */
    function NavigationController($rootScope, $scope, $translate, $log, $location) {

        var vm = this;
        vm.currentPath = $location.path();
        vm.lang = getLang();
        vm.toggleLanguage = toggleLanguage;
        vm.user = $rootScope.user;

        //set currentPath to active menu header
        $scope.$watch(
            function listener() {
                return $location.path();
            },
            function changeHandler(path) {
                vm.currentPath = path;
            }
        );

        ///////////////////////////////////////////////

        function getLang() {
            var lang = $translate.use();
            if (lang == null) {
                lang = $translate.preferredLanguage();
            }
            return lang;
        }

        function toggleLanguage(language) {
            $log.info('Change default language to : ' + language);
            $translate.use(language);
            vm.lang = $translate.use();
        }

    }

})();
