/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    my.canvas = (function () {
        var canvas = {};

        function displayHomePageText(fractal) {
            var index = fractal.stopIndex;

            if(fractal.texts[index]) {
                $.each(fractal.texts[index], function () {
                    var $textEle = $('#' + this.id);

                    $textEle
                        .html(this.text)
                        .css({
                            'margin-left' : '-' + ($textEle.width() / 2) + 'px'
                        });
                });
            }
        }

        function addRandomFlakes() {
            var random,
                totalFlakes = 0,
                fractal;

            random = Math.random() * 1000;

            if((random > (1000 - fract.config.flakeGenerationSpeed))) {
                $.each(fract.fractals, function () {
                    if(this) {
                        totalFlakes += 1;
                    }
                });
                if(totalFlakes < fract.config.maxFlakes) {
                    fractal = fract.addRandomFractal();
                    fractal.renderToggle();
                }
            }
        }

        function resetCanvases() {
            $.each(Object.keys(fract.ctx), function () {
                fract.ctx[this].clear();
            });
        }

        function drawOnActiveCanvases() {
            $.each(fract.fractals, function () {
                //only draw active canvas
                if(this && this.render
                    && ((this.canvas !== fract.snowCanvas) || (fract.generateFlakes && this.canvas === fract.snowCanvas))) {

                    this.prepareToDraw();
                    fract.ctx[this.canvas].beginPath();
                    fract.ctx[this.canvas].moveTo(this.drawVals.x, this.drawVals.y);
                    this.turnAndDraw();

                    //add home page text
                    if(this.canvas === fract.mainCanvas) {
                        if(!this.animate) {
                            displayHomePageText(this);
                        } else if(this.texts){
                            $('.fractText').text('');
                        }
                    }
                }
            });
        }

        canvas.render = function () {
            resetCanvases();

            if(fract.generateFlakes) {
                addRandomFlakes();
            }

            drawOnActiveCanvases();
        };

        return canvas;
    }());

    return my;
}(fract || {}));