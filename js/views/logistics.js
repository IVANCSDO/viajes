import {escapeHTML as e,icon,externalLink,number} from '../utils.js';
import {reservationBadge} from '../components.js';
import {overnightLabel} from '../trip.js';
import {tripStats} from '../stats.js';

export function renderLogistics(data) {
  const stats = tripStats(data);
  const reference = data.logistics.vehicle.budgetReference;
  const stays = data.logistics.accommodations.filter(stay => data.days.some(day => day.overnightId === stay.id));
  return `<section class="logistics-section">
    <div class="section-heading"><div><span class="eyebrow">LA PARTE PRÁCTICA DEL PLAN</span><h2>Dónde dormir. Cómo llegar.</h2></div></div>
    <div class="rental-summary"><div>${icon('truck')}<strong>${stats.camperDays} días · ${stats.camperNights} noches</strong><span>Autocaravana del día ${data.dayById.get(data.logistics.vehicle.pickupDayId).number} al ${data.dayById.get(data.logistics.vehicle.returnDayId).number}</span></div><div>${icon('house')}<strong>${stats.hotelNights} noches</strong><span>Alojamiento convencional: primeras 3 y última noche</span></div></div>
    <p class="fine-print">Distribución del plan. Empresa, vehículo, fechas y reservas por confirmar.</p>
    <div class="lodging-list">${stays.map(stay => {
      const days = data.days.filter(day => day.overnightId === stay.id);
      return `<article class="lodging-row"><div><span class="small-label">NOCHE${days.length > 1 ? 'S' : ''} ${days.map(day => day.number).join(', ')} · ${stay.type === 'convencional' ? 'ALOJAMIENTO CONVENCIONAL' : 'AUTOCARAVANA'}</span><h3>${e(overnightLabel(days[0],data))}</h3><p>${e(stay.note)}</p>${stay.url ? externalLink(stay.url,'Web oficial','text-link') : ''}${stay.candidateIds.map(id => data.accommodationById.get(id)).map(candidate => `<div class="camping-candidate"><span class="selection-badge">Solo candidato</span><h4>${e(candidate.name)}</h4><p>${e(candidate.note)}</p>${externalLink(candidate.url,'Consultar condiciones','text-link')}</div>`).join('')}</div><div class="booking-badges"><span class="selection-badge ${stay.selectionStatus === 'elegida' ? 'chosen' : ''}">${stay.selectionStatus === 'elegida' ? 'Camping elegido' : 'Por elegir'}</span>${reservationBadge(stay.reservationStatus)}</div></article>`;
    }).join('')}</div>
    <h2 class="service-heading">Reservas y enlaces por cerrar.</h2>
    <div class="services-grid">${data.logistics.services.map(service => `<article class="service-card"><h3>${e(service.name)}</h3>${reservationBadge(service.reservationStatus)}<p>${e(service.note)}</p></article>`).join('')}</div>
    <div class="budget-reference">${icon('info-circle')}<div><h3>Referencia inicial del alquiler</h3><p><strong>${number(reference.min)}–${number(reference.max)} € para unos ${reference.referenceDays} días</strong> · Sin confirmar</p><p>${e(reference.note)}</p><p class="fine-print">El plan actual prevé ${stats.camperDays} días. Esta referencia en euros no se suma ni se convierte al presupuesto en libras.</p></div></div>
  </section>`;
}
