import cn from 'classnames';
import Button from 'components/Button';
import Checks from 'components/Checks';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import { highlightStructuredText } from 'components/Highlight';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import QuotesCarousel from 'components/QuotesCarousel';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import Arrow from 'public/images/arrow.svg';
import Zen from 'public/images/illustrations/zen.svg';
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
        subtitle {
          value
        }
        heroImage {
          responsiveImage {
            ...imageFields
          }
        }
        quotesHeader {
          value
        }
        quotes {
          ...on PartnerTestimonialRecord {
            id
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
        featuresHeader
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
        successStoryHeader {
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
    <Layout preview={preview} noCta>
      <Head>{renderMetaTags(page.seo)}</Head>

      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroBody}>
            <h1 className={s.heroTitle}>
              {highlightStructuredText(page.title)}
            </h1>
            <div className={s.heroSubtitle}>
              {highlightStructuredText(page.subtitle)}
            </div>
            <div className={s.buttonContainer}>
              <Button as="a" href="https://dashboard.datocms.com/signup">
                Try it for free
              </Button>
              <Button as="a" s="invert" href="/contact">
                Contact sales
              </Button>
            </div>
          </div>
          <div className={s.heroImage}>
            <DatoImage data={page.heroImage.responsiveImage} />
          </div>
        </div>
      </Wrapper>

      <div className={s.testimonials}>
        <h2 className={s.testimonialTitle}>
          <StructuredText data={page.quotesHeader} />
        </h2>

        <Space top={1} bottom={2}>
          <QuotesCarousel quotes={page.quotes} animated={true} />
        </Space>
      </div>

      <div className={s.starterBox}>
        <Wrapper>
          <div className={s.starterText}>
            <h2>{highlightStructuredText(page.starterTitle)}</h2>
            <StructuredText data={page.starterDescription} />
            <Space top={1}>
              <Button as="a" p="small" s="invert" href={page.starterLink}>
                Check it out
              </Button>
            </Space>
          </div>

          {page.starterImage?.responsiveImage && (
            <div className={s.starterImage}>
              <div className={s.imageWrapper}>
                <DatoImage
                  className={s.test}
                  data={page.starterImage.responsiveImage}
                  pictureStyle={{
                    objectFit: 'contain',
                    objectPosition: 'left',
                  }}
                />
              </div>
            </div>
          )}
        </Wrapper>
      </div>

      <div className={s.features}>
        <Wrapper>
          <div className={s.baloons}>
            <div className={s.dev}>
              <p>
                <strong>
                  If you’re a <Highlight style="good">dev</Highlight>
                </strong>{' '}
                looking to hook up DatoCMS to your repos, head on over to{' '}
                <Link href={'/docs'}>our docs</Link>
              </p>
            </div>

            <div className={s.editor}>
              <p>
                <strong>
                  If you’re an{' '}
                  <Highlight style="good">
                    editor, marketer, or content creator
                  </Highlight>
                </strong>{' '}
                on the fence about whether or not DatoCMS is for you, you’re
                probably…
              </p>
              <Arrow />
            </div>
          </div>
        </Wrapper>

        <Wrapper>
          <div className={s.niceBlock}>
            <div className={s.blockIllustration}>
              <Zen />
            </div>
            <div className={s.blockText}>
              <h2>{page.featuresHeader}</h2>
              <StructuredText data={page.featuresDescription} />
            </div>
          </div>
        </Wrapper>

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

      <div className={s.successStoryWrapper}>
        <Wrapper>
          <div className={s.successStory}>
            <div className={s.successStoryText}>
              <h2>{highlightStructuredText(page.successStoryHeader)}</h2>
              <StructuredText data={page.successStorySummary} />
              <Space top={1}>
                <Button
                  as="a"
                  p="small"
                  s="invert"
                  href={`/customers/${page.caseStudy.slug}`}
                >
                  Check it out
                </Button>
              </Space>
            </div>

            {page.successStoryImage?.responsiveImage && (
              <div className={s.successStoryImage}>
                <div className={s.imageWrapper}>
                  <DatoImage
                    className={s.test}
                    data={page.successStoryImage.responsiveImage}
                    pictureStyle={{
                      objectFit: 'contain',
                      objectPosition: 'left',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Wrapper>
      </div>

      <Space top={3}>
        <div className={s.outro}>
          <InterstitialTitle style="one" kicker="Seen enough?">
            Get started with DatoCMS
          </InterstitialTitle>
          <Checks checks={['No credit card', 'Easy setup']}>
            <div className={s.buttonGroup}>
              <Button as="a" href="https://dashboard.datocms.com/signup">
                Sign up for free
              </Button>
              <Button
                as="a"
                s="invert"
                href="https://try.datocms.com"
                target="_blank"
              >
                Try our interactive demo ⤑
              </Button>
            </div>
          </Checks>
        </div>
      </Space>
    </Layout>
  );
}
