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

  function frontUrl(contactFormType) {
    if (contactFormType == 'sales') {
      return 'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/dTIFLRUzwsUhDSuSqTsVTadDNiaxdRGAXWcMPc785T1sSFl2FaLg_dh3D3syMHw06ZRO4UDsIYWvxwLolfWYe1kvkhpAxbfb4BK_Bmb_Kxro1oHtw-dCVYEZ-15Q';
    } else {
      return 'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/sWPCwvUmu--UpyGfM9hRVfjaIwWCyVh-3I0nJ4gNZKU6fQeDGRdrNfYSsrIyeoqTcGPguYxKX-ULe-OYj08sar17B0gWytpkKNcAZNZB_0HTwk9jBCh5wEQCmsmm';
    }
  }

  return (
    <div className={s.root}>
      <Form
        action={frontUrl(contactFormType)}
        defaultValues={defaultValues}
        submitLabel="Get in touch"
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
                name="companyName"
                label="Company name"
                placeholder="Your company name"
                validations={{ required: 'Required' }}
              />
              <Field
                name="industry"
                label="Industry"
                options={[
                  'Agency',
                  'Software Development',
                  'Ecommerce/Retail',
                  'FinTech',
                  'Media/Publishing',
                  'Services',
                  'CleanTech',
                  'Automotive',
                  'Utility',
                  'Food & Beverage',
                  'Education',
                  'Non-Profit & Culture',
                  'Government',
                  'Other',
                ]}
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
                name="phoneNumber"
                label="Phone number"
                placeholder="Your phone number"
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
                name="useCase"
                label="Use case"
                options={[
                  'Ecommerce',
                  'Moving to headless',
                  'Migrating from other headless CMS',
                  'Documentation',
                  'Multi-project',
                  'Other',
                ]}
              />
            </div>
          </>
        )}

        <Field
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          as={<Textarea />}
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

        {contactFormType === 'sales' && (
          <div className={s.formCols}>
            <Field
              name="referral"
              label="How did you hear about us?"
              options={[
                'A colleague/recommendation/forum',
                'Software review platform (G2, Capterra...)',
                'Our partners (Jamstack, Next.js...)',
                'Social Media (Twitter, LinkedIn...)',
                'Search',
                'Other',
              ]}
            />
          </div>
        )}

        <Field name="issueType" type="hidden" />
      </Form>
    </div>
  );
}
