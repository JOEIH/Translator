const confirm_button = document.createElement('button');

// 텍스트를 드래그하면 번역하기 버튼 생성
document.addEventListener('mouseup', function (e) {
  // mouseup 이벤트가 발생하는 요소를 텍스트가 들어 있는 p태그로 한정
  if (e.target.tagName != 'P') return;

  const selection = document.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) return;

  const base_tag = selection.baseNode.parentNode;

  if (!base_tag) return;

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
      onClickButton(send_text);
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

    const data = await response.json();

    return data.result;
  }
}

// 번역하기 버튼 클릭할 때 요청 전송
async function onClickButton(selectedText) {
  const result = await getTranslatedResult(
    `${import.meta.env.VITE_SERVER_URL}`,
    selectedText
  );

  console.log(result);
}
