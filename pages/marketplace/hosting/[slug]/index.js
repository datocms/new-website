import Button from 'components/Button';
import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import { LogoImage } from 'components/PluginBox';
import {
  Info,
  NameWithGravatar,
  PluginDetails,
  PluginInfo,
} from 'components/PluginToolkit';
import PostContent from 'components/PostContent';
import { generatePaths, generateProps } from 'lib/appQueries';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';

export const getStaticPaths = generatePaths('allHostingApps');
export const getStaticProps = generateProps('hostingApp');

export default function EnterpriseApp({ page, preview }) {
  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>

      <PluginDetails
        title={page.title}
        description={page.description}
        gallery={page.gallery.map((image) => (
          <DatoImage key={image.id} data={image.responsiveImage} />
        ))}
        content={
          <PostContent content={page && page.content} style={docPageStyles} />
        }
        image={<LogoImage logo={page.logo} />}
        shortDescription={page.shortDescription}
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
          </PluginInfo>
        }
      />
    </Layout>
  );
}
