import Button from 'components/Button';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isBlockquote } from 'datocms-structured-text-utils';
import {
  gqlStaticPaths,
  handleErrors,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import EnvelopeIcon from 'public/icons/regular/envelope.svg';
import BrowserIcon from 'public/icons/regular/link.svg';
import { StructuredText, renderMetaTags, renderRule } from 'react-datocms';
import { changeDescription, changeTitle } from 'utils/tweakSeoMetaTags';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      techPartners: allTechPartners(first: 100, orderBy: name_ASC) {
        slug
      }
    }
  `,
  'slug',
  ({ techPartners }) => techPartners.map((p) => p.slug),
);

export const getStaticProps = handleErrors(
  async ({ params: { slug }, preview }) => {
    const gqlRequest = {
      query: /* GraphQL */ `
        query TechPartnerQuery($slug: String!) {
          techPartner(filter: { slug: { eq: $slug } }) {
            seo: _seoMetaTags {
              ...seoMetaTagsFields
            }
            id
            slug
            name
            shortDescription {
              value
            }
            logo {
              url
            }
            description {
              value
            }
            publicContactEmail
            websiteUrl
          }
        }
        ${seoMetaTagsFields}
      `,
      variables: { slug },
      preview: preview || false,
    };

    const { data } = await request(gqlRequest);

    if (!data.techPartner) {
      return { notFound: true };
    }

    return {
      revalidate: 60 * 10,
      props: {
        preview: preview || false,
        subscription: preview
          ? {
              ...gqlRequest,
              token: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
              enabled: true,
              initialData: data,
            }
          : { enabled: false, initialData: data },
      },
    };
  },
);

export default function TechPartnerPage({ preview, subscription }) {
  const {
    data: { techPartner },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview} finalCta={false}>
      <Head>
        {renderMetaTags(
          changeTitle(
            changeDescription(
              techPartner.seo,
              toPlainText(techPartner.shortDescription),
            ),
            `${techPartner.name} | DatoCMS Ecosystem Partners`,
          ),
        )}
      </Head>
      <InterstitialTitle
        mainTitleOfPage
        style="two"
        kicker={<>DatoCMS Technology Partner</>}
        bigSubtitle
        subtitle={<StructuredText data={techPartner.shortDescription} />}
      >
        <LazyImage
          className={s.logo}
          alt={`${techPartner.name} logo`}
          src={techPartner.logo.url}
        />
      </InterstitialTitle>
      <Wrapper>
        <Space top={1}>
          <div className={s.container}>
            <div className={s.description}>
              <StructuredText
                data={techPartner.description}
                customRules={[
                  renderRule(isBlockquote, ({ node, children, key }) => {
                    return (
                      <div key={key} className={s.quote}>
                        <div className={s.quoteQuote}>{children}</div>
                        {node.attribution && (
                          <div className={s.quoteAuthor}>
                            {node.attribution}
                          </div>
                        )}
                      </div>
                    );
                  }),
                ]}
              />
            </div>
            <div className={s.action}>
              <div className={s.actionButton}>
                <Button as="a" href={techPartner.websiteUrl} target="_blank">
                  <BrowserIcon /> Visit website
                </Button>
              </div>
              {techPartner.publicContactEmail && (
                <div className={s.actionButton}>
                  <Button
                    as="a"
                    s="invert"
                    href={`mailto:${techPartner.publicContactEmail}`}
                    target="_blank"
                  >
                    <EnvelopeIcon /> Contact {techPartner.name}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Space>
      </Wrapper>
    </Layout>
  );
}
