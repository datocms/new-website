export default (req, res) => {
  res.clearPreviewData();

  res.statusCode = 302;
  res.setHeader('Location', req.query.page || '/');
  res.end();
};
