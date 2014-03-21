var textareas = {};

function openInAtom(textarea) {
  if (textareas[textarea]) {
    return;
  }

  safari.self.addEventListener('message', function(event) {
    switch (event.name) {
    case 'textchanged':
      textarea.value = event.message;
      break;

    case 'disconnect':
      textarea.removeEventListener('input', onInput);
      delete textareas[textarea];
      break;
    }
  }, false);

  function onInput() {
    safari.self.tab.dispatchMessage('textchanged', textarea.value);
  }
  textarea.addEventListener('onchange', onInput);

  safari.self.tab.dispatchMessage('connect', location.origin);

  onInput();
  textareas[textarea] = true;
}

document.addEventListener('keydown', function(event) {
  if (event.target.nodeName === 'TEXTAREA' &&
      event.keyCode == 69 &&
      event.shiftKey && event.metaKey) {
    openInAtom(event.target);
  }
});
