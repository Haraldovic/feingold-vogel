(() => {
  "use strict";
  function enableOriginalPhoto(photo) {
    const source = photo.dataset.fvDetail || photo.getAttribute('src');
    const trigger = document.createElement('a');
    trigger.href = source;
    trigger.className = 'fv-photo-open';
    trigger.setAttribute('aria-label', 'Originalfoto der Saphirkette vergrößern');
    photo.before(trigger);
    trigger.append(photo);
    const label = document.createElement('span');
    label.textContent = 'Originalfoto vergrößern';
    trigger.append(label);

    const dialog = document.createElement('dialog');
    if (typeof dialog.showModal !== 'function') return;
    dialog.className = 'fv-modal';
    dialog.setAttribute('aria-labelledby', 'fv-photo-title');
    const bar = document.createElement('div');
    bar.className = 'fv-modal-bar';
    const title = document.createElement('h2');
    title.id = 'fv-photo-title';
    title.textContent = 'Die Saphirkette im Original';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Schließen';
    const enlarged = document.createElement('img');
    enlarged.alt = photo.alt;
    bar.append(title, close);
    dialog.append(bar, enlarged);
    document.body.append(dialog);
    trigger.setAttribute('aria-haspopup', 'dialog');

    trigger.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (!enlarged.hasAttribute('src')) enlarged.src = source;
      dialog.showModal();
      close.focus();
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
  }

  const original = document.querySelector('.page-saphirkette .photo img[src$="saphirkette-original.webp"]');
  if (original) enableOriginalPhoto(original);
})();
