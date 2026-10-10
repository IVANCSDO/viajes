export const planLabels = {confirmada:'Plan acordado',planificada:'Planificado',provisional:'Plan provisional',orientativo:'Orientativo',pendiente:'Por confirmar'};
export const modeLabels = {public:'Autobús / tren',road:'Autocaravana',ferry:'Ferry',boat:'Barco',undecided:'Medio pendiente'};
export function placeBelongsTo(id, targetId, data) {
  const seen = new Set();
  while (id && !seen.has(id)) {
    if (id === targetId) return true;
    seen.add(id);
    id = data.placeById.get(id)?.parentId;
  }
  return false;
}
export function dayTouchesPlace(day, placeId, data) {
  const ids = [day.originId,day.destinationId,...day.stops.map(stop => stop.placeId),...day.travelLegs.flatMap(leg => [leg.originId,leg.destinationId])];
  if (day.overnightId) ids.push(data.accommodationById.get(day.overnightId)?.placeId);
  return ids.some(id => placeBelongsTo(id,placeId,data));
}
export function overnightLabel(day,data) {
  if (!day.overnightId) return day.tourismFree ? 'Sin pernocta · Regreso' : 'Por confirmar';
  const stay = data.accommodationById.get(day.overnightId);
  return stay.name || `${stay.type === 'convencional' ? 'Alojamiento' : 'Camping'} en ${data.placeById.get(stay.placeId).name} · Por elegir`;
}
export function travelWindowLabel(trip) {
  if (trip.startDate) return new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${trip.startDate}T12:00:00Z`));
  const window = trip.travelWindow;
  if (!window) return 'Fechas por confirmar';
  return `${new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(window.year,window.month-1,1)))} · ${window.status === 'provisional' ? 'Previsto' : 'Acordado'}`;
}
