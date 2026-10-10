"""Check every static resource over HTTP, including native-module MIME types."""
import functools
import http.server
from pathlib import Path
import threading
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

def main():
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    count = 0
    try:
        paths = [ROOT / 'index.html']
        for directory in ('js', 'css', 'data', 'assets'):
            paths.extend(path for path in (ROOT / directory).rglob('*') if path.is_file())
        for path in paths:
            relative = path.relative_to(ROOT).as_posix()
            with urlopen(f'http://127.0.0.1:{server.server_port}/{relative}', timeout=5) as response:
                assert response.status == 200, relative
                assert response.read() == path.read_bytes(), relative
                if path.suffix == '.js':
                    assert response.headers.get_content_type() in ('text/javascript', 'application/javascript'), relative
                if path.suffix == '.avif':
                    assert response.headers.get_content_type() == 'image/avif', relative
                count += 1
        print(f'OK: {count} static resources served over HTTP; JavaScript and AVIF MIME types correct.')
    finally:
        server.shutdown()
        server.server_close()

if __name__ == '__main__':
    main()
