/*global $, document, window*/
/*jslint browser : true, devel: true */
var tla =  (function (my) {
    'use strict';

    my.animate = (function () {

        var animate = {};
        animate.on = false;

        animate.loop = function () {
            if (animate.on) {
                window.setTimeout(animate.loop, tla.config.iterationSpeed);
                $.each(tla.fractals, function () {
                    if (this && this.animate) {
                        this.nudge();
                    }
                });
                tla.canvas.render();
            }
        };

        animate.toggle = function () {
            if (this.on) {
                this.on = false;
            } else {
                this.on = true;
                animate.loop();
            }
        };

        return animate;
    }());

    return my;
}(tla || {}));