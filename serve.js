import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const reqPath = (req.url || '/').split('?')[0];
  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  const candidate = path.join(DIST_DIR, safePath === '/' ? 'index.html' : safePath);

  const serveFile = (filePath) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found - Hãy chạy "npm run build" trước khi khởi chạy server.');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  };

  fs.stat(candidate, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(candidate);
    } else {
      serveFile(path.join(DIST_DIR, 'index.html'));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Apex Pickleball Academy (dist) is live at http://localhost:${PORT}`);
});
