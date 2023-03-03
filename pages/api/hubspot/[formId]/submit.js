const Rollbar = require('rollbar');

const rollbar = process.env.ROLLBAR_TOKEN
  ? new Rollbar(process.env.ROLLBAR_TOKEN)
  : { error: () => {} };

const hubspotPortalId = '27002970';

const handler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(404).send('Invalid endpoint!');
    }

    const { formId } = req.query;

    if (!formId) {
      return res.status(404).send('Missing form ID');
    }

    console.log('Forwarded IP', req.headers['x-vercel-forwarded-for']);

    const hubspotRequest = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/secure/submit/${hubspotPortalId}/${formId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        },
        body: JSON.stringify({
          ...req.body,
          context: {
            ...req.body.context,
            ipAddress: req.headers['x-vercel-forwarded-for'],
          },
        }),
      },
    );

    const resultText = await hubspotRequest.text();

    res.setHeader('content-type', hubspotRequest.headers.get('content-type'));

    return res.status(hubspotRequest.status).send(resultText);
  } catch (e) {
    rollbar.error(e);
    res.status(e.status).json({ success: false, error: e.message });
  }
};

export default handler;
