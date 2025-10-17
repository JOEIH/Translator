const title = document.querySelector('.title');

// 추출된 텍스트 렌더링
function getFile() {
  const data = localStorage.getItem('fileInfo');

  if (data) {
    const parsed = JSON.parse(data);
    title.textContent = parsed.filename;
  }
}

getFile();
