/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    my.turnAndDraw = function (fractal) {
        var turnDepth = 0,
            startTime = Date.now(),
            drawVals = fractal.drawVals;

        function saveSnap() {
            var snap = {
                x: drawVals.x,
                y: drawVals.y,
                heading: drawVals.heading
            };

            snap.load = function () {
                drawVals.x = this.x;
                drawVals.y = this.y;
                drawVals.heading = this.heading;
                fract.ctx[fractal.canvas].moveTo(drawVals.x, drawVals.y);
            };

            return snap;
        }

        function turnLine(i) {
            var count = i / Math.pow(drawVals.motifLines, turnDepth) % drawVals.motifLines;
            if (i % drawVals.sideLines === 0) {
                drawVals.heading += (Math.PI * 2) / drawVals.poly;
            } else if (count === 0) {
                turnDepth += 1;
                turnLine(i);
                turnDepth -= 1;
            } else if (count === 1) {
                if (drawVals.mirror) {
                    drawVals.snaps[turnDepth] = saveSnap();
                }
                drawVals.heading += -drawVals.radians;
            } else if (count < 2 + drawVals.segments * (drawVals.arms + 1)) {
                if (drawVals.arms) {
                    if (count % 2 === 1) {
                        drawVals.armSnaps[turnDepth].load();
                        drawVals.heading += drawVals.segmentRadian;
                    } else {
                        drawVals.armSnaps[turnDepth] = saveSnap();
                        drawVals.heading -= (Math.PI - drawVals.segmentRadian) / 2;
                    }
                } else {
                    drawVals.heading += drawVals.segmentRadian;
                }

            } else if (count === 2 + drawVals.segments * (drawVals.arms + 1)) {
                //last turn if mirror is off, otherwise snap
                if (drawVals.mirror) {
                    drawVals.snaps[turnDepth].load();
                    drawVals.heading += drawVals.lastRadian;
                } else {
                    drawVals.heading += -drawVals.lastRadian;
                }
            } else if (count < drawVals.motifLines - 1) {
                if (drawVals.arms) {
                    if (count % 2 === 0) {
                        drawVals.armSnaps[turnDepth].load();
                        drawVals.heading -= drawVals.segmentRadian;
                    } else {
                        drawVals.armSnaps[turnDepth] = saveSnap();
                        drawVals.heading += (Math.PI - drawVals.segmentRadian) / 2;
                    }
                } else {
                    drawVals.heading -= drawVals.segmentRadian;
                }
            } else if (count === drawVals.motifLines - 1) {
                //this is the last turn, only reached when mirror is on
                drawVals.heading += drawVals.radians;
            }
        }

        function drawFractal() {
            var i = 0;

            while (i < drawVals.sideLines * drawVals.poly) {
                //frozen - redraw
                if ((Date.now() - startTime) > 50) {
                    window.requestAnimFrame(fractal.turnAndDraw());
                    break;
                } else {
                    turnLine(i);
                    drawVals.x += drawVals.unit * Math.cos(drawVals.heading);
                    drawVals.y += drawVals.unit * Math.sin(drawVals.heading);

                    fract.ctx[fractal.canvas].lineTo(drawVals.x, drawVals.y);
                    i += 1;
                }
            }
            if (i === drawVals.sideLines * drawVals.poly) {
                fract.ctx[fractal.canvas].stroke();
            }
        }

        drawFractal();
    };

    return my;
}(fract || {}));