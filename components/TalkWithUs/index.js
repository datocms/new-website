import s from './style.module.css';
import Textarea from 'react-autosize-textarea';
import { getData } from 'country-list';
import { Form, Field } from 'components/Form';
import { getCookie } from 'utils/cookies';

export default function TalkWithUs({ contactFormType, issueType }) {
  const defaultValues = {
    name: '',
    email: getCookie('datoAccountEmail'),
    phoneNumber: '',
    companyName: '',
    country: '',
    jobTitle: '',
    companyRevenue: '',
    numberEmployees: '',
    body: '',
    issueType: issueType,
  };

  function salesForm(contactFormType) {
    return contactFormType == 'sales';
  }

  function supportForm(contactFormType) {
    return contactFormType == 'support';
  }

  function frontUrl(contactFormType) {
    if (contactFormType == 'sales') {
      return 'https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/4GuYjvVpHX6Xqau-2EggC1eKeg0Iw_fMbehg2EbuLpRQARK6OetUIsAzCTs5-NdwQS_X02Qo1vdMMh6aNGLiySEIPM3EqvAkgNvPW-dQ6BdvbK4bXw1qwh3D2i5j';
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
        {supportForm(contactFormType) && (
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

        {salesForm(contactFormType) && (
          <>
            <div className={s.formCols}>
              <Field
                name="name"
                label="Full name"
                placeholder="Your full name"
                validations={{ required: 'Required' }}
              />
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
            </div>
            <div className={s.formCols}>
              <Field
                name="jobTitle"
                label="Job title"
                validations={{ required: 'Required' }}
                options={[
                  'Owner',
                  'C-Level',
                  'Vice President',
                  'Director',
                  'Manager',
                  'Individual Contributor',
                  'Consultant',
                  'Other',
                ]}
              />
              <Field
                name="phoneNumber"
                label="Phone number"
                placeholder="Your phone number"
                validations={{ required: 'Required' }}
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
                name="country"
                label="Country"
                validations={{ required: 'Required' }}
                options={getData().map(({ code, name }) => ({
                  value: code,
                  label: name,
                }))}
              />
            </div>
            <div className={s.formCols}>
              <Field
                name="numberEmployees"
                label="# of employees"
                validations={{ required: 'Required' }}
                options={['1-20', '21-100', '101-1000', '1000+']}
              />
              <Field
                name="companyRevenue"
                label="Company revenue"
                validations={{ required: 'Required' }}
                options={[
                  'under $100M',
                  '$100M - $500M',
                  '$500M - $1B',
                  'over $1B',
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

        <Field
          name="uploads"
          label="Add any additional attachments"
          type="file"
          multiple
        />

        <Field name="issueType" type="hidden" />
      </Form>
    </div>
  );
}
