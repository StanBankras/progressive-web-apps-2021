if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (window.location.href === data.url && data.type === 'refresh') {
      setTimeout(
        () => renderPopup(
          'There is new content available for this page.',
          'Click to refresh',
          () => window.location.reload()
        ), 
        3000
      );
    }
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    const deferredPrompt = e;
    setTimeout(
      () => renderPopup(
        'Want to get an even beter experience?',
        'Install Coinevents as app!',
        async () => {
          await deferredPrompt.prompt();
          document.querySelector('#refresh').remove();
        }
      ), 
      15000
    );
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/%service_worker%');
  });
}

function renderPopup(textContent, btnText, buttonAction) {
  const body = document.querySelector('body');
  const refreshHtml = document.createElement('div');
  const text = document.createElement('p');
  const button = document.createElement('button');

  refreshHtml.setAttribute('id', 'refresh');
  text.textContent = textContent;
  button.textContent = btnText;
  button.addEventListener('click', buttonAction);

  text.appendChild(button);
  refreshHtml.appendChild(text);
  body.appendChild(refreshHtml);
}