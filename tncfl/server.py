#!/usr/bin/env python3
"""
Thursday Night Curse Fantasy Football League Hub — Local Server
Double-click this file (or run: python server.py) to launch the hub.
It will open automatically in your browser.
"""

import http.server
import socketserver
import json
import os
import threading
import webbrowser
from datetime import datetime

PORT     = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'site_data.json')


class HubHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        pass  # suppress per-request noise

    def do_GET(self):
        # API: GET /api/data — return site_data.json
        if self.path == '/api/data':
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    raw = f.read()
                body = raw.encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(body)
            except FileNotFoundError:
                self._send_error(404, 'site_data.json not found — run the build pipeline first.')
            return

        # Serve all other files normally (HTML, images, etc.)
        super().do_GET()

    def _send_error(self, code, msg):
        body = json.dumps({'error': msg}).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def open_browser(url):
    import subprocess
    chrome_paths = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
        r'C:\Users\hello\AppData\Local\Google\Chrome\Application\chrome.exe',
    ]
    for path in chrome_paths:
        if os.path.exists(path):
            subprocess.Popen([path, url])
            return
    try:
        subprocess.Popen(['chrome', url])
        return
    except (FileNotFoundError, OSError):
        pass
    webbrowser.open(url)


def main():
    os.chdir(BASE_DIR)

    if not os.path.exists(DATA_FILE):
        print('\n  ✖  site_data.json not found.')
        print('     Run the build pipeline first: python3 build_hub.py')
        print('     (from the code/ directory)\n')
        return

    url = f'http://localhost:{PORT}/TNCFL_hub.html'

    print(f'\n  🏈  Thursday Night Curse Fantasy Football League Hub')
    print(f'  {"─" * 50}')
    print(f'  Server: {url}')
    print(f'  Data:   site_data.json  ({os.path.getsize(DATA_FILE):,} bytes)')
    print(f'  Press Ctrl+C to stop\n')

    with socketserver.TCPServer(('', PORT), HubHandler) as httpd:
        httpd.allow_reuse_address = True
        threading.Timer(0.8, lambda: open_browser(url)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n  Server stopped.')


if __name__ == '__main__':
    main()
