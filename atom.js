(function(textareas) {
  if (window.self !== window.top) {
    return;
  }

  function openInAtom(textarea) {
    if (textareas[textarea]) {
      return;
    }

    safari.self.addEventListener('message', function(event) {
      switch (event.name) {
      case 'atom-textchanged':
        textarea.value = event.message;
        break;

      case 'ws-disconnected':
        textarea.removeEventListener('input', onInput);
        delete textareas[textarea];
        break;
      }
    }, false);

    safari.self.tab.dispatchMessage('ws-connect', location.origin);

    function onInput(e) {
      safari.self.tab.dispatchMessage('page-textchanged', textarea.value);
    }
    onInput();
    textarea.addEventListener('input', onInput, true);
    textareas[textarea] = true;
  }

  Array.prototype.slice.call(document.querySelectorAll('textarea')).forEach(function(t) {
    t.addEventListener('keydown', function(e) {
      if (e.keyCode == 69 && e.shiftKey && e.metaKey) {
        openInAtom(t);
      }
    });
  });

})({});
