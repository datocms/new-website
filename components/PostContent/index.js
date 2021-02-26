import ResponsiveEmbed from 'react-responsive-embed';
import VideoPlayer from 'components/VideoPlayer';
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
import { isBlockquote, isCode, isHeading } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';
import queryString from 'qs';

function renderBlock(s, block) {
  switch (block._modelApiKey) {
    case 'internal_video':
      return (
        <div className={s.unwrap}>
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
        </div>
      );

    case 'question_answer':
      return (
        <div className={s.qa}>
          <div className={s.qaQuestion}>
            <StructuredText data={block.question} />
          </div>
          <div className={s.qaAnswer}>
            <StructuredText data={block.answer} />
          </div>
        </div>
      );

    case 'demo':
      return (
        <div className={s.unwrap}>
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
        </div>
      );

    case 'multiple_demos_block':
      return (
        <div className={s.unwrap}>
          <div className={s.pluginBoxes}>
            {block.demos.map((item) => (
              <div key={item.name} className={s.pluginBoxContainer}>
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
        </div>
      );

    case 'graphiql_editor':
      return (
        <div className={s.unwrap}>
          <iframe
            src={`https://cda-explorer.datocms.com/?${queryString.stringify({
              embed: true,
              apitoken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
              query: block.query,
            })}`}
          />
        </div>
      );

    case 'image':
      return (
        <div className={s.unwrap}>
          <ImageFigure imageClassName={s.responsiveImage} data={block.image} />
        </div>
      );

    case 'video':
      return (
        <div className={s.unwrap}>
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
        </div>
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
        <>
          <StructuredText
            data={content}
            renderBlock={({ record }) => renderBlock(s, record)}
            customRules={[
              renderRule(isBlockquote, ({ node, children, key }) => {
                return (
                  <div
                    key={key}
                    className={cn(s.quote, {
                      [s.smallerQuote]: toPlainText(node).length > 500,
                    })}
                  >
                    <div className={s.quoteQuote}>{children}</div>
                    {node.attribution && (
                      <div className={s.quoteAuthor}>{node.attribution}</div>
                    )}
                  </div>
                );
              }),
              renderRule(isCode, ({ node, key }) => {
                return (
                  <Prism
                    key={key}
                    code={node.code}
                    language={node.language || 'unknown'}
                    highlightLines={node.highlight}
                    showLineNumbers={node.code.split(/\n/).length > 10}
                  />
                );
              }),
              renderRule(isHeading, ({ node, children, key }) => {
                return (
                  <Heading
                    key={key}
                    as={`h${node.level}`}
                    anchor={slugify(toPlainText(node))}
                  >
                    {children}
                  </Heading>
                );
              }),
            ]}
          />
          {children}
        </>
      )}
    </div>
  );
}
