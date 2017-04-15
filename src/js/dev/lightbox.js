// Lightbox
// vendors: jQuery
// TODO:

(function ($) {
//------ Widget elements ------

const CLASSES = {
   content: 'accordion__content'
};


   // Init classes
$('.widgetname').children().addClass(CLASSES.item)
               .each(function () {
                  $(this).children().first().addClass(CLASSES.head)
                                    .end().last().addClass(CLASSES.content);
               });


//------ Initial config ------

const DEFAULTS = {
};


//------ Main Class ------

class WidgetName {

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

   _addEventListeners() {
      const config = this._config;
      const toggleTabContent = this.toggleTabContent;
      const ELEMENTS = this.ELEMENTS;

   }


   //------ Public ------


   //------ Private ------

   _getConfig(config) {
      const configs = $.extend({}, DEFAULTS, config);
      return configs;
   }

   // Initial setup

   _initSetup() {

   }


} // end WidgetName


$.fn.widgetName = function (options) {
   return this.each(function () {
      new WidgetName(this, options);
   });
};


}(jQuery));
