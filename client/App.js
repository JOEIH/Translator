import HomePage from './src/routes/Home';
import PdfResultPage from './src/routes/PdfResult';

const routes = [
  { path: '/home', component: HomePage },
  { path: '/text', component: PdfResultPage },
];

let currentPage = null;

const App = async () => {
  const pageRouter = routes.map((route) => {
    return {
      route: route,
      isPage: window.location.pathname === route.path,
    };
  });

  let match = pageRouter.find((router) => router.isPage);

  const appElement = document.getElementById('app');

  if (!match) {
    appElement.innerHTML = `<h1>404</h1>`;
    return;
  }

  const newPage = new match.route.component({ $target: appElement });

  currentPage = newPage;
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    const targetElement = e.target.closest('a');

    if (!targetElement) return;

    e.preventDefault();
    const path = targetElement.pathname;

    window.history.pushState(null, null, path);
    App();
  });
  App();
});

window.addEventListener('popstate', () => {
  App();
});

window.addEventListener('nav', (e) => {
  const { path } = e.detail;
  window.history.pushState(null, null, path);
  App();
});
