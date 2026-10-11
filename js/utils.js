export const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const icon = name => `<i class="bi bi-${escapeHTML(name)}" aria-hidden="true"></i>`;
export const categories = {naturaleza:'Naturaleza',historia:'Historia',costa:'Costa',islas:'Islas',geologia:'Geología',transporte:'Puertos y traslados',ocio:'Bares y ocio'};
export const number = value => new Intl.NumberFormat('es-ES').format(value);
export function minutes(value) { return value == null ? 'Por confirmar' : value < 60 ? `${number(value)} min` : `${Math.floor(value / 60)} h${value % 60 ? ` ${value % 60} min` : ''}`; }
export function metricLabel(value, range, type = 'distance') {
  if (value != null) return type === 'distance' ? `${number(value)} km` : minutes(value);
  if (range) return type === 'distance' ? `${number(range[0])}–${number(range[1])} km` : range[1] <= 60 ? `${number(range[0])}–${number(range[1])} min` : `${minutes(range[0])}–${minutes(range[1])}`;
  return 'Por confirmar';
}
export function dateLabel(value) { return value ? new Intl.DateTimeFormat('es-ES', {day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`)) : 'Fecha por confirmar'; }
export const mapsUrl = place => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.coordinates.join(','))}`;
export function directionsUrl(day, data) {
  const origin = data.placeById.get(day.originId).coordinates.join(',');
  const destination = data.placeById.get(day.destinationId).coordinates.join(',');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
}
export function externalLink(url, label, className = '') { return `<a class="${className}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ${icon('arrow-up-right')}<span class="visually-hidden"> (abre otra pestaña)</span></a>`; }
export function toast(message) { const target = document.querySelector('#toast'); target.textContent = message; target.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => target.classList.remove('visible'), 3200); }
