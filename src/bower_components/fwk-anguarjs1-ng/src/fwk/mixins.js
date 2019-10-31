'use strict';

/**
 * Created by lmathieu on 28/07/2014.
 *
 * _()Undescore JS mixins : add some functionalities to undescore :
 *      - remove(array, element) : if found, remove an element from an array.
 *      - update(array, oldElement, newElement) : if found, update the oldElement with the newElement in the array.
 *      - isNotEmpty(str) : return true if the parameter is a not empty string, false otherwhise
 */
_.mixin({
    remove: function (array, element) {
        var elementIndex = array.indexOf(element);

        if (elementIndex !== -1) {
            array.splice(elementIndex, 1);
        }
    },

    update: function (array, oldElement, newElement) {
        var elementIndex = array.indexOf(oldElement);

        if (elementIndex !== -1) {
            array[elementIndex] = newElement;
        }
    },

    isNotEmpty: function (str) {

        if (_.isString(str)) {
            return str !== undefined && str !== null && str !== '';
        }

        return false;
    }
});