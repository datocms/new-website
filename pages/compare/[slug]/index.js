import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import QuotesCarousel from 'components/QuotesCarousel';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Wrapper from 'components/Wrapper';

import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import React from 'react';
import { StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      productComparisons: allProductComparisons(first: 100) {
        slug
      }
    }
  `,
  'slug',
  ({ productComparisons }) => productComparisons.map((p) => p.slug),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    query ComparisonQuery($slug: String!) {
      page: productComparison(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        product
        datocmsCharacterization {
          value
        }
        competitorCharacterization {
          value
        }
        testimonials {
          ... on RecordInterface {
            id
          }
          ... on PartnerTestimonialRecord {
            ...partnerTestimonialFields
          }
          ... on ReviewRecord {
            ...reviewFields
          }
        }
        topics {
          id
          topic
          differences {
            id
            datocmsTake {
              value
            }
            competitorTake {
              value
            }
          }
        }
        reasons {
          id
          title
          content {
            value
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
    ${partnerTestimonialFields}
  `,
  {
    requiredKeys: ['page'],
  },
);

export default function ProductComparison({ subscription, preview }) {
  const {
    data: { page },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head seo={page.seo} slug={page.slug} />
      <Wrapper>
        <Hero
          kicker="Product Comparison"
          title={
            <>
              Why choose DatoCMS vs <Highlight>{page.product}?</Highlight>
            </>
          }
          subtitle="Our customers choose DatoCMS for its convenient scalability, unparalled developer experience, and Wordpress-like editing interface"
        />
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[
            <DeutscheTelekom key="DeutscheTelekom" />,
            <Hashicorp key="Hashicorp" />,
            <Verizon key="Verizon" />,
            <Nike key="Nike" />,
            <Vercel key="Vercel" />,
          ]}
        />
      </Wrapper>

      <div id="main-content">
        <Space top={1} bottom={2}>
          <TitleStripWithContent
            title={
              <>
                DatoCMS&nbsp;vs.&nbsp;{page.product}:<br />
                <Highlight>How we&apos;re different</Highlight>
              </>
            }
          >
            <div className={s.whyDifferent}>
              <div className={s.whyDifferentBlock}>
                <StructuredText data={page.datocmsCharacterization} />
              </div>
              <div className={s.whyDifferentBlock}>
                <StructuredText data={page.competitorCharacterization} />
              </div>
            </div>
          </TitleStripWithContent>
        </Space>

        <Space top={4} bottom={2}>
          <InterstitialTitle style="two">
            What our customers say
          </InterstitialTitle>
          <QuotesCarousel quotes={page.testimonials} />
        </Space>

        <Space top={1} bottom={2}>
          <InterstitialTitle style="none">
            At a glance comparison
          </InterstitialTitle>
          <div className={s.topics}>
            <div className={s.topicsHeading}>
              <Wrapper>
                <div className={s.topicsHeadingInner}>
                  <div className={s.topicsHeadingTitle}>DatoCMS</div>
                  <div className={s.topicsHeadingTitle}>Contentful</div>
                </div>
              </Wrapper>
            </div>
            <Wrapper>
              <div className={s.topicsContent}>
                <div className={s.topicLines}>
                  <div className={s.topicLine} />
                  <div className={s.topicLine} />
                </div>
                {page.topics.map((topic) => (
                  <div key={topic.id} className={s.topic}>
                    <div className={s.topicName}>{topic.topic}</div>
                    <div className={s.topicDifferences}>
                      {topic.differences.map((difference) => (
                        <div key={difference.id} className={s.topicDifference}>
                          <div className={s.topicTake}>
                            <StructuredText data={difference.datocmsTake} />
                          </div>
                          <div className={s.topicTake}>
                            <StructuredText data={difference.competitorTake} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Wrapper>
          </div>
        </Space>

        <Space top={3} bottom={2}>
          <div className={s.reasons}>
            <Wrapper>
              <div className={s.reasonsTitle}>
                Three reasons to consider DatoCMS
              </div>
              <ol className={s.reasonsList}>
                {page.reasons.map((reason) => (
                  <li className={s.reason} key={reason.id}>
                    <div className={s.reasonTitle}>{reason.title}</div>
                    <div className={s.reasonContent}>
                      <StructuredText data={reason.content} />
                    </div>
                  </li>
                ))}
              </ol>
            </Wrapper>
          </div>
        </Space>
      </div>
    </Layout>
  );
}
