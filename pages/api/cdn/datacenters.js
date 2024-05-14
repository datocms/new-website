import tiny from 'tiny-json-http';

const datacenters = async (_req, res) => {
  const { body: data } = await tiny.get({
    url: `https://api.fastly.com/datacenters`,
    headers: {
      'Fastly-Key': process.env.FASTLY_API_KEY,
    },
  });

  res.status(200).json(data);
};

export default datacenters;
