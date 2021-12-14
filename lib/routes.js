import fetchCma from '../utils/fetchCma';
import { range } from 'range';
import { request } from './datocms';
import { parse } from 'flatted';
import {
  CHANGELOG_POSTS_PER_PAGE,
  BLOG_POSTS_PER_PAGE,
  PLUGINS_PER_PAGE,
} from './pages';

export const sitemapSlugs = [
  'sitemap-blog',
  'sitemap-docs',
  'sitemap-product-updates',
  'sitemap-static',
  'sitemap-marketplace',
];

export const allStaticRoutes = [
  '/',
  '/blog',
  '/company/about',
  '/company/brand-assets',
  '/contact',
  '/docs',
  '/features/dynamic-layouts',
  '/features/headless-cms-graphql',
  '/features/images-api',
  '/features/headless-cms-multi-language',
  '/features/video-api',
  '/features/worldwide-cdn',
  '/features/data-integrity',
  '/features/workflow-cms',
  '/features/real-time-api',
  '/features/structured-content-cms',
  '/customers',
  '/legal/cookie-policy',
  '/legal/gdpr',
  '/legal/privacy-policy',
  '/legal/security',
  '/legal/terms',
  '/product-updates',
  // '/partners',
  '/slack',
  '/pricing',
  '/support',
  '/enterprise-headless-cms',
  '/team/content-creators',
  '/team/best-cms-for-developers',
  '/team/cms-digital-marketing',
  '/marketplace',
  '/marketplace/plugins',
  '/marketplace/starters',
  '/marketplace/hosting',
  '/marketplace/enterprise',
].concat(sitemapSlugs.map((slug) => `/internal/${slug}`));

export const staticRoutesToIndex = async () => {
  const staticRoutesToIndex = allStaticRoutes.filter((route) => {
    return !(
      route.includes('/legal/') ||
      route === '/support' ||
      route === '/contact' ||
      route === '/slack' ||
      route.includes('/customers')
    );
  });

  return [...staticRoutesToIndex, ...(await staticGeneratorsRoutes())];
};

export const staticGeneratorsRoutes = async () => {
  // /cms/[slug]
  const {
    data: { landingPages },
  } = await request({
    query: `
        {
          landingPages: allLandingPages(first: 100) {
            slug
          }
        }
      `,
  });

  return landingPages.map((landingPage) => `/cms/${landingPage.slug}`);
};

export const customerRoutes = async () => {
  // /customers/[slug]
  const {
    data: { successStories },
  } = await request({
    query: `
      {
        successStories: allSuccessStories(first: 100) {
          slug
        }
      }
    `,
  });

  return successStories.map((page) => `/customers/${page.slug}`);
};

export const marketplaceRoutes = async () => {
  let routes = [];

  // /marketplace/enterprise/[slug]
  const {
    data: { enterpriseApps },
  } = await request({
    query: `
        {
          enterpriseApps: allEnterpriseApps(first: 100) {
            slug
          }
        }
      `,
  });
  routes = [
    ...routes,
    ...enterpriseApps.map((app) => `/marketplace/enterprise/${app.slug}`),
  ];

  // /marketplace/hosting/[slug]
  const {
    data: { hostingApps },
  } = await request({
    query: `
        {
          hostingApps: allHostingApps(first: 100) {
            slug
          }
        }
      `,
  });
  routes = [
    ...routes,
    ...hostingApps.map((app) => `/marketplace/hosting/${app.slug}`),
  ];

  // /marketplace/plugins/i/[...chunks]
  const {
    data: { plugins },
  } = await request({
    query: `
        {
          plugins: allPlugins(
            first: 100
            filter: { manuallyDeprecated: { eq: false } }
          ) {
            packageName
          }
        }
      `,
  });
  routes = [
    ...routes,
    ...plugins.map((plugin) => `/marketplace/plugins/i/${plugin.packageName}`),
  ];

  // /marketplace/plugins/p/[page]
  const {
    data: {
      meta: { count: pluginsCount },
    },
  } = await request({
    query: `
        {
          meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
            count
          }
        }
      `,
  });
  routes = [
    ...routes,
    ...range(1, Math.ceil(pluginsCount / parseFloat(PLUGINS_PER_PAGE))).map(
      (p) => `/marketplace/plugins/p/${p}`,
    ),
  ];

  // /marketplace/starters/[slug]
  const {
    data: { starters },
  } = await request({
    query: `
        {
          starters: allTemplateDemos(first: 100) {
            code
          }
        }
      `,
  });
  routes = [
    ...routes,
    ...starters.map((demo) => `/marketplace/starters/${demo.code}`),
  ];

  return routes;
};

