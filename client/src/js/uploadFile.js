// 파일 업로드 api 요청
async function postFile(url = '', file) {
  if (!file) {
    return alert('등록된 파일이 없습니다.');
  }

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

  return data;
}

function homepageFunction() {
  const uploadedFile = document.getElementById('uploadFile');
  const labelText = document.querySelector('.filename');
  const form = document.querySelector('.form-upload');

  // 입력된 파일 이름 감지
  uploadedFile.addEventListener('change', () => {
    if (!uploadedFile.files[0]) return;

    let fileName = uploadedFile.files[0].name;

    labelText.textContent = fileName;
  });

  // 업로드 버튼 누를 때 실행
  form.addEventListener(
    'submit',
    async (e) => {
      e.preventDefault();

      const file = uploadedFile.files[0];
      const serverURL = import.meta.env.VITE_LOCAL_SERVER_URL;

      const data = await postFile(`${serverURL}/api/upload`, file);

      if (data) {
        localStorage.setItem('fileInfo', JSON.stringify(data));

        const navEvent = new CustomEvent('nav', {
          detail: { path: '/text' },
        });
        window.dispatchEvent(navEvent);
      }
    },
    false
  );
}

export { homepageFunction };
