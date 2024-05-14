import BaseLayout from 'components/BaseLayout';
import DocSearch from 'components/DocSearch';
import Button from 'components/Button';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import SupportIcon from 'public/icons/regular/headset.svg';
import StatusIcon from 'public/icons/regular/tachometer.svg';
import ThumbsUpIcon from 'public/icons/regular/thumbs-up.svg';
import ThumbsDownIcon from 'public/icons/regular/thumbs-down.svg';
import wretch from 'wretch';

import LanguagePicker from 'components/LanguagePicker';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import classNames from 'classnames';

wretch().errorType('json');

function Feedback() {
  const { register, reset, setError, handleSubmit, formState } = useForm();
  const [positiveFeedback, setPositiveFeedback] = useState();
  const [success, setSuccess] = useState(false);

  const handleFeedback = (positive) => {
    setPositiveFeedback(positive);
  };

  const onSubmit = async ({ email, notes }) => {
    try {
      const url = `${document.location.protocol}//${document.location.host}${document.location.pathname}`;

      await wretch('/api/feedback/send')
        .post({
          namespace: 'docs',
          url,
          reaction: positiveFeedback ? 'positive' : 'negative',
          notes,
          email,
        })
        .json();

      reset();
      setSuccess(true);

      setTimeout(() => setSuccess(false), 5000);
    } catch (e) {
      if (e.json.errors) {
        for (const [key, error] of Object.entries(e.json.errors)) {
          setError(key, { message: error });
        }
      }
      setSuccess(false);
    }
  };

  return (
    <div>
      {success ? (
        <>Thank you! We received your feedback 🙏</>
      ) : (
        <>
          <button
            type="button"
            className={classNames(
              s.thumbsButton,
              positiveFeedback && s.activeThumbsButton,
            )}
            onClick={() => handleFeedback(true)}
          >
            <ThumbsUpIcon /> Yes
          </button>
          <button
            type="button"
            className={classNames(
              s.thumbsButton,
              positiveFeedback === false && s.activeThumbsButton,
            )}
            onClick={() => handleFeedback(false)}
          >
            <ThumbsDownIcon /> No
          </button>
          {positiveFeedback !== undefined && (
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={s.field}>
                <div className={s.label}>
                  <div className={s.labelName}>
                    {positiveFeedback
                      ? 'Let us know what we do well'
                      : 'Let us know what we can do better'}
                  </div>
                  <div className={s.labelInfo}>Optional</div>
                </div>
                <textarea
                  placeholder="Your feedback..."
                  {...register('notes')}
                />
              </div>
              <div className={s.field}>
                <div className={s.label}>
                  <div className={s.labelName}>
                    To receive further updates or address your feedback, kindly
                    share your email address with us.
                  </div>
                  <div className={s.labelInfo}>Optional</div>
                </div>
                <input placeholder="Enter your email" {...register('email')} />
                {formState.errors.email && (
                  <div className={s.fieldError}>
                    {formState.errors.email.message}
                  </div>
                )}
              </div>

              <p className={s.labelInfo}>
                If you need a reply, please contact support instead.
              </p>

              <Button
                as="button"
                p="small"
                block
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? 'Submitting...' : 'Submit feedback'}
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default function DocsLayout({
  sidebar,
  children,
  preview,
  languageSwitch,
}) {
  const content = (
    <div className={s.container}>
      {children}
      <div className={s.footer} data-datocms-noindex>
        <div className={s.footerCol}>
          <div className={s.footerTitle}>Did this doc help you?</div>
          <div className={s.footerBody}>
            <Feedback />
          </div>
        </div>
        <div className={s.footerCol}>
          <div className={s.footerTitle}>Still need help?</div>
          <div className={s.footerBody}>
            Explore our <a href="https://community.datocms.com">forum</a>,{' '}
            <Link href="/support">contact support</Link>, or{' '}
            <Link href="/enterprise-headless-cms#form">
              connect with our sales team
            </Link>
            . You can also chat live with other users in our{' '}
            <Link href="/slack">Slack channel</Link>.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseLayout preview={preview}>
      <div className={s.root}>
        <div className={s.sidebar}>
          <Link href="/">
            <a className={s.logo}>
              <FullLogo height={30} />
            </a>
          </Link>
          <div className={s.innerSidebar} data-datocms-noindex>
            {sidebar}
            {false && (
              <Link href="/webinars/how-to-use-structured-text-on-datocms">
                <a className={s.notice}>
                  <strong>
                    📅 Want to learn how to use our new Structured Text field
                    with Next.js?
                  </strong>{' '}
                  Follow our webinar on Wednesday,{' '}
                  {new Date('2021-03-10T18:00:00+01:00').toLocaleTimeString(
                    'en-US',
                    {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    },
                  )}
                </a>
              </Link>
            )}
          </div>
        </div>
        <div className={s.contentWrapper}>
          <DocSearch />
          <div className={s.mainHeader}>
            <ul>
              <li>
                <Link href="/support">
                  <a>
                    <SupportIcon />
                    Ask for help!
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="https://status.datocms.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <StatusIcon />
                  Status page
                </a>
              </li>
            </ul>
          </div>
          {languageSwitch ? (
            <LanguagePicker>{content}</LanguagePicker>
          ) : (
            content
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
