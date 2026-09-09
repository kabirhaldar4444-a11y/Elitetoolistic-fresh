import http.server
import socketserver
import urllib.request
import urllib.error
import json
import ssl

PORT = 8080

PAYALMA_API_URL = 'https://gate.payalma.com/api/v1/purchases/'
# Securely storing the API keys on the server instead of the client
PAYALMA_BRAND_ID = '9a0999f4-1298-4336-8b85-7c5d86238553'
PAYALMA_API_KEY = 'q_H9dTYyAEtoFVVhGPkREQLc27gGVIq3g8EONZemZN4wEvcqcZBou-7LckEecYcxVyjW46kSrvV6sSSNNnOWXA=='

class MyProxy(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/checkout':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # The client sends the payload (client email, purchase details, etc.)
            # We just need to inject the brand_id securely if it's not already there.
            payload = json.loads(post_data.decode('utf-8'))
            payload['brand_id'] = PAYALMA_BRAND_ID
            secure_post_data = json.dumps(payload).encode('utf-8')
            
            # Create a request to PayAlma
            req = urllib.request.Request(PAYALMA_API_URL, data=secure_post_data, method='POST')
            req.add_header('Content-Type', 'application/json')
            req.add_header('Authorization', f'Bearer {PAYALMA_API_KEY}')
            
            try:
                # Disabling SSL verification just in case there are local cert issues for python on mac
                context = ssl._create_unverified_context()
                response = urllib.request.urlopen(req, context=context)
                response_data = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response_data)
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = json.dumps({'error': str(e)}).encode('utf-8')
                self.wfile.write(error_response)
        else:
            self.send_response(404)
            self.end_headers()

# Prevent address already in use error
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), MyProxy) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
