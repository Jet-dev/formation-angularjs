(function () {
  'use strict';

  angular
    .module('formation-ng')
    .directive('changeBackground', changeBackground);

  /* @ngInject */
  function changeBackground() {

    return {
      restrict: 'EA',
      scope: {
        colorcode: '@?'
      },
      link: function ($scope, element) {
        element.on('mouseenter', function () {
          element.addClass('change-color');
          element.css('background-color', $scope.colorcode);
        });
        element.on('mouseleave', function () {
          element.removeClass('change-color');
          element.css('background-color', '#fff');
        });
      }
    };

  }

})();
