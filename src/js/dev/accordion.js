// Accordion with sliding effect
// vendors: jQuery
// TODO: 
// 	-event for keyboard
// 	-tabindex
// 	-some way to call bind class methods for use in event callbacks
// 	-version without jQuery

(function($){



//------ Widget elements ------


const CLASSES = {
	item: 'accordion__tab',
	head: 'accordion__head',
	content: 'accordion__content'
};


	// Init classes
$('.accordion').children().addClass(CLASSES.item)
					.each(function() {
						$(this).children().first().addClass(CLASSES.head)
												.end().last().addClass(CLASSES.content);
					});


//------ Initial config ------

const DEFAULTS = {
	activeItem: 1,	// Active item after init (0 - all hidden)
	duration: 200, // Slide duration
	single: true, // if true, only one tab can be active
	callbacks: {	// Callback for active item animation, this refers to current tab (jQuery object)
		afterSlideDown: null,
		afterSlideUp: null
	}
};


//------ Main Class ------

class Accordion {

	constructor(element, config) {
		this._element = $(element); // jquery help identify element with different selector types
		this._config = this._getConfig(config);

		this.ELEMENTS = {
			item: $('.accordion__tab', this._element),
			head: $('.accordion__head', this._element),
			content: $('.accordion__content', this._element)
		};
		this._initSetup();
		this._addEventListeners();

	}


	// Events

	_addEventListeners(){
		const config = this._config;
		const toggleTabContent = this.toggleTabContent;
		const ELEMENTS = this.ELEMENTS;

		this.ELEMENTS.head.on('click', function(e){
			let activeTab = ELEMENTS.item.filter('.active'); // open tabs
			let eTarget = $(e.target);
			let currTab = eTarget.closest(ELEMENTS.item), // tab which was clicked
			currContent = eTarget.siblings(ELEMENTS.content);

			toggleTabContent(config, activeTab, currTab, currContent, ELEMENTS);

		}); // end click event on ELEMENTS.head
	}


	//------ Public ------

	// Toggle tab content (slide-down / slide-up), with callbacks

	toggleTabContent(config, activeTab, currTab, currContent, ELEMENTS){
		let active = activeTab.index(currTab) == -1 ? false : true;	// whether currTab open or no

		currTab.toggleClass('active');

		// Single mod
		if (config.single) {
			ELEMENTS.item.not(currTab).removeClass('active');

			if (!active) {
				activeTab.find(ELEMENTS.content).stop().slideToggle(config.duration);
			}

		}

		currContent.stop().slideToggle(config.duration, () => {

			// Slide callbacks
			if (active) {
				if (config.callbacks.afterSlideUp != undefined) {
					config.callbacks.afterSlideUp.call($(this).closest(ELEMENTS.item)); // call with current tab
				}
			}
			else {
				if (config.callbacks.afterSlideDown != undefined) {
					config.callbacks.afterSlideDown.call($(this).closest(ELEMENTS.item)); // call with current tab
				}
			}

		});

	}


	//------ Private ------

	_getConfig(config){
		config = $.extend({}, DEFAULTS, config);
		return config;
	}

	// Initial setup

	_initSetup(){
		let activeItem = this._config.activeItem;

		this.ELEMENTS.item.not(`:nth-child(${activeItem})`).find(this.ELEMENTS.content).hide();

		if (activeItem !== 0) {
			this.ELEMENTS.item.eq(activeItem - 1).addClass('active');
		}
	}


} // end Accordion


$.fn.accordion = function(options) {
	return this.each(function(){
		new Accordion(this, options);
	});
};


}(jQuery));


