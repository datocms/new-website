const Rollbar = require('rollbar');
import {
  createNote,
  createLead,
  findOrCreatePerson,
  findOrCreateOrgByName,
} from '../../../lib/pipedriveHelpers';

const rollbar = process.env.ROLLBAR_TOKEN
  ? new Rollbar(process.env.ROLLBAR_TOKEN)
  : { error: () => {} };

const handler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(404).send('Invalid endpoint!');
    }

    if (!process.env.PIPEDRIVE_TOKEN) {
      res.status(200).json({ success: true });
      return;
    }

    const {
      firstName,
      lastName,
      companyName,
      email,
      country,
      jobFunction,
      industry,
      useCase,
      referral,
      body,
    } = req.body;

    const organization = await findOrCreateOrgByName(companyName, industry);

    const person = await findOrCreatePerson(
      email,
      firstName,
      lastName,
      country,
      jobFunction,
      referral,
      organization,
    );

    const lead = await createLead(person, organization, useCase);

    await createNote(lead, body);

    res.status(200).json({ success: true });
  } catch (e) {
    rollbar.error(e);
    res.status(e.status).json({ success: false, error: e.response.body.title });
  }
};

export default handler;
