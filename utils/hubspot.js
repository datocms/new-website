import { getCookie } from 'utils/cookies';

const hubspotObjectTypeIdMapping = {
  contact: '0-1',
  company: '0-2',
  deal: '0-3',
  ticket: '0-5',
};

function convertFormValuesToHubspotPayload(formValues, hubspotFieldsMapping) {
  return {
    fields: Object.entries(formValues)
      .map(([fieldName, fieldValue]) => {
        if (!(fieldValue && hubspotFieldsMapping[fieldName])) {
          return null;
        }

        const [hubspotContext, hubspotFieldName] =
          hubspotFieldsMapping[fieldName].split('.');

        return {
          objectTypeId: hubspotObjectTypeIdMapping[hubspotContext],
          name: hubspotFieldName,
          value: fieldValue,
        };
      })
      .filter(Boolean),
    context: {
      hutk: getCookie('hubspotutk'),
      pageUri: document.location.href,
      pageName: document.title,
    },
  };
}

export async function sendFormValuesToHubspot({
  formId,
  formValues,
  hubspotFieldsMapping,
}) {
  const res = await fetch(`/api/hubspot/${formId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      convertFormValuesToHubspotPayload(formValues, hubspotFieldsMapping),
    ),
  });

  if (!res.ok) {
    throw new Error('Ouch!');
  }
}
