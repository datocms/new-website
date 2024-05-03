import Head from 'components/Head';
import Hero from 'components/Hero';
import Layout from 'components/Layout';

import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import formatVideoDuration from 'utils/formatVideoDuration';
import { gqlStaticPropsWithSubscription, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import Image from 'next/image'
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AngleLeft from 'public/icons/regular/angle-left.svg'
import AngleRight from 'public/icons/regular/angle-right.svg'
import Clock from 'public/icons/regular/clock.svg'

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
            .map((chapter, index) => (
              <Chapter chapter={chapter} number={index +1} key={chapter.slug} />
            )
          )}
        </div>
      </Space>
    </Layout>
  );
}

function Chapter({ chapter, number }) {
  const carouselOptions = {
    loop: false,
    align: 'start',
  }

  const allVideosDurations = chapter.videos.reduce((totalDuration, episode) => {
    if (episode?.video.video.duration) {
      return totalDuration + episode.video.video.duration;
    }
    return totalDuration;
  }, 0);

  return (
    <div className={s.chapter}>
      <div className={s.chapterIntroWrapper}>
        <div className={s.chapterIntro}>
          <span className={s.chapterNumber}>Chapter #{number}</span>
          <div className={s.chapterIntroPills}>
            <div className={s.pill}>
              {chapter.videos.length > 1 ? `${chapter.videos.length} videos` : '1 video'}
            </div>
            <div className={s.pill}>
              <Clock />
              <span>
                {formatVideoDuration(allVideosDurations)} 
              </span>
            </div>
          </div>
        </div>
        <h2 className={s.chapterIntroHeading}>
          {chapter.title}
        </h2>
        <div className={s.chapterIntroDescription}>
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
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false)
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false)

  const prevSlide = () => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }

  const nextSlide = () => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }

  const onSelect = useCallback((emblaApi) => {
    setPrevButtonDisabled(!emblaApi.canScrollPrev())
    setNextButtonDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('init', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={s.embla} ref={emblaRef}>
      <div className={s.emblaContainer}>
        {chapter.videos.map((episode, index) => (
          <VideoCard key={index} chapter={chapter} episode={episode} />
        ))}
      </div>
      <div className={`${s.prevSlide} ${prevButtonDisabled ? s.isDisabled : ''}`} onClick={prevSlide}>
        <AngleLeft />
      </div>
      <div className={`${s.nextSlide} ${nextButtonDisabled ? s.isDisabled : ''}`} onClick={nextSlide}>
        <AngleRight />
      </div>
    </div>
  );
}

function VideoCard({ chapter, episode}) {
  return (
    <div key={episode.slug} className={s.chapterItem}>
      <div className={s.itemVideo}>
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
      </div>
      <Link href={`/user-guides/${chapter.slug}/${episode.slug}`} passHref>
        <a>
          <h4>
            {episode.title}
          </h4>
          <div className={`${s.videoDuration}`}>
            {formatVideoDuration(episode.video.video.duration)}
          </div>
        </a>
      </Link>
    </div>
  );
}