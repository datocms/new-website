import { gqlStaticProps, seoMetaTagsFields, imageFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import Link from 'next/link';
import Head from 'components/Head';
import s from './style.module.css';
import { renderMetaTags } from 'react-datocms';
import ActiveLink from 'components/ActiveLink';
import { Image as DatoImage } from 'react-datocms';
import Next from 'public/images/logos/next.svg';
import Gatsby from 'public/images/logos/gatsbyjs.svg';
import Hugo from 'public/images/logos/hugosquare.svg';
import Schema from 'public/images/illustrations/dynamic-layouts.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import GettingStarted from 'public/images/illustrations/marketers.svg';

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
              slugOverride
              page {
                slug
              }
            }
          }
        }
      }
      tutorials: allVideoTutorials(first: 3) {
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
              href={`/docs/${sub.slug}${normalize(
                sub.pages[0].slugOverride || sub.pages[0].page.slug,
              )}`}
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
          <a className={s.guide}>Video Tutorials</a>
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
        <h2 className={s.title}>Documentation</h2>
        <p className={s.subtitle}>
          Whether you’re a startup or a global enterprise, learn how to
          integrate with DatoCMS to manage your content in a centralized,
          structured hub.
        </p>

        <h6 className={s.introTitle}>Start with your use case</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/general-concepts">
            <a className={s.useCaseCard}>
              <GettingStarted />
              <div className={s.useCaseCardTitle}>Getting started</div>
              <p>Learn all the basic concepts and features behind DatoCMS.</p>
            </a>
          </Link>
          <Link href="/docs/content-modelling">
            <a className={s.useCaseCard}>
              <Schema />

              <div className={s.useCaseCardTitle}>Model your schema</div>
              <p>
                Build your administrative area and define the structure of your
                content.
              </p>
            </a>
          </Link>
          <Link href="/docs/content-delivery-api">
            <a className={s.useCaseCard}>
              <GraphQl />

              <div className={s.useCaseCardTitle}>GraphQL API</div>
              <p>Learn how to fetch your content into any frontend project.</p>
            </a>
          </Link>
        </div>

        <h6 className={s.introTitle}>Popular integrations (9)</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/next-js">
            <a className={s.useCaseCard}>
              <Next />
              <div className={s.useCaseCardTitle}>Next.js</div>
              <p>Learn how to integrate your Next.js website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/gatsby">
            <a className={s.useCaseCard}>
              <Gatsby />
              <div className={s.useCaseCardTitle}>Gatsby</div>
              <p>Learn how to integrate your Gatsby website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/hugo">
            <a className={s.useCaseCard}>
              <Hugo />
              <div className={s.useCaseCardTitle}>Hugo</div>
              <p>Learn how to integrate your Hugo website with DatoCMS</p>
            </a>
          </Link>
        </div>

        <h6 className={s.introTitle}>
          <Link href="/docs/community-tutorials">
            <a>Video Tutorials ({tutsCount.count})</a>
          </Link>
        </h6>
        <div className={s.useCaseCards}>
          {tutorials.map((tutorial) =>
            tutorial.res[0]._modelApiKey === 'youtube_video_resource' ? (
              <a
                href={tutorial.res[0].video.url}
                key={tutorial.res[0].video.url}
                className={s.videoCard}
              >
                <div className={s.tutorialCover}>
                  <img src={tutorial.res[0].video.thumbnailUrl} />
                </div>
                <div className={s.videoCardTitle}>{tutorial.title}</div>
              </a>
            ) : (
              <a
                href={tutorial.res[0].url}
                key={tutorial.res[0].url}
                className={s.videoCard}
              >
                <div className={s.videoCardCover}>
                  {tutorial.res[0].coverImage && (
                    <DatoImage
                      data={tutorial.res[0].coverImage.responsiveImage}
                    />
                  )}
                </div>
                <div className={s.videoCardTitle}>{tutorial.title}</div>
              </a>
            ),
          )}
        </div>
      </div>
    </DocsLayout>
  );
}
