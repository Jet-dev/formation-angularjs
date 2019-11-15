(function () {
  'use strict';

  angular
    .module('formation-ng')
    .controller('PlanesController', PlanesController);

  /** @ngInject */
  function PlanesController() {
    var vm = this;
    vm.jet = {
      description: "Le Rafale de Dassault Aviation est un avion de combat multirôle développé pour la Marine nationale et l'Armée de l'air françaises",
      height: 530,
      id: "buJbdUklQWrJjREvuALq",
      length: 1530,
      maker: "Dassault",
      maxSpeed: 2223,
      name: "Rafale",
      pictureUrl: "https://firebasestorage.googleapis.com/v0/b/formation-71217.appspot.com/o/rafale.jpg?alt=media&token=054c2843-0e54-48e7-a09c-810d893fc0f9",
      width: 1090,
      year: 1998
    };

    activate();

    function activate() {
    }

  }
})();
