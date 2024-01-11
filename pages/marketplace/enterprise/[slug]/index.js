import Button from 'components/Button';
import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import { LogoImage } from 'components/PluginBox';
import {
  Badge,
  Info,
  NameWithGravatar,
  PluginDetails,
  PluginInfo,
} from 'components/PluginToolkit';
import PostContent from 'components/PostContent';
import { generatePaths, generateProps } from 'lib/appQueries';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';

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
          <DatoImage key={image.id} data={image.responsiveImage} />
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
