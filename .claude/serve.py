import http.server
import os

port = int(os.environ.get("PORT", 4321))
root = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(root)

Handler = http.server.SimpleHTTPRequestHandler

with http.server.ThreadingHTTPServer(("", port), Handler) as httpd:
    httpd.serve_forever()
