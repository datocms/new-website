import { generatePaths, generateProps } from 'lib/appQueries';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import PostContent from 'components/PostContent';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import Layout from 'components/MarketplaceLayout';
import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import { Image as DatoImage } from 'react-datocms';
import { LogoImage } from 'components/PluginBox';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  PluginDetails,
} from 'components/PluginToolkit';

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
          <DatoImage
            key={image.id}
            explicitWidth
            data={image.responsiveImage}
          />
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
            <Info title="First released">
              <FormattedDate date={'2019-03-12'} />
            </Info>
          </PluginInfo>
        }
      />
    </Layout>
  );
}
