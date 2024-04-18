import Mailerlite from '@mailerlite/mailerlite-nodejs';
import format from 'date-fns/format';

const mailerlite = new Mailerlite({
  api_key: process.env.MAILERLITE_TOKEN,
});

const subscribe = async ({ method, body }, res) => {
  if (method !== 'POST') {
    return res.status(404).send('Invalid endpoint!');
  }

  const { email } = body;

  if (!email) {
    return res.status(422).send('Invalid request!');
  }

  try {
    await mailerlite.subscribers.createOrUpdate({
      email: body.email,
      status: 'active',
      opted_in_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res
      .status(e.status)
      .json({ success: false, error: 'Something went wrong...' });
  }
};

export default subscribe;
