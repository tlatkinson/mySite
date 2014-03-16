/*global $, document, window*/
/*jslint browser : true, devel: true, bitwise: true */
var tla = (function (my) {
    'use strict';

    my.color = (function () {
        var color = {},
            colorValue = 0,
            newColor;

        color.black = "#000000";
        color.white = "#ffffff";
        color.bg = color.black;
        color.fractal = color.white;
        color.fractalFill = '#222222';
        color.on = false;

        color.jump = function () {
            var frequency = 0.01,
                r,
                g,
                b;

            colorValue += 1;
            r = (Math.sin(frequency * colorValue) * 127) + 128;
            g = (Math.sin((frequency * colorValue) + 2) * 127) + 128;
            b = (Math.sin((frequency * colorValue) + 4) * 127) + 128;

            function byte2Hex(n) {
                var nybHexString = "0123456789ABCDEF";
                return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
            }
            if (tla.color.bg === tla.color.black) {
                newColor = '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
            } else {
                newColor = '#' + byte2Hex(r / 2) + byte2Hex(g / 2) + byte2Hex(b / 2);
            }

            return newColor;
        };

        color.cycle = function () {
            if (color.on) {
                tla.ctx[tla.mainCanvas].strokeStyle = color.jump();
            }
        };

        color.invert = function () {
            if (this.bg === this.black) {
                this.bg = this.white;
                this.fractal = this.black;
            } else {
                this.bg = color.black;
                this.fractal = color.white;
            }
            tla.ctx[tla.mainCanvas].fillStyle = this.bg;
            tla.ctx[tla.mainCanvas].strokeStyle = this.fractal;
        };

        color.toggle = function () {
            if (this.on) {
                this.on = false;
                color.invert();
            } else {
                this.on = true;
            }
            tla.ctx[tla.mainCanvas].clear();
            tla.canvas.render();
        };

        return color;
    }());

    return my;
}(tla || {}));