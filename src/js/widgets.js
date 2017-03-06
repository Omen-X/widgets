'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Accordion with sliding effect
// using: jQuery
// TODO: 
// 	-event for keyboard
// 	-tabindex
// 	-option: show only one active tab or several possible
// 	-some way to call bind class methods for use in event callbacks

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
	callbacks: { // Callback for animation, this refers to current tab (jQuery object)
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
		this._callbacks = this._config.callbacks;

		this._setupConfig(this._config);
		this._addEventListeners();
	}

	// Events

	_createClass(Accordion, [{
		key: '_addEventListeners',
		value: function _addEventListeners() {
			var duration = this._config.duration;
			var single = this._config.single;
			var callbackSlideDown = this._callbacks.afterSlideDown,
			    callbacksSlideUp = this._callbacks.afterSlideUp;

			ELEMENTS.head.on('click', function (e) {
				var _this = this;

				var activeTabs = ELEMENTS.content.closest(ELEMENTS.item).filter('.active'); // open tabs
				var eTarget = $(e.target);
				var currTab = eTarget.closest(ELEMENTS.item),
				    // tab which was clicked
				currContent = eTarget.siblings(ELEMENTS.content);

				currTab.toggleClass('active');

				// Single mod

				if (single) {
					ELEMENTS.item.not(currTab).removeClass('active');

					// Slide-up content of active element
					activeTabs.find(ELEMENTS.content).slideUp(duration, function () {

						// Slide-up callback for current tab
						if (callbacksSlideUp !== undefined) {
							callbacksSlideUp.call($(_this).closest('.accordion__tab')); // call with current tab
						}
					});

					// Show content of current tab if it's hidden
					if (currTab.hasClass('active')) {
						// condition check class after toggleClass above
						currContent.stop().slideDown(duration, function () {

							// Slide-down callback for current tab
							if (callbackSlideDown !== undefined) {
								callbackSlideDown.call($(_this).closest('.accordion__tab')); // call with current tab
							}
						});
					}
				}

				// Multi mod

				else {
						// Show content of current tab if it's hidden
						if (currTab.hasClass('active')) {
							currContent.stop().slideDown(duration, function () {

								// Slide-down callback for current tab
								if (callbackSlideDown !== undefined) {
									callbackSlideDown.call($(_this).closest('.accordion__tab')); // call with current tab
								}
							});
						}
						// Hide content of current tab if it's visible
						else {
								currContent.stop().slideUp(duration, function () {

									// Slide-up callback for current tab
									if (callbacksSlideUp !== undefined) {
										callbacksSlideUp.call($(_this).closest('.accordion__tab')); // call with current tab
									}
								});
							}
					} // end multi mod
			}); // end click event on ELEMENTS.head
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

			if (activeItem !== 0) {
				ELEMENTS.item.eq(activeItem - 1).addClass('active');
			}
		}

		// Show tab content (slide-down)

		// _showTabContent(){
		// 	let currContent = this.currContent;
		// 	currContent.stop().slideDown(duration, () => {

		// 		// Slide-down callback for current tab
		// 		if (callbackSlideDown !== undefined) {
		// 			callbackSlideDown.call($(this).closest('.accordion__tab')); // call with current tab
		// 		}

		// 	});
		// }

	}]);

	return Accordion;
}(); // end Accordion


var acc = new Accordion('.accordion', {
	activeItem: 0,
	duration: 1000,
	single: false,
	callbacks: {
		afterSlideDown: afterDown,
		afterSlideUp: afterUp
	}
});

function afterDown(currTab) {
	console.log('slide-down complete');
}

function afterUp(currTab) {
	console.log('slide-up complete');
}