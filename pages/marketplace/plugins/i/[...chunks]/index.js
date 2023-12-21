import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import { PluginImagePlacehoder } from 'components/PluginBox';
import {
  Announce,
  Info,
  NameWithGravatar,
  PluginDetails,
  PluginInfo,
} from 'components/PluginToolkit';
import SmartMarkdown from 'components/SmartMarkdown';
import VideoPlayer from 'components/VideoPlayer';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { useRouter } from 'next/router';
import { Image, renderMetaTags } from 'react-datocms';
import useSWR from 'swr';
import truncate from 'truncate';
import wretch from 'wretch';
import s from './style.module.css';

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
  /* GraphQL */
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
          responsiveImage(imgixParams: { auto: format, w: 300 }) {
            ...imageFields
          }
        }
        previewImage {
          format
          url
          responsiveImage(imgixParams: { auto: format, w: 850 }) {
            ...imageFields
          }
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
    ${imageFields}
  `,
  {
    paramsToVars: ({ chunks }) => ({ name: chunks.join('/') }),
    requiredKeys: ['plugin'],
  },
);

const fetcher = (packageName) =>
  wretch(
    `https://graphql.datocms.com${
      process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT_ID
        ? `/environments/${process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT_ID}`
        : '/'
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN}`,
      },
    },
  )
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

  const projectEnvironment = new URLSearchParams(asPath.split('?')[1]).get(
    'projectEnvironment',
  );

  const url = `${
    projectEnvironment ? `/environments/${projectEnvironment}` : ''
  }/configuration/plugins/install/${plugin.packageName}`;

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
          ) : plugin.previewImage.format === 'gif' ? (
            <video
              poster={`${plugin.previewImage.url}?fm=jpg&fit=max&w=850`}
              autoPlay
              loop
              muted
              className={s.previewImage}
            >
              <source
                src={`${plugin.previewImage.url}?fm=webm&w=850`}
                type="video/webm"
              />
              <source
                src={`${plugin.previewImage.url}?fm=mp4&w=850`}
                type="video/mp4"
              />
            </video>
          ) : (
            <Image
              data={plugin.previewImage.responsiveImage}
              className={s.previewImage}
            />
          ))
        }
        content={<SmartMarkdown>{plugin.readme}</SmartMarkdown>}
        image={
          plugin.coverImage ? (
            <div className={s.cover}>
              <Image data={plugin.coverImage.responsiveImage} />
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

            {plugin?.packageName && (
              <Info title="Package">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://www.npmjs.com/package/${plugin.packageName}`}
                >
                  Visit NPM
                </a>
              </Info>
            )}

            {plugin.pluginType && (
              <Info title="Plugin type">{plugin.pluginType.name}</Info>
            )}
            {plugin.fieldTypes.length > 0 && (
              <Info title="Compatible with fields">
                {plugin.fieldTypes.map((f) => f.name).join(', ')}
              </Info>
            )}
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
                ? `https://${projectDomain}${url}`
                : `https://dashboard.datocms.com/projects/redirect-to-project?path=${url}`
            }
          >
            Install this plugin!
          </Button>
        }
        announce={
          <Announce href="/docs/plugin-sdk">
            <strong>This is a Community Plugin!</strong> Learn how create your
            own plugin, or copy and remix existing ones in our documentation
          </Announce>
        }
      />
    </Layout>
  );
}
