import { useState } from 'react';
import Wrapper from 'components/Wrapper';
import FinalCta from 'components/FinalCta';
import StatusBadge from 'components/StatusBadge';
import cn from 'classnames';
import Link from 'next/link';
import Button from 'components/Button';
import s from './style.module.css';
import { useForm } from 'react-hook-form';
import wretch from 'wretch';

wretch().errorType('json');

const Feature = ({ href, isNew, title }) => (
  <div className={s.groupLink}>
    <Link href={href}>
      <a>
        {title}
        {isNew && (
          <>
            {' '}
            <span className={s.isNew}>New</span>
          </>
        )}
      </a>
    </Link>
  </div>
);

export default function Footer({ noCta }) {
  const { register, reset, setError, handleSubmit, formState } = useForm();

  const [success, setSuccess] = useState(false);

  const onSubmit = async ({ email }) => {
    try {
      await wretch('/api/mailchimp/subscribe').post({ email }).json();

      reset();
      setSuccess(true);
    } catch (e) {
      setSuccess(false);
      setError('email', {
        message: e.json.error,
      });
    }
  };

  return (
    <div
      className={cn(s.footerBg, { [s.noCta]: noCta, [s.cta]: !noCta })}
      data-datocms-noindex
    >
      {!noCta && <FinalCta />}
      <div className={s.footerRoot}>
        <Wrapper>
          <div className={s.newsletter}>
            <div className={s.newsletterBody}>
              <div className={s.newsletterTitle}>
                Subscribe to our newsletter!
              </div>
              <div className={s.newsletterDescription}>
                One update per month. All the latest news and sneak peeks
                directly in your inbox.
              </div>
            </div>
            <div className={s.formContainer} onSubmit={handleSubmit(onSubmit)}>
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
                <Button
                  as="button"
                  p="tiny"
                  fs="small"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? 'Submitting...' : 'Subscribe!'}
                </Button>
              </form>
              <div className={s.formMessage}>
                {formState.errors.email && formState.errors.email.message}
                {success &&
                  'You successfully subscribed to our newsletter. Welcome on board! 🎉'}
              </div>
            </div>
          </div>
        </Wrapper>
        <Wrapper>
          <div className={s.footerInnerRoot}>
            <div className={s.cols}>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Team</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/team/developers">
                        <a>For developers</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/team/digital-marketers">
                        <a>For digital marketers</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/team/content-creators">
                        <a>For content creators</a>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={s.monoLink}>
                  <Link href="/pricing">
                    <a>Pricing</a>
                  </Link>
                </div>

                <div className={s.monoLink}>
                  <Link href="/enterprise">
                    <a>DatoCMS for Enterprise</a>
                  </Link>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Features</div>
                  <div className={s.groupLinks}>
                    <Feature
                      title="Worldwide CDN"
                      href="/features/worldwide-cdn"
                      description="Performant, secure, and close to every customer"
                    />

                    <Feature
                      title="GraphQL Content API"
                      href="/features/graphql-content-api"
                      description="Develop faster with powerful developer tools"
                    />

                    <Feature
                      title="Images API"
                      href="/features/images-api"
                      description="Endless transformations at your disposal"
                    />

                    <Feature
                      title="Video API"
                      href="/features/video-streaming-encoding"
                      description="Produce videos and serve them fast to any device"
                    />

                    <Feature
                      title="Multi-language"
                      href="/features/multi-language"
                      description="Reach global audience with localized content"
                    />

                    <Feature
                      title="Dynamic layouts"
                      href="/features/dynamic-layouts"
                      description="Easily build dynamic layouts for landing pages"
                    />

                    <Feature
                      title="Content integrity"
                      href="/features/data-integrity"
                      description="Validations, sandbox environments and roles"
                    />

                    <Feature
                      title="Workflows"
                      isNew
                      href="/features/workflows"
                      description="Supercharge your content approval process"
                    />

                    <Feature
                      title="Real-time updates"
                      isNew
                      href="/features/real-time"
                      description="Live changes to content on production website"
                    />

                    <Feature
                      title="Structured text"
                      isNew
                      href="/features/structured-text"
                      description="Freedom for editors, control for developers"
                    />
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Resources</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/product-updates">
                        <a>Product updates</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/docs">
                        <a>Documentation</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/support">
                        <a>Support</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/contact">
                        <a>Contact sales</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={s.group}>
                  <div className={s.groupTitle}>Social</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/blog">
                        <a>Blog</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <a
                        href="https://community.datocms.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Community forum
                      </a>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/slack">
                        <a>Slack channel</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <a
                        href="https://www.twitter.com/datocms"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Technologies</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/cms/nextjs">
                        <a className={s.extraLink}>Next.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/gatsbyjs">
                        <a className={s.extraLink}>Gatsby</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/nuxt-js">
                        <a className={s.extraLink}>Nuxt.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/hugo">
                        <a className={s.extraLink}>Hugo</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/jekyll">
                        <a className={s.extraLink}>Jekyll</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/react">
                        <a className={s.extraLink}>React</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/vue">
                        <a className={s.extraLink}>Vue.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/middleman">
                        <a className={s.extraLink}>Middleman</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Status</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <StatusBadge />
                    </div>
                  </div>
                </div>

                <div className={s.group}>
                  <div className={s.groupTitle}>Company</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/company/about">
                        <a>About</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/company/brand-assets">
                        <a>Brand assets</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/legal/privacy-policy">
                        <a>Privacy</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/legal/security">
                        <a>Security</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
        <div className={s.finalFooter}>
          <Wrapper>
            <div className={s.finalLinks}>
              <Link href="/legal/privacy-policy">
                <a className={s.finalLink}>Privacy policy</a>
              </Link>
              <Link href="/legal/cookie-policy">
                <a className={s.finalLink}>Cookie policy</a>
              </Link>
              <Link href="/legal/gdpr">
                <a className={s.finalLink}>GDPR Compliance</a>
              </Link>
              <Link href="/legal/terms">
                <a className={s.finalLink}>Terms of Service</a>
              </Link>
            </div>
            <div className={s.finalLine}>
              <a href="mailto:support@datocms.com">support@datocms.com</a>{' '}
              <span>
                ©{new Date().getUTCFullYear()} Dato srl, all rights reserved
              </span>{' '}
              <span>P.IVA 06969620480</span>
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}
