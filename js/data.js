let cached;
export async function loadData() {
  if (cached) return cached;
  const files = ['trip.json','days.json','places.json','routes.geojson','practical.json','sources.json','logistics.json'];
  const [trip, days, places, routes, practical, sources, logistics] = await Promise.all(files.map(async file => {
    const response = await fetch(new URL(`../data/${file}`, import.meta.url));
    if (!response.ok) throw new Error(`No se pudo cargar ${file} (${response.status}).`);
    return response.json();
  }));
  const placeById = new Map(places.map(place => [place.id, place]));
  const dayById = new Map(days.map(day => [day.id, day]));
  const accommodationById = new Map(logistics.accommodations.map(stay => [stay.id,stay]));
  const serviceById = new Map(logistics.services.map(service => [service.id,service]));
  if (days.length !== trip.durationDays || placeById.size !== places.length || dayById.size !== days.length) throw new Error('Los datos del viaje no son coherentes.');
  for (const day of days) {
    if (![day.originId,day.destinationId,...day.stops.map(stop => stop.placeId),...day.travelLegs.flatMap(leg => [leg.originId,leg.destinationId])].every(id => placeById.has(id))) throw new Error(`Referencias incorrectas en ${day.id}.`);
    if (day.overnightId && !accommodationById.has(day.overnightId)) throw new Error(`Pernocta incorrecta en ${day.id}.`);
    if (day.travelLegs.some(leg => leg.serviceId && !serviceById.has(leg.serviceId))) throw new Error(`Servicio incorrecto en ${day.id}.`);
  }
  if (routes.features.some(route => !dayById.has(route.properties.dayId))) throw new Error('Existe una ruta sin jornada.');
  cached = {trip, days:days.sort((a,b) => a.number-b.number), places, routes, practical, sources, logistics, placeById, dayById, accommodationById, serviceById};
  return cached;
}
