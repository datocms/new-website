import { WebClient } from '@slack/web-api';

const handler = async (_req, res) => {
  const web = new WebClient(process.env.SLACK_TOKEN);
  const info = await web.conversations.info({
    channel: 'C7SS10UUW',
    include_num_members: true,
  });
  res.status(200).json({ count: info.channel.num_members });
};

export default handler;
