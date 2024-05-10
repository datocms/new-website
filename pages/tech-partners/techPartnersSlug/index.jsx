import Button from 'components/Button';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import SidebarPane from 'components/SidebarPane';
import Space from 'components/Space';
import StickySidebar from 'components/StickySidebar';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isBlockquote } from 'datocms-structured-text-utils';
import {
  gqlStaticPaths,
  handleErrors,
  imageFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import EnvelopeIcon from 'public/icons/regular/envelope.svg';
import DescriptionIcon from 'public/icons/regular/info.svg';
import LaptopIcon from 'public/icons/regular/laptop-code.svg';
import BrowserIcon from 'public/icons/regular/link.svg';
import MapPinIcon from 'public/icons/regular/map-marker.svg';
import MarkerIcon from 'public/icons/regular/marker.svg';
import { StructuredText, renderMetaTags, renderRule } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      techPartners: allTechPartners(first: 100, orderBy: slug_ASC) {
        slug
      }
    }
  `,
  'techPartnerSlug',
  ({ techPartners }) => techPartners.map((p) => p.slug),
);

export const getStaticProps = handleErrors(
  async ({ params: { techPartnerSlug }, preview }) => {
    const gqlRequest = {
      query: /* GraphQL */ `
        query TechPartnerQuery($techPartnerSlug: String!) {
          techPartner(filter: { slug: { eq: $techPartnerSlug } }) {
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
            areasOfExpertise {
              name
              slug
            }
            technologies {
              name
              slug
            }
            locations {
              name
              emoji
              continent {
                name
              }
            }
          }
        }

        ${imageFields}
      `,
      variables: { techPartnerSlug },
      preview: preview || false,
    };

    const { data } = await request(gqlRequest);

    if (!data.tech_partner) {
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
    data: { tech_partner },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview} noCta>
      <Head>
        {renderMetaTags(tech_partner._seoMetaTags)}
        <title>{tech_partner.name} | DatoCMS Technology Partners</title>
        <meta
          name="description"
          content={toPlainText(tech_partner.shortDescription)}
        />
      </Head>
      <InterstitialTitle
        mainTitleOfPage
        style="two"
        kicker={<>DatoCMS Technology Partner</>}
        bigSubtitle
        subtitle={<StructuredText data={tech_partner.shortDescription} />}
      >
        <LazyImage
          className={s.logo}
          alt={`${tech_partner.name} logo`}
          src={tech_partner.logo.url}
        />
      </InterstitialTitle>
      <Wrapper>
        <Space top={1}>
          <StickySidebar
            sidebar={
              <>
                <SidebarPane
                  icon={<MapPinIcon />}
                  title={
                    tech_partner.locations.length > 1 ? 'Locations' : 'Location'
                  }
                >
                  <ul className={s.list}>
                    {tech_partner.locations.map((location) => (
                      <li key={location.name}>
                        {location.emoji} {location.name}
                      </li>
                    ))}
                  </ul>
                </SidebarPane>
                <SidebarPane icon={<MarkerIcon />} title="Services offered">
                  <ul className={s.list}>
                    {tech_partner.areasOfExpertise.map((area) => (
                      <li key={area.slug}>{area.name}</li>
                    ))}
                  </ul>
                </SidebarPane>
                <SidebarPane icon={<LaptopIcon />} title="Covered technologies">
                  <ul className={s.list}>
                    {tech_partner.technologies.map((tech) => (
                      <li key={tech.slug}>{tech.name}</li>
                    ))}
                  </ul>
                </SidebarPane>
              </>
            }
          >
            <SidebarPane
              separateMoreFromContent
              icon={<DescriptionIcon />}
              title={`About ${tech_partner.name}`}
            >
              <div className={s.description}>
                <StructuredText
                  data={tech_partner.description}
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
                  <Button as="a" href={tech_partner.websiteUrl} target="_blank">
                    <BrowserIcon /> Visit website
                  </Button>
                </div>
                {tech_partner.publicContactEmail && (
                  <div className={s.actionButton}>
                    <Button
                      as="a"
                      s="invert"
                      href={`mailto:${tech_partner.publicContactEmail}`}
                      target="_blank"
                    >
                      <EnvelopeIcon /> Contact {tech_partner.name}
                    </Button>
                  </div>
                )}
              </div>
            </SidebarPane>
          </StickySidebar>
        </Space>
      </Wrapper>
    </Layout>
  );
}
