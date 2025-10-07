import Component from './core';

export default class TranslatedResult extends Component {
  setup() {
    this.$element = document.createElement('div');
    this.$element.setAttribute('class', 'translated');
    this.$element.insertAdjacentHTML('afterbegin', this.template());
  }
  template() {
    const { results } = this.props;
    return `
      ${results
        .map(
          (result) =>
            `<div class='translated-result'>
          <span class='lang'>${result.lang}</span>
          <span class='result'>${result.text}</span>
        </div>`
        )
        .join('')}
    `;
  }
}
