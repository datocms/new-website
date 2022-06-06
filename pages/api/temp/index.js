const handler = async (_req, res) => {
  res.status(200).json({
    FASTLY_API_KEY: process.env.FASTLY_API_KEY,
    SLACK_TOKEN: process.env.SLACK_TOKEN,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    MAILCHIMP_TOKEN: process.env.MAILCHIMP_TOKEN,
  });
};

export default handler;
