import {loadData} from './data.js';
import {getRoute,activateNav} from './router.js';
import {clearMaps} from './maps.js';
import {escapeHTML as e,icon,toast} from './utils.js';
import {favorites,toggleFavorite} from './storage.js';
import {recoverPhoto} from './images.js';
import {renderHome,mountHome} from './views/home.js';
import {renderItinerary,renderDay,mountDay} from './views/itinerary.js';
import {renderPlaces,mountPlaces,renderPlace,mountPlace} from './views/places.js';
import {renderMap,mountMap} from './views/map.js';
import {renderPractical,mountPractical,renderSources} from './views/practical.js';

const main=document.querySelector('#main');
main.addEventListener('error',recoverPhoto,true);
function updateSavedCount() { document.querySelector('#saved-count').textContent=favorites().length; }
async function start() {
  try {
    const data=await loadData();
    let firstRender=true;
    let cleanupView;
    function render() {
      cleanupView?.();
      cleanupView = null;
      clearMaps();
      const {section,id,params}=getRoute();
      let markup, mount;
      switch(section) {
        case 'inicio': markup=renderHome(data); mount=() => mountHome(data); break;
        case 'itinerario': markup=renderItinerary(data); break;
        case 'dia': markup=renderDay(data,id); mount=() => mountDay(data,id); break;
        case 'mapa': markup=renderMap(data,params); mount=() => mountMap(data); break;
        case 'lugares': markup=renderPlaces(data,params); mount=() => mountPlaces(data); break;
        case 'lugar': markup=renderPlace(data,id); mount=() => mountPlace(data,id); break;
        case 'practica': markup=id==='fuentes' ? renderSources(data) : renderPractical(data); mount=id==='fuentes' ? null : () => mountPractical(data); break;
      }
      if(!markup) { markup=`<div class="container empty-state">${icon('signpost-split')}<h1>Este camino no está en el mapa.</h1><p>No encontramos la página que buscas.</p><a href="#inicio" class="btn btn-forest">Volver al inicio</a></div>`; mount=null; }
      main.innerHTML=markup;
      activateNav(section);
      cleanupView = mount?.();
      document.title=section === 'inicio' ? 'Escocia, sin prisa · Nuestra guía de viaje' : `${main.querySelector('h1')?.textContent || 'Guía del viaje'} · Escocia, sin prisa`;
      if(!firstRender) { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
      firstRender=false;
    }
    main.addEventListener('click',event => {
      const button=event.target.closest('[data-save]');
      if(!button) return;
      const place=data.placeById.get(button.dataset.save);
      if(!place) return;
      const {saved,persisted}=toggleFavorite(place.id);
      main.querySelectorAll(`[data-save="${place.id}"]`).forEach(item => { item.classList.toggle('is-saved',saved); item.setAttribute('aria-pressed',String(saved)); item.setAttribute('aria-label',`${saved ? 'Quitar' : 'Guardar'} ${place.name}`); item.innerHTML=icon(saved ? 'bookmark-fill' : 'bookmark'); });
      updateSavedCount();
      toast(`${place.name}: ${saved ? 'guardado en tus lugares' : 'eliminado de tus lugares'}.${persisted ? '' : ' Solo durante esta sesión.'}`);
      button.dispatchEvent(new CustomEvent('favoriteschange',{bubbles:true}));
    });
    updateSavedCount(); render();
    window.addEventListener('hashchange',render);
    window.addEventListener('storage',() => { updateSavedCount(); render(); });
  } catch(error) {
    main.innerHTML=`<div class="container empty-state"><h1>No hemos podido abrir la guía.</h1><p>${e(error.message)}</p><p>Comprueba la conexión y abre el proyecto mediante un servidor HTTP, no como un archivo local.</p><button class="btn btn-forest" id="retry">Volver a intentar</button></div>`;
    document.querySelector('#retry').addEventListener('click',() => location.reload());
    console.error(error);
  }
}
start();
