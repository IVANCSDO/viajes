import {icon} from './utils.js';

export function mountMapFullscreen(resizeMap) {
  const slot = document.querySelector('#map-slot');
  const card = slot.querySelector('.full-map-card');
  const button = document.querySelector('#expand-map');
  const dialog = document.querySelector('#map-fullscreen');
  const previousOverflow = document.body.style.overflow;

  function updateButton(expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    button.innerHTML = `${icon(expanded ? 'fullscreen-exit' : 'arrows-fullscreen')} ${expanded ? 'Salir de pantalla completa' : 'Pantalla completa'}`;
  }
  function restore() {
    slot.append(card);
    document.body.style.overflow = previousOverflow;
    updateButton(false);
    resizeMap();
    button.focus({preventScroll:true});
  }
  function toggle() {
    if (dialog.open) {
      dialog.close();
      return;
    }
    dialog.append(card);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    updateButton(true);
    resizeMap();
    button.focus({preventScroll:true});
  }
  button.addEventListener('click', toggle);
  dialog.addEventListener('close', restore);
  return () => {
    button.removeEventListener('click', toggle);
    dialog.removeEventListener('close', restore);
    if (dialog.open) dialog.close();
    slot.append(card);
    document.body.style.overflow = previousOverflow;
  };
}
