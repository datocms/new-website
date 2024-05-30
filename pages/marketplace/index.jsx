import cn from 'classnames';
import Head from 'components/Head';
import LazyImage from 'components/LazyImage';
import MarketplaceCard from 'components/MarketplaceCard';
import Layout from 'components/MarketplaceLayout';
import PluginBox, { LogoImage } from 'components/PluginBox';
import { handleErrors, imageFields, request } from 'lib/datocms';
import Link from 'next/link';
import ArrowRight from 'public/icons/regular/arrow-right.svg';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import { Image as DatoImage } from 'react-datocms';
import tiny from 'tiny-json-http';
import truncate from 'truncate';
import { githubRepoToManifest } from 'utils/githubRepo';
import s from './style.module.css';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    data: { page, ...other },
  } = await request({
    query: `
      {
        demos: _allTemplateDemosMeta {
          count
        }
        plugins: _allPluginsMeta(
          filter: { manuallyDeprecated: { eq: false } }
        ) {
          count
        }
        hostingApps: _allHostingAppsMeta {
          count
        }
        enterpriseApps: _allEnterpriseAppsMeta {
          count
        }
        page: integrationsPage {
          demos {
            id
            code
            name
            cmsDescription
            starterType
            badge {
              name
              emoji
            }
            label
            githubRepo
            technology {
              name
              logo {
                url
              }
              squareLogo {
                url
              }
            }
            screenshot {
              responsiveImage(
                imgixParams: { auto: format, w: 600, h: 400, fit: crop }
              ) {
                ...imageFields
              }
            }
          }
          plugins {
            packageName
            coverImage {
              responsiveImage(imgixParams: { auto: format, w: 300, h: 200, fit: crop }) {
                ...imageFields
              }
            }
            title
            description
          }
          hostingBuilding {
            slug
            title
            description: shortDescription
            logo {
              url
              width
              height
            }
          }
          enterpriseApps {
            slug
            title
            description: shortDescription
            logo {
              url
              width
              height
            }
          }
        }
      }

      ${imageFields}
    `,
  });

  page.demos = await Promise.all(
    page.demos.map(async (starter) => {
      const { body } = await tiny.get({
        url: githubRepoToManifest(starter.githubRepo),
      });
      return { ...JSON.parse(body), ...starter };
    }),
  );

  return {
    props: {
      preview: preview || false,
      page,
      ...other,
    },
  };
});

const Category = ({ title, description, children, browse }) => (
  <div className={s.category}>
    <div
      className={cn(s.categoryHeader, {
        [s.categoryHeaderWithBrowse]: !!browse,
      })}
    >
      <div className={s.categoryLeft}>
        <div className={s.categoryTitle}>{title}</div>
        <div className={s.categoryDesc}>{description}</div>
      </div>
      {browse}
    </div>
    <div className={s.boxes}>{children}</div>
  </div>
);

const Box = ({ title, description, image, href, tag }) => (
  <div className={s.boxContainer}>
    <PluginBox
      href={href}
      title={title}
      tag={tag}
      description={description}
      image={image}
    />
  </div>
);

export default function IntegrationsPage({
  page,
  plugins,
  demos,
  hostingApps,
  enterpriseApps,
  preview,
}) {
  const fullFledged = page.demos.filter(
    (item) => item.starterType === 'full_fledged',
  );
  const techStarters = page.demos.filter(
    (item) => item.starterType === 'tech_starter',
  );

  return (
    <Layout preview={preview}>
      <Head>
        <title>Integrations Marketplace</title>
      </Head>

      <div className={s.sectionWrapper}>
        <section className={s.section}>
          <div className={s.sectionHeader}>
            <h2 className={s.headerTitle}>Our Starters</h2>
            <Link href="/marketplace/starters">
              <a className={s.headerViewAll}>
                <span>View all</span> <ArrowRight />
              </a>
            </Link>
          </div>

          <div className={s.startersWrapper}>
            <div className={s.fullFledged}>
              <div className={s.intro}>
                <h3>Full-fledged demos</h3>
                <p>
                  Use our pre-built demo projects to see all of DatoCMS&apos;s
                  features in a realistic production-ready setup. Includes many
                  example content types, and advanced features.
                </p>
              </div>

              {fullFledged.map((item) => (
                <MarketplaceCard
                  key={item.code}
                  href={`/marketplace/starters/${item.code}`}
                  image={item.screenshot.responsiveImage}
                  technology={item.technology}
                  text={{
                    title: item.name,
                    description: item.cmsDescription,
                  }}
                  badge={item.badge}
                  label={item.label}
                  size="large"
                />
              ))}
            </div>

            <div className={s.techStarters}>
              <div className={s.intro}>
                <h3>Tech starters</h3>
                <p>Kickstart your next project with our scaffolds.</p>
              </div>

              {techStarters.map((item) => (
                <MarketplaceCard
                  key={item.code}
                  href={`/marketplace/starters/${item.code}`}
                  technology={item.technology}
                  text={{
                    title: item.name,
                    description: item.cmsDescription,
                  }}
                  orientation="horizontal"
                  size="small"
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Category
        title="Starter projects"
        description="Start with a fully configured DatoCMS project, a best-practice frontend and free hosting"
        browse={
          <Link href="/marketplace/starters">
            <a className={s.browseAll}>
              View all ({demos.count}) <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.demos.map((item) => (
          <Box
            key={item.code}
            title={item.name}
            href={`/marketplace/starters/${item.code}`}
            tag={item.starterType === 'full_fledged' && 'Best choice to start!'}
            description={
              <div className={s.demoDesc}>
                <div className={s.demoDescBody}>{item.cmsDescription}</div>
                <div className={s.demoDescImage}>
                  <LazyImage
                    className={s.techLogo}
                    src={item.technology.logo.url}
                  />
                </div>
              </div>
            }
            image={
              item.screenshot && (
                <DatoImage
                  className={s.boxImageImage}
                  data={item.screenshot.responsiveImage}
                />
              )
            }
          />
        ))}
      </Category>
      <Category
        title="Community Plugins"
        browse={
          <Link href="/marketplace/plugins">
            <a className={s.browseAll}>
              View all ({plugins.count}) <ArrowIcon />
            </a>
          </Link>
        }
        description="Easily expand and customize the capabilities of DatoCMS with community plugins"
      >
        {page.plugins.map((item) => (
          <Box
            key={item.packageName}
            href={`/marketplace/plugins/i/${item.packageName}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={
              item.coverImage && (
                <DatoImage
                  className={s.boxImageImage}
                  data={item.coverImage.responsiveImage}
                />
              )
            }
          />
        ))}
      </Category>
      <Category
        title="Hosting &amp; CI Building"
        description={
          <>
            Server, serverless or static: no matter the stack you&#39;re using,
            we&#39;ve got you covered
          </>
        }
        browse={
          <Link href="/marketplace/hosting">
            <a className={s.browseAll}>
              View all ({hostingApps.count}) <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.hostingBuilding.map((item) => (
          <Box
            key={item.slug}
            href={`/marketplace/hosting/${item.slug}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage logo={item.logo} />}
          />
        ))}
      </Category>

      <Category
        title={<>Enterprise Apps</>}
        description={
          <>
            Keep your company data secure with centralized users management and
            assets storage
          </>
        }
        browse={
          <Link href="/marketplace/enterprise">
            <a className={s.browseAll}>
              View all ({enterpriseApps.count}) <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.enterpriseApps.map((item) => (
          <Box
            key={item.slug}
            href={`/marketplace/enterprise/${item.slug}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage style="azure" logo={item.logo} />}
          />
        ))}
      </Category>
    </Layout>
  );
}
