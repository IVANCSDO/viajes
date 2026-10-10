"""Optional Edge smoke tests using CDP and Python's standard library, no dependencies.

Runs a temporary local server and an isolated, headless browser. Stops both on exit.
Screenshots and reports are saved in ignored .qa/. Does not touch a normal browser profile.
"""
import base64
import functools
import http.server
import json
import os
from pathlib import Path
import socket
import struct
import subprocess
import threading
import time
from urllib.parse import urlparse
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / '.qa'
EDGE = Path(os.environ.get('PROGRAMFILES(X86)', 'C:/Program Files (x86)')) / 'Microsoft/Edge/Application/msedge.exe'

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

class CDP:
    def __init__(self, url):
        parsed = urlparse(url)
        self.socket = socket.create_connection((parsed.hostname, parsed.port), timeout=25)
        key = base64.b64encode(os.urandom(16)).decode()
        self.socket.sendall(f'GET {parsed.path} HTTP/1.1\r\nHost: {parsed.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
        response = b''
        while not response.endswith(b'\r\n\r\n'):
            response += self.socket.recv(1)
        assert b' 101 ' in response, response
        self.sequence = 0
        self.events = []

    def read(self, size):
        data = b''
        while len(data) < size:
            chunk = self.socket.recv(size - len(data))
            if not chunk:
                raise ConnectionError('Browser WebSocket closed')
            data += chunk
        return data

    def receive(self):
        chunks = []
        while True:
            first, second = self.read(2)
            length = second & 127
            if length == 126:
                length = struct.unpack('!H', self.read(2))[0]
            elif length == 127:
                length = struct.unpack('!Q', self.read(8))[0]
            mask = self.read(4) if second & 128 else None
            payload = self.read(length)
            if mask:
                payload = bytes(value ^ mask[i % 4] for i, value in enumerate(payload))
            if first & 15 == 8:
                raise ConnectionError('Browser WebSocket closed')
            chunks.append(payload)
            if first & 128:
                return json.loads(b''.join(chunks))

    def call(self, method, **params):
        self.sequence += 1
        payload = json.dumps({'id':self.sequence, 'method':method, 'params':params}).encode()
        length = len(payload)
        header = bytes([0x81, 0x80 | length]) if length < 126 else bytes([0x81, 0x80 | 126]) + struct.pack('!H', length)
        if length >= 65536:
            header = bytes([0x81, 0x80 | 127]) + struct.pack('!Q', length)
        mask = os.urandom(4)
        self.socket.sendall(header + mask + bytes(value ^ mask[i % 4] for i, value in enumerate(payload)))
        while True:
            message = self.receive()
            if message.get('id') == self.sequence:
                if 'error' in message:
                    raise RuntimeError(message['error'])
                return message.get('result', {})
            self.events.append(message)

    def evaluate(self, expression):
        result = self.call('Runtime.evaluate', expression=expression, returnByValue=True, awaitPromise=True)
        if result.get('exceptionDetails'):
            raise RuntimeError(result['exceptionDetails'])
        return result.get('result', {}).get('value')

    def wait(self, expression, timeout=15):
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            if self.evaluate(expression):
                return
            time.sleep(.1)
        raise TimeoutError(expression)

    def route(self, route, selector):
        self.evaluate(f'location.hash={json.dumps(route)}')
        self.wait(f'!!document.querySelector({json.dumps(selector)})')

    def screenshot(self, name):
        result = self.call('Page.captureScreenshot', format='png', captureBeyondViewport=False)
        (QA / name).write_bytes(base64.b64decode(result['data']))

def main():
    QA.mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    process = subprocess.Popen([str(EDGE), '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', f'--user-data-dir={QA / "edge-profile"}', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    client = None
    report = {'checks':[], 'layouts':[]}
    places = json.loads((ROOT / 'data/places.json').read_text(encoding='utf-8'))
    days = json.loads((ROOT / 'data/days.json').read_text(encoding='utf-8'))
    try:
        port_file = QA / 'edge-profile/DevToolsActivePort'
        for _ in range(150):
            if port_file.exists():
                try:
                    port = int(port_file.read_text().splitlines()[0])
                    with urlopen(f'http://127.0.0.1:{port}/json/list', timeout=1) as response:
                        tabs = json.load(response)
                    break
                except (OSError, ValueError):
                    pass
            time.sleep(.1)
        else:
            raise TimeoutError('Edge debugger unavailable')
        tab = next(tab for tab in tabs if tab['type'] == 'page')
        client = CDP(tab['webSocketDebuggerUrl'])
        client.call('Runtime.enable')
        client.call('Page.enable')
        client.call('Log.enable')
        client.call('Network.enable')
        client.call('Emulation.setDeviceMetricsOverride', width=1440, height=1000, deviceScaleFactor=1, mobile=False)
        client.call('Page.navigate', url=f'http://127.0.0.1:{server.server_port}/')
        client.wait('!!document.querySelector("#home-map .leaflet-pane")')
        client.wait('Array.from(document.images).filter(i=>i.loading!=="lazy").every(i=>i.complete&&i.naturalWidth>0)')
        client.screenshot('desktop-home.png')
        report['checks'].append('Home, modules, JSON, Leaflet and hero loaded')
        routes = [('inicio','.hero'),('itinerario','.itinerary-row'),('mapa','#trip-map .leaflet-pane'),('lugares','#places-results .place-card'),('practica','#budget-form'),('dia/dia-7','#day-map .leaflet-pane'),('lugar/staffa','#place-map .leaflet-pane'),('practica/fuentes','.source-list')]
        for width in (320, 390, 768, 1440):
            client.call('Emulation.setDeviceMetricsOverride', width=width, height=900, deviceScaleFactor=1, mobile=False)
            for route, selector in routes:
                client.route(route,selector)
                layout = client.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll("h1").length})')
                assert layout['scroll'] <= layout['width'], (route, layout)
                assert layout['h1'] == 1, (route, layout)
                report['layouts'].append({'route':route, **layout})
            if width == 390:
                client.route('inicio','.hero')
                client.screenshot('mobile-home.png')
        report['checks'].append('32 layouts without horizontal overflow; one h1 per view')
        client.route('lugares','#place-search')
        client.evaluate('document.querySelector("#place-search").value="Victoria Street";document.querySelector("#place-search").dispatchEvent(new Event("input"))')
        assert client.evaluate('document.querySelectorAll("#places-results .place-card").length') == 1
        client.evaluate('document.querySelector("[data-save]").click()')
        assert client.evaluate('JSON.parse(localStorage.getItem("escocia:favorites")).includes("victoria-street")')
        client.route('lugares?favoritos=1','#only-favorites:checked')
        assert client.evaluate('document.querySelectorAll("#places-results .place-card").length') == 1
        client.evaluate('document.querySelector("[data-save]").click()')
        assert client.evaluate('!!document.querySelector(".empty-state")')
        client.evaluate('document.querySelector("#reset-filters").click()')
        assert client.evaluate('document.querySelectorAll("#places-results .place-card").length') == len(places)
        client.evaluate('document.querySelector("[data-category=geologia]").click()')
        assert client.evaluate('document.querySelectorAll("#places-results .place-card").length') == sum(place['category'] == 'geologia' for place in places)
        report['checks'].append('Search, category filters, save/remove favorites, empty state and reset')
        client.route('practica','#budget-form')
        client.evaluate('document.querySelector("#budget-vehicle").value="300";document.querySelector("#budget-vehicle").dispatchEvent(new Event("input",{bubbles:true}));document.querySelector("[data-check]").click()')
        assert client.evaluate('document.querySelector("#budget-result").textContent.includes("300,00") && document.querySelector("#budget-result").textContent.includes("100,00")')
        client.call('Page.reload')
        client.wait('!!document.querySelector("#budget-form")')
        assert client.evaluate('document.querySelector("#budget-vehicle").value==="300" && document.querySelector("[data-check]").checked')
        client.evaluate('document.querySelector("#reset-budget").click()')
        assert client.evaluate('document.querySelector("#budget-vehicle").value===""')
        report['checks'].append('Budget subtotal/per person, reset and local persistence of checklist/budget')
        client.route('mapa','#map-day')
        client.evaluate('document.querySelector("#map-day").value="dia-4";document.querySelector("#map-day").dispatchEvent(new Event("change"))')
        selected_day = next(day for day in days if day['id'] == 'dia-4')
        selected_places = {selected_day['originId'], selected_day['destinationId'], *(stop['placeId'] for stop in selected_day['stops']), *(id for leg in selected_day['travelLegs'] for id in (leg['originId'], leg['destinationId']))}
        assert client.evaluate('document.querySelectorAll("#trip-map .trip-marker").length') == len(selected_places)
        client.evaluate('document.querySelector("#trip-map .trip-marker").click()')
        assert client.evaluate('!!document.querySelector(".leaflet-popup-content a")')
        client.evaluate('document.querySelector("#fit-map").click()')
        report['checks'].append('Day map filter, markers, popup links and recenter')
        for day in days:
            client.route(f'dia/{day["id"]}', '#day-map .leaflet-pane')
        assert client.evaluate('document.querySelectorAll(".stop-item").length') == 0
        for place in places:
            client.route(f'lugar/{place["id"]}', '#place-map .leaflet-pane')
        report['checks'].append(f'All {len(days)} day views, {len(places)} place views and tourism-free final day')
        client.route('missing','.empty-state')
        report['checks'].append('Unknown route recovery')
        report['runtimeErrors'] = [event for event in client.events if event.get('method') == 'Runtime.exceptionThrown']
        report['httpErrors'] = [event['params']['response']['url'] for event in client.events if event.get('method') == 'Network.responseReceived' and event['params']['response']['status'] >= 400]
        assert not report['runtimeErrors'], report['runtimeErrors']
        assert not [url for url in report['httpErrors'] if url.startswith('http://127.0.0.1')], report['httpErrors']
        report['checks'].append('No JavaScript exceptions or missing local HTTP assets')
        (QA / 'report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
        print(json.dumps(report, indent=2))
    finally:
        if client:
            try:
                client.call('Browser.close')
            except (OSError, ConnectionError):
                pass
            client.socket.close()
        try:
            process.wait(timeout=8)
        except subprocess.TimeoutExpired:
            process.terminate()
        server.shutdown()
        server.server_close()

if __name__ == '__main__':
    main()
