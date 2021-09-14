import ResponsiveEmbed from 'react-responsive-embed';
import VideoPlayer from 'components/VideoPlayer';
import ImageFigure from 'components/ImageFigure';
import Prism from 'components/Prism';
import defaultStyles from './style.module.css';
import LazyImage from 'components/LazyImage';
import { Image as DatoImage, StructuredText, renderRule } from 'react-datocms';
import UiChrome from 'components/UiChrome';
import PluginBox from 'components/PluginBox';
import Button from 'components/Button';
import CloneButtonGenerator from 'components/CloneButtonGenerator';
import DeployButtonGenerator from 'components/DeployButtonGenerator';
import cn from 'classnames';
import { isBlockquote, isCode, isHeading } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';
import queryString from 'qs';
import Corona from 'public/images/illustrations/live-4.svg';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';

function renderBlock(s, block, defaultAltForImages) {
  switch (block._modelApiKey) {
    case 'in_depth_cta_block':
      return (
        <div className={s.unwrap}>
          <a href={block.cta.ctaUrl} className={s.inDepth}>
            <div className={s.inDepthImage}>
              <Corona />
            </div>
            <div className={s.inDepthBody}>
              <div className={s.inDepthTitle}>{block.cta.title}</div>

              <div className={s.inDepthDescription}>
                <StructuredText data={block.cta.description} />
              </div>
              <div className={s.inDepthCta}>
                {block.cta.ctaLabel} <ArrowIcon />
              </div>
            </div>
          </a>
        </div>
      );

    case 'internal_video':
      return (
        <div className={s.unwrap}>
          <figure>
            <div className={s.videoWrapper}>
              <VideoPlayer
                controls
                autoPlay={block.autoplay}
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
                <DatoImage
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
                    <DatoImage
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
              apitoken: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
              query: block.query,
            })}`}
          />
        </div>
      );

    case 'image':
      const { width, height, responsiveImage, alt, title } = block.image;

      return (
        <div
          className={
            width && height ? (width / height > 1.3 ? s.unwrap : null) : null
          }
        >
          <ImageFigure
            imageClassName={s.responsiveImage}
            data={block.image}
            alt={
              (responsiveImage && responsiveImage.alt) ||
              alt ||
              defaultAltForImages
            }
            title={(responsiveImage && responsiveImage.title) || title}
          />
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

    case 'clone_button_form':
      return (
        <div className={s.unwrap}>
          <CloneButtonGenerator />
        </div>
      );

    case 'deploy_button_form':
      return (
        <div className={s.unwrap}>
          <DeployButtonGenerator />
        </div>
      );

    case 'codesandbox_embed_block':
      return (
        <div className={s.unwrap}>
          <iframe
            src={`https://codesandbox.io/embed/${block.slug}?codemirror=1&hidedevtools=1&fontsize=13&editorsize=20`}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      );
  }
}

export default function PostContent({
  content,
  style,
  children,
  defaultAltForImages,
}) {
  const s = style || defaultStyles;

  return (
    <div className={s.body}>
      <StructuredText
        data={content}
        renderBlock={({ record }) =>
          renderBlock(s, record, defaultAltForImages)
        }
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
            const nodeLevel = node.level === 1 ? 2 : node.level;

            return (
              <Heading
                key={key}
                as={`h${nodeLevel}`}
                anchor={slugify(toPlainText(node))}
              >
                {children}
              </Heading>
            );
          }),
        ]}
      />
      {children}
    </div>
  );
}
