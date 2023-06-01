import Button from 'components/Button';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
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
import {
  Image,
  StructuredText,
  renderMetaTags,
  renderRule,
} from 'react-datocms';
import truncate from 'truncate';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';
import { clean } from 'utils/stega';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      partners: allPartners(first: 100, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'partnerSlug',
  ({ partners }) => partners.map((p) => p.slug),
);

export const getStaticProps = handleErrors(
  async ({ params: { partnerSlug }, preview }) => {
    const gqlRequest = {
      query: /* GraphQL */ `
        query PartnerQuery($partnerSlug: String!) {
          partner(filter: { slug: { eq: $partnerSlug } }) {
            id
            slug
            _seoMetaTags {
              ...seoMetaTagsFields
            }
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
            npmUser {
              id
            }
            projects: _allReferencingShowcaseProjects(
              first: 100
              orderBy: position_ASC
            ) {
              name
              slug
              headline {
                value
              }
              technologies {
                name
                integrationType {
                  slug
                }
                logo {
                  url
                }
              }
              mainImage {
                responsiveImage(
                  imgixParams: {
                    auto: format
                    w: 750
                    h: 500
                    fit: crop
                    crop: top
                  }
                ) {
                  ...imageFields
                }
              }
            }
          }
        }

        ${seoMetaTagsFields}
        ${imageFields}
      `,
      variables: { partnerSlug },
      preview: preview || false,
    };

    const { data } = await request(gqlRequest);

    if (!data.partner) {
      return { notFound: true };
    }

    const authorId = data.partner.npmUser?.id;
    let plugins = [];

    if (authorId) {
      const { data } = await request({
        query: /* GraphQL */ `
          query ExtraProjectsQuery($authorId: ItemId!) {
            plugins: allPlugins(
              filter: {
                author: { eq: $authorId }
                manuallyDeprecated: { eq: false }
              }
              orderBy: installs_DESC
            ) {
              title
              description
              releasedAt
              packageName
              coverImage {
                responsiveImage(
                  imgixParams: { auto: format, w: 600, h: 400, fit: crop }
                ) {
                  ...imageFields
                }
              }
            }
          }

          ${imageFields}
        `,
        variables: { authorId },
        preview: preview || false,
      });

      plugins = data.plugins;
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
        plugins: plugins || [],
      },
    };
  },
);

export default function PartnerPage({ preview, subscription, plugins }) {
  const {
    data: { partner },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview} noCta>
      <Head>
        {renderMetaTags(partner._seoMetaTags)}
        <title>{partner.name} | DatoCMS Partners</title>
        <meta
          name="description"
          content={toPlainText(partner.shortDescription)}
        />
      </Head>
      <InterstitialTitle
        mainTitleOfPage
        style="two"
        kicker={<>DatoCMS Agency Partner</>}
        bigSubtitle
        subtitle={<StructuredText data={partner.shortDescription} />}
      >
        <LazyImage
          className={s.logo}
          alt={partner.name + ' logo'}
          src={partner.logo.url}
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
                    partner.locations.length > 1 ? 'Locations' : 'Location'
                  }
                >
                  <ul className={s.list}>
                    {partner.locations.map((area) => (
                      <li key={area.slug}>
                        {area.emoji} {area.name}
                      </li>
                    ))}
                  </ul>
                </SidebarPane>
                <SidebarPane icon={<MarkerIcon />} title="Services offered">
                  <ul className={s.list}>
                    {partner.areasOfExpertise.map((area) => (
                      <li key={area.slug}>{area.name}</li>
                    ))}
                  </ul>
                </SidebarPane>
                <SidebarPane icon={<LaptopIcon />} title="Covered technologies">
                  <ul className={s.list}>
                    {partner.technologies.map((area) => (
                      <li key={area.slug}>{area.name}</li>
                    ))}
                  </ul>
                </SidebarPane>
              </>
            }
          >
            <SidebarPane
              separateMoreFromContent
              icon={<DescriptionIcon />}
              title={`About ${partner.name}`}
            >
              <div className={s.description}>
                <StructuredText
                  data={partner.description}
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
                  <Button as="a" href={partner.websiteUrl} target="_blank">
                    <BrowserIcon /> Visit website
                  </Button>
                </div>
                {partner.publicContactEmail && (
                  <div className={s.actionButton}>
                    <Button
                      as="a"
                      s="invert"
                      href={`mailto:${partner.publicContactEmail}`}
                      target="_blank"
                    >
                      <EnvelopeIcon /> Contact {partner.name}
                    </Button>
                  </div>
                )}
              </div>
            </SidebarPane>
          </StickySidebar>
        </Space>

        {partner.projects.length > 0 && (
          <Space top={1}>
            <SidebarPane
              icon={<DescriptionIcon />}
              title="Projects showcase"
              separateMoreFromContent
            >
              <div className={s.projectsGrid}>
                {partner.projects.map((project) => (
                  <PluginBox
                    title={project.name}
                    key={project.slug}
                    href={`/partners/${partner.slug}/showcase/${project.slug}`}
                    description={
                      <div className={s.demoDesc}>
                        <div className={s.demoDescBody}>
                          {toPlainText(project.headline)}
                        </div>
                        <div className={s.demoDescImage}>
                          <LazyImage
                            className={s.techLogo}
                            src={
                              (
                                project.technologies.find(
                                  (t) =>
                                    t.integrationType.slug === 'framework' &&
                                    t.logo?.url,
                                ) ||
                                project.technologies.find((t) => t.logo?.url)
                              ).logo.url
                            }
                          />
                        </div>
                      </div>
                    }
                    image={
                      <Image
                        className={s.boxImageImage}
                        data={project.mainImage.responsiveImage}
                      />
                    }
                  />
                ))}
              </div>
            </SidebarPane>
          </Space>
        )}

        {plugins.length > 0 && (
          <Space top={1}>
            <SidebarPane
              icon={<DescriptionIcon />}
              title="Plugins released"
              separateMoreFromContent
            >
              <div className={s.pluginsGrid}>
                {plugins?.map((post) => (
                  <PluginBox
                    key={post.packageName}
                    title={post.title}
                    href={`/marketplace/plugins/i/${clean(post.packageName)}`}
                    image={
                      post.coverImage && post.coverImage.responsiveImage ? (
                        <Image
                          className={s.image}
                          data={post.coverImage.responsiveImage}
                        />
                      ) : (
                        <PluginImagePlacehoder hash={post.packageName} />
                      )
                    }
                    description={truncate(post.description, 120)}
                  />
                ))}
              </div>
            </SidebarPane>
          </Space>
        )}
      </Wrapper>
    </Layout>
  );
}
