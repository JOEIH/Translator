const title = document.querySelector('.title');
const content = document.querySelector('.content');

// 추출된 텍스트 렌더링
function getFile() {
  const extracted_text = localStorage.getItem('fileText');

  if (extracted_text) {
    const text = JSON.parse(extracted_text).extracted_text.split('\n');

    for (let p of text) {
      content.insertAdjacentHTML(
        'beforeend',
        `<p style="width=100%;">${p}</p>`
      );
    }
  }
}

getFile();
