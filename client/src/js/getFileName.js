function getFileName() {
  const title = document.querySelector('.title');
  const data = localStorage.getItem('fileInfo');

  if (data) {
    const parsed = JSON.parse(data);
    title.textContent = parsed.filename;
  }
}

export { getFileName };
