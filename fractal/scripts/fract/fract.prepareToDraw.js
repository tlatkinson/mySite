/*global $, document, window*/
/*jslint browser : true, devel: true */
var fract = (function (my) {
    'use strict';

    my.prepareToDraw = function (fractal) {
        var skewRadian,
            motifTestWidth,
            motifTestHeight,
            motifHeading,
            motifWidth,
            motifMax,
            skewCorrection,
            gap,
            shrinkRay,
            polyRadians,
            polyOffset,
            drawVals = {},
            zoomPow,
            i,
            canvasWidth,
            canvasHeight;

        function setCanvasSize() {
            canvasWidth = fract.canvasEle[fractal.canvas].clientWidth;
            canvasHeight = fract.canvasEle[fractal.canvas].clientHeight;
        }

        function setZoom() {
            if(fractal.canvas === fract.mainCanvas) {
                zoomPow = fract.config.zoomPow;

                if(canvasWidth < canvasHeight) {
                    zoomPow = fract.config.zoomPow / 2;
                }
            } else {
                zoomPow = fract.config.flakeZoomPow;
            }
        }

        function loadFractal() {
            drawVals.depth = fractal.depth.value + 1;
            drawVals.mirror = fractal.mirror.value;
            drawVals.segments = fractal.segments.value + 1;
            drawVals.poly = fractal.poly.value + 1;
            drawVals.arms = fractal.arms.value;
            drawVals.radians = fractal.angle.value * 5 * (Math.PI / 180);

            skewRadian = (fractal.angle.value - fractal.skewangle.value + fractal.skewangle.max / 2) * 5 * (Math.PI / 180);
            drawVals.segmentRadian = skewRadian * 2 / drawVals.segments;
            drawVals.lastRadian = skewRadian * 2 - drawVals.radians;
        }

        function calculateMotif () {
            motifTestWidth = 2 + Math.cos(drawVals.radians);
            motifTestHeight = Math.sin(drawVals.radians);
            motifHeading = drawVals.radians;

            for (i = 0; i < drawVals.segments; i += 1) {
                motifHeading -= drawVals.segmentRadian;
                motifTestWidth += Math.cos(motifHeading);
                motifTestHeight += Math.sin(motifHeading);
            }

            //if the correction is zero it doesn't work. default zero.
            skewCorrection = Math.atan2(motifTestHeight, motifTestWidth) || 0;
            //adjust for the highest/lowest the line gets after skew correction is applied. if it is too much change the way the shape renders.
            function adjustLine() {
                motifTestWidth += Math.cos(motifHeading);
                motifTestHeight += Math.sin(motifHeading);
                motifMax = Math.max(motifMax, Math.abs(motifTestHeight));
            }

            motifHeading = skewCorrection;
            motifTestWidth = Math.cos(motifHeading);
            motifTestHeight = Math.sin(motifHeading);
            motifMax = Math.abs(motifTestHeight);

            motifHeading -= drawVals.radians;
            adjustLine();

            for (i = 0; i < drawVals.segments; i += 1) {
                motifHeading += drawVals.segmentRadian;
                adjustLine();
            }

            motifHeading = skewCorrection;
            adjustLine();

            motifWidth = Math.abs(motifTestWidth);
        }

        function fitToCanvas() {
            if (motifWidth > 0.98) {
                //the default (would use 1, but want leeway to make up for floating point weirdness)
                drawVals.unit = canvasWidth / zoomPow / Math.abs(Math.pow(motifWidth, drawVals.depth));
                gap = fract.width / zoomPow;

            } else {
                //the fractal turns in on itself, so the start and end points won't be the limits of the shape.
                drawVals.unit = Math.abs(canvasWidth / zoomPow / (motifWidth - Math.cos(skewCorrection) * 2));
                gap = drawVals.unit * Math.pow(motifWidth, drawVals.depth);
            }

            if (motifMax * drawVals.unit > canvasWidth / zoomPow / 2) {
                //the motif sticks out too much, so the shape is shrunk.
                shrinkRay = (canvasWidth / zoomPow / 2) / (motifMax * drawVals.unit);
                drawVals.unit = drawVals.unit * shrinkRay;
                gap = gap * shrinkRay;
            }

            polyOffset = 0;
            if (drawVals.poly > 2) {
                polyRadians = Math.PI / drawVals.poly;
                polyOffset = (gap / 2) / Math.tan(polyRadians);
                if ((polyOffset * 2) > canvasWidth / zoomPow) {
                    shrinkRay = ((polyOffset * 2) / (canvasWidth / zoomPow));
                    drawVals.unit = drawVals.unit / shrinkRay;
                    gap = gap / shrinkRay;
                    polyOffset = polyOffset / shrinkRay;
                }
            }

            //the fractal turns as it starts, so act like it's just finished a side. The skews have to stack with every iteration.
            drawVals.heading = (skewCorrection * drawVals.depth - (Math.PI * 2) / drawVals.poly);
        }

        function calculateLines() {
            drawVals.motifLines = 3 + drawVals.segments;
            if (drawVals.mirror) {
                drawVals.motifLines += 1 + drawVals.segments;
            }
            if (drawVals.arms) {
                drawVals.motifLines += drawVals.segments * (drawVals.mirror + 1);
            }
            drawVals.sideLines = Math.pow(drawVals.motifLines, drawVals.depth);
        }

        function loadPosition() {
            //home page
            if(fractal.stops) {
                drawVals.x = canvasWidth / 2 - (gap / 2);
                drawVals.y = canvasHeight / 2 - polyOffset - fract.config.offset;
            //randomly generated flakes
            } else {
                drawVals.x = fractal.x * canvasWidth;
                drawVals.y = fractal.y;
            }
        }

        function resetSnaps() {
            drawVals.snaps = [];
            drawVals.armSnaps = [];
        }

        setCanvasSize();
        setZoom();
        loadFractal();
        calculateMotif();
        fitToCanvas();
        calculateLines();
        loadPosition();
        resetSnaps();

        fractal.drawVals = drawVals;
    };

    return my;
}(fract || {}));