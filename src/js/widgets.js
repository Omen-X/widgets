'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Accordion with sliding effect
// using: jQuery
// TODO: event for keyboard, tabindex, 

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
	callbacks: { // Callback for animation
		afterSlideDown: null,
		afterSlideUp: null
	}
};

//------ Main Class ------

var Accordion = function () {
	function Accordion(element, config) {
		_classCallCheck(this, Accordion);

		this._element = $(element)[0]; // jquery help identify element with different selectors
		this._config = this._getConfig(config);
		this._callbacks = this._config.callbacks;

		this._setupConfig(this._config);
		this._addEventListeners();
	}

	// Events

	_createClass(Accordion, [{
		key: '_addEventListeners',
		value: function _addEventListeners() {
			var duration = this._config.duration;
			var callback = this.afterSlideDown();

			ELEMENTS.head.on('click', function (e) {
				ELEMENTS.content.slideUp(duration);

				if ($(this).closest(ELEMENTS.item).hasClass('active')) {
					$(this).closest(ELEMENTS.item).removeClass('active');
				} else {
					ELEMENTS.item.removeClass('active');
					$(this).closest(ELEMENTS.item).addClass('active');
					$(this).siblings(ELEMENTS.content).stop().slideDown(duration, function () {
						if (callback !== undefined) {
							callback();
						}
					});
				}
			});
		}

		// Callback events

	}, {
		key: 'afterSlideDown',
		value: function afterSlideDown() {
			if (this._callbacks.afterSlideDown !== null) {
				var slideDown = new CustomEvent('afterSlideDown', {
					detail: {},
					bubbles: true,
					cancelable: true
				});
				var callback = this._callbacks.afterSlideDown.bind(this);

				this._element.addEventListener('afterSlideDown', function (e) {
					callback();
				});

				return this._element.dispatchEvent.bind(this._element, slideDown);
			}
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
		key: '_setupConfig',
		value: function _setupConfig(config) {
			var activeItem = this._config.activeItem;

			ELEMENTS.item.not(':nth-child(' + activeItem + ')').find(ELEMENTS.content).hide();
			ELEMENTS.item.eq(activeItem - 1).addClass('active');
		}
	}]);

	return Accordion;
}(); // end Accordion


var acc = new Accordion('.accordion', {
	activeItem: 0,
	duration: 200,
	callbacks: {
		afterSlideDown: afterDown
	}
});

function afterDown() {
	console.log('slide is down');
}