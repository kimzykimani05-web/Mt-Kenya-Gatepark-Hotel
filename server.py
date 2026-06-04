import http.server
import socketserver
import os
import webbrowser
import threading
import time

def get_port():
    try:
        with open('tokenk.txt', 'r') as f:
            for line in f:
                if line.startswith('PORT='):
                    return int(line.strip().split('=')[1])
    except FileNotFoundError:
        pass
    return 5000  # Default port

def open_browser(port):
    # Wait a moment for server to start
    time.sleep(1.5)
    # Try to open in Brave browser
    brave_path = r'C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe'
    url = f'http://localhost:{port}'
    
    if os.path.exists(brave_path):
        webbrowser.register('brave', None, 
                          webbrowser.BackgroundBrowser(brave_path))
        webbrowser.get('brave').open(url)
    else:
        # Fallback to default browser
        webbrowser.open(url)

if __name__ == '__main__':
    PORT = get_port()
    
    # Change to the directory where this script is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print(f'Serving at http://localhost:{PORT}')
        print('Press Ctrl+C to stop the server')
        
        # Open browser in a separate thread
        browser_thread = threading.Thread(target=open_browser, args=(PORT,))
        browser_thread.daemon = True
        browser_thread.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped.')
