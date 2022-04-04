import { Fragment } from 'react';
import { Image as DatoImage } from 'react-datocms';
import {
  request,
  seoMetaTagsFields,
  imageFields,
  handleErrors,
  gqlStaticPaths,
} from 'lib/datocms';
import {
  renderMetaTags,
  StructuredText,
  useQuerySubscription,
} from 'react-datocms';
import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import Link from 'next/link';
import ActiveLink from 'components/ActiveLink';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';
import InfoCircleIcon from 'public/icons/regular/info-circle.svg';
import slugify from 'utils/slugify';
import s from 'pages/docs/pageStyle.module.css';
import sharedStyle from 'pages/docs/style.module.css';
import Head from 'components/Head';
import cn from 'classnames';
import filter from 'utils/filterNodes';
import { isHeading } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { fetchPluginSdkHooks } from 'utils/fetchPluginSdk';
import fetchReactUiExamples from 'utils/fetchReactUiExamples';
import PluginSdkHook from 'components/PluginSdkHook';
import ReactUiExample from 'components/ReactUiExample';

export const getStaticPaths = gqlStaticPaths(
  `
    {
      roots: allDocGroups(first: 100, filter: { parent: { exists: false } }) {
        slug
        children {
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
                      page.slugOverride || page.page.slug,
                    ),
                )
              : sub.slug === 'structured-text'
              ? sub.pages.filter(
                  (page) => (page.slugOverride || page.page.slug) !== 'dast',
                )
              : sub.pages
            )
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

export const getStaticProps = handleErrors(async function ({
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
            __typename
            ... on DocGroupPageRecord {
              titleOverride
              slugOverride
              page {
                id
                title
                slug
              }
            }
            ... on DocGroupSectionRecord {
              title
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
        }
      }
    `,
    variables: { groupSlug },
    preview,
  });

  const allPages =
    docGroup &&
    docGroup.pages.reduce((acc, pageOrSection) => {
      if (pageOrSection.__typename === 'DocGroupPageRecord') {
        return [...acc, pageOrSection];
      }
      return [...acc, ...pageOrSection.pages];
    }, []);

  const page =
    allPages &&
    allPages.find((page) => (page.slugOverride || page.page.slug) === pageSlug);

  if (!page) {
    return { notFound: true };
  }

  const { titleOverride } = page;
  const pageId = page.page.id;

  const gqlPageRequest = {
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
                  zoomableResponsiveImage: responsiveImage(imgixParams: { w: 1500, fit: max }) {
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
                  id
                  title
                  res: videoTutorialResource {
                    ... on OtherVideoResourceRecord {
                      _modelApiKey
                      url
                      coverImage {
                        responsiveImage(imgixParams: { w: 300, ar: "4:3", fit: crop }) {
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
      titleOverride,
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
});

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

export default function DocPage({
  docGroup,
  titleOverride,
  pageSubscription,
  preview,
  additionalData,
}) {
  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;
  const pageTitle = titleOverride || (page && page.title);
  const defaultSeoTitle = `${
    docGroup ? `${docGroup.name} - ` : '-'
  }${pageTitle} - DatoCMS Docs`;

  let seo = [...page._seoMetaTags];

  if (
    page._seoMetaTags.find(
      // This is the Dato default title which is not descriptive enough for SEO
      (t) => t.tag === 'title' && t.content === `${pageTitle} - DatoCMS`,
    )
  ) {
    seo = [
      ...seo,
      {
        content: defaultSeoTitle,
        tag: 'title',
      },
    ];
  }

  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            entries={
              docGroup.pages.length > 1
                ? docGroup.pages.map((pageOrSection) => {
                    const pageToEntry = (page) => ({
                      url: `/docs/${docGroup.slug}${
                        (page.slugOverride || page.page.slug) === 'index'
                          ? ''
                          : `/${page.slugOverride || page.page.slug}`
                      }`,
                      label: page.titleOverride || page.page.title,
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
          <Toc content={page.content} />
        )}
        <div className={s.article}>
          <h1 className={s.kicker}>{`${
            docGroup && `${docGroup.name} > `
          }${pageTitle}`}</h1>
          <div className={s.title}>{pageTitle}</div>
          <PostContent
            content={page.content}
            style={s}
            defaultAltForImages={defaultSeoTitle}
            renderBlock={(block) => {
              switch (block._modelApiKey) {
                case 'plugin_sdk_hook_group': {
                  return (
                    <>
                      <hr />
                      {additionalData.pluginSdkHooks
                        .sort((a, b) => a.lineNumber - b.lineNumber)
                        .map((hook) => (
                          <PluginSdkHook key={hook.name} hook={hook} />
                        ))}
                    </>
                  );
                }
                case 'doc_callout': {
                  return (
                    <div
                      className={cn(
                        s.docCallout,
                        s[`docCallout--${block.calloutType}`],
                      )}
                    >
                      {block.title && (
                        <div className={s.docCalloutTitle}>
                          <InfoCircleIcon /> <span>{block.title}</span>
                        </div>
                      )}
                      <StructuredText data={block.text} />
                    </div>
                  );
                }
                case 'tutorial_video': {
                  return (
                    <>
                      <div className={sharedStyle.useCaseCards}>
                        {block.tutorials.map((tutorial) =>
                          tutorial.res[0]._modelApiKey ===
                          'youtube_video_resource' ? (
                            <a
                              href={tutorial.res[0].video.url}
                              key={tutorial.res[0].video.url}
                              className={sharedStyle.videoCard}
                            >
                              <div className={sharedStyle.videoCardCover}>
                                <img src={tutorial.res[0].video.thumbnailUrl} />
                              </div>
                              <div className={s.videoCardTitle}>
                                {tutorial.title}
                              </div>
                            </a>
                          ) : (
                            <a
                              href={tutorial.res[0].url}
                              key={tutorial.res[0].url}
                              className={sharedStyle.videoCard}
                            >
                              <div className={sharedStyle.videoCardCover}>
                                {tutorial.res[0].coverImage && (
                                  <DatoImage
                                    data={
                                      tutorial.res[0].coverImage.responsiveImage
                                    }
                                  />
                                )}
                              </div>
                              <div className={s.videoCardTitle}>
                                {tutorial.title}
                              </div>
                            </a>
                          ),
                        )}
                      </div>
                    </>
                  );
                }
                case 'react_ui_live_example': {
                  const examples = additionalData.allReactUiExamples.filter(
                    (e) => e.componentName === block.componentName,
                  );

                  return (
                    <>
                      {examples.map((example) => (
                        <Fragment key={example.title}>
                          <h2>{example.title}</h2>
                          {example.description}
                          <ReactUiExample example={example} />
                        </Fragment>
                      ))}
                    </>
                  );
                }
              }
            }}
          />
        </div>
      </div>
    </DocsLayout>
  );
}
