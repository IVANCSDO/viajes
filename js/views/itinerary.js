import {escapeHTML as e,icon,dateLabel,directionsUrl,externalLink} from '../utils.js';
import {pageHeading,notice,dayMetrics,statusBadge,mapLegend,placeImage,stopBadge,planLegend,accommodationCard,travelLegs} from '../components.js';
import {createMap} from '../maps.js';
import {overnightLabel} from '../trip.js';
import {renderMiniGuide} from '../mini-guide.js';
import {renderTimeline} from '../timeline.js';

export function renderItinerary(data) {
  return `<div class="container page-content">
    ${pageHeading('NUESTRO CUADERNO DE RUTA',`${data.days.length} días para perdernos.`,'Ciudades, islas y Highlands: un plan que deja espacio para disfrutar del camino.')}
    ${notice(data.trip.planningNote)}${planLegend()}
    <div class="itinerary-list">${data.days.map(day => `<article class="itinerary-row">
      <div class="timeline-number"><span>DÍA</span>${String(day.number).padStart(2,'0')}</div>
      <div class="itinerary-photo">${placeImage(data.placeById.get(day.imagePlaceId || day.destinationId))}</div>
      <div class="itinerary-copy"><div class="row-kicker">${e(dateLabel(day.date))} ${statusBadge(day.status)}</div>
        <h2><a href="#dia/${e(day.id)}">${e(day.title)}</a></h2><p>${e(day.subtitle)}</p>
        <div class="stop-tags">${day.tourismFree ? `<span>${icon('airplane')} Solo regreso · Sin turismo</span>` : !day.stops.length ? '<span>Llegada y descanso · Sin visitas obligatorias</span>' : day.stops.map(stop => `<span class="${stop.priority === 'opcional' ? 'optional' : stop.status === 'acordada' ? 'agreed' : ''}">${e(data.placeById.get(stop.placeId).name)} · ${stop.priority === 'opcional' ? 'Opcional' : stop.status === 'acordada' ? 'Acordada' : 'Provisional'}</span>`).join('')}</div>
        <p class="itinerary-overnight">${icon('moon')} ${e(overnightLabel(day,data))}</p>
      </div><a class="round-link" href="#dia/${e(day.id)}" aria-label="Ver día ${day.number}: ${e(day.title)}">${icon('arrow-right')}</a>
    </article>`).join('')}</div></div>`;
}

export function renderDay(data,id) {
  const day = data.dayById.get(id);
  if (!day) return null;
  const index = data.days.indexOf(day);
  const statusText = day.tourismFree ? 'Día sin turismo acordado. Vuelo y traslado pendientes.' : day.status === 'confirmada' ? 'Recorrido acordado. Las reservas y los horarios siguen pendientes.' : day.status === 'planificada' ? 'Jornada planificada. Las visitas concretas son propuestas.' : 'Tramo provisional, pendiente de desarrollar y validar.';
  return `<div class="container page-content">
    <a class="back-link" href="#itinerario">${icon('arrow-left')} Todo el itinerario</a>
    ${pageHeading(`DÍA ${String(day.number).padStart(2,'0')} · ${dateLabel(day.date)}`,day.title,day.subtitle)}
    <div class="detail-status">${statusBadge(day.status)}<span>${statusText}</span></div>
    <p class="day-description">${e(day.description)}</p>${dayMetrics(day,data)}
    ${renderTimeline(day,data)}
    <div class="detail-grid"><section>
      <h2>${day.tourismFree ? 'Hoy toca volver a casa.' : 'Lo que nos espera'}</h2>
      ${day.tourismFree ? `<div class="return-card">${icon('airplane')}<p>Traslado al aeropuerto de Glasgow y vuelo de regreso. Sin actividades ni visitas; la devolución de la autocaravana está prevista el día 11.</p></div>` : !day.stops.length ? `<div class="return-card">${icon('cup-hot')}<p>${day.number === 1 ? 'Llegar, instalarnos y descansar. Sin visitas obligatorias hasta conocer el horario del vuelo.' : 'Jornada de traslado o preparación, sin visitas obligatorias. Consulta la timeline y las indicaciones de abajo.'}</p></div>` : `<div class="stop-list">${day.stops.map((stop,i) => {
        const place = data.placeById.get(stop.placeId);
        return `<article class="stop-item"><span class="stop-index">${i+1}</span><div>${stopBadge(stop)}<h3><a href="#lugar/${e(stop.placeId)}">${e(place.name)} ${icon('arrow-up-right')}</a></h3><p>${e(stop.activity)}</p>${place.miniGuide ? `<details class="stop-guide"><summary>${icon('book')} Mini guía · Qué ver y curiosidades</summary>${renderMiniGuide(place,data,{embedded:true})}</details>` : ''}</div></article>`;
      }).join('')}</div>`}
      ${travelLegs(day,data)}
      <div class="tips-card"><h3>${icon('lightbulb')} Para tener en cuenta</h3><ul>${day.tips.map(tip => `<li>${e(tip)}</li>`).join('')}</ul></div>
      ${externalLink(directionsUrl(day,data),'Consultar origen y destino en Google Maps','btn btn-forest')}
      <p class="fine-print">Consulta orientativa entre los extremos del día. Los enlaces por mar y las visitas opcionales se consultan por separado. Revisar accesos y restricciones del vehículo.</p>
    </section><aside>
      <div id="day-map" class="map detail-map" role="region" aria-label="Mapa del día ${day.number}"></div>${mapLegend()}
      ${accommodationCard(day,data)}
    </aside></div>
    <nav class="day-pagination" aria-label="Otras jornadas">${index > 0 ? `<a href="#dia/${data.days[index-1].id}">${icon('arrow-left')} Día ${data.days[index-1].number}</a>` : '<span></span>'}<a href="#itinerario">${icon('grid')} Todos los días</a>${index < data.days.length-1 ? `<a href="#dia/${data.days[index+1].id}">Día ${data.days[index+1].number} ${icon('arrow-right')}</a>` : '<span></span>'}</nav>
  </div>`;
}
export function mountDay(data,id) { createMap('day-map',data,{dayId:id}); }
