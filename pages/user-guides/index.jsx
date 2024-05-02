import Head from 'components/Head';
import Hero from 'components/Hero';
import Layout from 'components/Layout';

import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import PrettyDuration from 'components/PrettyDuration';
import { gqlStaticPropsWithSubscription, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import Image from 'next/image'
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

import useEmblaCarousel from 'embla-carousel-react'

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
          video {
            video {
              duration
              thumbnailUrl
              blurUpThumb
              width
              height
            }
          }
          thumbTimeSeconds
        }
      }
    }

    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['page', 'chapters'],
  },
);

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

function Chapter({ chapter }) {
  const carouselOptions = {
    loop: false,
    align: 'start',
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
        <VideoList chapter={chapter} />
        <VideoCarousel options={carouselOptions} chapter={chapter} />
      </section>
    </div>
  );
}

function VideoList({ chapter }) {
  return (
    <div className={s.chapterVideosList}>
      {chapter.videos.map((episode, index) => (
        <VideoCard key={index} chapter={chapter} episode={episode} />
      ))}
    </div>
  );
}

function VideoCarousel({options, chapter}) {
  const [emblaRef] = useEmblaCarousel(options)

  return (
    <div className={s.embla} ref={emblaRef}>
      <div className={s.emblaContainer}>
        {chapter.videos.map((episode, index) => (
          <VideoCard key={index} chapter={chapter} episode={episode} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ chapter, episode}) {
  return (
    <div key={episode.slug} className={s.chapterItem}>
      <div className={s.itemVideo}>
        {episode?.video?.video?.thumbnailUrl && (
          <Link href={`/user-guides/${chapter.slug}/${episode.slug}`} passHref>
            <a>
              <Image
                src={`${episode.video.video.thumbnailUrl}${episode.thumbTimeSeconds ? `?time=${episode.thumbTimeSeconds}` : null}`}
                blurDataURL={episode.video.video.blurUpThumb}
                width={episode.video.video.width / 2}
                height={episode.video.video.height / 2}
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
              {PrettyDuration(episode.video.video.duration)}
            </div>  
          )}
        </a>
      </Link>
    </div>
  );
}