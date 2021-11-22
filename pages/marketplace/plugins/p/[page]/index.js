import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image as DatoImage } from 'react-datocms';
import { PLUGINS_PER_PAGE } from 'lib/pages';
import Head from 'components/Head';
import { renderMetaTags } from 'react-datocms';
import Paginator from 'components/Paginator';
import { range } from 'range';
import { useRouter } from 'next/router';
import s from './style.module.css';
import truncate from 'truncate';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
import { useDebounce } from 'use-debounce';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
    }
  `,
  'page',
  ({ meta }) => range(1, Math.ceil(meta.count / parseFloat(PLUGINS_PER_PAGE))),
);

export const getStaticProps = gqlStaticProps(
  `
    query($first: IntType!, $skip: IntType!) {
      pluginsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      plugins: allPlugins(
        first: $first
        skip: $skip
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: false } }
      ) {
        id
        title
        description
        releasedAt
        packageName
        coverImage {
          responsiveImage(imgixParams: { w: 600, h: 400, fit: crop }) {
            ...imageFields
          }
        }
      }

      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    paramsToVars: ({ page }) => ({
      first: PLUGINS_PER_PAGE,
      skip: PLUGINS_PER_PAGE * parseInt(page),
    }),
    requiredKeys: ['pluginsPage', 'plugins'],
  },
);

export default function Plugins({ plugins, preview, meta, pluginsPage }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    new URLSearchParams(router.asPath.split('?')[1]).get('s') || '',
  );
  const cache = useRef({});
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(plugins);

  const generateUrl = useCallback(
    (url, additionalParams = {}) => {
      const params = new URLSearchParams(router.asPath.split('?')[1]);
      Object.entries(additionalParams).forEach(([k, v]) => {
        params.set(k, v);
      });
      if (params.toString()) {
        return `${url}?${params.toString()}`;
      }
      return url;
    },
    [router.asPath],
  );

  useEffect(() => {
    if (
      (new URLSearchParams(router.asPath.split('?')[1]).get('s') || '') !==
      debouncedSearchTerm
    ) {
      router.push(
        generateUrl(`/marketplace/plugins`, { s: debouncedSearchTerm }),
        null,
        { shallow: true },
      );
    }

    if (!debouncedSearchTerm) {
      setSearchResults(plugins);
      return;
    }

    let aborted = false;

    if (!cache.current[debouncedSearchTerm]) {
      setIsLoading(true);
      setSearchResults([]);

      cache.current[debouncedSearchTerm] = fetch(
        `/api/plugins/search?term=${encodeURIComponent(debouncedSearchTerm)}`,
      ).then((res) => res.json());
    }

    cache.current[debouncedSearchTerm].then((newSearchResults) => {
      if (!aborted) {
        setSearchResults(newSearchResults);
        setIsLoading(false);
      }
    });

    return () => {
      aborted = true;
    };
  }, [
    router,
    debouncedSearchTerm,
    plugins,
    setIsLoading,
    setSearchResults,
    generateUrl,
  ]);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(pluginsPage.seo)}</Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Community Plugins</div>
          <div className={s.heroDesc}>
            Easily expand and customize the capabilities of DatoCMS with
            community plugins
          </div>
        </div>
        <div className={s.search}>
          <input
            className={s.searchInput}
            placeholder="Search plugins..."
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {searchTerm ? (
          <>
            {isLoading ? (
              <div className={s.loading}>Loading results...</div>
            ) : searchResults.length === 0 ? (
              <div className={s.noResults}>
                No results found... try broaden your search!
              </div>
            ) : (
              <div className={s.grid}>
                {searchResults.map((post) => (
                  <PluginBox
                    key={post.packageName}
                    title={post.title}
                    href={generateUrl(
                      `/marketplace/plugins/i/${post.packageName}`,
                    )}
                    image={
                      post.coverImage && post.coverImage.responsiveImage ? (
                        <DatoImage
                          className={s.image}
                          data={post.coverImage.responsiveImage}
                        />
                      ) : (
                        <PluginImagePlacehoder hash={post.packageName} />
                      )
                    }
                    description={truncate(post.description, 120)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={s.grid}>
              {plugins.map((post) => (
                <PluginBox
                  key={post.packageName}
                  title={post.title}
                  href={generateUrl(
                    `/marketplace/plugins/i/${post.packageName}`,
                  )}
                  image={
                    post.coverImage && post.coverImage.responsiveImage ? (
                      <DatoImage
                        className={s.image}
                        data={post.coverImage.responsiveImage}
                      />
                    ) : (
                      <PluginImagePlacehoder hash={post.packageName} />
                    )
                  }
                  description={truncate(post.description, 120)}
                />
              ))}
            </div>
            <Paginator
              perPage={PLUGINS_PER_PAGE}
              currentPage={router.query ? parseInt(router.query.page) : 0}
              totalEntries={meta.count}
              href={(index) =>
                index === 0
                  ? '/marketplace/plugins'
                  : `/marketplace/plugins/p/${index}`
              }
            />
          </>
        )}
      </Wrapper>
    </Layout>
  );
}
