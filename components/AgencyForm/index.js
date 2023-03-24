import { sendFormValuesToHubspot } from 'utils/hubspot';
import Textarea from 'react-textarea-autosize';
import { getData } from 'country-list';
import { Form, Field } from 'components/Form';
import { getCookie } from 'utils/cookies';
import s from './style.module.css';

export default function AgencyForm({
  action = 'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/aiwRgx07C0Ix1B7x-Ex6B67cQpfHc9C_8taVomi6wfkt5nrcQIIoChC4AKU90ytYoSIyBXB9iUAzttmGijXse3tNA4LJdiOWwmF--Xbifq0RxMqHExLQKezhuYth',
}) {
  const defaultValues = {
    firstName: '',
    lastName: '',
    agencyName: '',
    agencyUrl: '',
    country: '',
    email: getCookie('datoAccountEmail'),
    productFamiliarity: '',
    body: '',
    teamSize: '',
  };

  async function handleSubmit(formValues) {
    await sendFormValuesToHubspot({
      formId: 'd0146ada-8c89-4f7a-971c-053a4c30f3ad',
      formValues,
      hubspotFieldsMapping: {
        firstName: 'contact.firstname',
        lastName: 'contact.lastname',
        agencyName: 'company.name',
        agencyUrl: 'company.website',
        email: 'contact.email',
        country: 'company.country',
        body: 'contact.message',
        teamSize: 'company.numberofemployees',
        productFamiliarity: 'company.familiarity_with_datocms',
      },
    });

    const body = JSON.stringify(formValues);
    const res = await fetch('/api/pipedrive/submit-partner', {
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error('Ouch!');
    }
  }

  return (
    <div className={s.form}>
      <Form
        defaultValues={defaultValues}
        submitLabel="Let's have a chat!"
        nativeSubmitForm
        onSubmit={handleSubmit}
        action={action}
      >
        <div className={s.formCols}>
          <Field
            name="firstName"
            label="Your first name"
            placeholder="Enter your first name"
            validations={{ required: 'Required' }}
          />
          <Field
            name="lastName"
            label="Your last name"
            placeholder="Enter your last name"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <Field
            name="agencyName"
            label="What's the name of your agency?"
            placeholder="Acme Inc."
            validations={{ required: 'Required' }}
          />
          <Field
            name="agencyUrl"
            label="Do you have a website?"
            placeholder="https://www.acme.com"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <Field
            name="teamSize"
            label="Company size"
            placeholder="Select number of employees"
            options={[
              "1 — it's just me",
              '2-10',
              '10-50',
              '50-200',
              '200-1000',
              '1000+',
            ]}
            validations={{ required: 'Required' }}
          />
          <Field
            name="productFamiliarity"
            label="How familiar are you with DatoCMS?"
            options={[
              'Exploring the product',
              'Already published a few projects',
              'Already published +10 projects',
            ]}
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <Field
            name="email"
            label="What's your DatoCMS account email?"
            placeholder="info@acme.com"
            validations={{
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                message: 'Invalid email',
              },
            }}
          />

          <Field
            name="country"
            label="Where are you based?"
            validations={{ required: 'Required' }}
            options={getData()
              .map(({ code, name }) => ({
                value: code,
                label: name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </div>

        <Field
          name="body"
          label="Please introduce yourself and your agency. If you have any additional question or concern, please ask!"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea
              placeholder="Looking forward to chat with you! ;-)"
              {...field}
            />
          )}
        />
      </Form>
    </div>
  );
}
