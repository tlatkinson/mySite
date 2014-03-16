/*global $, document, window*/
/*jslint browser : true, devel: true */
var tla = (function (my) {
    'use strict';

    my.config = (function () {

        var config = {};

        config.setZoomLevel = function (level) {
            config.zoomLevel = level;
            config.zoomPow = Math.pow(1.25, config.zoomLevel);
        };

        config.adjustZoomLevel = function () {
            if((tla.width > 800) && (tla.height > 800)) {
                config.setZoomLevel(8)
            } else {
                config.setZoomLevel(7);
            }
        };

        config.zoomLevel = 7;
        config.zoomPow = Math.pow(1.25, config.zoomLevel);
        config.offset = 0;
        config.iterations = 50;
        config.timeout = 1500;

        config.iterationSpeed = 1000 / 60;
        config.descendRate = 1 / 20;
        config.defaultSpeed = 0.15;
        config.maxFlakes = 40;
        config.flakeGenerationSpeed = 20;
        config.flakeZoomPow = Math.pow(1.25, 15);

        return config;
    }());

    return my;
}(tla || {}));