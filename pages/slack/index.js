import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import useSWR from 'swr';
import s from './style.module.css';
import { useForm } from 'react-hook-form';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import wretch from 'wretch';
import { useState } from 'react';
import { useRecaptcha } from 'react-recaptcha-hook';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import Head from 'next/head';

wretch().errorType('json');

const fetcher = (url) => wretch(url).get().json();

const errorLabels = {
  already_invited:
    'You have already been invited! Check for an email from feedback@slack.com.',
};

function Slack() {
  const { data: stats } = useSWR('/api/slack/info', fetcher);
  const execute = useRecaptcha({
    sitekey: '6LcU1dwUAAAAADe2gkTfPNlG3xoybrgx_ulxVbF3',
    hideDefaultBadge: true,
  });

  const { addToast } = useToasts();

  const { register, reset, setError, handleSubmit, formState } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const token = await execute('slack');

      await wretch('/api/slack/invite').post({ email, token }).json();

      reset();
      addToast(
        '🎉 Awesome, welcome on board! Check your email for the invitation!',
      );
    } catch (e) {
      setError('email', {
        message: errorLabels[e.json.error] || `Slack error: ${e.json.error}`,
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Join DatoCMS Slack channel</title>
      </Head>
      <Hero
        kicker="DatoCMS Slack channel"
        title={
          <>
            Join our <Highlight>Community</Highlight>!
          </>
        }
        subtitle={
          <>
            Become a part of DatoCMS community, try out new product updates
            before they're widely released, help us test and improve the
            product.
          </>
        }
      />
      <Wrapper>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="Enter your email"
            {...register('email', {
              required: 'Please, enter your email! 😊',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                message: 'Please, enter a valid email! 😊',
              },
            })}
          />
          {formState.errors.email && (
            <span className={s.error}>{formState.errors.email.message}</span>
          )}
          <Button as="button" block disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Submitting...' : 'Get my invite!'}
          </Button>
          {stats && (
            <div className={s.stats}>
              <strong>{stats.count}</strong> people are already part of the
              community!
            </div>
          )}
          <div className={s.info}>
            Already a member? Enter the channel from{' '}
            <a href="https://datocms.slack.com/">datocms.slack.com</a>.
          </div>
        </form>
      </Wrapper>
    </Layout>
  );
}

export default function SlackWrapper(props) {
  return (
    <ToastProvider>
      <Slack {...props} />
    </ToastProvider>
  );
}
