import dotenv from 'dotenv';
dotenv.config();

const uploadedFile = document.getElementById('uploadFile');
const labelText = document.querySelector('.filename');
const uploadButton = document.querySelector('.button-upload');
const form = document.querySelector('.form-upload');

uploadedFile.addEventListener('change', () => {
  if (!uploadedFile.files[0]) return;

  let fileName = uploadedFile.files[0].name;

  labelText.textContent = fileName;
});

async function postFile(url = '', file) {
  if (!uploadedFile.files[0]) {
    return alert('등록된 파일이 없습니다.');
  } else {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    localStorage.setItem('fileText', JSON.stringify(data));

    window.location.href = '/text';
  }
}

function onsubmitForm(e) {
  e.preventDefault();

  const file = uploadedFile.files[0];

  postFile(`${process.env.VITE_SERVER_URL}/api/upload`, file);
}

form.addEventListener('submit', onsubmitForm, false);
