/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    //changes max to match the number of degrees required to do a full loop.
    my.calculateLoop = function (fractal) {
        var segments,
            skew,
            i = 1;

        segments = fractal.segments.value + 1;
        skew = fractal.skewangle.value - fractal.skewangle.max / 2;

        while (Math.abs((2 / segments) * i % 1) > 0.1) {
            i += 1;
        }
        fractal.angle.max = (360 / 5) * i;
        fractal.skewangle.max = 180 / 5 * segments;

        if (fractal.arms.value) {
            fractal.skewangle.max *= 2;
            if (segments % 2 === 0) {
                fractal.angle.max *= 2;
            }
        }

        return fractal;
    };

    return my;
}(fract || {}));