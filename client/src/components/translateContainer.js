import Component from './core';
import TranslatedResult from './translatedResult';

export default class TranslateContainer extends Component {
  setup() {
    this.state = {
      languages: ['English', 'Korean', 'Japanese', 'Chinese'],
    };
    this.text = this.props.text;
    this.$element = document.createElement('div');
    this.$element.setAttribute('class', 'button-container');
    this.$element.insertAdjacentHTML('afterbegin', this.template());
  }
  template() {
    const { languages } = this.state;
    return `
      <div class='lang-select-box'>
        <span class='select-text'>언어 선택</span>
        <form name="selected-lang">
          ${languages
            .map(
              (
                item
              ) => `<input type='checkbox' name='lang' id="${item}" value="${item}"/>
              <label class='lang-button' for="${item}">${item}</label>
          `
            )
            .join('')}
        </form>
      </div>
      <button class='button-translate'>번역하기</button>
    `;
  }
  setEvent() {
    const confirm_button = this.$element.querySelector('.button-translate');

    // 확인 버튼 누르면 텍스트, 선택된 언어 값 전달
    confirm_button.onclick = () => {
      if (this.text) {
        let selectedLangs = [];
        const lang_button_input = this.$element.querySelectorAll(
          'input[name="lang"]:checked'
        );

        lang_button_input.forEach((lang) => {
          selectedLangs.push(lang.value);
        });

        if (selectedLangs.length === 0) {
          alert('번역할 언어를 선택해주세요.');
        } else {
          onClickButton(this.text, this.$target, selectedLangs);

          this.$element.remove();
        }
      }
    };

    async function onClickButton(text, base_tag, lang) {
      const result = await getTranslatedResult(
        `${import.meta.env.VITE_SERVER_URL}`,
        text,
        lang
      );

      const div = showResult(result.translations);

      if (div) {
        base_tag.appendChild(div);
      }
    }

    // 번역된 결과를 가져오는 api 요청
    async function getTranslatedResult(url = '', text, lang) {
      if (!text) {
        return alert('선택된 텍스트가 없습니다.');
      } else {
        const response = await fetch(`${url}/api/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            lang: lang,
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.log('error: ', errorMessage);
          alert('번역 실패');
          return;
        }

        const data = await response.json();

        return data.result;
      }
    }

    // 번역 결과창
    function showResult(result) {
      if (!result) {
        alert('번역 실패');
        return;
      }

      // 이전 번역 결과 중첩되지 않게 삭제처리
      const translated = document.querySelectorAll('.translated');
      if (translated) {
        translated.forEach((item) => {
          item.remove();
        });
      }

      const resultBox = new TranslatedResult({
        results: result,
      });

      return resultBox.$element;
    }
  }
}
