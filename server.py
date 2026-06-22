import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys

ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
PORT = int(os.environ.get('PORT', 8080))
BIND = os.environ.get('BIND', '')


class Handler(SimpleHTTPRequestHandler):

    def translate_path(self, path):
        if path.startswith('/public/') or path.startswith('/api/'):
            return super().translate_path(path)
        if path.startswith('/gerador'):
            path = '/src/pages' + path
        else:
            path = '/src' + path
        return super().translate_path(path)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != '/api/proxy':
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        req = urllib.request.Request(ANTHROPIC_API, data=body, method='POST')
        req.add_header('content-type', 'application/json')
        req.add_header('x-api-key', self.headers.get('x-api-key', ''))
        req.add_header('anthropic-version',
                       self.headers.get('anthropic-version', '2023-06-01'))

        try:
            with urllib.request.urlopen(req) as res:
                payload = res.read()
                self.send_response(res.status)
                self.send_header('content-type', 'application/json')
                self._cors()
                self.end_headers()
                self.wfile.write(payload)
        except urllib.error.HTTPError as e:
            payload = e.read()
            self.send_response(e.code)
            self.send_header('content-type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(payload)

    def _cors(self):
        self.send_header('access-control-allow-origin', '*')
        self.send_header('access-control-allow-headers',
                         'content-type, x-api-key, anthropic-version')

    def log_message(self, fmt, *args):
        print(f'  {self.address_string()}  {fmt % args}')


if __name__ == '__main__':
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)

    server = HTTPServer((BIND, PORT), Handler)
    print(f'\nJuventude Dev — servidor local')
    print(f'  hotsite:  http://localhost:{PORT}/')
    print(f'  gerador:  http://localhost:{PORT}/gerador/\n')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor encerrado.')
        sys.exit(0)
