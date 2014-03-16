/*global $, document, window*/
/*jslint browser : true, devel: true */
var tla = (function (my) {
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

            if((random > (1000 - tla.config.flakeGenerationSpeed))) {
                $.each(tla.fractals, function () {
                    if(this) {
                        totalFlakes += 1;
                    }
                });
                if(totalFlakes < tla.config.maxFlakes) {
                    fractal = tla.addRandomFractal();
                    fractal.renderToggle();
                }
            }
        }

        function resetCanvases() {
            $.each(Object.keys(tla.ctx), function () {
                tla.ctx[this].clear();
            });
        }

        function drawOnActiveCanvases() {
            $.each(tla.fractals, function () {
                //only draw active canvas
                if(this && this.render
                    && ((this.canvas !== tla.snowCanvas) || (tla.generateFlakes && this.canvas === tla.snowCanvas))) {

                    this.prepareToDraw();
                    tla.ctx[this.canvas].beginPath();
                    tla.ctx[this.canvas].moveTo(this.drawVals.x, this.drawVals.y);
                    this.turnAndDraw();

                    //add home page text
                    if(this.canvas === tla.mainCanvas) {
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

            if(tla.generateFlakes) {
                addRandomFlakes();
            }

            drawOnActiveCanvases();
        };

        return canvas;
    }());

    return my;
}(tla || {}));