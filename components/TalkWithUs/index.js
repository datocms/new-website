import s from './style.css';
import Wrapper from 'components/Wrapper';
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

const Field = ({ name, label, placeholder, validations, options, as }) => {
  const { register, control, watch, errors } = useFormContext();
  const ref = register(validations);
  const value = watch(name);

  let input = (
    <input
      name={name}
      value={value}
      id={name}
      placeholder={placeholder}
      ref={ref}
    />
  );

  if (options) {
    input = (
      <>
        {!value && (
          <div className={s.selectPlaceholder}>Please select one...</div>
        )}
        <select name={name} id={name} ref={ref}>
          <option value="" selected></option>
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

export default function TalkWithUs() {
  const methods = useForm({
    defaultValues: {},
  });
  const { handleSubmit } = methods;

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <FormContext {...methods}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="name"
          label="Full name"
          placeholder="Your full name"
          validations={{ required: 'Required' }}
        />
        <div className={s.formCols}>
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
            name="jobTitle"
            label="Job title"
            validations={{ required: 'Required' }}
            options={[
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
            name="jobFunction"
            label="Job function"
            validations={{ required: 'Required' }}
            options={[
              'Customer Experience',
              'Developer/Engineering',
              'Digital',
              'HR',
              'Information Technology',
              'Marketing',
              'Procurement',
              'Product',
              'Sales',
              'Security',
              'Other',
            ]}
          />
        </div>

        <Field
          name="message"
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
