import {escapeHTML as e} from './utils.js';

export function renderTimeline(day,data) {
  if (!day.timeline) return '';
  const formatTime = item => item.start ? `${item.start}${item.end ? `–${item.end}` : ''}` : item.period;
  return `<section class="day-timeline" aria-labelledby="timeline-${e(day.id)}">
    <div class="timeline-heading"><h2 id="timeline-${e(day.id)}">Horarios aproximados</h2><span class="status-badge planned">Propuesta</span></div>
    <p class="timeline-intro">${e(day.timeline.note)}</p>
    <ol class="schedule-list">${day.timeline.items.map(item => {
      const leg = item.legIndex === null ? null : day.travelLegs[item.legIndex];
      const places = leg ? [leg.originId,leg.destinationId] : item.placeIds;
      const optional = item.placeIds.length > 0 && item.placeIds.every(id => day.stops.some(stop => stop.placeId === id && stop.priority === 'opcional'));
      return `<li class="schedule-item ${optional ? 'schedule-optional' : ''}"><div class="schedule-time">${e(formatTime(item))}<small>${item.start ? 'Franja propuesta' : 'Hora pendiente'}</small></div><div class="schedule-content"><h3>${e(item.label)}${optional ? ' <span class="stop-badge optional">Opcional</span>' : ''}</h3>${places.length ? `<p class="schedule-places">${places.map(id => `<a href="#lugar/${e(id)}">${e(data.placeById.get(id).name)}</a>`).join(leg ? ' → ' : ' · ')}</p>` : ''}<p>${e(item.note)}</p></div></li>`;
    }).join('')}</ol>
    <p class="fine-print">Horas locales de Escocia. Las franjas reservan margen de planificación: no acreditan tiempos de carretera, apertura ni salidas de transporte. Las opciones no tienen que completarse todas.</p>
  </section>`;
}
