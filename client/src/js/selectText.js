const wholeContent = document.querySelector('.content');

// 드래그해서 텍스트 선택
function selectText() {
  const selection = document.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    return selectedText;
  }
}

// 마우스를 떼면 선택된 텍스트를 번역하는 api 요청 실행
document.onmouseup = async function () {
  let selected = selectText();
  console.log(selected);

  if (!selected) {
    return alert('선택된 텍스트가 없습니다.');
  }

  const result = await getTranslatedResult(
    `${process.env.VITE_SERVER_URL}/api/translate?text=${selected}`
  );

  console.log(result);
  return result;
};

// 번역된 결과를 가져오는 api 요청
async function getTranslatedResult(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  return data.result;
}
