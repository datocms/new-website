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

proxy.on('proxyReq', function (proxyReq) {
  proxyReq.setHeader(
    'Authorization',
    `Client-ID ${process.env.UNSPLASH_ACCESS_TOKEN}`,
  );
});

export default function handler(req, res) {
  req.url = req.url.replace(/.*unsplash\-proxy/, '');

  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: 'api.unsplash.com',
    },
    changeOrigin: true,
  });
}
