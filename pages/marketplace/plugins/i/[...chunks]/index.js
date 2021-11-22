import Layout from 'components/MarketplaceLayout';
import Button from 'components/Button';
import { gqlStaticPaths, gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import SmartMarkdown from 'components/SmartMarkdown';
import { useRouter } from 'next/router';
import { renderMetaTags } from 'react-datocms';
import Head from 'components/Head';
import FormattedDate from 'components/FormattedDate';
import s from './style.module.css';
import useSWR from 'swr';
import wretch from 'wretch';
import { PluginImagePlacehoder } from 'components/PluginBox';
import truncate from 'truncate';
import VideoPlayer from 'components/VideoPlayer';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  PluginDetails,
  Announce,
} from 'components/PluginToolkit';

export const getStaticPaths = gqlStaticPaths(
  `
    {
      plugins: allPlugins(
        orderBy: installs_DESC
        first: 10
        filter: { manuallyDeprecated: { eq: false } }
      ) {
        packageName
      }
    }
  `,
  'chunks',
  ({ plugins }) => plugins.map((p) => p.packageName.split(/\//)),
);

export const getStaticProps = gqlStaticProps(
  `
    query pluginQuery($name: String!) {
      plugin(
        filter: {
          packageName: { eq: $name }
          manuallyDeprecated: { eq: false }
        }
      ) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        packageName
        version
        author {
          name
          email
        }
        homepage
        description
        tags {
          tag
        }
        title
        coverImage {
          url
        }
        previewImage {
          url
          width
          height
          video {
            duration
            streamingUrl
            thumbnailUrl
          }
        }
        fieldTypes {
          name
          code
        }
        pluginType {
          name
          code
        }
        releasedAt
        readme(markdown: true)
      }
    }
    ${seoMetaTagsFields}
  `,
  {
    paramsToVars: ({ chunks }) => ({ name: chunks.join('/') }),
    requiredKeys: ['plugin'],
  },
);

const fetcher = (packageName) =>
  wretch('https://graphql.datocms.com/', {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN}`,
    },
  })
    .post({
      query: `
        query pluginQuery($packageName: String!) {
          plugin(
            filter: {
              packageName: { eq: $packageName }
              manuallyDeprecated: { eq: false }
            }
          ) {
            lastUpdate
            version
            installs
          }
        }
      `,
      variables: {
        packageName,
      },
    })
    .json();

export default function Plugin({ plugin, preview }) {
  const {
    query: { chunks },
    asPath,
  } = useRouter();

  const { data } = useSWR(chunks.join('/'), fetcher);
  const info = data && data.data.plugin;

  const projectDomain = new URLSearchParams(asPath.split('?')[1]).get(
    'projectDomain',
  );

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(plugin.seo)}</Head>

      <PluginDetails
        title={plugin.title}
        description={plugin.description}
        gallery={
          plugin.previewImage &&
          (plugin.previewImage.video ? (
            <VideoPlayer
              controls
              src={plugin.previewImage.video.streamingUrl}
              poster={plugin.previewImage.video.thumbnailUrl}
            />
          ) : (
            <img
              alt="Preview"
              className={s.previewImage}
              src={plugin.previewImage.url}
            />
          ))
        }
        content={<SmartMarkdown>{plugin.readme}</SmartMarkdown>}
        image={
          plugin.coverImage ? (
            <div className={s.cover}>
              <img alt="Preview" src={plugin.coverImage.url} />
            </div>
          ) : (
            <PluginImagePlacehoder hash={plugin.packageName} />
          )
        }
        shortDescription={truncate(plugin.description, 55)}
        info={
          <PluginInfo>
            <Info title="Publisher">
              <NameWithGravatar
                email={plugin.author.email}
                name={plugin.author.name}
              />
            </Info>
            <Info title="Homepage">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={plugin && plugin.homepage}
              >
                Visit homepage
              </a>
            </Info>
            <Info title="Plugin type">{plugin.pluginType.name}</Info>
            <Info title="Compatible with fields">
              {plugin.fieldTypes.map((f) => f.name).join(', ')}
            </Info>
            <Info title="Current version">{plugin.version}</Info>
            <Info title="Installs count">{info && info.installs}</Info>
            <Info title="Last update">
              {info && <FormattedDate date={info.lastUpdate} />}
            </Info>
          </PluginInfo>
        }
        actions={
          <Button
            as="a"
            href={
              projectDomain
                ? `https://${projectDomain}/admin/plugins/install/${plugin.packageName}`
                : `https://dashboard.datocms.com/projects/redirect-to-project?path=/admin/plugins/install/${plugin.packageName}`
            }
            target="_blank"
          >
            Install this plugin!
          </Button>
        }
        announce={
          <Announce href="/docs/building-plugins">
            <strong>This is a Community Plugin!</strong> Learn how create your
            own plugin, or copy and remix existing ones in our documentation
          </Announce>
        }
      />
    </Layout>
  );
}
