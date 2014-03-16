/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    my.part = function (value, max, min, id) {

        var part = {};

        part.value = value;
        part.max = max;
        part.min = min;
        part.id = id;

        part.update = function (value, render) {
            this.value = value;
            if (render) {
                fract.canvas.render();
            }
        };

        part.random = function () {
            part.update(Math.floor((Math.random() * (part.max - part.min)) + part.min));
        };

        return part;
    };

    return my;
}(fract || {}));