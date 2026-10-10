"""Validate data integrity and static file references with the Python standard library."""
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main():
    data = {path.stem: json.loads(path.read_text(encoding='utf-8')) for path in (ROOT / 'data').glob('*.json')}
    routes = json.loads((ROOT / 'data/routes.geojson').read_text(encoding='utf-8'))
    trip, days, places = data['trip'], data['days'], data['places']
    sources = {source['id'] for source in data['sources']}
    assert len(sources) == len(data['sources']), 'Duplicate source ID'
    source_by_id = {source['id']: source for source in data['sources']}
    for source in data['sources']:
        assert source['type'] in ('usuario', 'propuesta', 'oficial', 'divulgacion', 'fotografia')
        assert source['url'] is None or source['url'].startswith('https://')
    logistics = data['logistics']
    accommodations = {stay['id']: stay for stay in logistics['accommodations']}
    services = {service['id']: service for service in logistics['services']}
    assert len(accommodations) == len(logistics['accommodations'])
    assert len(services) == len(logistics['services'])
    place_ids = {place['id'] for place in places}
    day_ids = {day['id'] for day in days}
    assert len(place_ids) == len(places), 'Duplicate place ID'
    assert len(day_ids) == len(days) == trip['durationDays'], 'Invalid day count or IDs'
    assert sorted(day['number'] for day in days) == list(range(1, trip['durationDays'] + 1))
    assert trip['travelers'] > 0
    assert trip['arrivalPlaceId'] in place_ids and trip['departurePlaceId'] in place_ids
    assert all(id in place_ids for id in trip['featuredPlaceIds'])
    assert all(id in place_ids for id in trip['priorityPlaceIds'])
    assert all(id in sources for id in trip['sourceIds'])
    assert 1 <= trip['travelWindow']['month'] <= 12
    assert (ROOT / trip['heroImage']).is_file()
    for day in days:
        assert day['status'] in ('confirmada', 'planificada', 'provisional', 'descartada')
        assert day['originId'] in place_ids and day['destinationId'] in place_ids
        assert day.get('imagePlaceId') is None or day['imagePlaceId'] in place_ids
        assert day['date'] is None or re.fullmatch(r'\d{4}-\d{2}-\d{2}', day['date'])
        for metric in ('distanceKm', 'drivingMinutes'):
            assert day[metric] is None or isinstance(day[metric], (int, float)) and day[metric] >= 0
            bounds = day.get(f'{metric}Range')
            if bounds is not None:
                assert len(bounds) == 2 and 0 <= bounds[0] <= bounds[1]
                assert day[metric] is None, 'Keep range estimates separate from exact values'
                assert day['metricsStatus'] == 'estimada'
        if day['metricsStatus'] == 'pendiente':
            assert day['distanceKm'] is None and day['drivingMinutes'] is None
            assert day['distanceKmRange'] is None and day['drivingMinutesRange'] is None
        assert day['overnightId'] is None or day['overnightId'] in accommodations
        assert day['sourceIds'] and all(id in sources for id in day['sourceIds'])
        for stop in day['stops']:
            assert stop['placeId'] in place_ids
            assert stop['priority'] in ('imprescindible', 'opcional')
            assert stop['status'] in ('propuesta', 'acordada', 'provisional')
        for leg in day['travelLegs']:
            assert leg['originId'] in place_ids and leg['destinationId'] in place_ids
            assert leg['mode'] in ('public', 'road', 'ferry', 'boat', 'undecided')
            assert leg['serviceId'] is None or leg['serviceId'] in services
        if day['tourismFree']:
            assert not day['stops'], 'Tourism-free day contains stops'
    final_day = max(days, key=lambda day: day['number'])
    assert final_day['tourismFree'] and final_day['destinationId'] == trip['departurePlaceId']
    assert final_day['overnightId'] is None and not final_day['camper']
    assert days[0]['originId'] == trip['arrivalPlaceId']
    for stay in accommodations.values():
        assert stay['placeId'] in place_ids
        assert stay['type'] in ('convencional', 'camping')
        assert stay['selectionStatus'] in ('elegida', 'candidata', 'pendiente')
        assert stay['reservationStatus'] in ('pendiente', 'confirmada')
        assert stay['availability'] is None or isinstance(stay['availability'], bool)
        assert all(id in accommodations and accommodations[id]['selectionStatus'] == 'candidata' for id in stay['candidateIds'])
        assert all(id in sources for id in stay['sourceIds'])
        if stay['selectionStatus'] == 'candidata':
            assert not any(day['overnightId'] == stay['id'] for day in days), 'Candidate presented as chosen'
        if stay['bookingPolicy']:
            assert stay['bookingPolicy']['sourceId'] in sources
    for service in services.values():
        assert service['reservationStatus'] in ('pendiente', 'confirmada')
        assert all(id in sources for id in service['sourceIds'])
    camper_days = sum(day['camper'] is True for day in days)
    camper_nights = sum(day['camper'] is True and day['overnightId'] is not None and accommodations[day['overnightId']]['type'] != 'convencional' for day in days)
    assert camper_days == trip['camperDays'] and camper_nights == trip['camperNights']
    assert sum(day['overnightId'] is not None for day in days) == trip['durationDays'] - 1
    vehicle = logistics['vehicle']
    assert vehicle['pickupDayId'] in day_ids and vehicle['returnDayId'] in day_ids
    assert vehicle['pickupPlaceId'] in place_ids and vehicle['returnPlaceId'] in place_ids
    ordered_days = sorted(days, key=lambda day: day['number'])
    pickup = next(day for day in days if day['id'] == vehicle['pickupDayId'])
    dropoff = next(day for day in days if day['id'] == vehicle['returnDayId'])
    assert all(day['camper'] == (pickup['number'] <= day['number'] <= dropoff['number']) for day in days)
    assert accommodations[dropoff['overnightId']]['type'] == 'convencional', 'Return night must be a conventional stay'
    reference = vehicle['budgetReference']
    assert reference['min'] <= reference['max'] and reference['referenceDays'] > 0
    for previous, following in zip(sorted(days, key=lambda day: day['number']), sorted(days, key=lambda day: day['number'])[1:]):
        assert previous['destinationId'] == following['originId'], 'Discontinuous itinerary'
    for place in places:
        lat, lon = place['coordinates']
        assert -90 <= lat <= 90 and -180 <= lon <= 180
        assert place['sourceIds'] and all(id in sources for id in place['sourceIds'])
        guide = place.get('miniGuide')
        assert isinstance(guide, dict), f'Missing mini guide: {place["id"]}'
        assert all(isinstance(guide.get(key), str) and guide[key].strip() for key in ('intro', 'story'))
        assert len(guide['highlights']) >= 2, f'Missing sights: {place["id"]}'
        for sight in guide['highlights']:
            assert all(isinstance(sight.get(key), str) and sight[key].strip() for key in ('title', 'text'))
        assert guide['curiosities'], f'Missing curiosities: {place["id"]}'
        for curiosity in guide['curiosities']:
            assert curiosity['kind'] in ('dato', 'leyenda')
            assert isinstance(curiosity['text'], str) and curiosity['text'].strip()
        assert guide['sourceIds'] and len(guide['sourceIds']) == len(set(guide['sourceIds']))
        assert all(id in sources and id in place['sourceIds'] and source_by_id[id]['url'] for id in guide['sourceIds'])
        date.fromisoformat(guide['checkedAt'])
        assert place.get('parentId') is None or place['parentId'] in place_ids
        seen = {place['id']}
        parent = place.get('parentId')
        while parent:
            assert parent not in seen, 'Cyclic place hierarchy'
            seen.add(parent)
            parent = next(p for p in places if p['id'] == parent).get('parentId')
        if place.get('durationMinutesRange'):
            low, high = place['durationMinutesRange']
            assert 0 <= low <= high and place['durationMinutes'] is None
        assert place['image'], f'Missing photograph: {place["id"]}'
        assert (ROOT / place['image']).is_file(), place['image']
        assert place['imageAlt'] and place['imageCaption'], f'Missing photo description: {place["id"]}'
        photo = (ROOT / place['image']).read_bytes()
        if place['image'].endswith('.jpg'):
            assert photo.startswith(b'\xff\xd8\xff'), f'Invalid JPEG: {place["image"]}'
        elif place['image'].endswith('.avif'):
            assert photo[4:8] == b'ftyp' and b'avif' in photo[8:32], f'Invalid AVIF: {place["image"]}'
    assert routes['type'] == 'FeatureCollection'
    for feature in routes['features']:
        prop = feature['properties']
        assert prop['dayId'] in day_ids
        assert prop['mode'] in ('public', 'road', 'ferry', 'boat', 'undecided')
        assert prop['originId'] in place_ids and prop['destinationId'] in place_ids
        assert prop['serviceId'] is None or prop['serviceId'] in services
        assert prop['geometryStatus'] in ('schematic', 'verified')
        assert prop['source']
        assert feature['geometry']['type'] == 'LineString'
        assert len(feature['geometry']['coordinates']) >= 2
        if prop['geometryStatus'] == 'verified':
            assert prop.get('verifiedAt') and prop.get('sourceUrl'), 'Verified geometry needs provenance'
        for lon, lat in feature['geometry']['coordinates']:
            assert -180 <= lon <= 180 and -90 <= lat <= 90
    expected_legs = sorted((day['id'], leg['mode'], leg['originId'], leg['destinationId'], leg['serviceId'] or '') for day in days for leg in day['travelLegs'])
    actual_legs = sorted((feature['properties']['dayId'], feature['properties']['mode'], feature['properties']['originId'], feature['properties']['destinationId'], feature['properties']['serviceId'] or '') for feature in routes['features'])
    assert expected_legs == actual_legs, 'GeoJSON does not match documented travel legs'
    for section in data['practical']['sections']:
        assert all(id in sources for id in section['sourceIds'])
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    for relative in re.findall(r'(?:src|href)="([^"#]+)"', html):
        if not relative.startswith(('http:', 'https:')):
            assert (ROOT / relative).is_file(), relative
    for module in (ROOT / 'js').rglob('*.js'):
        for relative in re.findall(r"from\s+['\"](\.[^'\"]+)['\"]", module.read_text(encoding='utf-8')):
            assert (module.parent / relative).is_file(), f'{module}: {relative}'
    print(f'OK: {len(days)} days, {len(places)} places, {len(routes["features"])} routes, {len(sources)} sources.')
    print(f'Validated: {len(places)} complete mini guides with referenced sources and dated content checks.')
    print(f'Validated: {camper_days} camper days, {camper_nights} camper nights; plans, reservations, estimates, travel legs, references and assets.')

if __name__ == '__main__':
    main()
