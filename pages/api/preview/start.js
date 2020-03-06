export default (req, res) => {
  res.setPreviewData({});

  res.statusCode = 302;
  res.setHeader('Location', req.query.page || '/');
  res.end();
};
