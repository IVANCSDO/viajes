"""Download pinned, public front-end assets. Development utility; no build step."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ASSETS = {
    'assets/vendor/bootstrap.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'assets/vendor/bootstrap-icons.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'assets/vendor/fonts/bootstrap-icons.woff2': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2',
    'assets/vendor/fonts/bootstrap-icons.woff': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff',
    'assets/vendor/leaflet.css': 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'assets/vendor/leaflet.js': 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'assets/vendor/images/layers.png': 'https://unpkg.com/leaflet@1.9.4/dist/images/layers.png',
    'assets/vendor/images/layers-2x.png': 'https://unpkg.com/leaflet@1.9.4/dist/images/layers-2x.png',
    'assets/vendor/images/marker-icon.png': 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    'assets/vendor/images/marker-icon-2x.png': 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    'assets/vendor/images/marker-shadow.png': 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    'assets/images/skye.jpg': 'https://images.unsplash.com/photo-1589807867645-53afff92b7d8?auto=format&fit=crop&w=2000&q=85',
    'assets/images/quiraing.jpg': 'https://images.unsplash.com/photo-1694084086107-5a545c8b58d0?auto=format&fit=crop&w=1000&q=80',
    'assets/images/edinburgh.jpg': 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=1000&q=80',
    'assets/images/highlands.jpg': 'https://images.unsplash.com/photo-1691201200764-6e7389fb4c6f?auto=format&fit=crop&w=1000&q=80',
    'assets/vendor/BOOTSTRAP-LICENSE.txt': 'https://raw.githubusercontent.com/twbs/bootstrap/v5.3.3/LICENSE',
    'assets/vendor/ICONS-LICENSE.txt': 'https://raw.githubusercontent.com/twbs/icons/v1.11.3/LICENSE',
    'assets/vendor/LEAFLET-LICENSE.txt': 'https://raw.githubusercontent.com/Leaflet/Leaflet/v1.9.4/LICENSE',
}

def download(item):
    name, url = item
    target = ROOT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    request = Request(url, headers={'User-Agent': 'ScotlandTripGuide/1.0'})
    with urlopen(request, timeout=45) as response:
        content = response.read()
    target.write_bytes(content)
    return f'{name}: {len(content)} bytes'

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=5) as pool:
        for result in pool.map(download, ASSETS.items()):
            print(result)
