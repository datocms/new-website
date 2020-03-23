import Layout from 'components/MarketplaceLayout';
import LazyImage from 'components/LazyImage';
import Head from 'next/head';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import s from './style.module.css';
import gql from 'graphql-tag';
import { Image } from 'react-datocms';
import truncate from 'truncate';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import Link from 'next/link';
import cn from 'classnames';
import PluginBox, { LogoImage } from 'components/PluginBox';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      demos: _allTemplateDemosMeta {
        count
      }
      plugins: _allPluginsMeta {
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
          deploymentType
          description
          name
          demoName
          technology {
            name
            logo {
              url
            }
          }
          category {
            name
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
);

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

const Box = ({ title, description, image, href, as }) => (
  <div className={s.boxContainer}>
    <PluginBox
      href={href}
      as={as}
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
        {page.demos.map(item => (
          <Box
            key={item.code}
            title={item.name}
            as={`/marketplace/starters/${item.code}`}
            href="/marketplace/starters/[slug]"
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
              <Image
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
        {page.plugins.map(item => (
          <Box
            key={item.packageName}
            href="/marketplace/plugins/i/[...chunks]"
            as={`/marketplace/plugins/i/${item.packageName}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={
              <Image
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
            Server, serverless or static: no matter the stack you're using,
            we've got you covered
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
        {page.hostingBuilding.map(item => (
          <Box
            key={item.slug}
            as={`/marketplace/hosting/${item.slug}`}
            href="/marketplace/hosting/[slug]"
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
        {page.enterpriseApps.map(item => (
          <Box
            key={item.slug}
            as={`/marketplace/enterprise/${item.slug}`}
            href="/marketplace/enterprise/[slug]"
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage style="azure" logo={item.logo} />}
          />
        ))}
      </Category>
    </Layout>
  );
}
