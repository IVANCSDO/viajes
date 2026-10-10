"""Optional maintenance: download documented Unsplash images to local files."""
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = [
    ('glencoe', 'kuq8hXjdimY', 'LoboStudio Hamburg', 'Montañas verdes y rocosas de Glencoe', 'photo-1472494060377-5e98f58af1c2'),
    ('eilean-donan', 'l6axIa5mfGc', None, 'Castillo de Eilean Donan y su puente de piedra', 'photo-1649980559603-5f48e84e0fe2'),
]

def fetch(item):
    place_id, photo_id, author, alt, image_id = item
    url = f'https://unsplash.com/photos/{photo_id}'
    image_url = f'https://images.unsplash.com/{image_id}?auto=format&fit=crop&w=1100&q=82'
    with urlopen(Request(image_url, headers={'User-Agent':'Mozilla/5.0'}), timeout=40) as response:
        image = response.read()
    path = f'assets/images/{place_id}.jpg'
    (ROOT / path).write_bytes(image)
    print(f'{place_id}: {len(image)} bytes', flush=True)
    return place_id, path, url, author, alt, image_url

def main():
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(fetch, PHOTOS))
    places = json.loads((ROOT / 'data/places.json').read_text(encoding='utf-8'))
    sources = json.loads((ROOT / 'data/sources.json').read_text(encoding='utf-8'))
    for place_id, path, url, author, alt, image_url in results:
        place = next(place for place in places if place['id'] == place_id)
        place.update(image=path, imageAlt=alt, imageCaption=place['name'])
        source_id = f'photo-{place_id}'
        if not any(source['id'] == source_id for source in sources):
            sources.append({'id':source_id, 'title':f'{author or place["name"]} · Unsplash', 'url':url, 'type':'fotografia', 'note':f'{path}. Licencia Unsplash. Imagen: {image_url}'})
    for name, value in [('places', places), ('sources', sources)]:
        (ROOT / f'data/{name}.json').write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
