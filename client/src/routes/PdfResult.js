import Component from '../components/core';
import { getFileName } from '../js/getFileName';
import { selectText } from '../js/selectText';
import { paginationFunction } from '../js/pagination';

export default class PdfResultPage extends Component {
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
    const response = await fetch('/pdfResult.html');
    const html = await response.text();

    this.$target.innerHTML = html;

    this.renderAfter();
  }
  renderAfter() {
    getFileName();
    selectText();
    paginationFunction();
  }
  removeEvent() {}
}
