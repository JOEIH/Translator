import Component from './core';

export default class TranslatedResult extends Component {
  template() {
    const { results } = this.props;
    return `
    <div class='translated'>
      ${results
        .map(
          (result) =>
            `<div class='translated-result'>
          <div class='lang'>${result.lang}</div>
          <div class='result'>
            <span class='text'>${result.text}</span>
            <i class="fas fa-solid fa-clipboard"></i>
          </div>
        </div>`
        )
        .join('')}
      </div>
    `;
  }
  setEvent() {
    const clipboardIcon = this.$target.querySelectorAll('i');

    clipboardIcon.forEach((icon) => {
      icon.onmousedown = (e) => {
        const targetText = e.target.parentElement.children[0].textContent;
        let copied = window.navigator.clipboard.writeText(targetText);

        if (copied) {
          icon.setAttribute('class', 'fa-solid fa-clipboard-check');
          icon.style.color = 'black';
          icon.style.opacity = '100%';
        }
      };
    });
  }
}
