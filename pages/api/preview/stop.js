export default (req, res) => {
  res.clearPreviewData()

  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}