import { SitemapStream, streamToPromise } from 'sitemap';
import gql from 'graphql-tag';
import { request } from './datocms';
import { range } from 'range';
import fetchCma from '../utils/fetchCma';
import { parse } from 'flatted/cjs';

export const CHANGELOG_POSTS_PER_PAGE = 10;
export const BLOG_POSTS_PER_PAGE = 16;
export const PLUGINS_PER_PAGE = 100;

const staticRoutes = [
  '/',
  '/blog',
  '/company/about',
  '/company/brand-assets',
  '/contact',
  '/docs',
  '/enterprise',
  '/features/dynamic-layouts',
  '/features/graphql-content-api',
  '/features/images-api',
  '/features/multi-language',
  '/features/video-streaming-encoding',
  '/features/worldwide-cdn',
  '/legal/cookie-policy',
  '/legal/gdpr',
  '/legal/privacy-policy',
  '/legal/security',
  '/legal/terms',
  '/product-updates',
  '/slack',
  '/support',
  '/team/content-creators',
  '/team/developers',
  '/team/digital-marketers',
  '/marketplace',
];

export default async function generateSitemap() {
  let routes = [...staticRoutes];

  // /cms/[slug]
  const {
    data: { landingPages },
  } = await request({
    query: gql`
      {
        landingPages: allLandingPages(first: 15) {
          slug
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...landingPages.map(landingPage => `/cms/${landingPage.slug}`),
  ];

  // /plugins/i/[...chunks]
  const {
    data: { plugins },
  } = await request({
    query: gql`
      {
        plugins: allPlugins(orderBy: installs_DESC, first: 100) {
          packageName
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...plugins.map(plugin => `/plugins/i/${plugin.packageName}`),
  ];

  // /plugins/p/[page]
  const {
    data: {
      meta: { count: pluginsCount },
    },
  } = await request({
    query: gql`
      {
        meta: _allPluginsMeta {
          count
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...range(1, Math.ceil(pluginsCount / parseFloat(PLUGINS_PER_PAGE))).map(
      p => `/marketplace/plugins/p/${p}`,
    ),
  ];

  // /docs/content-management-api/resources/[resource]
  const cma = await fetchCma();
  const { toc } = parse(cma);

  routes = [
    ...routes,
    ...toc.map(({ slug }) => `/docs/content-management-api/resources/${slug}`),
  ];

  // /docs/[...chunks]
  const {
    data: { docGroups },
  } = await request({
    query: gql`
      {
        docGroups: allDocGroups(filter: { parent: { exists: false } }) {
          slug
          children {
            name
            slug
            pages {
              slugOverride
              page {
                slug
              }
            }
          }
        }
      }
    `,
  });

  routes = [
    ...routes,
    ...docGroups
      .map(root =>
        root.children.map(sub =>
          sub.pages.map(page =>
            (page.slugOverride || page.page.slug) === 'index'
              ? [sub.slug]
              : [sub.slug, page.slugOverride || page.page.slug],
          ),
        ),
      )
      .flat(2)
      .map(chunks => `/docs/${chunks.join('/')}`),
  ];

  // /blog/p/[page]
  const {
    data: {
      meta: { count: blogPostCount },
    },
  } = await request({
    query: gql`
      {
        meta: _allBlogPostsMeta {
          count
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...range(1, Math.ceil(blogPostCount / parseFloat(BLOG_POSTS_PER_PAGE))).map(
      p => `/blog/p/${p}`,
    ),
  ];

  // /blog/[slug]
  const {
    data: { blogPosts },
  } = await request({
    query: gql`
      {
        blogPosts: allBlogPosts(first: 100) {
          slug
        }
      }
    `,
  });
  routes = [...routes, ...blogPosts.map(blogPost => `/blog/${blogPost.slug}`)];

  // /customers/[slug]
  const {
    data: { successStories },
  } = await request({
    query: gql`
      {
        successStories: allSuccessStories(first: 100) {
          slug
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...successStories.map(blogPost => `/customers/${blogPost.slug}`),
  ];

  // /product-updates/p/[page]
  const {
    data: {
      meta: { count: changelogEntryCount },
    },
  } = await request({
    query: gql`
      {
        meta: _allChangelogEntriesMeta {
          count
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...range(
      1,
      Math.ceil(changelogEntryCount / parseFloat(CHANGELOG_POSTS_PER_PAGE)),
    ).map(p => `/product-updates/p/${p}`),
  ];

  // /product-updates/[slug]
  const {
    data: { changelogEntries },
  } = await request({
    query: gql`
      {
        changelogEntries: allChangelogEntries(first: 100) {
          slug
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...changelogEntries.map(blogPost => `/product-updates/${blogPost.slug}`),
  ];

  const sitemap = new SitemapStream({ hostname: 'https://www.datocms.com' });
  routes.forEach(route => sitemap.write(route));
  sitemap.end();

  const sm = await streamToPromise(sitemap);
  return sm.toString();
}
