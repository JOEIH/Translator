import TranslateContainer from '../components/translateContainer';

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
  const buttons = document.querySelectorAll('.button-container');
  if (buttons) {
    buttons.forEach((item) => {
      item.remove();
    });
  }

  let send_text = selectedText;
  const button_container = new TranslateContainer({
    $target: base_tag,
    text: send_text,
  });

  base_tag.appendChild(button_container.$element);
});
