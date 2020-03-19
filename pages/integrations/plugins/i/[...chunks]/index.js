import Layout from 'components/IntegrationsLayout';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import { gqlStaticPaths, gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import SmartMarkdown from 'components/SmartMarkdown';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { Copy, Image } from 'components/FakeContent';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import FormattedDate from 'components/FormattedDate';
import s from './style.module.css';
import useSWR from 'swr';
import wretch from 'wretch';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
import truncate from 'truncate';

import {
  PluginInfo,
  Info,
  NameWithGravatar,
  Header,
  Back,
  Announce,
} from 'components/PluginToolkit';

export const getStaticPaths = gqlStaticPaths(
  gql`
    {
      plugins: allPlugins(orderBy: installs_DESC, first: 10) {
        packageName
      }
    }
  `,
  'chunks',
  ({ plugins }) => plugins.map(p => p.packageName.split(/\//)),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query pluginQuery($name: String!) {
      plugin(filter: { packageName: { eq: $name } }) {
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
  ({ chunks }) => ({ name: chunks.join('/') }),
);

const fetcher = packageName =>
  wretch('https://graphql.datocms.com/', {
    headers: {
      Authorization:
        'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
    },
  })
    .post({
      query: `
        query pluginQuery($packageName: String!) {
          plugin(filter: { packageName: { eq: $packageName } }) {
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
    isFallback,
    query: { chunks },
  } = useRouter();

  const { data } = useSWR(isFallback ? null : chunks.join('/'), fetcher);
  const info = data && data.data.plugin;

  return (
    <Layout preview={preview}>
      {!isFallback && <Head>{renderMetaTags(plugin.seo)}</Head>}

      <Wrapper>
        <div className={s.root}>
          <div className={s.split}>
            <div className={s.content}>
              <Header
                isFallback={isFallback}
                title={!isFallback && plugin.title}
                description={!isFallback && plugin.description}
              >
                {!isFallback && plugin.previewImage && (
                  <img
                    alt="Preview"
                    className={s.previewImage}
                    src={plugin.previewImage.url}
                  />
                )}
              </Header>

              <div className={s.readme}>
                {isFallback ? (
                  <>
                    <Copy />
                    <Image />
                    <Copy />
                  </>
                ) : (
                  <SmartMarkdown>{plugin.readme}</SmartMarkdown>
                )}
              </div>
            </div>
            <div className={s.sidebar}>
              <div className={s.sidebarInner}>
                <PluginBox
                  isFallback={isFallback}
                  title={!isFallback && plugin.title}
                  image={
                    !isFallback && plugin.coverImage ? (
                      <div className={s.cover}>
                        <img alt="Preview" src={plugin.coverImage.url} />
                      </div>
                    ) : (
                      <PluginImagePlacehoder />
                    )
                  }
                  description={!isFallback && truncate(plugin.description, 55)}
                  actions={
                    <Button
                      as="a"
                      href={
                        isFallback
                          ? '#'
                          : `https://dashboard.datocms.com/projects/redirect-to-project?path=/admin/plugins/install/${plugin.packageName}`
                      }
                      target="_blank"
                    >
                      Install this plugin!
                    </Button>
                  }
                />

                <div className={s.announce}>
                  <Announce
                    as="/docs/building-plugins"
                    href="/docs/[...chunks]"
                  >
                    <strong>This is a Community Plugin!</strong> Learn how
                    create your own plugin, or copy and remix existing ones in
                    our documentation
                  </Announce>
                </div>

                <div className={s.info}>
                  <PluginInfo>
                    <Info title="Publisher" isFallback={isFallback}>
                      {!isFallback && (
                        <NameWithGravatar
                          email={plugin.author.email}
                          name={plugin.author.name}
                        />
                      )}
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
                    <Info title="Plugin type" isFallback={isFallback}>
                      {!isFallback && plugin.pluginType.name}
                    </Info>
                    <Info
                      title="Compatible with fields"
                      isFallback={isFallback}
                    >
                      {!isFallback &&
                        plugin.fieldTypes.map(f => f.name).join(', ')}
                    </Info>
                    <Info title="First released" isFallback={isFallback}>
                      {!isFallback && (
                        <FormattedDate date={plugin.releasedAt} />
                      )}
                    </Info>
                    <Info title="Current version" isFallback={isFallback}>
                      {!isFallback && plugin.version}
                    </Info>
                    <Info title="Installs count" isFallback={!info}>
                      {info && info.installs}
                    </Info>
                    <Info title="Last update" isFallback={!info}>
                      {info && <FormattedDate date={info.lastUpdate} />}
                    </Info>
                  </PluginInfo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
