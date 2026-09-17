const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (err) => console.error('[CONSOLE ERROR]', err));
virtualConsole.on('jsdomError', (err) => console.error('[JSDOM ERROR]', err));
virtualConsole.on('log', (msg) => console.log('[CONSOLE LOG]', msg));

const indexHtmlPath = path.join(__dirname, 'src', 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml);
});

server.listen(4201, '127.0.0.1', () => {
  console.log('Test server running on http://127.0.0.1:4201');
  
  fetch('http://127.0.0.1:4201/')
    .then(res => res.text())
    .then(html => {
      console.log('Fetched HTML length:', html.length);
      const dom = new JSDOM(html, {
        url: 'http://127.0.0.1:4201/',
        virtualConsole
      });
      console.log('App root element present:', !!dom.window.document.querySelector('app-root'));
      server.close(() => process.exit(0));
    })
    .catch(err => {
      console.error('Test error:', err);
      server.close(() => process.exit(1));
    });
});
