export function getRoute() {
  const [path,query=''] = (location.hash.slice(1) || 'inicio').split('?');
  const [section,id] = path.split('/');
  return {section,id,params:new URLSearchParams(query)};
}
export function activateNav(section) {
  const active = ({dia:'itinerario',lugar:'lugares'})[section] || section;
  document.querySelectorAll('[data-nav]').forEach(link => { const selected=link.dataset.nav===active; link.classList.toggle('active',selected); selected ? link.setAttribute('aria-current','page') : link.removeAttribute('aria-current'); });
}
