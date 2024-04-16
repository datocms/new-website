import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Layout from 'components/Layout';
import Bullets from 'components/Bullets';
import Checks from 'components/Checks';
import SuccessIcon from 'public/icons/regular/check.svg';
import Button from 'components/Button';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image as DatoImage, StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';
import Wrapper from 'components/Wrapper';
import Quote from 'components/Quote';

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  query {
    allReviews(first: 100) {
      ...reviewFields
      _updatedAt
    }
    allPartnerTestimonials(first: 100) {
      ...partnerTestimonialFields
      _updatedAt
    }
    integrations: allIntegrations(first: 100) {
      id
      logo {
        url
      }
      integrationType {
        slug
      }
      squareLogo {
        url
      }
    }
    productOverview {
      header {
        value
      }
      subheader {
        value
      }
      pillars {
        id
        theme
        icon {
          url
        }
        pillarCallout
        title {
          value
        }
        capability1 {
          value
        }
        capability2 {
          value
        }
        capability3 {
          value
        }
        image {
          responsiveImage {
            ...imageFields
          }
        }
      }
      testimonials {
        ... on ReviewRecord {
          id
          name
          quote {
            value
          }
          image {
            responsiveImage(
              imgixParams: {
                w: 300
                h: 300
                fit: crop
                crop: faces
                auto: format
              }
            ) {
              ...imageFields
            }
          }
          role
        }
        ... on PartnerTestimonialRecord {
          id
          name
          quote {
            value
          }
          image {
            responsiveImage(
              imgixParams: {
                w: 300
                h: 300
                fit: crop
                crop: faces
                auto: format
              }
            ) {
              ...imageFields
            }
          }
          role
        }
      }
      features {
        id
        title
        icon {
          url
        }
        description {
          value
        }
      }
    }
  }

  ${reviewFields}
  ${partnerTestimonialFields}
  ${imageFields}
`);

export default function Product({ preview, subscription }) {
  const {
    data: { productOverview, integrations },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview} noCta>
      <Head>
        <title>Better, with DatoCMS</title>
      </Head>

      <div>
        <Hero
          title={highlightStructuredText(productOverview.header)}
          subtitle={<StructuredText data={productOverview.subheader} />}
        />
        <div className={s.buttonContainer}>
          <Button fs="big">Try it for free</Button>
          <Button fs="big" s="invert">
            Contact sales
          </Button>
        </div>
      </div>

      {/* alternating pillars */}

      {productOverview.pillars.map((pillar, index) => {
        return (
          <div key={pillar.id} className={s.flagContainer}>
            <Flag
              kicker={pillar.theme}
              title={
                <div className={s.flagTitle}>
                  <LazyImage src={pillar.icon.url} height={35} width={35} />
                  <div>
                    {highlightStructuredText(pillar.title, {
                      highlightWith: function BadHighlight({ children }) {
                        return (
                          <FlagHighlight style="bad">{children}</FlagHighlight>
                        );
                      },
                    })}
                  </div>
                </div>
              }
              image={DatoImage}
              imageProps={{
                data: pillar.image.responsiveImage,
              }}
              rightImage={!(index % 2)}
              hideDot
            >
              <p> {pillar.pillarCallout}</p>

              <Bullets
                style="bad"
                icon={SuccessIcon}
                largeBullet
                bullets={[
                  <StructuredText key={pillar.id} data={pillar.capability1} />,
                  <StructuredText key={pillar.id} data={pillar.capability2} />,
                  <StructuredText key={pillar.id} data={pillar.capability3} />,
                ]}
              />
            </Flag>
          </div>
        );
      })}

      <IntegrationsBanner
        title={<div>Extensible and integrable by&nbsp;design</div>}
        bubbles={integrations
          .filter((i) =>
            ['ci', 'static-generator', 'language', 'cdn', 'framework'].includes(
              i.integrationType.slug,
            ),
          )
          .slice(0, 30)
          .map((integration) => (
            <LazyImage
              key={integration.id}
              src={
                integration.squareLogo
                  ? integration.squareLogo.url
                  : integration.logo.url
              }
            />
          ))}
      >
        Being a API-first <Link href="/">headless CMS</Link>,{' '}
        <strong>
          DatoCMS easily integrates with any third-party platform or service
        </strong>
        . DatoCMS is considered to be the best CMS for developers because it
        offers some of the best tools in the market: plugins, webhooks,
        templates and SDKs to get you started in no time. Check them out on our{' '}
        <a href="https://github.com/datocms/" target="_blank" rel="noreferrer">
          official Github page
        </a>
      </IntegrationsBanner>

      {/* testiominals */}

      <div className={s.testimonials}>
        <h2 className={s.title}>What our customers say...</h2>
        <div className={s.testimonialsContainer}>
          {productOverview.testimonials.map((testimonial) => {
            return (
              <div key={testimonial.id} className={s.root}>
                <div className={s.quote}>
                  {highlightStructuredText(testimonial.quote)}
                </div>
                <div className={s.content}>
                  <DatoImage
                    className={s.image}
                    data={testimonial.image.responsiveImage}
                  />
                  {testimonial.partner ? (
                    <Link href={`/partners/${quote.partner.slug}`}>
                      <div className={s.authorRole}>
                        <div className={s.name}>{quote.name}</div>
                        <div className={s.role}>
                          {testimonial.role} @ {testimonial.partner.name}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className={s.authorRole}>
                      <div className={s.name}>{testimonial.name}</div>
                      <div className={s.role}>{testimonial.role}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* feature grid */}

      <div>
        <h2 className={s.featureSectionTitle}>
          ...and the features they love!
        </h2>
        <div className={s.featuresContainers}>
          {productOverview.features.map((feature) => {
            return (
              <div key={feature.id} className={s.feature}>
                <div className={s.featureIcon}>
                  <LazyImage src={feature.icon.url} height={30} width={30} />
                </div>
                <div className={s.featureText}>
                  <h4 className={s.featureTitle}>{feature.title}</h4>
                  <p>
                    <StructuredText data={feature.description} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* footer */}

      <div className={s.customFooter}>
        <Wrapper>
          <div className={s.customFooterInner}>
            <h1 className={s.footerTitle}>
              Seen enough? Get started with DatoCMS
            </h1>
            <Checks checks={['No credit card', 'Easy setup']}>
              <Button
                fs="big"
                as="a"
                href="https://dashboard.datocms.com/signup"
              >
                Try it now for free!
              </Button>
            </Checks>
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}
