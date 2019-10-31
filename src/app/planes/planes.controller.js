(function () {
    'use strict';

    angular
      .module('formation-ng')
      .controller('PlanesController', PlanesController);

    /** @ngInject */
    function PlanesController($timeout) {
      var vm = this;

      vm.jet = {
        title: 'Emily Ratajkowski',
        description: 'Emily Ratajkowski, née le 7 juin 1991 à Londres, est une mannequin et actrice américaine. Née de parents américains et principalement élevée en Californie, elle s\'est fait connaître du grand public en apparaissant seins nus dans le clip Blurred Lines de Robin Thicke en 2013.',
        pictureUrl: 'https://firebasestorage.googleapis.com/v0/b/formation-71217.appspot.com/o/rata.jpg?alt=media&token=4dbf1db5-05d4-4887-b1f8-532b93aef45e'
      };

      activate();

      function activate() {
        $timeout(function () {
          vm.classAnimation = 'rubberBand';
        }, 4000);
      }
    }
  }
)();
