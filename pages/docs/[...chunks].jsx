import cn from 'classnames';
import ActiveLink from 'components/ActiveLink';
import DocPageContent from 'components/DocPageContent';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import MarketplaceCard from 'components/MarketplaceCard';
import Space from 'components/Space';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isHeading } from 'datocms-structured-text-utils';
import {
  gqlStaticPaths,
  handleErrors,
  imageFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import s from 'pages/docs/pageStyle.module.css';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { fetchPluginSdkHooks } from 'utils/fetchPluginSdk';
import fetchReactUiExamples from 'utils/fetchReactUiExamples';
import filter from 'utils/filterNodes';
import slugify from 'utils/slugify';
import {
  changeImageWithGeneratedDoc,
  changeTitle,
} from 'utils/tweakSeoMetaTags';
import { useQuerySubscription } from 'utils/useQuerySubscription';

export const getStaticPaths = gqlStaticPaths(
  /* GraphQL */ `
    {
      roots: allDocGroups(first: 100, filter: { parent: { exists: false } }) {
        slug
        children {
          slug
          pages {
            __typename
            ... on DocGroupPageRecord {
              page {
                slug
              }
            }
            ... on DocGroupSectionRecord {
              pages {
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
                    !['filtering-records', 'filtering-uploads'].includes(
                      page.page.slug,
                    ),
                )
              : sub.slug === 'structured-text'
                ? sub.pages.filter((page) => page.page.slug !== 'dast')
                : sub.pages
            )
              .flatMap((pageOrSection) => {
                if (pageOrSection.__typename === 'DocGroupPageRecord') {
                  return pageOrSection;
                }
                return pageOrSection.pages;
              })
              .map((page) =>
                page.page.slug === 'index'
                  ? [sub.slug]
                  : [sub.slug, page.page.slug],
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

export const getStaticProps = handleErrors(
  async ({ params: { chunks: rawChunks }, preview }) => {
    const chunks = rawChunks.flatMap((chunk) => chunk.split(/\//g));
    const groupSlug =
      chunks.length >= 2 ? chunks[chunks.length - 2] : chunks[0];
    const pageSlug = chunks.length >= 2 ? chunks[chunks.length - 1] : 'index';

    const {
      data: { docGroup },
    } = await request({
      query: /* GraphQL */ `
        query($groupSlug: String!) {
          docGroup(filter: { slug: { eq: $groupSlug } }) {
            name
            slug
            pages {
              __typename
              ... on DocGroupPageRecord {
                page {
                  id
                  title
                  slug
                }
              }
              ... on DocGroupSectionRecord {
                title
                pages {
                  page {
                    id
                    title
                    slug
                  }
                }
              }
            }
            techStarterKit {
              id
              name
              cmsDescription
              code
              starterType
              badge {
                name
                emoji
              }
              label
              githubRepo
              technology {
                name
                logo {
                  url
                }
                squareLogo {
                  url
                }
              }
              screenshot {
                responsiveImage(
                  imgixParams: { auto: format, w: 600, h: 400, fit: crop }
                ) {
                  ...imageFields
                }
              }
            }
          }
        }

        ${imageFields}
      `,
      variables: { groupSlug },
      preview,
    });

    if (!docGroup) {
      return { notFound: true };
    }

    const allPages = docGroup?.pages.flatMap((pageOrSection) => {
      if (pageOrSection.__typename === 'DocGroupPageRecord') {
        return pageOrSection;
      }
      return pageOrSection.pages;
    });

    const page = allPages?.find((page) => page.page.slug === pageSlug);

    if (!page) {
      return { notFound: true };
    }

    const pageId = page.page.id;

    const gqlPageRequest = {
      query: /* GraphQL */ `
        query ($pageId: ItemId!) {
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
                  frameless
                  image {
                    format
                    width
                    responsiveImage(imgixParams: { auto: format, w: 1000 }) {
                      ...imageFields
                    }
                    zoomableResponsiveImage: responsiveImage(
                      imgixParams: { auto: format, w: 1500, fit: max }
                    ) {
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
                ... on TableRecord {
                  id
                  _modelApiKey
                  table
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
                        imgixParams: {
                          auto: format
                          w: 450
                          h: 350
                          fit: crop
                          crop: top
                        }
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
                        imgixParams: {
                          auto: format
                          w: 300
                          h: 200
                          fit: crop
                          crop: top
                        }
                      ) {
                        ...imageFields
                      }
                    }
                  }
                }
                ... on InternalVideoRecord {
                  id
                  _modelApiKey
                  thumbTimeSeconds
                  video {
                    title
                    width
                    height
                    blurUpThumb
                    video {
                      playbackId: muxPlaybackId
                    }
                  }
                }
                ... on GraphiqlEditorRecord {
                  id
                  _modelApiKey
                  query
                }
                ... on CloneButtonFormRecord {
                  id
                  _modelApiKey
                }
                ... on DeployButtonFormRecord {
                  id
                  _modelApiKey
                }
                ... on PluginSdkHookGroupRecord {
                  id
                  _modelApiKey
                  groupName
                }
                ... on DocCalloutRecord {
                  id
                  _modelApiKey
                  calloutType
                  title
                  text {
                    value
                  }
                }
                ... on ReactUiLiveExampleRecord {
                  id
                  _modelApiKey
                  componentName
                }
                ... on TutorialVideoRecord {
                  id
                  _modelApiKey
                  tutorials {
                    ... on RecordInterface {
                      id
                      _modelApiKey
                    }
                    ... on RecordInterface {
                      id
                      _modelApiKey
                    }
                    ... on UserGuidesVideoRecord {
                      title
                      slug
                      thumbTimeSeconds
                      video {
                        video {
                          thumbnailUrl
                          blurUpThumb
                          width
                          height
                        }
                      }
                      chapters: _allReferencingUserGuidesChapters {
                        slug
                      }
                    }
                    ... on VideoTutorialRecord {
                      id
                      title
                      res: videoTutorialResource {
                        ... on OtherVideoResourceRecord {
                          _modelApiKey
                          url
                          coverImage {
                            responsiveImage(
                              imgixParams: {
                                auto: format
                                w: 300
                                ar: "4:3"
                                fit: crop
                              }
                            ) {
                              ...imageFields
                            }
                          }
                        }
                        ... on YoutubeVideoResourceRecord {
                          _modelApiKey
                          video {
                            url
                            thumbnailUrl
                            providerUid
                          }
                        }
                      }
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
    };
    const { data } = await request(gqlPageRequest);

    if (!data.page) {
      return { notFound: true };
    }

    const additionalData = {};

    const interestingHookGroups = data.page.content.blocks
      .filter((block) => block._modelApiKey === 'plugin_sdk_hook_group')
      .map((block) => block.groupName);

    if (interestingHookGroups.length > 0) {
      const allHooks = await fetchPluginSdkHooks();

      additionalData.pluginSdkHooks = allHooks.filter((hook) =>
        interestingHookGroups.some((interestingHookGroup) =>
          hook.groups.includes(interestingHookGroup),
        ),
      );
    }

    if (
      data.page.content.blocks.some(
        (block) => block._modelApiKey === 'react_ui_live_example',
      )
    ) {
      additionalData.allReactUiExamples = await fetchReactUiExamples();
    }

    return {
      props: {
        docGroup,
        pageSubscription: preview
          ? {
              ...gqlPageRequest,
              token: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
              enabled: true,
              initialData: data,
            }
          : { enabled: false, initialData: data },
        additionalData,
        preview: preview ? true : false,
      },
    };
  },
);

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

export const Sidebar = ({ title, entries, techStarterKit }) => {
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

      {techStarterKit && (
        <Space top={1}>
          <MarketplaceCard
            size="micro"
            href={`/marketplace/starters/${techStarterKit.code}`}
            technology={
              techStarterKit.technology.squareLogo ||
              techStarterKit.technology.logo
            }
            text={{
              title: techStarterKit.name,
              description: (
                <>
                  Words are nice... but code speaks louder. Dive into a fully
                  commented project template, showcasing these techniques (and
                  more) in action.
                </>
              ),
            }}
            badge={techStarterKit.badge}
            label={techStarterKit.label}
          />
        </Space>
      )}
    </>
  );
};

/**
 * For pages with plugin hooks, this is the name of the anchor link in the sidebar and in-page anchor.
 * @type {string}
 */
export const FUNCTIONS_REFERENCE_ANCHOR_NAME = 'function-reference';

export function Toc({ content, extraEntries: extra, pluginSdkHooks = [] }) {
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

  const extraEntries = extra?.map(({ anchor, label }) => (
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
                  <StructuredText data={node}/>
                </div>
            ))}
            {extraEntries}
            {
              // If a plugin page, also make TOC entries for each function
              !!pluginSdkHooks?.length && <>
              <br/>
              <div className={s.tocTitle}>Function Reference</div>
              <div className={s.tocEntry}>
                {pluginSdkHooks.map((hook, key) => (
                    <div className={s.tocEntry} key={key}>
                      <a href={`#${hook.name}`} className={s.tocEntry}>
                        <code>{
                          // Add zero-width spaces to camelCase function names so they can wrap at word boundaries
                          hook.name.replace(/([a-z])([A-Z])/g, "$1\u200B$2")
                        }()</code>
                      </a>
                    </div>
                ))}
              </div>
            </>
            }
          </div>
        </div>
      </div>
    </div>
  ) : (
      <div className={s.emptySidebar}/>
  );
}

