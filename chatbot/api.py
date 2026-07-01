import sys
import io
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading

# Suppress initialization prints
original_stdout = sys.stdout
sys.stdout = io.StringIO()

from retriever import Retriever
retriever = Retriever()

sys.stdout = original_stdout
print("Retriever API loaded and listening on port 8000")

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return # suppress logging
        
    def do_POST(self):
        if self.path == '/retrieve':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data)
                query = data.get("query", "")
                top_k = data.get("top_k", 4)
                
                context = retriever.retrieve(query, top_k=top_k)
                
                response_data = {"context": context}
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), RequestHandler)
    server.serve_forever()
