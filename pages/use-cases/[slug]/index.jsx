import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
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

        featuresTitle: heading
        featuresDescription: description {
          value
        }
        callout {
          features {
            id
            title
            icon {
              responsiveImage {
                ...imageFields
              }
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
        <h2 className={s.title}>
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
          <h2>
            <StructuredText data={page.starterTitle} />
          </h2>
          <StructuredText data={page.starterDescription} />
        </Wrapper>
      </div>

      <Wrapper>
        <div className={s.features}>
          {page.callout.map((callout, index) => (
            <div key={index} className={s.feature}>
              {callout.features.map((card, index) => (
                <div key={index} className={s.card}>
                  {card.icon && (
                    <DatoImage
                      data={card.icon.responsiveImage}
                      className={s.icon}
                    />
                  )}
                  <h3>{card.title}</h3>
                  <StructuredText data={card.description.value.document} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={s.successStory}>
          <h2>
            <StructuredText data={page.successStoryTitle} />
          </h2>
          <StructuredText data={page.successStorySummary} />
          <Link href={`/customers/${page.caseStudy.slug}`} passHref>
            <a className={s.link}>Read Case Study</a>
          </Link>
        </div>
      </Wrapper>
    </Layout>
  );
}
