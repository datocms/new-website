import Rollbar from 'rollbar';

export default async function handleServerSideError(error, context) {
  if (!process.env.ROLLBAR_TOKEN) {
    throw error;
  }

  const client = new Rollbar(process.env.ROLLBAR_TOKEN);

  await new Promise((resolve) => client.error(error, null, context, resolve));

  throw error;
}
