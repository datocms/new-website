import { parse } from 'flatted';
import { range } from 'range';
import fetchCma from '../utils/fetchCma';
import { request } from './datocms';
import {
  BLOG_POSTS_PER_PAGE,
  CHANGELOG_POSTS_PER_PAGE,
  PLUGINS_PER_PAGE,
} from './pages';

export const sitemapSlugs = [
  'sitemap-blog',
  'sitemap-docs',
  'sitemap-partners',
  'sitemap-product-updates',
  'sitemap-static',
  'sitemap-marketplace',
  'sitemap-academy',
  'sitemap-compare',
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
  '/glossary',
  '/customers',
  '/legal/cookie-policy',
  '/legal/gdpr',
  '/legal/privacy-policy',
  '/security',
  '/legal/terms',
  '/product-updates',
  '/partners',
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
  '/academy',
].concat(sitemapSlugs.map((slug) => `/internal/${slug}`));

export const staticRoutesToIndex = async () => {
  const staticRoutesToIndex = allStaticRoutes.filter((route) => {
    return !(
      route.includes('/legal/') ||
      route === '/support' ||
      route === '/contact' ||
      route === '/slack'
    );
  });

  return [...staticRoutesToIndex, ...(await staticGeneratorsRoutes())];
};

export const staticGeneratorsRoutes = async () => {
  // /cms/[slug]
  const {
    data: { landingPages },
  } = await request({
    query: /* GraphQL */ `
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
    query: /* GraphQL */ `
      {
        successStories: allSuccessStories(first: 100) {
          slug
        }
      }
    `,
  });

  return successStories.map((page) => `/customers/${page.slug}`);
};

export const partnerRoutes = async () => {
  // /partners/[slug]
  const {
    data: { partners },
  } = await request({
    query: /* GraphQL */ `
      {
        partners: allPartners(first: 100) {
          slug
        }
      }
    `,
  });

  const partnerPages = partners.map((partner) => `/partners/${partner.slug}`);

  // /partners/[slug]/showcase/[slug]
  const {
    data: { projects },
  } = await request({
    query: /* GraphQL */ `
      {
        projects: allShowcaseProjects(
          first: 100
          orderBy: _firstPublishedAt_DESC
        ) {
          slug
          partner {
            slug
          }
        }
      }
    `,
  });

  return [
    ...partnerPages,
    ...projects.map(
      (project) => `/partners/${project.partner.slug}/showcase/${project.slug}`,
    ),
  ];
};

export const marketplaceRoutes = async () => {
  let routes = [];

  // /marketplace/enterprise/[slug]
  const {
    data: { enterpriseApps },
  } = await request({
    query: /* GraphQL */ `
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
    query: /* GraphQL */ `
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
    query: /* GraphQL */ `
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
    query: /* GraphQL */ `
      {
        meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
          count
        }
      }
    `,
  });
  routes = [
    ...routes,
    ...range(
      1,
      Math.ceil(pluginsCount / Number.parseFloat(PLUGINS_PER_PAGE)),
    ).map((p) => `/marketplace/plugins/browse/p/${p}`),
  ];

  // /marketplace/starters/[slug]
  const {
    data: { starters },
  } = await request({
    query: /* GraphQL */ `
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

export const productUpdatesRoutes = async () => {
  // /product-updates/p/[page]
  const {
    data: {
      meta: { count: changelogEntryCount },
    },
  } = await request({
    query: /* GraphQL */ `
      {
        meta: _allChangelogEntriesMeta {
          count
        }
      }
    `,
  });

  const pageRoutes = range(
    1,
    Math.ceil(
      changelogEntryCount / Number.parseFloat(CHANGELOG_POSTS_PER_PAGE),
    ),
  ).map((p) => `/product-updates/p/${p}`);

  // /product-updates/[slug]
  const {
    data: { changelogEntries },
  } = await request({
    query: /* GraphQL */ `
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

  const cmaResourceRoutes = toc.flatMap(({ children }) => {
    const cmaResourcesUrls = children.map(({ url }) => url);
    const cmaResChildren = children.map(({ children }) =>
      children.map(({ url }) => url),
    );

    return [...cmaResourcesUrls, ...cmaResChildren].flat();
  });

  // /docs/[...chunks]
  const {
    data: { docGroups },
  } = await request({
    query: /* GraphQL */ `
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
            .flatMap((pageOrSection) => {
              if (pageOrSection.__typename === 'DocGroupPageRecord') {
                return pageOrSection;
              }
              return pageOrSection.pages;
            })
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
    query: /* GraphQL */ `
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
    query: /* GraphQL */ `
      {
        blogPosts: allBlogPosts(first: 100) {
          slug
        }
      }
    `,
  });

  return [
    '/blog',
    ...range(
      1,
      Math.ceil(blogPostCount / Number.parseFloat(BLOG_POSTS_PER_PAGE)),
    ).map((p) => `/blog/p/${p}`),
    ...blogPosts.map((blogPost) => `/blog/${blogPost.slug}`),
  ];
};

export const academyRoutes = async () => {
  // /academy/[course]/[chapter]
  const {
    data: { courses },
  } = await request({
    query: /* GraphQL */ `
      {
        courses: allAcademyCourses {
          slug
          chapters {
            slug
          }
        }
      }
    `,
  });

  return courses.flatMap((course) =>
    course.chapters.map((chapter) => `/academy/${course.slug}/${chapter.slug}`),
  );
};

export const compareRoutes = async () => {
  // /compare/[slug]
  const {
    data: { productComparisons },
  } = await request({
    query: /* GraphQL */ `
      query {
        productComparisons: allProductComparisons(first: 100) {
          slug
        }
      }
    `,
  });

  return productComparisons.map(
    (productComparison) => `/compare/${productComparison.slug}`,
  );
};
