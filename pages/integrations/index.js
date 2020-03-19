import Layout from 'components/IntegrationsLayout';
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
import { Badge } from 'components/PluginToolkit';

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
    <Link href={href} as={as}>
      <a className={s.box}>
        <PluginBox title={title} description={description} image={image} />
      </a>
    </Link>
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
          <Link href="/starters">
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
            as={`/integrations/starters/${item.code}`}
            href="/integrations/starters/[slug]"
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
          <Link href="/integrations/plugins">
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
            href="/integrations/plugins/i/[...chunks]"
            as={`/integrations/plugins/i/${item.packageName}`}
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
          <Link href="/integrations/hosting">
            <a className={s.browseAll}>
              View all ({hostingApps.count}) <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.hostingBuilding.map(item => (
          <Box
            key={item.slug}
            as={`/integrations/hosting/${item.slug}`}
            href="/integrations/hosting/[slug]"
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage logo={item.logo} />}
          />
        ))}
      </Category>

      <Category
        title={
          <>
            Custom storage and Single Sign-On <Badge>Enterpise only</Badge>
          </>
        }
        description={
          <>
            Keep your company data secure with centralized users management and
            assets storage
          </>
        }
        browse={
          <Link href="/integrations/enterprise">
            <a className={s.browseAll}>
              View all ({enterpriseApps.count}) <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.enterpriseApps.map(item => (
          <Box
            key={item.slug}
            as={`/integrations/enterprise/${item.slug}`}
            href="/integrations/enterprise/[slug]"
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage style="azure" logo={item.logo} />}
          />
        ))}
      </Category>
    </Layout>
  );
}
