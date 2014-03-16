/*global $, document, window, less*/
/*jslint browser : true, devel: true */

var tla = (function (my) {
    'use strict';

    my.fractals = [];
    my.width = window.innerWidth;
    my.height = window.innerHeight;
    my.mainCanvas = 'helloCanvas';
    my.snowCanvas = 'snowflake';
    my.generateFlakes = false;

    function getPixelValue(pixels) {
        return parseInt(pixels.substring(0, pixels.length - 2), 10)
    }

    function fixCentering() {
        var articleHeight = (tla.height - 75) * 0.75,
            articleWidth = tla.width * 0.75,
            $projectWrapper = $('#projects').find('.projectWrapper'),
            $canvasWrapper = $('.project').find('.canvasWrapper'),
            maxHeight = getPixelValue($canvasWrapper.css('max-height')),
            maxWidth = getPixelValue($canvasWrapper.css('max-width'));

        if(articleHeight > maxHeight) {
            articleHeight = maxHeight;
        }
        if(articleWidth > maxWidth) {
            articleWidth = maxWidth;
        }

        //percent width can't be done in css because top/left is based off of those values
        $canvasWrapper.css({
            'width': articleWidth + 'px',
            'height': articleHeight + 'px'
        });
        $projectWrapper.css({
            'top': ((tla.height / 2) - (articleHeight / 1.75)) + 'px'
        });
    }

    function resetCanvases() {
        var grd= tla.ctx[tla.snowCanvas].createLinearGradient(0, 0, 0, tla.height);

        tla.width = window.innerWidth;
        tla.height = window.innerHeight;

        $.each(Object.keys(tla.canvasEle), function () {
            var $this = $('#' + this);
            tla.canvasEle[this].width = $this.width();
            tla.canvasEle[this].height = $this.height();
        });

        grd.addColorStop(0,'#1A3742');
        grd.addColorStop(1,'#9EA183');
        tla.canvasEle[tla.snowCanvas].fillStyle = grd;
        tla.canvasEle[tla.snowCanvas].strokeStyle = tla.color.fractal;

        //still havent figured out why strokeStyle is being reverted
        $.each(Object.keys(tla.ctx), function () {
            tla.ctx[this].fillStyle = tla.canvasEle[this].fillStyle;
            tla.ctx[this].strokeStyle = tla.canvasEle[this].strokeStyle;
            tla.ctx[this].clear();
        });
    }

    my.fixSize = function () {
        resetCanvases();
        fixCentering();

        tla.canvas.render();
        tla.config.adjustZoomLevel();
    };

    my.randomize = function (fractal) {
        fractal.depth.random();
        fractal.poly.random();
        fractal.segments.random();
        fractal.mirror.random();
        fractal.arms.random();
        fractal = tla.calculateLoop(fractal);

        return fractal;
    };

    function getNextIndex() {
        var i;

        for(i = 0; i < tla.fractals.length; i += 1) {
            if(!tla.fractals[i]) {
                break;
            }
        }

        return i;
    }

    my.addFractal = function (poly, segments, mirror, arms, depth, canvas, angleSteps, skewSteps, stops, texts) {
        var index = getNextIndex();
        tla.fractals[index] =
            tla.fractal(poly, segments, mirror, arms, depth, canvas, index, angleSteps, skewSteps, stops, texts);

        return tla.fractals[index];
    };

    my.addRandomFractal = function () {
        var fractal,
            index = getNextIndex();

        fractal = tla.fractal(0, 0, 0, 0, 0, tla.snowCanvas, index);
        tla.fractals[index] = tla.randomize(fractal);

        return fractal;
    };

    my.destroyFractal = function (index) {
        delete tla.fractals[index];
    };

    my.toggleFlakes = function (render) {
        $.each(tla.fractals, function () {
            if(this && this.canvas === tla.snowCanvas) {
                this.render = render;
            }
        });
    };

    function initializeCanvas(canvas) {
        tla.canvasEle[canvas] = document.getElementById(canvas);
        tla.ctx[canvas] = tla.canvasEle[canvas].getContext("2d");
        tla.ctx[canvas].lineWidth = 2;

        $.each(Object.keys(tla.canvasEle), function () {
            var $this = $('#' + this);
            tla.canvasEle[this].width = $this.width();
            tla.canvasEle[this].height = $this.height();
        });

        tla.ctx[canvas].clear = function () {
            tla.ctx[canvas].fillRect(0, 0, tla.canvasEle[canvas].clientWidth, tla.canvasEle[canvas].clientHeight);
        };
    }

    my.init = function () {
        var canvases = [tla.mainCanvas, tla.snowCanvas];

        tla.canvasEle = {};
        tla.ctx = {};

        $.each(canvases, function () {
            initializeCanvas(this);
        });

        tla.canvasEle[tla.mainCanvas].fillStyle = tla.color.fractalFill;
        tla.canvasEle[tla.mainCanvas].strokeStyle = tla.color.fractal;

        tla.fixSize();

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame;
        }());
    };

    return my;
}(tla || {}));