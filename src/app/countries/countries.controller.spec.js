'use strict';

/*
 * CountriesControllerTest.js : test of the CountriesController.js controller file
 *
 * @author lmathieu
 */
describe('CountriesController', function () {

    var $scope;
    var $httpBackend;
    var createController;
    var Country;

    beforeEach(function () {

        //mock configuration module
        angular.module('configuration', []);

        //define wich module to test : app
        module('app');

        inject(function ($rootScope, $controller, _$httpBackend_, _Country_, _globalConfig_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            Country = _Country_;

            //define spies
            spyOn(Country, 'query').andCallThrough();//spy on query and call throught in order to assert that the call was made and mock via $httpBackend
            spyOn(Country, 'delete').andCallThrough();

            //define controller
            createController = function () {
                return $controller('CountriesController', {'$scope': $scope, 'Country': Country});
            };
        });
    });

    describe('loads', function () {
        it('should load all 3 countries', function () {
            //expect
            $httpBackend.expect('GET', 'rs/paysws/v1/countries').respond([
                { code: 'FR' },
                { code: 'EN' },
                { code: 'NL' }
            ]);

            //when
            var CountriesController = createController();
            $httpBackend.flush();

            //then
            expect(Country.query).toHaveBeenCalled();
            expect($scope.countries.length).toBe(3);
        });
    });

    describe('remove()', function () {
        it('should delete FR', function () {
            //given
            var country = new Country({ code: 'FR' });

            //expect
            $httpBackend.expect('GET', 'rs/paysws/v1/countries').respond([
                { code: 'FR' },
                { code: 'EN' },
                { code: 'NL' }
            ]);
            $httpBackend.expect('DELETE', 'rs/paysws/v1/countries/FR').respond({});

            //when
            var CountriesController = createController();
            $scope.remove(country);
            $httpBackend.flush();

            //then
            expect(Country.delete).toHaveBeenCalled();
            expect($scope.countries.length).toBe(2);
        });

    });
});
