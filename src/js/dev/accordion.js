// Accordion with sliding effect
// using: jQuery
// TODO: event for keyboard, tabindex, 

//------ Widget elements ------

const ELEMENTS = {
	item: $('.accordion__tab'),
	head: $('.accordion__head'),
	content: $('.accordion__content')
};

//------ Initial config ------

const DEFAULTS = {
	activeItem: 1,	// Active item after init (0 - all hidden)
	duration: 200, // Slide duration
	callbacks: {	// Callback for animation
		afterSlideDown: null,
		afterSlideUp: null
	}
};


//------ Main Class ------

class Accordion {

	constructor(element, config) {
		this._element = $(element)[0]; // jquery help identify element with different selectors
		this._config = this._getConfig(config);
		this._callbacks = this._config.callbacks;

		this._setupConfig(this._config);
		this._addEventListeners();
	}

	

	// Events

	_addEventListeners(){
		let duration = this._config.duration;
		let callback = this.afterSlideDown();

		ELEMENTS.head.on('click', function(e){
			ELEMENTS.content.slideUp(duration);

			if ($(this).closest(ELEMENTS.item).hasClass('active')) {
				$(this).closest(ELEMENTS.item).removeClass('active');
			}
			else {
				ELEMENTS.item.removeClass('active');
				$(this).closest(ELEMENTS.item).addClass('active');
				$(this).siblings(ELEMENTS.content).stop().slideDown(duration, function(){
					if (callback !== undefined) {
						callback();
					}
				});
			}


		});
	}

	// Callback events

	afterSlideDown(){
		if (this._callbacks.afterSlideDown !== null) {
			let slideDown = new CustomEvent('afterSlideDown', {
				detail: {},
				bubbles: true,
				cancelable: true
			});
			let callback = this._callbacks.afterSlideDown.bind(this);

			this._element.addEventListener('afterSlideDown', function(e) {
				callback();
			});

			return this._element.dispatchEvent.bind(this._element, slideDown);
		}
	}

	//------ Private ------

	_getConfig(config){
		config = $.extend({}, DEFAULTS, config);
		return config;
	}

	// Initial setup

	_setupConfig(config){
		let activeItem = this._config.activeItem;

		ELEMENTS.item.not(`:nth-child(${activeItem})`).find(ELEMENTS.content).hide();
		ELEMENTS.item.eq(activeItem - 1).addClass('active');
	}

} // end Accordion



var acc = new Accordion('.accordion', {
		activeItem: 0,
		duration: 200,
		callbacks: {
			afterSlideDown: afterDown
		}
	});



function afterDown(){
	console.log('slide is down');
}
