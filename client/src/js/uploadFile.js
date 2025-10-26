const uploadedFile = document.getElementById('uploadFile');
const labelText = document.querySelector('.filename');
const form = document.querySelector('.form-upload');

// 입력된 파일 이름 감지
uploadedFile.addEventListener('change', () => {
  if (!uploadedFile.files[0]) return;

  let fileName = uploadedFile.files[0].name;

  labelText.textContent = fileName;
});

// 파일 업로드 api 요청
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

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log('error: ', errorMessage);
      alert('파일 업로드 실패');
      return;
    }

    const data = await response.json();

    localStorage.setItem('fileInfo', JSON.stringify(data));

    window.location.href = '/text';
  }
}

// 업로드 버튼 누를 때 실행
function onsubmitForm(e) {
  e.preventDefault();

  const file = uploadedFile.files[0];

  postFile(`${import.meta.env.VITE_SERVER_URL}/api/upload`, file);
}

form.addEventListener('submit', onsubmitForm, false);
