import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import VideoPlayer from 'components/VideoPlayer';
import TitleStripWithContent from 'components/TitleStripWithContent';

import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';

import s from './style.module.css';
import { range } from 'range';

function VideoStreamingEncoding() {
  return (
    <Layout>
      <Hero
        over="Video encoding and streaming"
        title={
          <>
            Stream&nbsp;beautifully, <Highlight>everywhere</Highlight>
          </>
        }
        subtitle={
          <>
            Empower your content team with the ability to produce beautiful
            videos and serve them fast to any device.
          </>
        }
      />

      <TitleStripWithContent
        title={<>Adaptive bitrate means fast on every device</>}
        subtitle={
          <>
            Thanks to HLS Adaptive Bitrate (ABR) streaming, every viewer will
            always download the right video size for their device and connection
            speed.
          </>
        }
      >
        <div className={s.video}>
          <VideoPlayer
            controls
            autoPlay
            muted
            loop
            src="https://stream.mux.com/goGuGfWk00LaymzN28ox44TAz00xOxea8i.m3u8"
          />
        </div>
      </TitleStripWithContent>

      <Flag
        style="good"
        title={
          <>
            Any video format,{' '}
            <FlagHighlight>instantly&nbsp;streamable</FlagHighlight>
          </>
        }
        image="go-mobile"
      >
        <p>
          We can ingest almost every available codec — including those for
          broadcast and professional applications like H.264, H.265, VP9, and
          Apple ProRes — and make videos instantly available for streaming.
        </p>
      </Flag>

      <TitleStripWithContent
        title={<>Thumbnails? Included.</>}
        subtitle={
          <>
            Thumbnails are entry level when it comes to video, yet implementing
            them is far from simple. With a single request through our API you
            can get a thumbnail or an entire storyboard to use in your player to
            scrub preview images.
          </>
        }
      >
        <div className={s.frames}>
          {range(1, 12, 2).map(t => (
            <div key={t} className={s.frame}>
              <img
                src={`https://image.mux.com/goGuGfWk00LaymzN28ox44TAz00xOxea8i/thumbnail.jpg?width=400&amp;time=${t}`}
              />
              <div className={s.frameLabel}>
                /video/15831/thumb.jpg?
                <span className={s.paramName}>width</span>=
                <span className={s.paramValue}>400</span>&amp;
                <span className={s.paramName}>time</span>=
                <span className={s.paramValue}>{t}</span>
              </div>
            </div>
          ))}
        </div>
      </TitleStripWithContent>

      <Flag
        style="good"
        image="video-player"
        title={
          <>
            Works with <FlagHighlight>any&nbsp;video&nbsp;player</FlagHighlight>
          </>
        }
      >
        <p>
          Rather than require you to use a proprietary player, we made it easy
          to integrate with all major web and mobile video players, open-source
          or professional, web or native.
        </p>
      </Flag>
    </Layout>
  );
}

export default VideoStreamingEncoding;
