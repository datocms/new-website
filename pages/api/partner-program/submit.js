const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  secure: true,
  hostRewrite: true,
  autoRewrite: true,
});

export default function handler(req, res) {
  proxy.web(req, res, {
    ignorePath: true,
    target:
      'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/aiwRgx07C0Ix1B7x-Ex6B67cQpfHc9C_8taVomi6wfkt5nrcQIIoChC4AKU90ytYoSIyBXB9iUAzttmGijXse3tNA4LJdiOWwmF--Xbifq0RxMqHExLQKezhuYth',
    headers: {
      Referer: 'https://www.datocms.com/partner-program',
    },
    changeOrigin: true,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
