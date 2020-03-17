import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import { gqlStaticPaths, gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import SmartMarkdown from 'components/SmartMarkdown';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { Line, Text, Copy, Image } from 'components/FakeContent';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import gravatar from 'utils/gravatar';
import FormattedDate from 'components/FormattedDate';
import s from './style.module.css';
import useSWR from 'swr';
import wretch from 'wretch';
import MegaphoneIcon from 'public/icons/regular/megaphone.svg';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';

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
          <Link href="/plugins">
            <a className={s.back}>
              <LeftIcon /> Browse all plugins
            </a>
          </Link>
          <div className={s.split}>
            <div className={s.content}>
              <div className={s.header}>
                <div className={s.headerLeft}>
                  <div className={s.title}>
                    {isFallback ? <Text width={30} /> : plugin.title}
                  </div>
                </div>
                <div className={s.actions}>
                  <Button
                    as="a"
                    href={
                      isFallback
                        ? '#'
                        : `https://dashboard.datocms.com/projects/redirect-to-project?path=/admin/plugins/install/${plugin.packageName}`
                    }
                    target="_blank"
                  >
                    Install
                  </Button>
                </div>
              </div>

              <div className={s.description}>
                {isFallback ? <Copy /> : plugin.description}
              </div>

              {isFallback ? (
                <Image />
              ) : (
                plugin.previewImage && (
                  <div className={s.preview}>
                    <img alt="Preview" src={plugin.previewImage.url} />
                  </div>
                )
              )}

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
              <Link as="/docs/building-plugins" href="/docs/[...chunks]">
                <a className={s.announce}>
                  <MegaphoneIcon /> <strong>This is a Community Plugin!</strong>{' '}
                  Learn how create your own plugin, or copy and remix existing
                  ones in our documentation →
                </a>
              </Link>
              <div className={s.info}>
                <div className={s.infoBlock}>
                  <div className={s.infoBlockTitle}>Publisher</div>
                  {isFallback ? (
                    <Line />
                  ) : (
                    <>
                      <img
                        alt="Author gravatar"
                        className={s.avatar}
                        src={gravatar(plugin.author.email, {
                          s: 80,
                          d: 'retro',
                        })}
                      />
                      {plugin.author.name}
                    </>
                  )}
                </div>
                <dl>
                  <dt>Homepage</dt>
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={plugin && plugin.homepage}
                    >
                      Visit homepage
                    </a>
                  </dd>
                  <dt>Plugin type</dt>
                  <dd>{isFallback ? <Line /> : plugin.pluginType.name}</dd>
                  <dt>Compatible with fields</dt>
                  <dd>
                    {isFallback ? (
                      <Line />
                    ) : (
                      plugin.fieldTypes.map(f => f.name).join(', ')
                    )}
                  </dd>
                  <dt>First released</dt>
                  <dd>
                    {isFallback ? (
                      <Line />
                    ) : (
                      <FormattedDate date={plugin.releasedAt} />
                    )}
                  </dd>
                  <dt>Current version</dt>
                  <dd>{isFallback ? <Line /> : plugin.version}</dd>
                  <dt>Installs count</dt>
                  <dd>{!info ? <Line /> : info.installs}</dd>
                  <dt>Last update</dt>
                  <dd>
                    {!info ? (
                      <Line />
                    ) : (
                      <FormattedDate date={info.lastUpdate} />
                    )}
                  </dd>
                </dl>
              </div>
              {isFallback ? (
                <Image />
              ) : (
                plugin.coverImage && (
                  <div className={s.cover}>
                    <img alt="Preview" src={plugin.coverImage.url} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
