angular.
module('formation-ng').
filter('checkDescriptionLength', function() {
  return function(description) {
    if (description.length > 150) {
      return description.substring(0, 150) + '...';
    }
    return description;
  };
});
