import cn from 'classnames';
import Button from 'components/Button';
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

  const quotes = page.quotes;

  return (
    <Layout preview={preview} noCta>
      <Head>{renderMetaTags(page.seo)}</Head>

      <div className={s.hero2}>
        <Wrapper>
          <div className={s.heroTitle}>
            <Hero title={highlightStructuredText(page.title)} />
          </div>

          <div className={s.heroInfo}>
            <div className={s.heroImage}>
              <DatoImage data={page.heroImage.responsiveImage} />
            </div>
            <div className={s.heroText}>
              {/* <h1 className={s.heroTitle}>{highlightStructuredText(page.title)}</h1> */}
              <h3 className={s.heroSubtitle}>
                {highlightStructuredText(page.subtitle)}
              </h3>
              <div className={s.buttonContainer}>
                <Button as="a" href="https://dashboard.datocms.com/signup">
                  Try it for free
                </Button>
                <Button as="a" s="invert" href="/contact">
                  Contact sales
                </Button>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>

      <div className={s.testimonials}>
        <h2 className={s.testimonialTitle}>
          <StructuredText data={page.quotesHeader} />
        </h2>

        <Space top={1} bottom={2}>
          <QuotesCarousel quotes={quotes} animated={true} />
        </Space>
      </div>

      <TitleStripWithContent
        title={<StructuredText data={page.starterTitle} />}
      >
        <div className={s.starterBox}>
          <div className={s.starterText}>
            <StructuredText data={page.starterDescription} />
            <Button as="a" p="small" href={page.starterLink}>
              Check it out
            </Button>
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
        </div>
      </TitleStripWithContent>

      <div className={s.features}>
        <Wrapper>
          <div className={s.baloons}>
            <div className={s.dev}>
              <p>
                <strong>
                  If you’re a <Highlight style="good">dev</Highlight> 
                </strong>{' '}
                looking to hook up DatoCMS to your repos, head on over to <Link href={'/docs'}>our
                docs</Link>
                {/* <Button as="a" p="tiny" s="invert" href="/docs">
                  To the docs
                </Button> */}
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
              <h2>{page.featuresTitle}</h2>
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

      <TitleStripWithContent
        title={<StructuredText data={page.successStoryTitle} />}
      >
        <div className={s.successStory}>
          <div className={s.successStoryText}>
            <h2>
              <StructuredText data={page.successStoryTitle} />
            </h2>
            <StructuredText data={page.successStorySummary} />
            <Space top={1}>
              <Button
                as="a"
                p="small"
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
      </TitleStripWithContent>
    </Layout>
  );
}
