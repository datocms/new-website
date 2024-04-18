import { Field, Form } from 'components/Form';
import { getData } from 'country-list';
import Textarea from 'react-textarea-autosize';
import { getCookie } from 'utils/cookies';
import s from './style.module.css';

const frontFormIds = {
  sales:
    'sWPCwvUmu--UpyGfM9hRVfjaIwWCyVh-3I0nJ4gNZKU6fQeDGRdrNfYSsrIyeoqTcGPguYxKX-ULe-OYj08sar17B0gWytpkKNcAZNZB_0HTwk9jBCh5wEQCmsmm',
  support:
    'dTIFLRUzwsUhDSuSqTsVTadDNiaxdRGAXWcMPc785T1sSFl2FaLg_dh3D3syMHw06ZRO4UDsIYWvxwLolfWYe1kvkhpAxbfb4BK_Bmb_Kxro1oHtw-dCVYEZ-15Q',
};

async function sendToPipedrive(payload) {
  const res = await fetch('/api/pipedrive/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Ouch!');
  }

  const result = await res.json();

  if (!result.success) {
    throw new Error('Ouch!');
  }
}

export default function TalkWithUs({ initialValues = {}, fieldset }) {
  const defaultValues = {
    firstName: '',
    lastName: '',
    project: '',
    email: getCookie('datoAccountEmail'),
    companyName: '',
    country: '',
    industry: '',
    jobFunction: '',
    useCase: '',
    referral: '',
    body: '',
    errorId: '',
    ...initialValues,
  };

  async function handleSubmit(formValues) {
    if (fieldset === 'sales') {
      await sendToPipedrive(formValues);
    }
  }

  return (
    <div className={s.root}>
      <Form
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        nativeSubmitForm
        onSubmit={handleSubmit}
        action={`https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/${frontFormIds[fieldset]}`}
      >
        {fieldset === 'support' && (
          <>
            <Field
              name="email"
              label="DatoCMS account email"
              placeholder="Your account email"
              validations={{
                required: 'Required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                  message: 'Invalid email',
                },
              }}
            />
            <Field
              name="project"
              label="DatoCMS project URL"
              placeholder="https://<YOUR_PROJECT>.admin.datocms.com"
              validations={{ required: 'Required' }}
            />
          </>
        )}

        {fieldset === 'sales' && (
          <>
            <Field
              name="companyName"
              label="Company name"
              placeholder="Your company name"
              validations={{ required: 'Required' }}
            />

            <div className={s.formCols}>
              <Field
                name="country"
                label="Country"
                validations={{ required: 'Required' }}
                options={getData()
                  .map(({ code, name }) => ({
                    value: code,
                    label: name,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
              />
              <Field
                name="industry"
                label="Industry"
                options={[
                  'Agency / Freelancer',
                  'Ecommerce / Retail',
                  'FinTech',
                  'Media / Publishing',
                  'SaaS',
                  'Automotive',
                  'CleanTech / Utility',
                  'Food & Beverage',
                  'Education',
                  'Non-Profit & Culture',
                  'Other',
                ]}
                validations={{ required: 'Required' }}
              />
            </div>

            <div className={s.formCols}>
              <Field
                name="firstName"
                label="First name"
                placeholder="Your first name"
                validations={{ required: 'Required' }}
              />

              <Field
                name="lastName"
                label="Last name"
                placeholder="Your last name"
                validations={{ required: 'Required' }}
              />
            </div>

            <div className={s.formCols}>
              <Field
                name="email"
                label="Work email"
                placeholder="Your work email"
                validations={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                    message: 'Invalid email',
                  },
                }}
              />

              <Field
                name="jobFunction"
                label="Job function"
                validations={{ required: 'Required' }}
                options={[
                  'Editorial & Content',
                  'Developer/Engineering',
                  'Product & Project',
                  'Sales & Marketing',
                  'Administrative',
                  'Other',
                ]}
              />
            </div>

            <Field
              name="useCase"
              label="Use case"
              options={[
                'Ecommerce',
                'Moving to headless',
                'Migrating from other headless CMS',
                'Agency',
                'Other',
              ]}
              validations={{ required: 'Required' }}
            />
          </>
        )}

        <Field
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          render={({ field }) => <Textarea {...field} />}
        />

        {fieldset === 'sales' && (
          <Field
            name="referral"
            label="How did you hear about us?"
            options={[
              'A colleague/recommendation/forum',
              'Software review platform (G2, Capterra...)',
              'Our partners (Gatsby, Next.js...)',
              'Social Media (Twitter, LinkedIn...)',
              'Search',
              'Other',
            ]}
            validations={{ required: 'Required' }}
          />
        )}

        {initialValues.errorId && (
          <Field name="errorId" label="Error ID" readOnly />
        )}

        {fieldset === 'support' && (
          <Field
            name="uploads"
            label="Add any additional attachments, if necessary"
            type="file"
            multiple
          />
        )}

        <Field name="issueType" type="hidden" />
      </Form>
    </div>
  );
}
