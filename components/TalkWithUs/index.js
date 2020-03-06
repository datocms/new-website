import s from './style.module.css';
import Textarea from 'react-autosize-textarea';
import { getData } from 'country-list';
import { Form, Field } from 'components/Form';

export default function TalkWithUs() {
  const defaultValues = {
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    country: '',
    jobTitle: '',
    companyRevenue: '',
    numberEmployees: '',
    body: '',
  };

  return (
    <div className={s.root}>
      <Form
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/4GuYjvVpHX6Xqau-2EggC1eKeg0Iw_fMbehg2EbuLpRQARK6OetUIsAzCTs5-NdwQS_X02Qo1vdMMh6aNGLiySEIPM3EqvAkgNvPW-dQ6BdvbK4bXw1qwh3D2i5j"
        defaultValues={defaultValues}
        submitLabel="Get in touch"
      >
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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

        <Field
          name="body"
          label="What's your question?"
          placeholder="Please tell us how we can help"
          validations={{ required: 'Required' }}
          as={<Textarea />}
        />
      </Form>
    </div>
  );
}
