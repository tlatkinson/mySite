/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    my.angleModel = function (value, max, id, steps) {
        var angleModel = fract.part(value, max, 0, id);

        angleModel.steps = steps;
        angleModel.animate = true;
        angleModel.speed = 0;

        angleModel.nudge = function (stepIndex, animationIndex) {
            var next,
                speed = this.speed;

            if(!this.steps) {
                if(id === 'angle') {
                    speed = fract.config.defaultSpeed / 2;
                } else if (id === 'skewAngle') {
                    speed = fract.config.defaultSpeed / 5;
                }
            }

            if(this.animate) {
                next = this.value + speed;

                if(steps && (animationIndex === (fract.config.iterations - 1))){
                    next = this.steps[stepIndex];
                }

                this.update(next);
            }
        };

        angleModel.calculateNextSpeed = function (stepIndex) {
            var first,
                second;

            first = this.steps[stepIndex];

            if(stepIndex === (this.steps.length - 1)) {
                second = this.steps[0];
            } else {
                second = this.steps[stepIndex+ 1];
            }

            if(second > first) {
                this.speed = second - first;
            } else {
                this.speed = (this.max - first) + second;
            }

            this.speed = this.speed / fract.config.iterations;
        };

        return angleModel;
    };

    return my;
}(fract || {}));