import fetch from 'node-fetch';

export default async (_req, res) => {
  const response = await fetch(`https://api.fastly.com/datacenters`, {
    headers: {
      'Fastly-Key': process.env.FASTLY_API_KEY,
    },
  });

  const data = await response.json();

  res.status(200).json(data);
}