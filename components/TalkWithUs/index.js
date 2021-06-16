import s from './style.module.css';
import Textarea from 'react-autosize-textarea';
import { getData } from 'country-list';
import { Form, Field } from 'components/Form';
import { getCookie } from 'utils/cookies';

export default function TalkWithUs({
  initialValues = {},
  contactFormType,
  issueType,
}) {
  const defaultValues = {
    name: '',
    project: '',
    email: getCookie('datoAccountEmail'),
    phoneNumber: '',
    companyName: '',
    country: '',
    industry: '',
    jobFunction: '',
    useCase: '',
    referral: '',
    companyRevenue: '',
    body: '',
    errorId: '',
    issueType: issueType,
    ...initialValues,
  };

  const onSubmit = async (values, event, { addToast }) => {
    const target = event.nativeEvent.currentTarget;

    if (contactFormType !== 'sales') {
      target.action =
        'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/sWPCwvUmu--UpyGfM9hRVfjaIwWCyVh-3I0nJ4gNZKU6fQeDGRdrNfYSsrIyeoqTcGPguYxKX-ULe-OYj08sar17B0gWytpkKNcAZNZB_0HTwk9jBCh5wEQCmsmm';

      target.submit();

      return;
    }

    event.preventDefault();

    const body = JSON.stringify(values);

    try {
      const res = await fetch('/api/pipedrive/submit', {
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

      target.action =
        'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/dTIFLRUzwsUhDSuSqTsVTadDNiaxdRGAXWcMPc785T1sSFl2FaLg_dh3D3syMHw06ZRO4UDsIYWvxwLolfWYe1kvkhpAxbfb4BK_Bmb_Kxro1oHtw-dCVYEZ-15Q';

      target.submit();
    } catch (e) {
      addToast('Ouch! There was an error submitting the form!', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  return (
    <div className={s.root}>
      <Form
        defaultValues={defaultValues}
        submitLabel="Get in touch"
        onSubmit={onSubmit}
      >
        {contactFormType === 'support' && (
          <>
            <div className={s.formCols}>
              <Field
                name="email"
                label="Account email"
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
                label="Project URL"
                placeholder="Your CMS URL"
                validations={{ required: 'Required' }}
              />
            </div>
          </>
        )}

        {contactFormType === 'sales' && (
          <>
            <div className={s.formCols}>
              <Field
                name="name"
                label="Full name"
                placeholder="Your full name"
                validations={{ required: 'Required' }}
              />

              <Field
                name="companyName"
                label="Company name"
                placeholder="Your company name"
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
            </div>

            <div className={s.formCols}>
              <Field
                name="jobFunction"
                label="Job function"
                validations={{ required: 'Required' }}
                options={[
                  'Editorial & Content',
                  'Developer/Engineering',
                  'Product & Project',
                  'Sales & Marketing',
                  'Other',
                ]}
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

              {contactFormType === 'sales' && (
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
            </div>
          </>
        )}

        <Field
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          render={({ field }) => <Textarea {...field} />}
        />

        {initialValues.errorId && (
          <Field name="errorId" label="Error ID" readOnly />
        )}

        {contactFormType === 'support' && (
          <Field
            name="uploads"
            label="Add any additional attachments"
            type="file"
            multiple
          />
        )}

        <Field name="issueType" type="hidden" />
      </Form>
    </div>
  );
}
