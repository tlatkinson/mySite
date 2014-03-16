/*global $, fract, document, window*/
/*jslint browser : true, devel: true */

//TODO add tal logo, mobile nav bar
(function () {
    'use strict';

    $(document).ready(function () {
        var steps,
            anchors = {};

        function stepCreator () {
            var angleSteps = [],
                skewangleSteps = [],
                stops = [],
                texts = [];

            $.each(arguments, function () {
                angleSteps[angleSteps.length] =         this[0];
                skewangleSteps[skewangleSteps.length] = this[1];
                stops[stops.length] = this[2];
                texts[texts.length] = this[3];
            });

            return [angleSteps, skewangleSteps, stops, texts];
        }

        function addEventListeners() {
            window.addEventListener('orientationchange', function () {
                fract.fixSize();
            });
        }

        function setupHomePage() {
            steps = stepCreator(
                [0,     0,  true, [{text : "Tyler Atkinson", id : 'middleText'}]],
                [54,    30, false],
                [108,   54, true, [
                    {text : "Developer", id : 'middleText'},
                    {text : "JavaScript", id : 'upperText'},
                    {text : "Java", id : 'lowerLeftText'},
                    {text : ".NET", id : 'lowerRightText'}
                ]],
                [140,   22,  false],
                [180,   54, true, [{text : "Gamer", id : 'middleText'}]],
                [80,    0,  false],
                [162,   54, true, [{text : "Designer", id : 'middleText'}]],
                [186,    62,  false]
            );

            fract.init();
            fract.addFractal(2, 2, 0, 0, 1, fract.mainCanvas, steps[0], steps[1], steps[2], steps[3]);
            fract.animate.toggle();
        }

        function init() {
            setupHomePage();
            addEventListeners();

            anchors.hello = "Hello";
            anchors.projects = "Projects";

            $.fn.fullpage({
                verticalCentered: true,
                resize: true,
                easing: 'easeInQuart',
                anchors: [anchors.hello, anchors.projects],
                navigation: true,
                navigationPosition: "right",
                afterLoad: function (anchorLink) {
                    switch(anchorLink) {
                        case anchors.hello:
                            fract.fractals[0].reset();
                            fract.fractals[0].render = true;
                            $('#fullPage-nav').show();
                            break;
                        case anchors.projects:
                            fract.fixSize();
                            fract.generateFlakes = true;
                            fract.toggleFlakes(true);
                            $('#fullPage-nav').hide();
                            break;
                    }
                },
                onLeave: function (index) {
                    switch(index) {
                        case 1:
                            break;
                        case 2:
                            fract.fractals[0].render = false;
                            fract.generateFlakes = false;
                            fract.toggleFlakes(false);
                            break;
                    }
                }
            });

            $(window).trigger('resize');
        }

        init();
    });
}());