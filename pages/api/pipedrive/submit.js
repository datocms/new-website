const pipedrive = require('pipedrive');
const https = require('https');
const Rollbar = require('rollbar');
const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);

pipedrive.Configuration.apiToken = process.env.PIPEDRIVE_TOKEN;

export default async (req, res) => {
  // create the error before the async part
  // otherwise we loose the stack!
  let error;
  try {
    throw new Error();
  } catch (e) {
    error = e;
  }

  try {
    if (req.method !== 'POST') {
      return res.status(404).send('Invalid endpoint!');
    }

    const {
      fullName,
      companyName,
      workEmail,
      country,
      jobFunction,
      industry,
      useCase,
      howDidYouHearAboutUs,
      question,
    } = req.body;

    const organization = await findOrCreateOrgByName(companyName, industry);

    const person = await findOrCreatePerson(
      workEmail,
      fullName,
      country,
      jobFunction,
      howDidYouHearAboutUs,
      organization,
    );

    const lead = await createLead(person, organization, useCase);
    await createNote(lead, question);

    res.status(200).json({ success: true });
  } catch (e) {
    error.name = e.name;
    error.message = e.message;
    rollbar.error(error);
    res
      .status(error.status)
      .json({ success: false, error: error.response.body.title });
  }
};

async function findOrCreateOrgByName(name, industry) {
  const orgController = pipedrive.OrganizationsController;
  const industryCustomField = 'b42d7891b195b7aa9a6348258c746d0b03dee2c4';
  const org = await orgController.findOrganizationsByName({
    term: name,
    exact_match: true,
  });
  if (
    org.data.length > 0 &&
    org.data[0].name.toLowerCase() == name.toLowerCase()
  ) {
    return org.data[0];
  } else {
    const data = {
      name: name,
      [industryCustomField]: industry,
      visible_to: 3,
    };
    const newOrg = await orgController.addAnOrganization({
      body: data,
    });
    return newOrg.data;
  }
}

async function findOrCreatePerson(
  workEmail,
  fullName,
  country,
  jobFunction,
  howDidYouHearAboutUs,
  organization,
) {
  const personsController = pipedrive.PersonsController;
  const jobFunctionCustomField = 'c28a0aa1a4c02699ca8617d8241b4451cb6348d7';
  const howDidYouHearAboutUsCustomField =
    '8d682dcba3c78ba24d802f3391d7fbbc10adeb8e';
  const result = await personsController.searchPersons({
    term: workEmail,
    fields: 'email',
    exact_match: true,
  });
  if (result.data.items.length > 0) {
    const person = result.data.items[0].item;
    if (person.organization == null) {
      const updatedPerson = await personsController.updateAPerson({
        id: person.id,
        orgId: organization.id,
      });
      return updatedPerson.data;
    }
    return person;
  } else {
    const data = {
      name: fullName,
      email: workEmail,
      postal_address: country,
      [jobFunctionCustomField]: jobFunction,
      [howDidYouHearAboutUsCustomField]: howDidYouHearAboutUs,
      org_id: organization.id,
      visible_to: 3,
    };
    const newPerson = await personsController.addAPerson({
      body: data,
    });
    return newPerson.data;
  }
}

async function createLead(person, organization, useCase) {
  const useCaseCustomField = '01de2dc74c0a37431deeb784603b14d6c718da12';
  const data = {
    title: organization.name,
    [useCaseCustomField]: useCase,
    person_id: person.id,
    organization_id: organization.id,
  };
  const result = await httpPost('leads', JSON.stringify(data));
  const parsedResult = JSON.parse(result);
  return parsedResult.data;
}

async function createNote(lead, question) {
  const data = {
    content: question,
    lead_id: lead.id,
    org_id: lead.organization_id,
    person_id: lead.person_id,
  };
  const result = await httpPost('notes', JSON.stringify(data));

  throw 'monster';

  const parsedResult = JSON.parse(result);
  return parsedResult.data;
}

function httpPost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'datocms.pipedrive.com',
      port: 443,
      path: `/v1/${endpoint}?api_token=${process.env.PIPEDRIVE_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      const chunksOfData = [];

      res.on('data', (d) => {
        chunksOfData.push(d);
      });

      res.on('end', () => {
        const responseBody = Buffer.concat(chunksOfData);
        resolve(responseBody.toString());
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}
