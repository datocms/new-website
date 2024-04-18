const https = require('node:https');
const pipedrive = require('pipedrive');
const Rollbar = require('rollbar');

const rollbar = process.env.ROLLBAR_TOKEN
  ? new Rollbar(process.env.ROLLBAR_TOKEN)
  : { error: () => {} };

pipedrive.Configuration.apiToken = process.env.PIPEDRIVE_TOKEN;

export function httpPost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'datocms.pipedrive.com',
      port: 443,
      path: `/v1/${endpoint}?api_token=${process.env.PIPEDRIVE_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export async function createNote(lead, body) {
  try {
    const data = {
      content: body,
      lead_id: lead.id,
      org_id: lead.organization_id,
      person_id: lead.person_id,
    };

    const result = await httpPost('notes', JSON.stringify(data));

    const parsedResult = JSON.parse(result);
    console.log(parsedResult);
    return parsedResult.data;
  } catch (e) {
    rollbar.error(e);
    throw e;
  }
}

export async function createLead(person, organization, useCase, labels = []) {
  try {
    const useCaseCustomField = '01de2dc74c0a37431deeb784603b14d6c718da12';
    const data = {
      title: organization.name,
      [useCaseCustomField]: useCase,
      person_id: person.id,
      organization_id: organization.id,
      label_ids: labels,
    };
    const result = await httpPost('leads', JSON.stringify(data));
    const parsedResult = JSON.parse(result);
    return parsedResult.data;
  } catch (e) {
    rollbar.error(e);
    throw e;
  }
}

export async function findOrCreatePerson(
  email,
  firstName,
  lastName,
  country,
  jobFunction,
  referral,
  organization,
) {
  try {
    const jobFunctionCustomField = 'c28a0aa1a4c02699ca8617d8241b4451cb6348d7';
    const referralCustomField = '8d682dcba3c78ba24d802f3391d7fbbc10adeb8e';
    const personsController = pipedrive.PersonsController;

    const result = await personsController.searchPersons({
      term: email,
      fields: 'email',
      exact_match: true,
    });

    if (result.data.items.length > 0) {
      const person = result.data.items[0].item;

      if (person.organization !== null) {
        return person;
      }

      const updatedPerson = await personsController.updateAPerson({
        id: person.id,
        orgId: organization.id,
      });

      return updatedPerson.data;
    }

    const data = {
      name: `${firstName} ${lastName}`,
      email: email,
      postal_address: country,
      [jobFunctionCustomField]: jobFunction,
      [referralCustomField]: referral,
      org_id: organization.id,
      visible_to: 3,
    };
    const newPerson = await personsController.addAPerson({
      body: data,
    });

    return newPerson.data;
  } catch (e) {
    rollbar.error(e);
    throw e;
  }
}

export async function findOrCreateOrgByName(name, industry, link = '') {
  try {
    const industryCustomField = 'b42d7891b195b7aa9a6348258c746d0b03dee2c4';
    const linkField = 'b7d80b2d8f0177495004c3dd83efe67ee44ddaca';
    const orgController = pipedrive.OrganizationsController;

    const org = await orgController.findOrganizationsByName({
      term: name,
      exact_match: true,
    });

    if (
      org.data.length > 0 &&
      org.data[0].name.toLowerCase() === name.toLowerCase()
    ) {
      return org.data[0];
    }

    const data = {
      name: name,
      [industryCustomField]: industry,
      [linkField]: link,
      visible_to: 3,
    };

    const newOrg = await orgController.addAnOrganization({
      body: data,
    });

    return newOrg.data;
  } catch (e) {
    rollbar.error(e);
    throw e;
  }
}
