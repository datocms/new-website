const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  secure: true,
  hostRewrite: true,
  autoRewrite: true,
});

proxy.on('error', function (err, req, res) {
  console.error(err);
  res.writeHead(500, {
    'Content-Type': 'text/json',
  });
  res.end(err.toString());
});

export default function handler(req, res) {
  req.url = 'https://cdn.usefathom.com/script.js';

  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: 'cdn.usefathom.com',
    },
    changeOrigin: true,
  });
}
