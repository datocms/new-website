import { generatePaths, generateProps } from 'lib/appQueries';
import { useRouter } from 'next/router';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import PostContent from 'components/PostContent';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import s from 'pages/marketplace/plugins/i/[...chunks]/style.module.css';
import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import { Image } from 'react-datocms';
import PluginBox, { LogoImage } from 'components/PluginBox';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  PluginDetails,
  Back,
} from 'components/PluginToolkit';
import { Copy, Image as FakeImage } from 'components/FakeContent';

export const getStaticPaths = generatePaths('allHostingApps');
export const getStaticProps = generateProps('hostingApp');

export default function EnterpriseApp({ page, preview }) {
  const { isFallback } = useRouter();

  return (
    <Layout preview={preview}>
      {!isFallback && <Head>{renderMetaTags(page.seo)}</Head>}

      <PluginDetails
        isFallback={isFallback}
        title={!isFallback && page.title}
        description={!isFallback && page.description}
        gallery={
          !isFallback &&
          page.gallery.map((image) => (
            <Image key={image.id} explicitWidth data={image.responsiveImage} />
          ))
        }
        content={
          isFallback ? (
            <>
              <Copy />
              <FakeImage />
              <Copy />
            </>
          ) : (
            <PostContent
              isFallback={isFallback}
              content={page && page.content}
              style={docPageStyles}
            />
          )
        }
        image={!isFallback && <LogoImage logo={page.logo} />}
        shortDescription={!isFallback && page.shortDescription}
        actions={
          <Button
            as="a"
            href="https://dashboard.datocms.com/projects/redirect-to-project?path=/admin/build_triggers/new"
            target="_blank"
          >
            Install this app
          </Button>
        }
        info={
          <PluginInfo>
            <Info title="Publisher">
              <NameWithGravatar email="support@datocms.com" name="DatoCMS" />
            </Info>
            <Info title="First released">
              <FormattedDate date={'2019-03-12'} />
            </Info>
          </PluginInfo>
        }
      />
    </Layout>
  );
}
