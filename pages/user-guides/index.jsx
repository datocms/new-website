import Head from 'components/Head';
import Hero from 'components/Hero';
import Layout from 'components/Layout';

import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription, seoMetaTagsFields, imageFields } from 'lib/datocms';
import Link from 'next/link';
import Image from 'next/image'
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      page: userGuidesHome {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      chapters: allUserGuidesChapters {
        title
        slug
        introduction {
          value
        }
        videos {
          title
          slug
          image {
            responsiveImage {
              ...imageFields
            }
          }
          video {
            video {
              duration
              thumbnailUrl
              blurUpThumb
            }
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
  {
    requiredKeys: ['page', 'chapters'],
  },
);

function Chapter({ chapter }) {
  const convertVideoSecondsInMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }

  return (
    <div className={s.chapter}>
      <div className={s.chapterIntro}>
        <div>
          <h2>
            {chapter.title}
          </h2>
          <div className={s.chapterIntroPill}>
            {chapter.videos.length > 1 ? `${chapter.videos.length} videos` : '1 video'}
          </div>
        </div>

        <div>
          <StructuredText data={chapter.introduction} />
        </div>
      </div>

      <section className={s.chapterVideosWrapper}>
        <div className={s.chapterVideos}>
          {chapter.videos.map((episode) => (
            <div key={episode.slug} className={s.chapterItem}>
              <div className={s.itemVideo}>
                {episode?.video?.video?.thumbnailUrl && (
                  <Link href={`/user-guides/${chapter.slug}/${episode.slug}`} passHref>
                    <a>
                      <Image
                        src={episode.video.video.thumbnailUrl}
                        blurDataURL={episode.video.video.blurUpThumb}
                        width={1024}
                        height={593}
                        alt={episode.title}
                      />
                    </a>
                  </Link>
                )}
              </div>
              <Link href={`/user-guides/${chapter.slug}/${episode.slug}`} passHref>
                <a>
                  {episode.title}
                  {episode?.video?.video?.duration && (
                    <div className={`${s.videoDuration}`}>
                      {convertVideoSecondsInMinutes(episode.video.video.duration)}
                    </div>  
                  )}
                </a>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function UserGuides({ subscription, preview }) {
  const {
    data: { chapters, page },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{page && renderMetaTags(page.seo)}</Head>
      <Wrapper>
        <Hero
          title={
            <>
              Editor Guides
            </>
          }
          subtitle="Editors and content creators, this one’s for you. Join along for a casual and non-technical walkthrough of DatoCMS focusing on content creation and the UI."
        />
      </Wrapper>
      
      <Space top={2} bottom={2}>
        <div className={s.allChapters}>
          {chapters
            .filter((chapter) => chapter.videos.length > 0)
            .map((chapter) => (
              <Chapter chapter={chapter} key={chapter.slug} />
            ))}
        </div>
      </Space>
    </Layout>
  );
}
