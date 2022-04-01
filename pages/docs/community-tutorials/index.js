import { gqlStaticProps, imageFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import { Sidebar } from 'pages/docs';
import Head from 'components/Head';
import s from 'pages/docs/pageStyle.module.css';
import { Image as DatoImage } from 'react-datocms';
import t from './style.module.css';

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
              slugOverride
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
    }

    ${imageFields}
  `,
);

export default function Tutorials({ tutorials, roots }) {
  return (
    <DocsLayout sidebar={<Sidebar roots={roots} />}>
      <Head>
        <title>Video Tutorials — DatoCMS</title>
      </Head>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>Video Tutorials</div>

          <div className={t.tutorials}>
            {tutorials.map((tutorial) =>
              tutorial.res[0]._modelApiKey === 'youtube_video_resource' ? (
                <a
                  href={tutorial.res[0].video.url}
                  key={tutorial.res[0].video.url}
                  className={t.tutorial}
                >
                  <div className={t.tutorialCover}>
                    <img src={tutorial.res[0].video.thumbnailUrl} />
                  </div>
                  <div className={t.tutorialTitle}>{tutorial.title}</div>
                </a>
              ) : (
                <a
                  href={tutorial.res[0].url}
                  key={tutorial.res[0].url}
                  className={t.tutorial}
                >
                  <div className={t.tutorialCover}>
                    {tutorial.res[0].coverImage && (
                      <DatoImage
                        data={tutorial.res[0].coverImage.responsiveImage}
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
