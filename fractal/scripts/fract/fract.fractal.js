/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    //TODO add base snowflake class and extend
    my.fractal = function (poly, segments, mirror, arms, depth, canvas, index, angleSteps, skewSteps, stops, texts) {
        var fractal = {},
            initialAngle,
            initialSkew;

        //for front page
        if(angleSteps) {
            initialAngle = angleSteps[0];
            initialSkew = skewSteps[0];
            fractal.render = true;
            fractal.animate = true;
        //for snowflakes
        } else {
            initialAngle = 0;
            initialSkew = 0;
            fractal.descendRate = (Math.random() * (fract.config.descendRate)) + 0.2;

            fractal.x = Math.random();
            fractal.y = -18;
            fractal.render = false;
            fractal.animate = false;
        }

        fractal.index = index;
        fractal.angle = fract.angleModel(initialAngle, 1800, "angle", angleSteps);
        fractal.skewangle = fract.angleModel(initialSkew, 900, "skewAngle", skewSteps);
        fractal.poly = fract.part(poly, 6, 2, "poly");
        fractal.segments = fract.part(segments, 2, 0, "segments");
        fractal.mirror = fract.part(mirror, 2, 0, "mirror");
        fractal.arms = fract.part(arms, 2, 0, "arms");
        fractal.depth = fract.part(depth, 1, 0, "depth");
        fractal.animationIndex = 0;
        fractal.stopIndex = 0;
        fractal.stops = stops;
        fractal.texts = texts;
        fractal.iterations = fract.config.iterations;
        fractal.canvas = canvas;

        //handles first iteration
        function valuesEqualStep() {
            return (fractal.angle.value === fractal.angle.steps[fractal.stopIndex])
                && (fractal.skewangle.value === fractal.skewangle.steps[fractal.stopIndex]);
        }

        fractal.nextStep = function () {
            this.animate = true;

            fractal.angle.calculateNextSpeed(this.stopIndex);
            fractal.skewangle.calculateNextSpeed(this.stopIndex);

            this.animationIndex = 0;
            this.stopIndex += 1;

            if((this.stopIndex === this.stops.length)) {
                this.stopIndex = 0;

            }
        };

        fractal.nudge = function () {
            var fractal = this;

            if(angleSteps && ((this.animationIndex === fract.config.iterations) || valuesEqualStep())) {
                this.animate = false;

                if(this.stops[this.stopIndex]) {
                    setTimeout(function () {
                        fractal.nextStep();
                    }, fract.config.timeout);
                } else {
                    this.nextStep();
                }
            } else if(!angleSteps) {
                this.y += this.descendRate;

                if(this.y > fract.canvasEle[this.canvas].height) {
                    this.destroy();
                }
            }

            if(this.animate) {
                this.angle.nudge(this.stopIndex, this.animationIndex);
                this.skewangle.nudge(this.stopIndex, this.animationIndex);

                if(angleSteps) {
                    this.animationIndex += 1;
                }
            }
        };

        fractal.prepareToDraw = function () {
            fract.prepareToDraw(fractal);
        };

        fractal.turnAndDraw = function () {
            fract.turnAndDraw(fractal);
        };

        fractal.reset = function () {
            if(angleSteps) {
                this.stopIndex = 0;
                this.animationIndex = 0;
                $('.fractText').text('');
            }

            this.angle.value = angleSteps[0];
            this.skewangle.value = skewSteps[0];
            fract.ctx[this.canvas].clear();
        };

        fractal.destroy = function () {
            fract.destroyFractal(index);
        };

        fractal.animateToggle = function () {
            if(this.animate) {
                this.animate = false;
            } else {
                this.animate = true;
            }
        };

        fractal.renderToggle = function () {
            if(this.render) {
                this.render = false;
                this.animate = false;
            } else {
                this.render = true;
                this.animate = true;
            }
        };

        fractal.toString = function () {
            return "angle: " + this.angle.value.toFixed(2)
                + " skewangle: " + this.skewangle.value.toFixed(2)
                + " poly: " + this.poly.value
                + " segments: " + this.segments.value
                + " mirror: " + this.mirror.value
                + " arms: " + this.arms.value
                + " depth: " + this.depth.value
                + " hash: " + (('000' + (Math.round(this.angle.value * 5))).substr(-4)) + "," +
                ('000' + (Math.round(this.skewangle.value * 5))).substr(-4);
        };

        function init() {
            fractal = fract.calculateLoop(fractal);

            //for front page
            if(angleSteps) {
                fractal.angle.calculateNextSpeed(fractal.stopIndex);
                fractal.skewangle.calculateNextSpeed(fractal.stopIndex);
            }
        }

        init();

        return fractal;
    };

    return my;
}(fract || {}));