const { JSDOM, VirtualConsole } = require('jsdom');

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (err) => console.error('[CONSOLE ERROR]', err));
virtualConsole.on('jsdomError', (err) => console.error('[JSDOM ERROR]', err));
virtualConsole.on('log', (msg) => console.log('[CONSOLE LOG]', msg));

const targetUrl = process.env.APP_URL || 'http://127.0.0.1:4200/';

fetch(targetUrl)
  .then(res => res.text())
  .then(html => {
    console.log("HTML received, length:", html.length);
    const dom = new JSDOM(html, {
      url: targetUrl,
      runScripts: 'dangerously',
      resources: 'usable',
      virtualConsole
    });

    setTimeout(() => {
      console.log("Root innerHTML length after 3s:", dom.window.document.querySelector('app-root')?.innerHTML?.length);
      console.log("Root innerHTML:", dom.window.document.querySelector('app-root')?.innerHTML);
      process.exit(0);
    }, 4000);
  })
  .catch(err => {
    console.error('Fetch error:', err);
    process.exit(1);
  });
