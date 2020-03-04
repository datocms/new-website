export default (req, res) => {
  res.setPreviewData({});

  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}