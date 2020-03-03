import s from './style.css';
import Button from 'components/Button';
import Link from 'next/link';
import {
  FormContext,
  useForm,
  useFormContext,
  Controller,
} from 'react-hook-form';
import Textarea from 'react-autosize-textarea';
import { getData } from 'country-list';
import cn from 'classnames';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { useEffect } from 'react';

const Field = ({ name, label, placeholder, validations, options, as }) => {
  const { register, control, watch, errors } = useFormContext();
  const ref = register(validations);
  const value = watch(name);

  let input = (
    <input name={name} id={name} placeholder={placeholder} ref={ref} />
  );

  if (options) {
    input = (
      <>
        {!value && (
          <div className={s.selectPlaceholder}>Please select one...</div>
        )}
        <select name={name} id={name} ref={ref}>
          <option value=""></option>
          {options.map(option => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      </>
    );
  }

  if (as) {
    input = (
      <Controller
        as={as}
        name={name}
        id={name}
        control={control}
        placeholder={placeholder}
        rules={validations}
      />
    );
  }

  return (
    <div
      className={cn(s.field, {
        [s.fieldError]: errors[name] && errors[name].message,
      })}
    >
      <label htmlFor={name}>{label}</label>

      {errors[name] && <div className={s.error}>← {errors[name].message}</div>}
      {input}
    </div>
  );
};

function TalkWithUs() {
  const { addToast } = useToasts();

  useEffect(() => {
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code')) {
      const code = urlParams.get('code');

      if (code === 'ok') {
        addToast('Thank you! We will get in touch as soon as possible.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        addToast('Ouch! There was an error submitting the form!', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  }, []);

  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      country: '',
      jobTitle: '',
      companyRevenue: '',
      numberEmployees: '',
      body: '',
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = (values, event) => {
    event.nativeEvent.currentTarget.submit();
  };

  return (
    <FormContext {...methods}>
      <form
        className={s.form}
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/4GuYjvVpHX6Xqau-2EggC1eKeg0Iw_fMbehg2EbuLpRQARK6OetUIsAzCTs5-NdwQS_X02Qo1vdMMh6aNGLiySEIPM3EqvAkgNvPW-dQ6BdvbK4bXw1qwh3D2i5j"
        encType="multipart/form-data"
        acceptCharset="utf-8"
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
            options={[
              '1-20',
              '21-100',
              '101-1000',
              '1000+',
            ]}
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
        <div className={s.submit}>
          <div className={s.agree}>
            By submitting you agree to our{' '}
            <Link href="/legal/terms">
              <a>TOS</a>
            </Link>{' '}
            and acknowledge our{' '}
            <Link href="/legal/privacy-policy">
              <a>Privacy Policy</a>
            </Link>
          </div>

          <Button as="button" type="submit">
            Get in touch
          </Button>
        </div>
      </form>
    </FormContext>
  );
}

export default function OuterTalkWithUs() {
  return (
    <ToastProvider>
      <TalkWithUs />
    </ToastProvider>
  );
}
