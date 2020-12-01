import client from '@mailchimp/mailchimp_marketing';

client.setConfig({
  apiKey: process.env.MAILCHIMP_TOKEN,
  server: 'us13',
});

export default async ({ method, body }, res) => {
  if (method !== 'POST') {
    return res.status(404).send('Invalid endpoint!');
  }

  const { email } = body;

  if (!email) {
    return res.status(422).send('Invalid request!');
  }

  try {
    await client.lists.addListMember('89c6a6a92b', {
      email_address: body.email,
      status: 'transactional',
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(e.status).json({ success: false, error: e.response.body });
  }
};
