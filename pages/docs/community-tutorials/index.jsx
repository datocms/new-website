import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import { Sidebar } from 'pages/docs';
import s from 'pages/docs/pageStyle.module.css';
import { Image as DatoImage } from 'react-datocms';
import t from './style.module.css';
import Link from "next/link";

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
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
      tutorials: allVideoTutorials {
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
    }

    ${imageFields}
  `,
);

export default function Tutorials({ tutorials, roots }) {
  return (
    <DocsLayout sidebar={<Sidebar roots={roots} />}>
      <Head>
        <title>Community Video Tutorials — DatoCMS</title>
      </Head>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>DatoCMS Community Videos</div>

          <p>New here? We recommend starting with our official <Link href="/user-guides">DatoCMS Editor Guides</Link>, which offer a series of videos and written tutorials to help you learn the basics.</p>

          <p>The below are a collection of additional videos made by our awesome community members covering a wide range of topics, from beginner to advanced.</p>

          <div className={t.tutorials}>
            {tutorials.map((tutorial) =>
              tutorial.res._modelApiKey === 'youtube_video_resource' ? (
                <a
                  href={tutorial.res.video.url}
                  key={tutorial.res.video.url}
                  className={t.tutorial}
                >
                  <div className={t.tutorialCover}>
                    <img src={tutorial.res.video.thumbnailUrl} />
                  </div>
                  <div className={t.tutorialTitle}>{tutorial.title}</div>
                </a>
              ) : (
                <a
                  href={tutorial.res.url}
                  key={tutorial.res.url}
                  className={t.tutorial}
                >
                  <div className={t.tutorialCover}>
                    {tutorial.res.coverImage && (
                      <DatoImage
                        data={tutorial.res.coverImage.responsiveImage}
                      />
                    )}
                  </div>
                  <div className={t.tutorialTitle}>{tutorial.title}</div>
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
