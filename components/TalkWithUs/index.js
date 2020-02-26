import s from './style.css';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import { useForm, Controller } from 'react-hook-form';
import Textarea from 'react-autosize-textarea';

export default function TalkWithUs({ sales }) {
  const { handleSubmit, control, register, errors, watch } = useForm();
  const issueType = watch('issueType');

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      {!sales && (
        <div className={s.field}>
          <label tfor="issueType">What's your question about?</label>
          {errors.issueType && (
            <div className={s.fieldError}>{errors.issueType.message}</div>
          )}
          {!issueType && (
            <div className={s.selectPlaceholder}>Please select one...</div>
          )}
          <select
            name="issueType"
            id="issueType"
            ref={register({ required: 'Required' })}
          >
            <option selected disabled value=""></option>
            <option value="feature">I have a feature request</option>
            <option value="docs">
              I cannot understand how something works
            </option>
            <option value="email">I think I'm not receiving emails</option>
            <option value="billing">I have a question about billing</option>
            <option value="error">I think something is broken</option>
            <option value="enterprise">
              I'm interested in the enterprise plan
            </option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
      <div className={s.field}>
        <label tfor="name">Full name</label>
        {errors.name && (
          <div className={s.fieldError}>{errors.name.message}</div>
        )}
        <input
          name="name"
          id="name"
          placeholder="Your Full Name"
          ref={register({
            required: 'Required',
          })}
        />
      </div>
      <div className={s.formCols}>
        <div className={s.field}>
          <label tfor="email">Work Email</label>
          {errors.email && (
            <div className={s.fieldError}>{errors.email.message}</div>
          )}
          <input
            name="email"
            id="email"
            placeholder="Your Work Email"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email',
              },
            })}
          />
        </div>
        <div className={s.field}>
          <label tfor="company">Company name</label>
          {errors.company && (
            <div className={s.fieldError}>{errors.company.message}</div>
          )}
          <input
            name="company"
            id="company"
            placeholder="Company Name"
            ref={register({
              required: 'Required',
            })}
          />
        </div>
      </div>
      <div className={s.field}>
        <label tfor="message">What's your question?</label>
        {errors.message && (
          <div className={s.fieldError}>{errors.company.message}</div>
        )}
        <Controller
          as={<Textarea />}
          name="message"
          id="message"
          control={control}
          placeholder="Please tell us how we can help"
          rules={{
            required: 'Required',
          }}
        />
      </div>
      {!sales && (
        <div className={s.field}>
          <label tfor="projectUrl">What's your project URL?</label>
          {errors.projectUrl && (
            <div className={s.fieldError}>{errors.projectUrl.message}</div>
          )}
          <input
            name="projectUrl"
            id="projectUrl"
            placeholder="Enter your project URL"
            ref={register()}
          />
        </div>
      )}
      <div className={s.submit}>
        <Button as="button" type="submit">
          Get in touch
        </Button>
      </div>
    </form>
  );
}
