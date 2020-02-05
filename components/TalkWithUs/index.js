import s from './style.css';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import { useForm, Controller } from 'react-hook-form';
import Textarea from 'react-autosize-textarea';

export default function TalkWithUs() {
  const { handleSubmit, control, register, errors } = useForm();

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.intro}>
            <div className={s.title}>Talk with us</div>
            <div className={s.description}>
              Our experts are available to answer any of your questions. We’re
              available in a number of ways, any time that you need us.
            </div>
          </div>
          <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
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
              <label tfor="message">Message</label>
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
            <div className={s.submit}>
              <Button as="button" type="submit">Get in touch</Button>
            </div>
          </form>
        </div>
      </Wrapper>
    </div>
  );
}
