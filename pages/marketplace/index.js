import Layout from 'components/MarketplaceLayout';
import LazyImage from 'components/LazyImage';
import Head from 'components/Head';
import { request, imageFields } from 'lib/datocms';
import s from './style.module.css';
import { Image as DatoImage } from 'react-datocms';
import truncate from 'truncate';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import Link from 'next/link';
import cn from 'classnames';
import PluginBox, { LogoImage } from 'components/PluginBox';
import tiny from 'tiny-json-http';
import { githubRepoToManifest } from 'utils/githubRepo';
import { handleErrors } from 'lib/datocms';

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
            githubRepo
            technology {
              name
              logo {
                url
              }
            }
            screenshot {
              responsiveImage(
                imgixParams: { w: 300, h: 200, fit: crop, crop: top }
              ) {
                ...imageFields
              }
            }
          }
          plugins {
            packageName
            coverImage {
              responsiveImage(imgixParams: { w: 300, h: 200, fit: crop }) {
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

const Box = ({ title, description, image, href }) => (
  <div className={s.boxContainer}>
    <PluginBox
      href={href}
      title={title}
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
  return (
    <Layout preview={preview}>
      <Head>
        <title>Integrations Marketplace</title>
      </Head>
      <Category
        title="Starter projects"
        description={
          <>
            Start with a fully configured DatoCMS project, a best-practice
            frontend and free hosting
          </>
        }
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
            description={
              <div className={s.demoDesc}>
                <div className={s.demoDescBody}>{item.description}</div>
                <div className={s.demoDescImage}>
                  <LazyImage
                    className={s.techLogo}
                    src={item.technology.logo.url}
                  />
                </div>
              </div>
            }
            image={
              <DatoImage
                className={s.boxImageImage}
                data={item.screenshot.responsiveImage}
              />
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
        description={
          <>
            Easily expand and customize the capabilities of DatoCMS with
            community plugins
          </>
        }
      >
        {page.plugins.map((item) => (
          <Box
            key={item.packageName}
            href={`/marketplace/plugins/i/${item.packageName}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={
              <DatoImage
                className={s.boxImageImage}
                data={item.coverImage.responsiveImage}
              />
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
