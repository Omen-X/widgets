import './select.sass';

// analyze node => set some options
// render a new custom element

class Select {
  constructor(selector, options) {
    this.defaults = {};
    this.options = this.setOptions(options);
    this.selector = selector;
    this.element = document.querySelector(selector);

    this.setOptions(options);
    this.parseNode();

    this.classes = {
      wrap: 'select-wrap',
      optionActive: 'select-option_active',
      optionsList: 'select-options',
      option: 'select-option',
      optionSelected: 'select-option_selected',
    };

    this.render();
  }

  setOptions(options) {
    return Object.assign({}, this.defaults, options);
  }

  /**
   * Analyzes the structure of an element,
   * and stores certain values in the options object
   */
  parseNode() {
    // static collection
    const selectOptions = document.querySelectorAll(`${this.selector} option`);

    // selected option
    let selectedOptionIndex = 0;
    [...selectOptions].map((option, i) => {
      if (option.hasAttribute('selected')) selectedOptionIndex = i;
    });

    this.options.selectOptions = selectOptions;
    this.options.selectedOptionIndex = selectedOptionIndex;
  }

  renderOption(element, index) {
    const option = document.createElement('li');

    // Html-structure
    option.classList.add(this.classes.option);
    option.dataset.index = index;

    if (this.selectedOptionIndex === index) {
      option.classList.add(this.classes.optionSelected);
    }

    // Text
    option.textContent = element.textContent;

    return option;
  }

  renderActiveOption() {
    // Create an active option
    const activeOption = document.createElement('div');
    activeOption.classList.add(this.classes.optionActive);

    return activeOption;
  }

  renderOptionsList() {
    // Create an options list
    const optionsList = document.createElement('ul');
    optionsList.classList.add(this.classes.optionsList);

    [...this.options.selectOptions].map((option, i) => {
      optionsList.appendChild(this.renderOption(option, i));
    });

    return optionsList;
  }

  render() {
    const elementParent = this.element.parentNode;

    // Create a wrapper
    const wrap = document.createElement('div');
    wrap.classList.add(this.classes.wrap);

    elementParent.appendChild(wrap);

    wrap.appendChild(this.element);
    wrap.appendChild(this.renderActiveOption());
    wrap.appendChild(this.renderOptionsList());
  }
}

export default Select;
