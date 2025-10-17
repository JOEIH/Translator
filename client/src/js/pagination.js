const prev = document.querySelector('.button-prev');
const next = document.querySelector('.button-next');
const pagebox = document.querySelector('.page-box');
const content = document.querySelector('.content');

const data = localStorage.getItem('fileInfo');
const parsed = JSON.parse(data);
const totalPages = parsed.total_page;
const pageSet = parsed.page_set;

let currentPage = 1;
const pageLimit = 5;

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
    page.textContent = i;
    pagebox.appendChild(page);
  }
};

showPageGroup();

// 좌클릭
prev.onclick = () => {
  if (currentPage > 1) {
    currentPage -= 1;
    showText(pageSet, currentPage);
  }

  if (currentPage % pageLimit == 0) {
    showPageGroup();
  }
};

// 우클릭
next.onclick = () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    showText(pageSet, currentPage);
  }

  if (currentPage % pageLimit == 1) {
    showPageGroup();
  }
};

// 페이지별 텍스트 출력
const showText = (pageSet, currentPage) => {
  let text = pageSet[currentPage];
  console.log(pageSet[currentPage]);

  if (text.trim().length != 0) {
    content.innerHTML = `<p class='extracted' style='width=100%;'>
        ${text}
      </p>`;
  }
};

showText(pageSet, currentPage);
