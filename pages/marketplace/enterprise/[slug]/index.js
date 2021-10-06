import { generatePaths, generateProps } from 'lib/appQueries';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import PostContent from 'components/PostContent';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import Layout from 'components/MarketplaceLayout';
import Button from 'components/Button';
import { Image as DatoImage } from 'react-datocms';
import { LogoImage } from 'components/PluginBox';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  PluginDetails,
  Badge,
} from 'components/PluginToolkit';

export const getStaticPaths = generatePaths('allEnterpriseApps');
export const getStaticProps = generateProps('enterpriseApp');

export default function EnterpriseApp({ page, preview }) {
  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>

      <PluginDetails
        title={
          <>
            {page.title} <Badge>Enterprise integration</Badge>
          </>
        }
        shortTitle={page.title}
        description={page.description}
        gallery={page.gallery.map((image) => (
          <DatoImage
            key={image.id}
            explicitWidth
            data={image.responsiveImage}
          />
        ))}
        content={
          <PostContent content={page && page.content} style={docPageStyles} />
        }
        image={<LogoImage style="azure" logo={page.logo} />}
        shortDescription={page.shortDescription}
        actions={
          <Button as="a" href="/contact" target="_blank">
            Request activation
          </Button>
        }
        info={
          <PluginInfo>
            <Info title="Publisher">
              <NameWithGravatar email="support@datocms.com" name="DatoCMS" />
            </Info>
          </PluginInfo>
        }
      />
    </Layout>
  );
}
