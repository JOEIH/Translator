const confirm_button = document.createElement('button');

// 텍스트를 드래그하면 번역하기 버튼 생성
document.addEventListener('mouseup', function (e) {
  if (e.target.tagName == 'BUTTON') return;

  const selection = document.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) return;

  // focusNode로 선택한 영역의 가장 끝에 있는 노드 가져오기
  // const base_tag = selection.baseNode.parentNode;
  const base_tag = selection.focusNode.parentNode;

  if (!base_tag.classList.contains('extracted')) return;

  // 이전 버튼 요소들 중첩되지 않게 삭제처리
  const buttons = document.querySelectorAll('.button-translate');
  if (buttons) {
    buttons.forEach((item) => {
      item.remove();
    });
  }

  let send_text = selectedText;

  confirm_button.setAttribute('class', 'button-translate');
  confirm_button.textContent = '번역하기';
  base_tag.appendChild(confirm_button);

  // 번역하기 버튼 누르면 api 요청 전송
  confirm_button.onclick = () => {
    if (send_text) {
      onClickButton(send_text, base_tag);

      confirm_button.remove();
    }
  };
});

// 번역된 결과를 가져오는 api 요청
async function getTranslatedResult(url = '', text) {
  if (!text) {
    return alert('선택된 텍스트가 없습니다.');
  } else {
    const response = await fetch(`${url}/api/translate?text=${text}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

// 번역하기 버튼 클릭할 때 요청 전송
async function onClickButton(selectedText, baseTag) {
  const result = await getTranslatedResult(
    `${import.meta.env.VITE_SERVER_URL}`,
    selectedText
  );

  const div = showResult(result.translations);

  if (div) {
    baseTag.appendChild(div);
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

  const div = document.createElement('div');

  div.setAttribute('class', 'translated');

  for (let i of result) {
    const li = document.createElement('p');
    const lang_span = document.createElement('span');
    const result_span = document.createElement('span');
    li.setAttribute('class', 'translated-result');
    lang_span.setAttribute('class', 'lang');
    result_span.setAttribute('class', 'result');

    lang_span.textContent = i.language;
    result_span.textContent = i.text;

    li.append(lang_span, result_span);
    div.appendChild(li);
  }

  return div;
}
