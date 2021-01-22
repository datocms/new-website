import ResponsiveEmbed from 'react-responsive-embed';
import VideoPlayer from 'components/VideoPlayer';
import SmartMarkdown from 'components/SmartMarkdown';
import ImageFigure from 'components/ImageFigure';
import Prism from 'components/Prism';
import defaultStyles from './style.module.css';
import { Copy, Image as FakeImage } from 'components/FakeContent';
import LazyImage from 'components/LazyImage';
import { Image, StructuredText, renderRule } from 'react-datocms';
import UiChrome from 'components/UiChrome';
import PluginBox from 'components/PluginBox';
import Button from 'components/Button';
import cn from 'classnames';
import { isBlockquote } from 'datocms-structured-text-utils';
import { render } from 'datocms-structured-text-to-plain-text';

function renderBlock(s, block) {
  switch (block._modelApiKey) {
    case 'internal_video':
      return (
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
          {block.video.title && <figcaption>{block.video.title}</figcaption>}
        </figure>
      );

    case 'question_answer':
      return (
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
      );

    case 'demo':
      return (
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
      );

    case 'multiple_demos_block':
      return (
        <div className={s.pluginBoxes}>
          {block.demos.map((item) => (
            <div className={s.pluginBoxContainer}>
              <PluginBox
                description="Try this demo »"
                image={
                  <Image
                    className={s.pluginBoxImage}
                    data={item.screenshot.responsiveImage}
                  />
                }
                title={item.name}
                href={`/marketplace/starters/${item.code}`}
              />
            </div>
          ))}
        </div>
      );

    // case 'code_block':
    //   return (
    //     <Prism
    //       code={block.code}
    //       language={block.language || 'unknown'}
    //       highlightLines={block.highlightLines}
    //       showLineNumbers={block.showLineNumbers}
    //     />
    //   );

    // case 'quote':
    //   return (
    //     <div
    //       className={cn(s.quote, {
    //         [s.smallerQuote]: block.quote.length > 500,
    //       })}
    //     >
    //       <div
    //         className={s.quoteQuote}
    //         dangerouslySetInnerHTML={{
    //           __html: block.quote,
    //         }}
    //       />
    //     </div>
    //   );

    case 'image':
      return (
        <ImageFigure imageClassName={s.responsiveImage} data={block.image} />
      );

    case 'video':
      return (
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
      );
  }
}

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
        <StructuredText
          structuredText={content}
          renderBlock={({ record }) => (
            <div className={s.unwrap}>{renderBlock(s, record)}</div>
          )}
          customRules={[
            renderRule(
              isBlockquote,
              ({ adapter: { renderNode }, node, children, key }) => {
                return (
                  <div
                    className={cn(s.quote, {
                      [s.smallerQuote]:
                        render({
                          structuredText: { value: { document: node } },
                        }).length > 500,
                    })}
                  >
                    <div className={s.quoteQuote}>{children}</div>
                    {node.attribution && (
                      <div className={s.quoteAuthor}>{node.attribution}</div>
                    )}
                  </div>
                );
              },
            ),
          ]}
        />
      )}
    </div>
  );
}
