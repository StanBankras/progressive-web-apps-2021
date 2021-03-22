if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (window.location.href === data.url && data.type === 'refresh') {
      setTimeout(() => {
        const body = document.querySelector('body');
        const refreshHtml = document.createElement('div');
        const text = document.createElement('p');
        const button = document.createElement('button');

        refreshHtml.setAttribute('id', 'refresh');
        text.textContent = 'There is new content available for this page.';
        button.textContent = 'Click to refresh';
        button.addEventListener('click', () => {
          window.location.reload();
        });

        text.appendChild(button);
        refreshHtml.appendChild(text);
        body.appendChild(refreshHtml);
      }, 3000);
    }
  });

  // window.addEventListener('beforeinstallprompt', (e) => {
  //   e.preventDefault();
  //   const deferredPrompt = e;
  //   showInstallPromotion();
  // });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js');
  });
}