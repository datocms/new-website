import cn from 'classnames';
import Button from 'components/Button';
import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import {
  Image as DatoImage,
  StructuredText,
  renderMetaTags,
} from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      pages: allUseCasePages {
        slug
      }
    }
  `,
  'slug',
  ({ pages }) => pages.map((p) => p.slug),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($slug: String!) {
      page: useCasePage(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title {
          value
        }

        quotesHeader: header {
          value
        }
        quotes {
          ...on PartnerTestimonialRecord {
            ...partnerTestimonialFields
          }
        }

        starterTitle {
          value
        }
        starterDescription {
          value
        }
        starterLink: link
        starterImage {
          responsiveImage {
            ...imageFields
          }
        }

        featuresTitle: heading
        featuresDescription: description {
          value
        }
        callout {
          title
          description {
            value
          }
          image {
            responsiveImage {
              ...imageFields
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

        successStoryTitle: headline {
          value
        }
        successStorySummary: summary {
          value
        }
        caseStudy {
          ...on SuccessStoryRecord {
            slug
          }
        }
        successStoryImage: image {
          responsiveImage {
            ...imageFields
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${partnerTestimonialFields}
    ${imageFields}
  `,
  {
    requiredKeys: ['page'],
  },
);

function FeatureCard({ feature }) {
  return (
    <div
      key={feature.id}
      className={`${s.feature} ${feature.highlight && s.isHighlighted}`}
    >
      <article className={s.featureContent}>
        {feature.icon?.url && (
          <div className={s.featureIcon}>
            <LazyImage src={feature.icon.url} height={30} width={30} />
          </div>
        )}
        <div className={s.featureText}>
          <h4 className={s.featureTitle}>{feature.title}</h4>
          <StructuredText data={feature.description.value} />
        </div>
      </article>
    </div>
  );
}

export default function UseCase({ subscription, preview }) {
  const {
    data: { page },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>

      <Wrapper>
        <Hero title={highlightStructuredText(page.title)} />
      </Wrapper>

      <div className={s.testimonials}>
        <h2 className={s.testimonialTitle}>
          <StructuredText data={page.quotesHeader} />
        </h2>
        <div className={s.testimonialsContainer}>
          {page.quotes
            .filter((t) => t.quote)
            .map((testimonial) => {
              return (
                <div key={testimonial.id} className={s.quoteWrapper}>
                  <div className={s.quote}>
                    {highlightStructuredText(testimonial.quote)}
                  </div>
                  <div className={s.info}>
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

      <div className={s.starter}>
        <Wrapper>
          <div className={s.starterText}>
            <h2>
              <StructuredText data={page.starterTitle} />
            </h2>
            <StructuredText data={page.starterDescription} />
            <Button as="a" p="small" href={page.starterLink}>
              Check it out
            </Button>
          </div>
        </Wrapper>

        {page.starterImage?.responsiveImage && (
          <div className={s.starterImage}>
            <div className={s.imageWrapper}>
              <DatoImage
                className={s.test}
                data={page.starterImage.responsiveImage}
                pictureStyle={{ objectFit: 'contain', objectPosition: 'left' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={s.features}>
        <h2>{page.featuresTitle}</h2>
        {page.callout.map((callout, index) => (
          <section
            key={index}
            className={cn(s.featuresGroup, { [s.alternative]: index === 1 })}
          >
            <div className={s.featuresIntro}>
              <div className={s.visual}>
                {callout.image?.responsiveImage && (
                  <DatoImage data={callout.image.responsiveImage} />
                )}
              </div>
              <article>
                <h3>{callout.title}</h3>
                <StructuredText data={callout.description} />
              </article>
            </div>
            <div className={s.featuresGrid}>
              {callout.features.map((card, index) => (
                <FeatureCard key={index} feature={card} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className={s.successStory}>
        <Wrapper>
          <div className={s.successStoryText}>
            <h2>
              <StructuredText data={page.successStoryTitle} />
            </h2>
            <StructuredText data={page.successStorySummary} />
            <Button as="a" p="small" href={`/customers/${page.caseStudy.slug}`}>
              Check it out
            </Button>
          </div>
        </Wrapper>

        {page.successStoryImage?.responsiveImage && (
          <div className={s.successStoryImage}>
            <div className={s.imageWrapper}>
              <DatoImage
                className={s.test}
                data={page.successStoryImage.responsiveImage}
                pictureStyle={{ objectFit: 'contain', objectPosition: 'left' }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
