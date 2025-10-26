const prev = document.querySelector('.button-prev');
const next = document.querySelector('.button-next');
const pagebox = document.querySelector('.page-box');
const content = document.querySelector('.content');

// pdf 정보 호출
const data = localStorage.getItem('fileInfo');
const parsed = JSON.parse(data);
const totalPages = parsed.total_page;
const pageSet = parsed.page_set;

let currentPage = 1;
const pageLimit = 5;
let activatedPageButton = null;

// 현재 페이지라면 버튼 스타일 변경
const changeButtonStyle = (button) => {
  if (activatedPageButton) {
    activatedPageButton.style.backgroundColor = 'white';
    activatedPageButton.style.fontWeight = '300';
    activatedPageButton.style.color = 'black';
  }

  button.style.backgroundColor = 'rgb(216, 232, 255)';
  button.style.fontWeight = 'bold';
  button.style.color = 'rgb(14, 97, 220)';

  activatedPageButton = button;
};

// 좌우클릭 화살표 스타일
const changeArrowStyle = () => {
  next.style.color = 'white';
  prev.style.color = 'white';

  if (currentPage == totalPages) {
    next.style.color = 'rgb(218, 218, 218)';
  }

  if (currentPage == 1) {
    prev.style.color = 'rgb(218, 218, 218)';
  }
};

// 페이지 번호 출력
const showPageGroup = () => {
  //페이지 그룹 초기화
  pagebox.innerHTML = '';
  // 아래 나타나는 페이지 그룹
  let pageGroup = Math.ceil(currentPage / pageLimit);
  // 현재 페이지 그룹의 시작, 마지막 페이지

  let lastPage = pageGroup * pageLimit;
  // 수정되기 전의 lastPage로 페이지 그룹 계산
  let firstPage = lastPage - (pageLimit - 1);
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    // 개별 페이지
    const page = document.createElement('button');
    page.setAttribute('class', 'page-number');
    page.setAttribute('id', `page-${i}`);
    page.textContent = i;

    page.addEventListener('click', () => {
      showText(pageSet, i);
      changeButtonStyle(page);
      currentPage = i;
      changeArrowStyle();
    });

    pagebox.appendChild(page);
  }
};

showPageGroup();
let firstPageButton = document.querySelector(`#page-${currentPage}`);
changeButtonStyle(firstPageButton);
changeArrowStyle();

// 좌클릭
prev.onclick = () => {
  if (currentPage > 1) {
    currentPage -= 1;
    showText(pageSet, currentPage);

    if (currentPage % pageLimit == 0) {
      showPageGroup();
    }

    const page = document.querySelector(`#page-${currentPage}`);
    changeButtonStyle(page);
  } else {
    return;
  }

  changeArrowStyle();
};

// 우클릭
next.onclick = () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    showText(pageSet, currentPage);

    if (currentPage % pageLimit == 1) {
      showPageGroup();
    }

    const page = document.querySelector(`#page-${currentPage}`);
    changeButtonStyle(page);
  } else {
    return;
  }

  changeArrowStyle();
};

// 페이지별 텍스트 출력
const showText = (pageSet, currentPage) => {
  if (content) {
    content.innerHTML = '';
  }

  let text = pageSet[currentPage];
  const lines = text.split('\n');

  for (let i of lines) {
    if (i.trim().length != 0) {
      const newLine = document.createElement('pre');
      newLine.setAttribute('class', 'extracted');
      newLine.style.width = '100%';
      newLine.textContent = i;

      content.insertAdjacentElement('beforeend', newLine);
    }
  }
};

showText(pageSet, currentPage);
