import Component from './core';
import TranslatedResult from './translatedResult';

export default class TranslateContainer extends Component {
  setup() {
    this.state = {
      languages: ['English', 'Korean', 'Japanese', 'Chinese'],
    };
    this.text = this.props.text;
  }
  template() {
    const { languages } = this.state;
    return `
    <div class='button-container'>
      <div class='lang-select-box'>
        <span class='select-text'>언어 선택</span>
        <form name="selected-lang">
          ${languages
            .map(
              (
                item
              ) => `<input type='checkbox' name='lang' id="${item}" value="${item}"/>
              <span class='lang-button' data-for="${item}">${item}</span>
          `
            )
            .join('')}
        </form>
      </div>
      <button class='button-translate'>번역하기</button>
      </div>
    `;
  }
  setEvent() {
    const lang_button_label = this.$target.querySelectorAll('.lang-button');
    const confirm_button = this.$target.querySelector('.button-translate');

    // 언어 버튼 클릭 시 input 변경
    lang_button_label.forEach((label) => {
      label.addEventListener('click', (e) => {
        e.preventDefault();

        console.log('클릭');

        const currentTarget = e.currentTarget;

        const inputId = currentTarget.dataset['for'];
        const input = document.getElementById(inputId);

        if (input) {
          input.checked = !input.checked;
        }
      });
    });

    if (confirm_button) {
      // 확인 버튼 누르면 텍스트, 선택된 언어 값 전달
      confirm_button.onmousedown = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (this.text) {
          let selectedLangs = [];
          const checked_input = this.$target.querySelectorAll(
            'input[name="lang"]:checked'
          );

          console.log('checked: ', checked_input);

          checked_input.forEach((lang) => {
            selectedLangs.push(lang.value);
          });

          if (selectedLangs.length === 0) {
            alert('번역할 언어를 선택해주세요.');
          } else {
            onClickButton(this.text, this.$target, selectedLangs);
          }
        }
      };
    }

    async function onClickButton(text, base_tag, lang) {
      const serverURL = import.meta.env.VITE_SERVER_URL;

      const result = await getTranslatedResult(`${serverURL}`, text, lang);

      showResult(result.translations, base_tag);
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
    function showResult(result, base_tag) {
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

      const resultBox = document.createElement('div');
      base_tag.insertAdjacentElement('afterend', resultBox);

      new TranslatedResult({
        $target: resultBox,
        results: result,
      });

      base_tag.scrollIntoView();
      base_tag.remove();
    }
  }
}
