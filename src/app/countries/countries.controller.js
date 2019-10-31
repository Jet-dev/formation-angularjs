(function() {
    'use strict';

    /*
     * CountriesController.js : controller for the Countries page
     * @author lmathieu
     */
    angular
        .module('application-blanche-angularjs-ng')
        .controller('CountriesController', CountriesController);

    /* @ngInject */
    function CountriesController ($log, $uibModal, kNotification, countriesService, countries) {

        var vm = this;

        vm.countries = countries;

        vm.createCountry = createCountry;
        vm.updateCountry = updateCountry;
        vm.removeCountry = removeCountry;

        /////////////////////////////////

        function createCountry () {
            $log.info('CountriesController - Call create');

            //display the modal
            $uibModal.open({
                templateUrl: 'app/countries/modal/editCountry.modal.html',
                controller: 'editCountryModalController',
                controllerAs: 'ecc',
                resolve: {
                    country: {}
                }
            }).result.then(function (countryToCreate) {
                //send the countryToUpdate to the server
                $log.info('CountriesController - creating the pays');
                // create
                countriesService.createCountry(countryToCreate).then(function () {
                    vm.countries.push(countryToCreate);
                    //alert the user
                    kNotification.success('Country successfully created for codePays : ' + countryToCreate.code, {timeout: 5000});
                }, function error(response) {
                    $log.error('Error while trying to create the countryToCreate : ' + countryToCreate.code);
                    kNotification.error('Unable to create the countryToCreate : ' + countryToCreate.code, {detail: response.data});
                });

            });

        }

        function updateCountry (country) {
            $log.info('CountriesController - Call update for country : ' + country.codePays);

            //display the modal
            $uibModal.open({
                templateUrl: 'app/countries/modal/editCountry.modal.html',
                controller: 'editCountryModalController',
                controllerAs: 'ecc',
                resolve: {
                    country: angular.copy(country)
                }
            }).result.then(function (countryToUpdate) {
                //send the countryToUpdate to the server
                $log.info('CountriesController - updating the pays');
                //update
                countriesService.updateCountry(countryToUpdate).then(function () {
                    //update the existing country now that the backend return OK, update of front will be made automatically thanks to databinding
                    _(vm.countries).update(country, countryToUpdate);
                    //alert the user
                    kNotification.success('Country successfully updated for codePays : ' + countryToUpdate.code, {timeout: 5000});
                }, function error(response) {
                    $log.error('Error while trying to update the country : ' + countryToUpdate.code);
                    kNotification.error('Unable to update the country : ' + countryToUpdate.code, {detail: response.data});
                });
            });

        }

        function removeCountry (country) {
            $log.info('CountriesController - Call delete for codePays : ' + country.code);
            countriesService.removeCountry(country).then(function () {
                //remove the element in the array
                _(vm.countries).remove(country);
                //alert the user
                kNotification.success('Country deleted successfully for codePays : ' + country.code, {timeout: 5000});
            }, function error(response) {
                $log.info('Error while trying to delete the country : ', response.data);
                kNotification.error('Unable to delete the country : ' + country.code, {detail: response.data});
            });
        }

    }

})();
