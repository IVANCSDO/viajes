"""Static development server with a stable readiness signal for VS Code F5."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    print('ESCOCIA_SERVER_START', flush=True)
    try:
        # Windows can allow a second bind with SO_REUSEADDR; check for a listener.
        try:
            connection = socket.create_connection(('127.0.0.1', 8000), timeout=1)
        except OSError:
            pass
        else:
            connection.close()
            raise OSError('El puerto 8000 ya tiene un servidor activo.')
        server = ThreadingHTTPServer(('127.0.0.1', 8000), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
    except OSError as error:
        print(f'No se pudo abrir http://127.0.0.1:8000/: {error}', file=sys.stderr)
        print('Si el puerto esta ocupado, detén el servidor anterior con Ctrl+C en su terminal y vuelve a pulsar F5.', file=sys.stderr)
        return 1
    with server:
        print('ESCOCIA_SERVER_READY http://127.0.0.1:8000/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
    return 0


if __name__ == '__main__':
    sys.exit(main())
