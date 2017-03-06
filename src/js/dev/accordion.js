// Accordion with sliding effect
// using: jQuery
// TODO: 
// 	-event for keyboard
// 	-tabindex
// 	-option: show only one active tab or several possible
// 	-some way to call bind class methods for use in event callbacks
// 	-автоматически добавлять в классе классы элементам, элементы в дкоу вынести, в опциях нужно указыввать трлько родщителя

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
	single: true, // if true, only one tab can be active
	callbacks: {	// Callback for animation, this refers to current tab (jQuery object)
		afterSlideDown: null,
		afterSlideUp: null
	}
};


//------ Main Class ------

class Accordion {

	constructor(element, config) {
		this._element = $(element)[0]; // jquery help identify element with different selector types
		this._config = this._getConfig(config);
		this._callbacks = this._config.callbacks;

		this._setupConfig(this._config);
		this._addEventListeners();
	}


	// Events

	_addEventListeners(){
		let duration = this._config.duration;
		let single = this._config.single;
		let callbackSlideDown = this._callbacks.afterSlideDown,
		callbacksSlideUp  = this._callbacks.afterSlideUp;

		ELEMENTS.head.on('click', function(e){
			let activeTabs = ELEMENTS.content.closest(ELEMENTS.item).filter('.active'); // open tabs
			let eTarget = $(e.target);
			let currTab = eTarget.closest(ELEMENTS.item), // tab which was clicked
			currContent = eTarget.siblings(ELEMENTS.content);

			currTab.toggleClass('active');


			// Single mod

			if (single) {
				ELEMENTS.item.not(currTab).removeClass('active');

				// Slide-up content of active element
				activeTabs.find(ELEMENTS.content).slideUp(duration, () => {

					// Slide-up callback for current tab
					if (callbacksSlideUp !== undefined) {
						callbacksSlideUp.call($(this).closest('.accordion__tab')); // call with current tab
					}
				});

				// Show content of current tab if it's hidden
				if (currTab.hasClass('active')) {  // condition check class after toggleClass above
					currContent.stop().slideDown(duration, () => {

						// Slide-down callback for current tab
						if (callbackSlideDown !== undefined) {
							callbackSlideDown.call($(this).closest('.accordion__tab')); // call with current tab
						}

					});
				}
			}


			// Multi mod

			else {
				// Show content of current tab if it's hidden
				if (currTab.hasClass('active')) {
					currContent.stop().slideDown(duration, () => {

						// Slide-down callback for current tab
						if (callbackSlideDown !== undefined) {
							callbackSlideDown.call($(this).closest('.accordion__tab')); // call with current tab
						}

					});
				}
				// Hide content of current tab if it's visible
				else {
					currContent.stop().slideUp(duration, () => {

						// Slide-up callback for current tab
						if (callbacksSlideUp !== undefined) {
							callbacksSlideUp.call($(this).closest('.accordion__tab')); // call with current tab
						}

					});

				}
			} // end multi mod

		}); // end click event on ELEMENTS.head
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

} // end Accordion



const acc = new Accordion('.accordion', {
	activeItem: 0,
	duration: 1000,
	single: false,
	callbacks: {
		afterSlideDown: afterDown,
		afterSlideUp: afterUp
	}
});



function afterDown(currTab){
	console.log('slide-down complete');
}

function afterUp(currTab) {
	console.log('slide-up complete');
}
