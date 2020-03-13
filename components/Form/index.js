import s from './style.module.css';
import Button from 'components/Button';
import Link from 'next/link';
import {
  FormContext,
  useForm,
  useFormContext,
  Controller,
} from 'react-hook-form';
import cn from 'classnames';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { useEffect } from 'react';

export const Field = ({
  name,
  label,
  placeholder,
  validations,
  options,
  as,
  type,
  multiple,
}) => {
  const { register, control, watch, errors } = useFormContext();
  const ref = register(validations);
  const value = watch(name);

  let input = (
    <input
      name={name}
      id={name}
      placeholder={placeholder}
      ref={ref}
      type={type}
      multiple={multiple}
    />
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

export function FormInner({ children, defaultValues, action, submitLabel }) {
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
    defaultValues,
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
        action={action}
        encType="multipart/form-data"
        acceptCharset="utf-8"
      >
        {children}

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
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormContext>
  );
}

export function Form(props) {
  return (
    <ToastProvider>
      <FormInner {...props} />
    </ToastProvider>
  );
}
