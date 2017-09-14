import './select.sass';

/**
 * TODO
 * - store a wrapper in the state (optionsList.parentNode => this.wrapper)
 */

class Select {
  constructor(selector, options) {
    this.defaults = {};
    this.state = {};
    this.options = this.setOptions(options);
    this.element = document.querySelector(selector);
    this.selectors = {
      wrap: 'select-wrap',
      wrapOpened: 'select-wrap_opened',
      optionActive: 'select-option-active',
      optionsList: 'select-options',
      option: 'select-option',
      optionSelected: 'select-option_selected',
    };

    this.parseElement();

    this.render();
  }

  setOptions(options) {
    return Object.assign({}, this.defaults, options);
  }

  /**
   * Analyzes the structure of an element,
   * and stores certain values
   */
  parseElement() {
    // static collection
    const selectOptions = this.element.querySelectorAll('option');

    // selected option
    let selectedOptionIndex = 0;
    let selectedOptionText = selectOptions[0].textContent;

    [...selectOptions].map((option, i) => {
      if (option.hasAttribute('selected')) {
        selectedOptionIndex = i;
        selectedOptionText = option.textContent;
      }
    });

    this.state.selectOptions = selectOptions;
    this.state.selectedOptionText = selectedOptionText;
    this.state.selectedOptionIndex = selectedOptionIndex;
  }

  get value() {
    return this.state.selectedOptionText;
  }
  set value(value) {
    this.state.selectedOptionText = value;
  }

  renderOption(element, index) {
    const option = document.createElement('li');

    // Html-structure
    option.classList.add(this.selectors.option);
    option.dataset.index = index;

    if (this.state.selectedOptionIndex === index) {
      option.classList.add(this.selectors.optionSelected);
    }

    // Text
    option.textContent = element.textContent;

    return option;
  }

  renderActiveOption() {
    const activeOption = document.createElement('div');
    activeOption.classList.add(this.selectors.optionActive);
    activeOption.textContent = this.state.selectedOptionText;

    activeOption.addEventListener('click', event => {
      event.target.parentNode.classList.toggle(
        this.selectors.wrapOpened,
      );
    });

    return activeOption;
  }

  updateActiveOption() {}

  renderOptionsList() {
    const optionsList = document.createElement('ul');
    optionsList.classList.add(this.selectors.optionsList);

    [...this.state.selectOptions].map((option, i) => {
      optionsList.appendChild(this.renderOption(option, i));
    });

    // Handle option-elements clicks with delegation
    optionsList.addEventListener('click', event => {
      const target = event.target;
      const index = parseInt(target.dataset.index, 10);
      const text = target.textContent;

      optionsList.parentNode.classList.remove(this.selectors.wrapOpened);

      this.state.selectedOptionText = text;
      this.state.selectedOptionIndex = index;

      optionsList.previousSibling.textContent = text;

      [...this.state.selectOptions].map((option, i) => {
        if (index === i) option.setAttribute('selected', '');
        else option.removeAttribute('selected');
      });
    });

    return optionsList;
  }

  render() {
    const elementParent = this.element.parentNode;

    // Create a wrapper
    const wrap = document.createElement('div');
    wrap.classList.add(this.selectors.wrap);

    elementParent.appendChild(wrap);

    // Append containers
    wrap.appendChild(this.element);
    wrap.appendChild(this.renderActiveOption());
    wrap.appendChild(this.renderOptionsList());
  }
}

export default Select;
