/*global $, document, window, less*/
/*jslint browser : true, devel: true */

var fract = (function (my) {
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
        var articleHeight = (fract.height - 75) * 0.75,
            articleWidth = fract.width * 0.75,
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
            'top': ((fract.height / 2) - (articleHeight / 1.75)) + 'px'
        });
    }

    function resetCanvases() {
        var grd= fract.ctx[fract.snowCanvas].createLinearGradient(0, 0, 0, fract.height);

        fract.width = window.innerWidth;
        fract.height = window.innerHeight;

        $.each(Object.keys(fract.canvasEle), function () {
            var $this = $('#' + this);
            fract.canvasEle[this].width = $this.width();
            fract.canvasEle[this].height = $this.height();
        });

        grd.addColorStop(0,'#1A3742');
        grd.addColorStop(1,'#9EA183');
        fract.canvasEle[fract.snowCanvas].fillStyle = grd;
        fract.canvasEle[fract.snowCanvas].strokeStyle = fract.color.fractal;

        //still havent figured out why strokeStyle is being reverted
        $.each(Object.keys(fract.ctx), function () {
            fract.ctx[this].fillStyle = fract.canvasEle[this].fillStyle;
            fract.ctx[this].strokeStyle = fract.canvasEle[this].strokeStyle;
            fract.ctx[this].clear();
        });
    }

    my.fixSize = function () {
        resetCanvases();
        fixCentering();

        fract.canvas.render();
        fract.config.adjustZoomLevel();
    };

    my.randomize = function (fractal) {
        fractal.depth.random();
        fractal.poly.random();
        fractal.segments.random();
        fractal.mirror.random();
        fractal.arms.random();
        fractal = fract.calculateLoop(fractal);

        return fractal;
    };

    function getNextIndex() {
        var i;

        for(i = 0; i < fract.fractals.length; i += 1) {
            if(!fract.fractals[i]) {
                break;
            }
        }

        return i;
    }

    my.addFractal = function (poly, segments, mirror, arms, depth, canvas, angleSteps, skewSteps, stops, texts) {
        var index = getNextIndex();
        fract.fractals[index] =
            fract.fractal(poly, segments, mirror, arms, depth, canvas, index, angleSteps, skewSteps, stops, texts);

        return fract.fractals[index];
    };

    my.addRandomFractal = function () {
        var fractal,
            index = getNextIndex();

        fractal = fract.fractal(0, 0, 0, 0, 0, fract.snowCanvas, index);
        fract.fractals[index] = fract.randomize(fractal);

        return fractal;
    };

    my.destroyFractal = function (index) {
        delete fract.fractals[index];
    };

    my.toggleFlakes = function (render) {
        $.each(fract.fractals, function () {
            if(this && this.canvas === fract.snowCanvas) {
                this.render = render;
            }
        });
    };

    function initializeCanvas(canvas) {
        fract.canvasEle[canvas] = document.getElementById(canvas);
        fract.ctx[canvas] = fract.canvasEle[canvas].getContext("2d");
        fract.ctx[canvas].lineWidth = 2;

        $.each(Object.keys(fract.canvasEle), function () {
            var $this = $('#' + this);
            fract.canvasEle[this].width = $this.width();
            fract.canvasEle[this].height = $this.height();
        });

        fract.ctx[canvas].clear = function () {
            fract.ctx[canvas].fillRect(0, 0, fract.canvasEle[canvas].clientWidth, fract.canvasEle[canvas].clientHeight);
        };
    }

    my.init = function () {
        var canvases = [fract.mainCanvas, fract.snowCanvas];

        fract.canvasEle = {};
        fract.ctx = {};

        $.each(canvases, function () {
            initializeCanvas(this);
        });

        fract.canvasEle[fract.mainCanvas].fillStyle = fract.color.fractalFill;
        fract.canvasEle[fract.mainCanvas].strokeStyle = fract.color.fractal;

        fract.fixSize();

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame;
        }());
    };

    return my;
}(fract || {}));