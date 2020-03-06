import ResponsiveEmbed from 'react-responsive-embed';
import VideoPlayer from 'components/VideoPlayer';
import SmartMarkdown from 'components/SmartMarkdown';
import ImageFigure from 'components/ImageFigure';
import Prism from 'components/Prism';
import defaultStyles from './style.module.css';
import { Copy, Image } from 'components/FakeContent';

export default function PostContent({ isFallback, content, style, children }) {
  const s = style || defaultStyles;

  return (
    <div className={s.body}>
      {isFallback ? (
        <>
          <div className={s.text}>
            <Copy lines={4} />
          </div>
          <figure>
            <Image />
          </figure>
          <div className={s.text}>
            <Copy lines={3} />
          </div>
        </>
      ) : (
        <>
          {content &&
            content.map(block => (
              <React.Fragment key={block.id}>
                {block._modelApiKey === 'text' && (
                  <div className={s.text}>
                    <SmartMarkdown>{block.text}</SmartMarkdown>
                  </div>
                )}
                {block._modelApiKey === 'internal_video' && (
                  <figure>
                    <VideoPlayer
                      controls
                      autoplay={block.autoplay}
                      loop={block.loop}
                      src={block.video.video.streamingUrl}
                      poster={`${
                        block.video.video.thumbnailUrl
                      }?time=${block.thumbTimeSeconds ||
                        block.video.video.duration / 2}`}
                    />
                    {block.video.title && (
                      <figcaption>{block.video.title}</figcaption>
                    )}
                  </figure>
                )}
                {block._modelApiKey === 'question_answer' && (
                  <div className={s.qa}>
                    <div className={s.qaQuestion}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: block.question,
                        }}
                      />
                    </div>
                    <div className={s.qaAnswer}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: block.answer,
                        }}
                      />
                    </div>
                  </div>
                )}
                {block._modelApiKey === 'code_block' && (
                  <Prism
                    code={block.code}
                    language={block.language || 'unknown'}
                  />
                )}
                {block._modelApiKey === 'quote' && (
                  <div className={s.quote}>
                    <div
                      className={s.quoteQuote}
                      dangerouslySetInnerHTML={{
                        __html: block.quote,
                      }}
                    />
                  </div>
                )}
                {block._modelApiKey === 'image' && (
                  <ImageFigure
                    imageClassName={s.responsiveImage}
                    data={block.image}
                  />
                )}
                {block._modelApiKey === 'video' && (
                  <figure>
                    {block.video.provider === 'youtube' ? (
                      <ResponsiveEmbed
                        src={`//www.youtube.com/embed/${block.video.providerUid}`}
                        ratio={`${block.video.width}:${block.video.height}`}
                        allowFullScreen
                      />
                    ) : (
                      <ResponsiveEmbed
                        src={`//player.vimeo.com/video/${block.video.providerUid}?title=0&byline=0&portrait=0`}
                        ratio={`${block.video.width}:${block.video.height}`}
                        allowFullScreen
                      />
                    )}
                  </figure>
                )}
              </React.Fragment>
            ))}
          {children}
        </>
      )}
    </div>
  );
}
