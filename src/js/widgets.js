'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Accordion with sliding effect
// vendors: jQuery
// TODO: 
// 	-event for keyboard
// 	-tabindex
// 	-some way to call bind class methods for use in event callbacks
// 	-автоматически добавлять в классе классы элементам, элементы в дкоу вынести, в опциях нужно указыввать трлько родщителя
// 	-multiple activeItems
// 	-version without jQuery

(function ($) {

	//------ Widget elements ------

	var ELEMENTS = {
		item: $('.accordion__tab'),
		head: $('.accordion__head'),
		content: $('.accordion__content')
	};

	//------ Initial config ------

	var DEFAULTS = {
		activeItem: 1, // Active item after init (0 - all hidden)
		duration: 200, // Slide duration
		single: true, // if true, only one tab can be active
		callbacks: { // Callback for active item animation, this refers to current tab (jQuery object)
			afterSlideDown: null,
			afterSlideUp: null
		}
	};

	//------ Main Class ------

	var Accordion = function () {
		function Accordion(element, config) {
			_classCallCheck(this, Accordion);

			this._element = $(element)[0]; // jquery help identify element with different selector types
			this._config = this._getConfig(config);

			this._initSetup(this._config);
			this._addEventListeners();
		}

		// Events

		_createClass(Accordion, [{
			key: '_addEventListeners',
			value: function _addEventListeners() {
				var config = this._config;
				var toggleTabContent = this.toggleTabContent;

				ELEMENTS.head.on('click', function (e) {
					var activeTab = ELEMENTS.item.filter('.active'); // open tabs
					var eTarget = $(e.target);
					var currTab = eTarget.closest(ELEMENTS.item),
					    // tab which was clicked
					currContent = eTarget.siblings(ELEMENTS.content);

					toggleTabContent(config, activeTab, currTab, currContent);
				}); // end click event on ELEMENTS.head
			}

			//------ Public ------

			// Toggle tab content (slide-down / slide-up), with callbacks

		}, {
			key: 'toggleTabContent',
			value: function toggleTabContent(config, activeTab, currTab, currContent) {
				var _this = this;

				var active = activeTab.index(currTab) == -1 ? false : true; // whether currTab open or no

				currTab.toggleClass('active');

				// Single mod
				if (config.single) {
					ELEMENTS.item.not(currTab).removeClass('active');

					if (!active) {
						activeTab.find(ELEMENTS.content).stop().slideToggle(config.duration);
					}
				}

				currContent.stop().slideToggle(config.duration, function () {

					// Slide callbacks
					if (active) {
						if (config.callbacks.afterSlideUp !== undefined) {
							config.callbacks.afterSlideUp.call($(_this).closest(ELEMENTS.item)); // call with current tab
						}
					} else {
						if (config.callbacks.afterSlideDown !== undefined) {
							config.callbacks.afterSlideDown.call($(_this).closest(ELEMENTS.item)); // call with current tab
						}
					}
				});
			}

			//------ Private ------

		}, {
			key: '_getConfig',
			value: function _getConfig(config) {
				config = $.extend({}, DEFAULTS, config);
				return config;
			}

			// Initial setup

		}, {
			key: '_initSetup',
			value: function _initSetup() {
				var activeItem = this._config.activeItem;

				ELEMENTS.item.not(':nth-child(' + activeItem + ')').find(ELEMENTS.content).hide();

				if (activeItem !== 0) {
					ELEMENTS.item.eq(activeItem - 1).addClass('active');
				}
			}
		}]);

		return Accordion;
	}(); // end Accordion


	$.fn.accordion = function (options) {
		return this.each(function () {
			new Accordion(this, options);
		});
	};
})(jQuery);

var options = {
	activeItem: 0,
	duration: 300,
	single: true,
	callbacks: {
		afterSlideDown: afterDown,
		afterSlideUp: afterUp
	}
};

$('.accordion').accordion(options);

// const acc = new Accordion('.accordion', {
// 	activeItem: 0,
// 	duration: 300,
// 	single: false,
// 	callbacks: {
// 		afterSlideDown: afterDown,
// 		afterSlideUp: afterUp
// 	}
// });

function afterDown() {
	console.log('slide-down complete');
}

function afterUp() {
	console.log('slide-up complete');
}