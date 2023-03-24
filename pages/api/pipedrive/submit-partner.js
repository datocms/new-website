const Rollbar = require('rollbar');
import {
  createNote,
  createLead,
  findOrCreateOrgByName,
  findOrCreatePerson,
} from '../../../lib/pipedrive-helpers';

const rollbar = process.env.ROLLBAR_TOKEN
  ? new Rollbar(process.env.ROLLBAR_TOKEN)
  : { error: () => {} };

const partnershipLabel = '87a60c60-6a8e-11ed-92ec-410445a67487';

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
      agencyName,
      agencyUrl,
      email,
      country,
      body,
      teamSize,
      productFamiliarity,
    } = req.body;

    const organization = await findOrCreateOrgByName(
      agencyName,
      'Agency / Freelancer',
      agencyUrl,
    );

    const person = await findOrCreatePerson(
      email,
      firstName,
      lastName,
      country,
      '',
      '',
      organization,
    );

    const lead = await createLead(person, organization, '', [partnershipLabel]);

    const noteText = `Team size: ${teamSize}
    Product familiarity: ${productFamiliarity}
    Message: ${body}`;
    await createNote(lead, noteText);

    res.status(200).json({ success: true });
  } catch (e) {
    rollbar.error(e);
    res.status(e.status).json({ success: false, error: e.response.body.title });
  }
};

export default handler;
