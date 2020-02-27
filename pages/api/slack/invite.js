import tiny from 'tiny-json-http';
import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_TOKEN);

export default async ({ method, body }, res) => {
  if (method !== 'POST') {
    return res.status(404).send('Invalid endpoint!');
  }

  const { email, token } = body;

  console.log(body);

  try {
    const result = await web.apiCall(
      'users.admin.invite',
      {
        email,
        set_active: true,
        channels: [
          "C7SS10UUW", // general
          "CDP0ERYJE", // graphql
          "CDQC7RHPG", // help
          "CDN843R1N", // javascript
          "CDN83VAQG", // plugins
        ]
      }
    );

    console.log(result);

    res.status(200).json({ success: true });
  } catch(e) {
    res.status(400).json({ success: false, error: e.code });
  }
};

// result = JSON.parse(Faraday.post(
//   "https://www.google.com/recaptcha/api/siteverify",
//   secret: ENV.fetch("RECAPTCHA_SECRET_KEY"),
//   response: params["g-recaptcha-response"],
// ).body)

// if result["success"]
//   client.users_admin_invite(
//     email: params[:email],
//     set_active: true,
//     channels: [

//     ].join(","),
//   )
//   response = { success: true }
//   render json: response
// else
//   response = { success: false, error: "recaptcha" }
//   render json: response, status: 422
// end
// rescue Slack::Web::Api::Errors::SlackError => e
// response = { success: false, error: e.message }
// render json: response, status: 422
