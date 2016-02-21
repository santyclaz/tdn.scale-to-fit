/**
 *	tdn.scale-to-fit
 *
 *	Pair of directives for having content content fill to container given
 *		content aspect ratio or dimensions
 *
 *	Dependencies:
 *	- jQuery .width()
 *
 *	Notes:
 *	- Only designed to be used with with media files like videos or images
 *	- Expects container to have a set height & width
 *
 *	TODO: support giving specific pixel conditions from which to start
 *		matching on width
 *
 */

(function() {
'use strict';

var module = angular.module('tdn.scale-to-fit', []);

/**
 *	directive for target container to fill
 */

module.directive('scaleToFitContainer', [function() {
	var DEFINITION = {
		restrict: 'A',
		controller: [
			'$scope', '$element', '$attrs',
			function($scope, $element, $attrs) {
				$element.addClass('scale-to-fit-container');

				// Properties
				Object.defineProperty(this, 'width', {
					get: function() {
						return $element.width();
					}
				});
				Object.defineProperty(this, 'height', {
					get: function() {
						return $element.height();
					}
				});

				// Methods
				this.dimensions = function dimensions() {
					var dim = {
						width: this.width,
						height: this.height
					};
					return dim;
				};
			}
		]
	};

	return DEFINITION;
}]);

/**
 *	directive for content that will fill container
 *
 *	API:
 *	- scaleToFit : string 'width:height' | obj {width, height}
 *	- verticalAlign: string {center, top, bottom, inherit} : default 'center'
 *	- horizontalAlign: string {center, left, right, inherit} : default 'center'
 */

module.directive('scaleToFit', [function() {
	var DIRECTIVE = 'scaleToFit';
	var DEFINITION = {
		restrict: 'A',
		require: '^scaleToFitContainer',
		scope: {
			scaleToFit: '=scaleToFit', // string | obj{width, height}
			verticalAlign: '=verticalAlign', // string {center, top, bottom}
			horizontalAlign: '=horizontalAlign', // string {center, left, right}
		},
		link: function(scope, element, attrs, containerCtrl) {
			element.addClass('scale-to-fit');

			scope.$watch('scaleToFit', function(val) {
				var dimensionObj = null;

				// handle case object passed in
				if (typeof val === 'object') {
					dimensionObj = val;
				}
				// handle case string passed in
				if (typeof val === 'string') {
					dimensionObj = parseAspectRatio(val);
				}
				validateDimensionObj(dimensionObj);
				contentAspectRatio = new AspectRatio(dimensionObj.width, dimensionObj.height);
			});

			scope.$watch('verticalAlign', function(alignment) {
				setVerticalAlign(alignment);
			});

			scope.$watch('horizontalAlign', function(alignment) {
				setHorizontalAlign(alignment);
			});


			var contentAspectRatio = new AspectRatio(1, 1);


			/**
			 *	Events from which to trigger check
			 */

			window.addEventListener('resize',
				function() {
					var dimensions = containerCtrl.dimensions();
					var aspectRatio = new AspectRatio(dimensions.width, dimensions.height);
					setClass(aspectRatio);
				},
				true);

			scope.$watch(
				function() {
					return containerCtrl.dimensions();
				},
				function(newDimensions) {
					var aspectRatio = new AspectRatio(newDimensions.width, newDimensions.height);
					setClass(aspectRatio);
				},
				true);


			/**
			 *	Helper functions
			 */

			function setClass(containerAspectRatio) {
				// if content ratio is less than container ratio, need to fill width
				if (contentAspectRatio < containerAspectRatio) {
					setFillWidth();
				}
				// if content ratio is greather than container ratio, need to fill width
				else if (contentAspectRatio > containerAspectRatio) {
					setFillHeight();
				}
			}

			function setFillWidth() {
				element.addClass('fill-width');
				element.removeClass('fill-height');
			}
			function setFillHeight() {
				element.removeClass('fill-width');
				element.addClass('fill-height');
			}

			function setVerticalAlign(alignment) {
				clearVerticalAlign();

				switch (alignment) {
					// if inherit, don't apply any preset alignment classes
					case 'inherit':
						break;
					case 'top':
						element.addClass('top');
						break;
					case 'bottom':
						element.addClass('bottom');
						break;
					// default to center alignment
					default:
					case 'center':
						element.addClass('vertical-center');
				}
			}
			function clearVerticalAlign() {
				element.removeClass('vertical-center');
				element.removeClass('top');
				element.removeClass('bottom');
			}

			function setHorizontalAlign(alignment) {
				clearHorizontalAlign();

				switch (alignment) {
					// if inherit, don't apply any preset alignment classes
					case 'inherit':
						break;
					case 'left':
						element.addClass('left');
						break;
					case 'right':
						element.addClass('right');
						break;
					// default to center alignment
					default:
					case 'center':
						element.addClass('horizontal-center');
				}
			}
			function clearHorizontalAlign() {
				element.removeClass('horizontal-center');
				element.removeClass('left');
				element.removeClass('right');
			}

			function parseAspectRatio(aspectRatioString) {
				var parts = aspectRatioString.trim().split(':');
				var width = parseFloat(parts[0]);
				var height = parseFloat(parts[1]);

				var aspectRatio = {
					width: width,
					height: height
				};
				return aspectRatio;
			}

			function validateDimensionObj(dimensions) {
				var errorMsgPrefix = '[' + DIRECTIVE + ']';

				if (typeof dimensions !== 'object'
					|| dimensions === null
					|| !('width' in dimensions)
					|| !('height' in dimensions))
				{
					throw new Error(errorMsgPrefix + ' width and height required!');
				}
				if (typeof dimensions.width !== 'number') {
					throw new Error(errorMsgPrefix + ' invalid width "' + dimensions.width + '"');
				}
				if (typeof dimensions.height !== 'number') {
					throw new Error(errorMsgPrefix + ' invalid height "' + dimensions.height + '"');
				}
			}

			/**
			 * Helper constructor
			 */

			function AspectRatio(width, height) {
				this.width = width;
				this.height = height;
			}
			AspectRatio.prototype.valueOf = function valueOf() {
				return this.width / this.height;
			};
		}
	};

	return DEFINITION;
}]);


})();