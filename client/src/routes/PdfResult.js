import Component from '../components/core';
import { getFileName } from '../js/getFileName';
import { selectText } from '../js/selectText';
import { paginationFunction } from '../js/pagination';

export default class PdfResultPage extends Component {
  template() {
    return `
    <div class="background">
  <div class="container">
    <a href="/"><i class="fas fa-solid fa-house"></i>&nbsp;처음으로</a>
    <header class="title"></header>
    <hr class="divider" />
    <main class="content"></main>
    <footer class="page-box"></footer>
  </div>
  <button class="button-prev">
    <i class="fa-solid fa-chevron-left"></i>
  </button>
  <button class="button-next">
    <i class="fa-solid fa-chevron-right"></i>
  </button>
</div>
`;
  }
  setEvent() {
    getFileName();
    selectText();
    paginationFunction();
  }
}
