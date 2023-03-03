import s from './style.module.css';
import Button from 'components/Button';
import Link from 'next/link';
import {
  FormProvider,
  useForm,
  useFormContext,
  Controller,
} from 'react-hook-form';
import cn from 'classnames';
import { useToasts } from 'react-toast-notifications';
import { useRef } from 'react';
import useComponentSize from '@rehooks/component-size';
import { useRecaptcha } from 'react-recaptcha-hook';

export const Field = ({
  name,
  label,
  placeholder,
  validations,
  options,
  render,
  type,
  multiple,
  readOnly,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const value = watch(name);
  const field = register(name, validations);
  const labelRef = useRef();
  const { height: labelHeight } = useComponentSize(labelRef);

  let input = (
    <input
      {...field}
      id={name}
      placeholder={placeholder}
      type={type}
      multiple={multiple}
      readOnly={readOnly}
    />
  );

  if (options) {
    input = (
      <>
        {!value && (
          <div className={s.selectPlaceholder}>
            {placeholder || 'Please select one...'}
          </div>
        )}
        <select id={name} {...field}>
          <option value="" />
          {options.map((option) => {
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

  if (render) {
    input = (
      <Controller
        render={render}
        name={name}
        id={name}
        control={control}
        rules={validations}
      />
    );
  }

  if (type === 'hidden') {
    return input;
  }

  return (
    <div
      className={cn(s.field, {
        [s.fieldError]: errors[name] && errors[name].message,
      })}
      style={{
        '--paddingTop': `${35 + labelHeight}px`,
      }}
    >
      <label htmlFor={name} ref={labelRef}>
        {label}
        {validations && <span className={s.required}>&nbsp;*</span>}
      </label>

      {errors[name] && <div className={s.error}>← {errors[name].message}</div>}
      {input}
    </div>
  );
};

export const Form = ({
  children,
  defaultValues,
  action,
  submitLabel,
  onSubmit,
  nativeSubmitForm,
}) => {
  const execute = useRecaptcha({
    // must be v3 Recaptcha!
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY,
    hideDefaultBadge: true,
  });

  const methods = useForm({
    defaultValues: { ...defaultValues, FORM_ERROR: '' },
  });
  const { clearErrors, setError, handleSubmit, formState } = methods;

  const toastHelpers = useToasts();
  const recaptchaInput = useRef(null);

  async function defaultSubmit(values, event) {
    event.preventDefault();

    const token = await execute('form');

    recaptchaInput.current.value = token;

    if (onSubmit) {
      try {
        await onSubmit(values, toastHelpers);
      } catch (e) {
        toastHelpers.addToast('Ouch! There was an error submitting the form!', {
          appearance: 'error',
          autoDismiss: true,
        });
        setError('FORM_ERROR');
        setTimeout(() => clearErrors('FORM_ERROR'), 100);
        return;
      }
    }

    if (nativeSubmitForm) {
      event.target.submit();
    }
  }

  const waiting =
    formState.isSubmitting ||
    (formState.isSubmitSuccessful && nativeSubmitForm);

  return (
    <FormProvider {...methods}>
      <form
        className={s.form}
        onSubmit={handleSubmit(defaultSubmit)}
        method="POST"
        action={action}
        encType="multipart/form-data"
        acceptCharset="utf-8"
      >
        {children}

        <input type="hidden" name="g-recaptcha-response" ref={recaptchaInput} />

        <div className={s.submit}>
          <div className={s.agree}>
            By submitting you agree to our <Link href="/legal/terms">TOS</Link>{' '}
            and acknowledge our{' '}
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
          </div>

          <Button as="button" type="submit" disabled={waiting}>
            {waiting ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
