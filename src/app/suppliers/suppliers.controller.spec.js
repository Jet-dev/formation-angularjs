'use strict';

/*
 * SuppliersControllerTest.js : test of the SuppliersController.js controller file
 *
 * @author lmathieu
 */
describe('SuppliersController', function () {

    var $scope;
    var $httpBackend;
    var createController;
    var Supplier;
    var Country;

    beforeEach(function () {

        //mock configuration module
        angular.module('configuration', []);

        //define wich module to test : refintApp
        module('refintApp');

        inject(function ($rootScope, $controller, _$httpBackend_, _Supplier_, _Country_) {
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            Supplier = _Supplier_;
            Country = _Country_;

            //define spies
            spyOn(Supplier, 'query').andCallThrough();//spy on query and call throught in order to assert that the call was made and mock via $httpBackend
            spyOn(Supplier, 'delete').andCallThrough();
            spyOn(Country, 'query').andCallThrough();

            //function to create the controller
            createController = function () {
                return $controller('SuppliersController', {'$scope': $scope, 'Supplier': Supplier, 'Country': Country});
            };
        });
    });

    describe('loads', function () {
        it('should load all 3 suppliers and all 3 countries', function () {
            //expect
            $httpBackend.expect('GET', 'rs/fournisseurws/fournisseurs').respond([
                { codeFrs: 'FRS1' },
                { codeFrs: 'FRS2' },
                { codeFrs: 'FRS3' }
            ]);
            $httpBackend.expect('GET', 'rs/paysws/pays').respond([
                { codePays: 'FR' },
                { codePays: 'EN' },
                { codePays: 'NL' }
            ]);

            //when
            var SuppliersController = createController();
            $httpBackend.flush();

            //then
            expect(Supplier.query).toHaveBeenCalled();
            expect(Country.query).toHaveBeenCalled();
            expect($scope.suppliers.length).toBe(3);
            expect(_($scope.countries).size()).toBe(3);
        });
    });

    describe('delete()', function () {
        it('should delete FRS1', function () {
            //given
            var supplier = new Supplier({ codeFrs: 'FRS1' });

            //expect
            $httpBackend.expect('GET', 'rs/fournisseurws/fournisseurs').respond([
                { codeFrs: 'FRS1' },
                { codeFrs: 'FRS2' },
                { codeFrs: 'FRS3' }
            ]);
            $httpBackend.expect('GET', 'rs/paysws/pays').respond([
                { codePays: 'FR', libPays: 'FR' },
                { codePays: 'EN', libPays: 'EN' },
                { codePays: 'NL', libPays: 'NL' }
            ]);
            $httpBackend.expect('DELETE', 'rs/fournisseurws/fournisseurs/FRS1').respond({});

            //when
            var SuppliersController = createController();
            $scope.remove(supplier);
            $httpBackend.flush();

            //then
            expect(Supplier.query).toHaveBeenCalled();
            expect(Supplier.delete).toHaveBeenCalled();
            expect(Country.query).toHaveBeenCalled();
            expect($scope.suppliers.length).toBe(2);
            console.log($scope.countries);
            console.log(typeof $scope.countries);
            expect(_($scope.countries).size()).toBe(3);
        });

    });
});
