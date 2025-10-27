import Component from '../components/core';
import { homepageFunction } from '../js/uploadFile';

export default class HomePage extends Component {
  constructor({ $target, ...props }) {
    super({ $target, ...props });
  }
  setup() {
    this.getHtml();
  }
  render() {
    this.$target.innerHTML = `<h1>Loading...</h1>`;
  }
  async getHtml() {
    const response = await fetch('/home.html');
    const html = await response.text();

    this.$target.innerHTML = html;

    this.renderAfter();
  }

  renderAfter() {
    homepageFunction();
  }
}
