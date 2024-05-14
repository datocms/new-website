import url from 'url';

const handler = (req, res) => {
  const uri = url.parse(req.query.page || req.query.slug || '/', true);
  const sanitizedUrl = `${uri.pathname}${uri.search || ''}`;

  res.clearPreviewData();

  res.statusCode = 307;
  res.setHeader('Location', sanitizedUrl);
  res.end();
};

export default handler;
