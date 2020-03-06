import url from 'url';

export default (req, res) => {
  const uri = url.parse(req.query.page || '/', true);
  const sanitizedUrl = `${uri.pathname}${uri.search || ''}`;

  res.clearPreviewData();

  res.statusCode = 307;
  res.setHeader('Location', sanitizedUrl);
  res.end();
};
