import Bullets from 'components/Bullets';
import Button from 'components/Button';
import Checks from 'components/Checks';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import MaybeLink from 'components/MaybeLink';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
} from 'lib/datocms';
import Link from 'next/link';
import SuccessIcon from 'public/icons/regular/check.svg';
import Marketers from 'public/images/illustrations/content-editors.svg';
import Developers from 'public/images/illustrations/developers-2.svg';
import { Image as DatoImage, StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

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
        ... on PartnerTestimonialRecord {
          ...partnerTestimonialFields
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
        highlight
        image {
          responsiveImage {
            ...imageFields
          }
        }
        link {
          __typename
          ...on DocPageRecord {
            slug
            parent: _allReferencingDocGroups {
              slug
            }
          }
          ...on FeatureRecord {
            slug
          }
        }
        featureGroup
      }
    }
  }

  ${reviewFields}
  ${partnerTestimonialFields}
  ${imageFields}
`);

function Feature({ feature }) {
  const link =
    feature.link &&
    (feature.link.__typename === 'FeatureRecord'
      ? `/features/${feature.link.slug}`
      : `/docs/${feature.link.parent[0].slug}/${feature.link.slug}`);

  return (
    <MaybeLink
      href={link}
      key={feature.id}
      className={`${s.feature} ${feature.highlight && s.isHighlighted}`}
    >
      {feature.highlight && (
        <figure className={s.featureImage}>
          {feature.image && <DatoImage data={feature.image.responsiveImage} />}
        </figure>
      )}

      <article className={s.featureContent}>
        <div className={s.featureIcon}>
          <LazyImage src={feature.icon.url} height={30} width={30} />
        </div>
        <div className={s.featureText}>
          <h4 className={s.featureTitle}>{feature.title}</h4>
          <StructuredText data={feature.description} />
        </div>
        {feature.link && <p className={s.featureLink}>Learn more</p>}
      </article>
    </MaybeLink>
  );
}

export default function Product({ preview, subscription }) {
  const {
    data: { productOverview, integrations },
  } = useQuerySubscription(subscription);

  const developerFeatures = productOverview.features.filter(
    (f) => f.featureGroup === 'developers',
  );

  const marketersFeatures = productOverview.features.filter(
    (f) => f.featureGroup === 'marketers',
  );

  return (
    <Layout preview={preview} noCta>
      <Head>
        <title>Better, with DatoCMS</title>
      </Head>

      <div className={s.hero}>
        <Hero
          title={highlightStructuredText(productOverview.header)}
          subtitle={<StructuredText data={productOverview.subheader} />}
        >
          <div className={s.buttonContainer}>
            <Button fs="big" as="a" href="https://dashboard.datocms.com/signup">
              Try it for free
            </Button>
            <Button fs="big" as="a" s="invert" href="/contact">
              Contact sales
            </Button>
          </div>
        </Hero>
      </div>

      {productOverview.pillars.map((pillar, index) => {
        return (
          <div key={pillar.id} className={s.flagContainer}>
            <Flag
              kicker={pillar.theme}
              flip={index % 2 === 0}
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
              hideDot
            >
              <p>{pillar.pillarCallout}</p>
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

      <div className={s.testimonials}>
        <h2 className={s.title}>What our customers say...</h2>
        <div className={s.testimonialsContainer}>
          {productOverview.testimonials
            .filter((t) => t.quote)
            .map((testimonial) => {
              return (
                <div key={testimonial.id} className={s.quoteWrapper}>
                  <div className={s.quote}>
                    {highlightStructuredText(testimonial.quote)}
                  </div>
                  <div className={s.content}>
                    <DatoImage
                      className={s.avatar}
                      data={testimonial.image.responsiveImage}
                    />
                    {testimonial.partner ? (
                      <Link
                        href={`/partners/${testimonial.partner.slug}`}
                        passHref
                      >
                        <div className={s.authorRole}>
                          <div className={s.name}>{testimonial.name}</div>
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

      <div className={s.featuresWrapper}>
        <h2 className={s.featureSectionTitle}>
          ...and the features they love!
        </h2>

        <div className={s.featureGroupHeading}>
          <figure className={s.featureGroupIcon}>
            <Developers />
          </figure>
          <h3 className={s.featureGroupTitle}>For developers</h3>
        </div>
        <div data-developers className={s.featuresContainer}>
          {developerFeatures.map((feature) => {
            return <Feature key={feature.id} feature={feature} />;
          })}
        </div>

        <div className={s.featureGroupHeading}>
          <figure className={s.featureGroupIcon}>
            <Marketers />
          </figure>
          <h3 className={s.featureGroupTitle}>For marketers</h3>
        </div>
        <div className={s.featuresContainer}>
          {marketersFeatures.map((feature) => {
            return <Feature key={feature.id} feature={feature} />;
          })}
        </div>
      </div>

      <div className={s.customFooter}>
        <Wrapper>
          <div className={s.customFooterInner}>
            <p className={s.footerTitle}>
              Seen enough? Get started with DatoCMS
            </p>
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
