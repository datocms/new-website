import ActiveLink from 'components/ActiveLink';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import { gqlStaticProps, imageFields, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import SchemaIcon from 'public/images/illustrations/dynamic-layouts.svg';
import CDAIcon from 'public/images/illustrations/graphql-api.svg';
import GettingStartedIcon from 'public/images/illustrations/marketers.svg';
import VideoIcon from 'public/images/illustrations/video-encoding.svg'
import HeadlessIcon from 'public/images/illustrations/developers-2.svg'
import CMAIcon from 'public/images/illustrations/content-editors2.svg'
import NextIcon from 'public/images/logos/next.svg';
import NuxtIcon from 'public/images/logos/nuxt.svg';
import SvelteIcon from 'public/images/logos/svelte.svg';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    query {
      page: docsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          slug
          pages {
            __typename
            ... on DocGroupPageRecord {
              page {
                slug
              }
            }
          }
        }
      }
      tutorials: allVideoTutorials(
        first: 3
        filter: { showInDocsHomepage: { eq: true } }
      ) {
        id
        title
        res: videoTutorialResource {
          ... on OtherVideoResourceRecord {
            _modelApiKey
            url
            coverImage {
              responsiveImage(
                imgixParams: { auto: format, w: 300, ar: "4:3", fit: crop }
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
        _publishedAt
      }
      tutsCount: _allVideoTutorialsMeta {
        count
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
  `,
);

const normalize = (slug) => (slug === 'index' ? '' : `/${slug}`);

export const Sidebar = ({ roots }) => (
  <>
    {roots.map((root) => (
      <div className={s.group} key={root.slug}>
        <div className={s.groupName}>{root.name}</div>
        <div className={s.guides}>
          {root.children.map((sub) => (
            <ActiveLink
              activeClassName={s.activePage}
              href={`/docs/${sub.slug}${normalize(sub.pages[0].page.slug)}`}
              key={sub.slug}
            >
              <a className={s.guide}>{sub.name}</a>
            </ActiveLink>
          ))}
        </div>
      </div>
    ))}
    <div className={s.group}>
      <div className={s.groupName}>Community</div>
      <div className={s.guides}>
        <ActiveLink
          href="/docs/community-tutorials"
          activeClassName={s.activePage}
        >
          <a className={s.guide}>Community Videos</a>
        </ActiveLink>
      </div>
    </div>
  </>
);

export default function Docs({ roots, preview, tutorials, tutsCount, page }) {
  return (
    <DocsLayout preview={preview} sidebar={<Sidebar roots={roots} />}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <div className={s.container}>
        <h2 className={s.title}>DatoCMS Documentation</h2>
        <p className={s.subtitle}>
          Whether you’re a startup or a global enterprise, learn how to
          integrate with DatoCMS to manage your content in a centralized,
          structured hub.
        </p>

        <h6 className={s.introTitle}>For everyone</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/general-concepts">
            <a className={s.useCaseCard}>
              <GettingStartedIcon/>
              <div className={s.useCaseCardTitle}>What is DatoCMS?</div>
              <p>Learn the basic concepts and features of DatoCMS.</p>
            </a>
          </Link>

          <Link href="/user-guides">
            <a className={s.useCaseCard}>
              <VideoIcon/>
              <div className={s.useCaseCardTitle}>Videos & Tutorials</div>
              <p>Jump right in with our video walkthroughs and step-by-step tutorials.</p>
            </a>
          </Link>

          <Link href="/docs/content-modelling">
            <a className={s.useCaseCard}>
              <SchemaIcon/>
              <div className={s.useCaseCardTitle}>Modeling your first schema</div>
              <p>
               Structure your own content in our easy-to-use interface.
              </p>
            </a>
          </Link>


        </div>

        <h6 className={s.introTitle}>For developers</h6>
        <div className={s.useCaseCards}>
          <Link href="/academy">
            <a className={s.useCaseCard}>
              <HeadlessIcon/>
              <div className={s.useCaseCardTitle}>What is a headless CMS?</div>
              <p>
                Join us for a gentle intro to modern web dev with headless CMSes and JS frontends.
              </p>
            </a>
          </Link>

          <Link href="/docs/content-delivery-api">
            <a className={s.useCaseCard}>
              <CDAIcon/>
              <div className={s.useCaseCardTitle}>GraphQL API Reference</div>
              <p>Fetch exactly what your frontend needs with our Content Delivery API.</p>
            </a>
          </Link>

          <Link href="/docs/content-management-api">
            <a className={s.useCaseCard}>
              <CMAIcon/>
              <div className={s.useCaseCardTitle}>REST API Reference</div>
              <p>Programmatically create and edit content with our Content Management API.</p>
            </a>
          </Link>
        </div>

        <h6 className={s.introTitle}>Popular integrations</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/next-js">
            <a className={s.useCaseCard}>
              <NextIcon/>
              <div className={s.useCaseCardTitle}>Next.js + DatoCMS</div>
              <p>Learn how to integrate your Next.js website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/nuxt">
            <a className={s.useCaseCard}>
              <NuxtIcon/>
              <div className={s.useCaseCardTitle}>Nuxt + DatoCMS</div>
              <p>Learn how to integrate your Nuxt website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/svelte">
            <a className={s.useCaseCard}>
              <SvelteIcon/>
              <div className={s.useCaseCardTitle}>Svelte + DatoCMS</div>
              <p>Learn how to integrate your Svelte website with DatoCMS</p>
            </a>
          </Link>
        </div>

        <h6 className={s.introTitle}>
          Community Videos
        </h6>
        <p>If you&apos;re new to DatoCMS, we recommend starting with our official <Link href="/user-guides">Editor Guides</Link>, which cover the basics in a series of videos and written tutorials.</p>
        <p>Want more videos? Check out these awesome community contributions:</p>
        <div className={s.useCaseCards}>
          {tutorials.map((tutorial) =>
              tutorial.res._modelApiKey === 'youtube_video_resource' ? (
                  <a
                      href={tutorial.res.video.url}
                      key={tutorial.res.video.url}
                      className={s.videoCard}
                  >
                    <div className={s.tutorialCover}>
                      <img src={tutorial.res.video.thumbnailUrl}/>
                    </div>
                    <div className={s.videoCardTitle}>{tutorial.title}</div>
                  </a>
              ) : (
                  <a
                      href={tutorial.res.url}
                      key={tutorial.res.url}
                      className={s.videoCard}
                  >
                    <div className={s.videoCardCover}>
                      {tutorial.res.coverImage && (
                          <DatoImage data={tutorial.res.coverImage.responsiveImage}/>
                      )}
                    </div>
                    <div className={s.videoCardTitle}>{tutorial.title}</div>
                  </a>
              ),
          )}
        </div>
        <p><Link href="/docs/community-tutorials">
          <a>See more videos ({tutsCount.count} total)</a>
        </Link>
        </p>
      </div>
    </DocsLayout>
  );
}
