export function completeTotal(days, field) {
  if (days.some(day => day[field] == null)) return null;
  return days.reduce((total, day) => total + day[field], 0);
}
export function tripStats(data) {
  return {days:data.days.length,travelers:data.trip.travelers,distance:completeTotal(data.days,'distanceKm'),driving:completeTotal(data.days,'drivingMinutes'),camperDays:data.days.filter(day => day.camper === true).length,camperNights:data.days.filter(day => day.camper && day.overnightId && data.accommodationById.get(day.overnightId).type !== 'convencional').length,hotelNights:data.days.filter(day => day.overnightId && data.accommodationById.get(day.overnightId).type === 'convencional').length,estimated:data.days.some(day => day.metricsStatus !== 'confirmada')};
}
export function budgetTotal(values) {
  const known = values.filter(value => value !== '' && value != null && Number.isFinite(Number(value)) && Number(value) >= 0);
  return {total:known.reduce((sum,value) => sum + Number(value),0), complete:known.length === values.length, count:known.length};
}
