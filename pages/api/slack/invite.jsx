import { WebClient } from '@slack/web-api';
import tiny from 'tiny-json-http';

const web = new WebClient(process.env.SLACK_TOKEN);

const handler = async ({ method, body }, res) => {
  if (method !== 'POST') {
    return res.status(404).send('Invalid endpoint!');
  }

  const { email, token } = body;

  if (!email || !token) {
    return res.status(422).send('Invalid request!');
  }

  try {
    const { body: recaptcha } = await tiny.post({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    if (!recaptcha.success) {
      return res.status(401).send('Invalid RECAPTCHA!');
    }

    const result = await web.apiCall('users.admin.invite', {
      email,
      set_active: true,
      channels: [
        'C7SS10UUW', // general
        'CDP0ERYJE', // graphql
        'CDQC7RHPG', // help
        'CDN843R1N', // javascript
        'CDN83VAQG', // plugins
      ],
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(422).json({ success: false, error: e.data.error });
  }
};

export default handler;