export const partnerRoutes = async () => {
  // /partners/[slug]
  const {
    data: { partners },
  } = await request({
    query: `
      {
        partners: allPartners(first: 100, filter: { hidden: { eq: false } }) {
          slug
        }
      }
    `,
  });

  const partnerPages = partners.map((partner) => `/partners/${partner.slug}`);

  // /partners/[slug]/projects/[slug]
  const {
    data: { projects },
  } = await request({
    query: `
      {
        projects: allShowcaseProjects(first: 100, orderBy: _firstPublishedAt_DESC, filter: { hidden: { eq: false } }) {
          slug
          partner { slug }
        }
      }
    `,
  });

  return [
    ...partnerPages,
    ...projects.map(
      (project) => `/partners/${project.partner.slug}/projects/${project.slug}`,
    ),
  ];
};

export const productUpdatesRoutes = async () => {
  // /product-updates/p/[page]
  const {
    data: {
      meta: { count: changelogEntryCount },
    },
  } = await request({
    query: `
      {
        meta: _allChangelogEntriesMeta {
          count
        }
      }
    `,
  });

  const pageRoutes = range(
    1,
    Math.ceil(changelogEntryCount / parseFloat(CHANGELOG_POSTS_PER_PAGE)),
  ).map((p) => `/product-updates/p/${p}`);

  // /product-updates/[slug]
  const {
    data: { changelogEntries },
  } = await request({
    query: `
      {
        changelogEntries: allChangelogEntries(first: 100) {
          slug
        }
      }
    `,
  });

  return [
    ...pageRoutes,
    ...changelogEntries.map((blogPost) => `/product-updates/${blogPost.slug}`),
  ];
};

export const docsRoutes = async () => {
  // /docs/content-management-api/resources/[resource]
  const cma = await fetchCma();
  const { toc } = parse(cma);

  const cmaResourceRoutes = toc
    .map(({ children }) => {
      const cmaResourcesUrls = children.map(({ url }) => url);
      const cmaResChildren = children.map(({ children }) =>
        children.map(({ url }) => url),
      );

      return [...cmaResourcesUrls, ...cmaResChildren].flat();
    })
    .flat();

  // /docs/[...chunks]
  const {
    data: { docGroups },
  } = await request({
    query: `
        {
          docGroups: allDocGroups(filter: { parent: { exists: false } }) {
            slug
            children {
              name
              slug
              pages {
                __typename
                ... on DocGroupPageRecord {
                  slugOverride
                  page {
                    slug
                  }
                }
                ... on DocGroupSectionRecord {
                  pages {
                    slugOverride
                    page {
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `,
  });

  return [
    ...cmaResourceRoutes,
    ...docGroups
      .map((root) =>
        root.children.map((sub) =>
          sub.pages
            .reduce((acc, pageOrSection) => {
              if (pageOrSection.__typename === 'DocGroupPageRecord') {
                return [...acc, pageOrSection];
              }
              return [...acc, ...pageOrSection.pages];
            }, [])
            .map((page) =>
              (page.slugOverride || page.page.slug) === 'index'
                ? [sub.slug]
                : [sub.slug, page.slugOverride || page.page.slug],
            ),
        ),
      )
      .flat(2)
      .map((chunks) => `/docs/${chunks.join('/')}`),
  ];
};

export const blogRoutes = async () => {
  // /blog/p/[page]
  const {
    data: {
      meta: { count: blogPostCount },
    },
  } = await request({
    query: `
      {
        meta: _allBlogPostsMeta {
          count
        }
      }
    `,
  });

  // /blog/[slug]
  const {
    data: { blogPosts },
  } = await request({
    query: `
      {
        blogPosts: allBlogPosts(first: 100) {
          slug
        }
      }
    `,
  });

  return [
    ...range(1, Math.ceil(blogPostCount / parseFloat(BLOG_POSTS_PER_PAGE))).map(
      (p) => `/blog/p/${p}`,
    ),
    ...blogPosts.map((blogPost) => `/blog/${blogPost.slug}`),
  ];
};
