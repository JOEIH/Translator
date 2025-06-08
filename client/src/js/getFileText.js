const title = document.querySelector('.title');
const content = document.querySelector('.content');

// 추출된 텍스트 렌더링
function getFile() {
  const data = localStorage.getItem('fileInfo');

  if (data) {
    const parsed = JSON.parse(data);
    const text = parsed.extracted_text.split('\n');
    title.textContent = parsed.filename;

    // 공백인 열을 제외하고 출력
    for (let p of text) {
      if (p.trim().length != 0) {
        content.insertAdjacentHTML(
          'beforeend',
          `<p class="extracted" style="width=100%;">${p}</p>`
        );
      }
    }
  }
}

getFile();
