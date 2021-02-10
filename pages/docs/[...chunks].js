import { request, seoMetaTagsFields, imageFields } from 'lib/datocms';
import { renderMetaTags, StructuredText } from 'react-datocms';
import { gqlStaticPaths } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import Link from 'next/link';
import ActiveLink from 'components/ActiveLink';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';
import slugify from 'utils/slugify';
import s from 'pages/docs/pageStyle.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Line } from 'components/FakeContent';
import cn from 'classnames';
import filter from 'utils/filterNodes';
import { isHeading } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';

export const getStaticPaths = gqlStaticPaths(
  `
    {
      roots: allDocGroups(first: 100, filter: { parent: { exists: false } }) {
        slug
        children {
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
  'chunks',
  ({ roots }) => {
    const results = roots
      .map((root) =>
        root.children
          .filter((c) => c.slug !== 'content-management-api')
          .map((sub) =>
            (sub.slug === 'content-delivery-api'
              ? sub.pages.filter(
                  (page) =>
                    (page.slugOverride || page.page.slug) !==
                    'filtering-records',
                )
              : sub.slug === 'structured-text'
              ? sub.pages.filter(
                  (page) => (page.slugOverride || page.page.slug) !== 'dast',
                )
              : sub.pages
            )
              .map((page) =>
                (page.slugOverride || page.page.slug) === 'index'
                  ? [sub.slug]
                  : [sub.slug, page.slugOverride || page.page.slug],
              )
              // .slice() only pre-renders the first 2 sub-pages for each section
              // remove it if you want to pre-render all the pages
              .slice(0, 2),
          ),
      )
      .flat(2);

    return results;
  },
);

export const getStaticProps = async function ({
  params: { chunks: rawChunks },
  preview,
}) {
  const chunks = rawChunks.map((chunk) => chunk.split(/\//g)).flat();
  const groupSlug = chunks.length >= 2 ? chunks[chunks.length - 2] : chunks[0];
  const pageSlug = chunks.length >= 2 ? chunks[chunks.length - 1] : 'index';

  const {
    data: { docGroup },
  } = await request({
    query: `
      query($groupSlug: String!) {
        docGroup(filter: { slug: { eq: $groupSlug } }) {
          name
          slug
          pages {
            titleOverride
            slugOverride
            page {
              id
              title
              slug
            }
          }
        }
      }
    `,
    variables: { groupSlug },
    preview,
  });

  const page =
    docGroup &&
    docGroup.pages.find(
      (page) => (page.slugOverride || page.page.slug) === pageSlug,
    );
  const titleOverride = page ? page.titleOverride : null;
  const pageId = page && page.page.id;

  let pageData = null;

  if (pageId) {
    const { data } = await request({
      query: `
        query($pageId: ItemId!) {
          page: docPage(filter: { id: { eq: $pageId } }) {
            title
            _seoMetaTags {
              ...seoMetaTagsFields
            }
            content {
              value
              blocks {
                ... on ImageRecord {
                  id
                  _modelApiKey
                  image {
                    format
                    width
                    responsiveImage(imgixParams: { w: 1000 }) {
                      ...imageFields
                    }
                    url
                  }
                }
                ... on VideoRecord {
                  id
                  _modelApiKey
                  video {
                    url
                    title
                    provider
                    width
                    height
                    providerUid
                  }
                }
                ... on DemoRecord {
                  id
                  _modelApiKey
                  demo {
                    id
                    name
                    code
                    githubRepo
                    technology {
                      name
                      logo {
                        url
                      }
                    }
                    screenshot {
                      responsiveImage(
                        imgixParams: { w: 450, h: 350, fit: crop, crop: top }
                      ) {
                        ...imageFields
                      }
                    }
                  }
                }
                ... on MultipleDemosBlockRecord {
                  id
                  _modelApiKey
                  demos {
                    id
                    name
                    code
                    technology {
                      name
                      logo {
                        url
                      }
                    }
                    screenshot {
                      responsiveImage(
                        imgixParams: { w: 300, h: 200, fit: crop, crop: top }
                      ) {
                        ...imageFields
                      }
                    }
                  }
                }
                ... on InternalVideoRecord {
                  id
                  _modelApiKey
                  autoplay
                  loop
                  thumbTimeSeconds
                  video {
                    title
                    width
                    height
                    video {
                      duration
                      streamingUrl
                      thumbnailUrl
                    }
                  }
                }
              }
            }
          }
        }

        ${seoMetaTagsFields}
        ${imageFields}
      `,
      variables: { pageId },
      preview,
    });

    pageData = data.page;
  }

  return {
    props: {
      docGroup,
      titleOverride,
      page: pageData,
      preview: preview ? true : false,
    },
  };
};

const SidebarEntry = ({ url, level, label, children }) => {
  if (!url && level === 0) {
    return (
      <>
        <div className={s.subgroupName}>{label}</div>
        {children && children.length > 0 && (
          <div className={cn(s.pageChildren, s[`pageChildrenLevel${level}`])}>
            {children.map((entry) => (
              <SidebarEntry key={entry.url} level={level + 1} {...entry} />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      {url ? (
        <ActiveLink href={url} activeClassName={s.activePage}>
          <a className={cn(s.page, s[`page-level${level}`])}>{label}</a>
        </ActiveLink>
      ) : (
        <span className={cn(s.page, s[`page-level${level}`])}>{label}</span>
      )}
      {children && children.length > 0 && (
        <div className={cn(s.pageChildren, s[`pageChildrenLevel${level}`])}>
          {children.map((entry) => (
            <SidebarEntry key={entry.url} level={level + 1} {...entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ title, entries }) => {
  return (
    <>
      <Link href="/docs">
        <a className={s.backHome}>
          <LeftIcon /> Home
        </a>
      </Link>

      <div className={s.groupName}>{title}</div>

      {entries.map((entry) => (
        <SidebarEntry key={entry.label} level={0} {...entry} />
      ))}

      <div style={{ height: '80px' }} />
    </>
  );
};

export function Toc({ content, extraEntries: extra }) {
  const nodes =
    content &&
    filter(content.value.document, isHeading).map((heading) => {
      const slug = slugify(toPlainText(heading));
      return {
        type: 'link',
        url: `#${slug}`,
        children: heading.children,
      };
    });

  const extraEntries =
    extra &&
    extra.map(({ anchor, label }) => (
      <div className={s.tocEntry} key={anchor}>
        <a href={`#${anchor}`} className={s.tocEntry}>
          {label}
        </a>
      </div>
    ));

  return (nodes && nodes.length > 0) ||
    (extraEntries && extraEntries.length > 0) ? (
    <div className={s.sidebar} data-datocms-noindex>
      <div className={s.toc}>
        <div className={s.tocInner}>
          <div className={s.tocTitle}>In this page</div>
          <div className={s.entries}>
            {nodes.map((node) => (
              <div className={s.tocEntry} key={node.url}>
                <StructuredText data={node} />
              </div>
            ))}
            {extraEntries}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default function DocPage({ docGroup, titleOverride, page, preview }) {
  const { isFallback } = useRouter();

  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            entries={
              docGroup && docGroup.pages.length > 1
                ? docGroup.pages.map((page) => {
                    return {
                      url: `/docs/${docGroup.slug}${
                        (page.slugOverride || page.page.slug) === 'index'
                          ? ''
                          : `/${page.slugOverride || page.page.slug}`
                      }`,
                      label: page.titleOverride || page.page.title,
                    };
                  })
                : page &&
                  page.content &&
                  filter(page.content.value.document, isHeading).map(
                    (heading) => {
                      const innerText = toPlainText(heading);

                      return {
                        url: `#${slugify(innerText)}`,
                        label: innerText,
                      };
                    },
                  )
            }
          />
        )
      }
    >
      <Head>{!isFallback && page && renderMetaTags(page._seoMetaTags)}</Head>
      <div className={s.articleContainer}>
        {docGroup && docGroup.pages.length > 1 && (
          <Toc content={page && page.content} />
        )}
        <div className={s.article}>
          <div className={s.title}>
            {isFallback ? <Line /> : titleOverride || (page && page.title)}
          </div>
          <PostContent
            isFallback={isFallback}
            content={page && page.content}
            style={s}
          />
        </div>
      </div>
    </DocsLayout>
  );
}
