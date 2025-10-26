const title = document.querySelector('.title');

function getFileName() {
  const data = localStorage.getItem('fileInfo');

  if (data) {
    const parsed = JSON.parse(data);
    title.textContent = parsed.filename;
  }
}

getFileName();