export default function DocPage({
  docGroup,
  pageSubscription,
  preview,
  additionalData,
}) {
  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;
  const pageTitle = page.title;
  const defaultSeoTitle = `${pageTitle}${
    docGroup ? ` — ${docGroup.name}` : ''
  } — DatoCMS`;

  const seo = changeImageWithGeneratedDoc(
    changeTitle(page._seoMetaTags, defaultSeoTitle),
    page.title,
    docGroup ? docGroup.name : undefined,
  );

  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            techStarterKit={docGroup.techStarterKit}
            entries={
              docGroup.pages.length > 1
                ? docGroup.pages.map((pageOrSection) => {
                    const pageToEntry = (page) => ({
                      url: `/docs/${docGroup.slug}${
                        page.page.slug === 'index' ? '' : `/${page.page.slug}`
                      }`,
                      label: page.page.title,
                    });

                    if (pageOrSection.__typename === 'DocGroupPageRecord') {
                      return pageToEntry(pageOrSection);
                    }

                    const section = pageOrSection;

                    return {
                      label: section.title,
                      children: section.pages.map(pageToEntry),
                    };
                  })
                : page.content &&
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
      <Head>{renderMetaTags(seo)}</Head>
      <div className={s.articleContainer}>
        {docGroup && docGroup.pages.length > 1 && (
          <Toc content={page.content} pluginSdkHooks={additionalData?.pluginSdkHooks}/>
        )}
        <div className={s.article}>
          <h1 className={s.kicker}>{`${
              docGroup && `${docGroup.name} > `
          }${pageTitle}`}</h1>
          <div className={s.title}>{pageTitle}</div>
          <DocPageContent
              additionalData={additionalData}
              content={page.content}
              style={s}
              defaultAltForImages={defaultSeoTitle}
          />
        </div>
      </div>
    </DocsLayout>
  );
}
