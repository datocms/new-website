import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import s from './style.module.css';
import gql from 'graphql-tag';
import { Image } from 'react-datocms';
import truncate from 'truncate';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import Link from 'next/link';
import cn from 'classnames';
import docHref from 'utils/docHref';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      page: integrationsPage {
        technologies {
          ...integration
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
          ...integration
        }
        assetsStorage {
          ...integration
        }
        singleSignOn {
          ...integration
        }
      }
    }

    fragment integration on IntegrationRecord {
      slug
      name
      integrationType {
        slug
      }
      documentationUrl
      landingUrl
      logo {
        url
        width
        height
      }
    }

    ${imageFields}
  `,
);

const Category = ({ title, description, children, noBrowse }) => (
  <div className={s.category}>
    <div className={s.categoryHeader}>
      <div className={s.categoryLeft}>
        <div className={s.categoryTitle}>{title}</div>
        <div className={s.categoryDesc}>{description}</div>
      </div>
      {!noBrowse && (
        <div className={s.browseAll}>
          Browse all <ArrowIcon />
        </div>
      )}
    </div>
    <div className={s.boxes}>{children}</div>
  </div>
);

const Box = ({ title, description, image, href, as }) => (
  <div className={s.boxContainer}>
    <Link href={href} as={as}>
      <a className={s.box}>
        {image}
        <div className={s.boxBody}>
          <div className={s.boxTitle}>{title}</div>
          <div className={s.boxDesc}>{description}</div>
        </div>
      </a>
    </Link>
  </div>
);

const LogoImage = ({ logo }) => (
  <div className={cn(s.logo, { [s.square]: logo.width / logo.height < 1.7 })}>
    <LazyImage src={logo.url} />
  </div>
);

export default function IntegrationsPage({ page }) {
  return (
    <Layout>
      <Head>
        <title>Integrations Marketplace</title>
      </Head>
      <Hero
        title={
          <>
            <Highlight>Integrations Marketplace</Highlight>
          </>
        }
        subtitle="Expand and customize the capabilities of DatoCMS, integrating your favorite third-party services"
      />
      <Category
        title="Web technologies"
        description={
          <>
            DatoCMS integrates with every framework so that you can always
            choose the best fit for your project.
          </>
        }
      >
        {page.technologies.map(item => (
          <Box
            key={item.slug}
            title={item.name}
            as={item.landingUrl || item.documentationUrl}
            href={
              item.landingUrl ? '/cms/[slug]' : docHref(item.documentationUrl)
            }
            description={`Use DatoCMS into your ${item.name} website`}
            image={<LogoImage logo={item.logo} />}
          />
        ))}
      </Category>
      <Category
        title="Community Plugins"
        description={
          <>
            Easily expand and customize the capabilities of DatoCMS with one of
            the existing community plugins.
          </>
        }
      >
        {page.plugins.map(item => (
          <Box
            key={item.packageName}
            href="/plugins/i/[...chunks]"
            as={`/plugins/i/${item.packageName}`}
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
            Server, serverless or static. No matter the stack you're using,
            we've got you covered.
          </>
        }
      >
        {page.hostingBuilding.map(item => (
          <Box
            key={item.slug}
            as={item.documentationUrl}
            href={docHref(item.documentationUrl)}
            title={item.name}
            description={`Trigger a build of your website on ${item.name}`}
            image={<LogoImage logo={item.logo} />}
          />
        ))}
      </Category>
      <div className={s.grid}>
        <Category
          title="Assets storage"
          noBrowse
          description={
            <>
              Keep 100% ownership of your media files using your own AWS/Google
              Storage buckets.
            </>
          }
        >
          {page.assetsStorage.map(item => (
            <Box
              key={item.slug}
              as={item.documentationUrl}
              href={docHref(item.documentationUrl)}
              title={item.name}
              description={`Store your DatoCMS assets in ${item.name}`}
              image={<LogoImage logo={item.logo} />}
            />
          ))}
        </Category>
        <Category
          title="Single Sign-On"
          noBrowse
          description={
            <>
              Keep your company data secure with centralized users management.
            </>
          }
        >
          {page.singleSignOn.map(item => (
            <Box
              key={item.slug}
              as={item.documentationUrl}
              href={docHref(item.documentationUrl)}
              title={item.name}
              description={`Provision/deprovision users using your ${item.name} account`}
              image={<LogoImage logo={item.logo} />}
            />
          ))}
        </Category>
      </div>
    </Layout>
  );
}
