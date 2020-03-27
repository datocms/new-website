import ResponsiveEmbed from 'react-responsive-embed';
import VideoPlayer from 'components/VideoPlayer';
import SmartMarkdown from 'components/SmartMarkdown';
import ImageFigure from 'components/ImageFigure';
import Prism from 'components/Prism';
import defaultStyles from './style.module.css';
import { Copy, Image as FakeImage } from 'components/FakeContent';
import LazyImage from 'components/LazyImage';
import { Image } from 'react-datocms';
import UiChrome from 'components/UiChrome';
import PluginBox from 'components/PluginBox';
import Button from 'components/Button';

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
            <FakeImage />
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
                    <div className={s.videoWrapper}>
                      <VideoPlayer
                        controls
                        autoPlay={block.autoplay}
                        loop={block.loop}
                        src={block.video.video.streamingUrl}
                        poster={`${block.video.video.thumbnailUrl}?time=${
                          block.thumbTimeSeconds !== null
                            ? block.thumbTimeSeconds
                            : block.video.video.duration / 2
                        }`}
                      />
                    </div>
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
                {block._modelApiKey === 'demo' && (
                  <div className={s.demo}>
                    <div className={s.demoPreview}>
                      <UiChrome title={block.demo.name}>
                        <Image
                          className={s.demoImage}
                          data={block.demo.screenshot.responsiveImage}
                        />
                      </UiChrome>
                    </div>
                    <div className={s.demoCopy}>
                      <div className={s.demoTitle}>{block.demo.name}</div>
                      <div className={s.demoDesc}>
                        Try the full-fledged DatoCMS demo project in minutes.
                      </div>
                      <Button
                        as="a"
                        target="_blank"
                        p="small"
                        href={`https://dashboard.datocms.com/deploy?repo=${block.demo.githubRepo}`}
                      >
                        Deploy the demo project
                      </Button>
                      <LazyImage
                        className={s.techLogo}
                        src={block.demo.technology.logo.url}
                      />
                    </div>
                  </div>
                )}
                {block._modelApiKey === 'multiple_demos_block' && (
                  <div className={s.pluginBoxes}>
                    {block.demos.map(item => (
                      <div className={s.pluginBoxContainer}>
                        <PluginBox
                          description="View this demo »"
                          image={
                            <Image
                              className={s.pluginBoxImage}
                              data={item.screenshot.responsiveImage}
                            />
                          }
                          title={item.name}
                          as={`/marketplace/starters/${item.code}`}
                          href="/marketplace/starters/[slug]"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {block._modelApiKey === 'code_block' && (
                  <Prism
                    code={block.code}
                    language={block.language || 'unknown'}
                    highlightLines={block.highlightLines}
                    showLineNumbers={block.showLineNumbers}
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
