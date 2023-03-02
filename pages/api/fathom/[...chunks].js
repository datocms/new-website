export default async function handler(req, res) {
  const response = await fetch('https://cdn.usefathom.com/script.js');
  const text = await response.text();

  res.setHeader('content-type', 'application/javascript');
  res.status(200).send(text);
}
