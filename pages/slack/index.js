import React, { useState } from 'react';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import useSWR from 'swr';
import s from './style.module.css';
import { useForm } from 'react-hook-form';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import wretch from 'wretch';
import { useRecaptcha } from 'react-recaptcha-hook';
import { useToasts } from 'react-toast-notifications';
import Head from 'components/Head';
import Link from 'next/link';

wretch().errorType('json');

const fetcher = (url) => wretch(url).get().json();

const errorLabels = {
  already_invited:
    'You have already been invited! Check for an email from feedback@slack.com.',
};

function Slack() {
  const { data: stats } = useSWR('/api/slack/info', fetcher);
  const execute = useRecaptcha({
    // must be v3 Recaptcha!
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY,
    hideDefaultBadge: true,
  });

  const { addToast } = useToasts();

  const { register, reset, setError, handleSubmit, formState } = useForm();
  const setState = useState()[1];

  const onSubmit = async ({ email }) => {
    try {
      const token = await execute('slack');

      await wretch('/api/slack/invite').post({ email, token }).json();

      reset();
      addToast(
        '🎉 Awesome, welcome on board! Check your email for the invitation!',
      );
    } catch (e) {
      if (e.json && e.json.error) {
        setError('email', {
          message: errorLabels[e.json.error] || `Slack error: ${e.json.error}`,
        });
      } else {
        setState(() => {
          throw e;
        });
      }
    }
  };

  return (
    <Layout>
      <Head noIndex>
        <title>Join the DatoCMS Slack Channel</title>
      </Head>
      <Hero
        kicker="DatoCMS Community Slack Shannel"
        title={
          <>
            Join us on <Highlight>Slack</Highlight>!
          </>
        }
        subtitle={
          <>
            <p>
              Try out new product updates before they&apos;re widely released,
              help us test and improve the product, and connect with other
              users!
            </p>
            <p>
              Our Slack is great for informal chats and quick questions, but for
              official technical support, we recommend the{' '}
              <Link href={'https://community.datocms.com/'}>
                community forum
              </Link>{' '}
              or <Link href={'/support'}>support form</Link> instead.
            </p>
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
            {formState.isSubmitting ? 'Submitting...' : 'Get my Slack invite!'}
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

export default Slack;
