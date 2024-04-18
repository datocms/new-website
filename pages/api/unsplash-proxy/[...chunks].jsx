const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  secure: true,
  hostRewrite: true,
  autoRewrite: true,
});

export default function handler(req, res) {
  proxy.web(req, res, {
    ignorePath: true,
    target: `https://api.unsplash.com${req.url.replace(
      /.*unsplash\-proxy/,
      '',
    )}`,
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_TOKEN}`,
    },
    changeOrigin: true,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
