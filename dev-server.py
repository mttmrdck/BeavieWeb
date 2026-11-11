"""Local development server for BeavieWeb.

Serves the site on http://localhost:5173 and tells the browser never to
cache, so every reload picks up the latest files (Safari otherwise keeps
old stylesheets and scripts). Run with `npm run dev`.
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".wasm": "application/wasm"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


with Server(("", PORT), NoCacheHandler) as httpd:
    print(f"BeavieWeb running at http://localhost:{PORT}  (Ctrl+C to stop)", flush=True)
    httpd.serve_forever()
