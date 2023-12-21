import cn from 'classnames';
import Button from 'components/Button';
import CloneButtonGenerator from 'components/CloneButtonGenerator';
import DeployButtonGenerator from 'components/DeployButtonGenerator';
import Heading from 'components/Heading';
import ImageFigure from 'components/ImageFigure';
import LazyImage from 'components/LazyImage';
import PluginBox from 'components/PluginBox';
import Prism from 'components/Prism';
import UiChrome from 'components/UiChrome';
import VideoPlayer from 'components/VideoPlayer';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isBlockquote, isCode, isHeading } from 'datocms-structured-text-utils';
import Link from 'next/link';
import CodeSandboxIcon from 'public/icons/brands/codesandbox.svg';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import Corona from 'public/images/illustrations/live-4.svg';
import queryString from 'qs';
import { Image as DatoImage, StructuredText, renderRule } from 'react-datocms';
import ResponsiveEmbed from 'react-responsive-embed';
import truncate from 'truncate';
import slugify from 'utils/slugify';
import { parseShortCodes } from '../../utils/table';
import defaultStyles from './style.module.css';
import partnerStyles from '/pages/partners/[partnerSlug]/style.module.css';

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

    case 'showcase_project_block':
      return (
        <div className={s.unwrap}>
          <div
            className={s.pluginBoxes}
            style={{
              justifyContent:
                block.showcaseProjects.length === 1 ? 'center' : undefined,
            }}
          >
            {block.showcaseProjects.map((project) => (
              <div key={project.slug} className={s.pluginBoxContainer}>
                <PluginBox
                  title={project.name}
                  key={project.slug}
                  href={`/partners/${project.partner.slug}/showcase/${project.slug}`}
                  description={
                    <div className={partnerStyles.demoDesc}>
                      <div className={partnerStyles.demoDescBody}>
                        {truncate(toPlainText(project.headline), 120)}
                      </div>
                      <div className={partnerStyles.demoDescImage}>
                        <LazyImage
                          className={partnerStyles.techLogo}
                          src={project.partner.logo.url}
                        />
                      </div>
                    </div>
                  }
                  image={
                    <DatoImage
                      className={partnerStyles.boxImageImage}
                      data={project.mainImage.responsiveImage}
                    />
                  }
                />
              </div>
            ))}
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

    case 'cta_button':
      return (
        <Button as="a" href={block.url} p="tiny" fs="small" s="invert">
          {block.text}
        </Button>
      );

    case 'multiple_demos_block':
      return (
        <div className={s.unwrap}>
          <div
            className={s.pluginBoxes}
            style={{
              justifyContent: block.demos.length === 1 ? 'center' : undefined,
            }}
          >
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

    case 'tutorial_video':
      return (
        <div className={s.unwrap}>
          <div
            className={s.pluginBoxes}
            style={{
              justifyContent:
                block.tutorials.length === 1 ? 'center' : undefined,
            }}
          >
            {block.tutorials.map((tutorial) => (
              <div key={tutorial.title} className={s.pluginBoxContainer}>
                {tutorial.res[0]._modelApiKey === 'youtube_video_resource' ? (
                  <PluginBox
                    title={tutorial.title}
                    description="Play video »"
                    image={
                      <img
                        alt={tutorial.res[0].video.alt}
                        className={s.pluginBoxImage}
                        src={tutorial.res[0].video.thumbnailUrl}
                      />
                    }
                    href={tutorial.res[0].video.url}
                  />
                ) : (
                  <PluginBox
                    title={tutorial.title}
                    description="Play video »"
                    image={
                      <DatoImage
                        className={s.pluginBoxImage}
                        data={tutorial.res[0].coverImage.responsiveImage}
                      />
                    }
                    href={tutorial.res[0].url}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'graphiql_editor':
      return (
        <div className={s.unwrap}>
          <iframe
            loading="lazy"
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
            alt={responsiveImage?.alt || alt || defaultAltForImages}
            title={responsiveImage?.title || title}
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
          <Link href={`https://codesandbox.io/s/${block.slug}`} target="_blank">
            <a className={s.link} target="_blank" rel="noreferrer" href="">
              <DatoImage
                className={s.responsiveImage}
                data={block.preview.responsiveImage}
              />
              <div className={s.lightbox}>
                <button className={s.lightboxButton} type="button">
                  <CodeSandboxIcon />
                  Try it on CodeSandbox!
                </button>
              </div>
            </a>
          </Link>
        </div>
      );

    case 'table': {
      const columns = block.table.columns.map((rawName) =>
        parseShortCodes(rawName, ['style']),
      );

      function toCss(style) {
        if (!style) {
          return {};
        }

        return {
          ...(style.align ? { textAlign: style.align } : {}),
          ...(style.width ? { width: style.width } : {}),
        };
      }

      return (
        <div className={s.tableWrapper}>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.id} style={toCss(col.style)}>
                    {col.content}
                  </th>
                ))}
              </tr>
            </thead>
            {block.table.data.map((row) => (
              <tr key={JSON.stringify(row)}>
                {columns.map((col) => (
                  <td key={col.id} style={toCss(col.style)}>
                    {row[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      );
    }
  }
}

export default function PostContent({
  content,
  style,
  children,
  defaultAltForImages,
  renderBlock: customRenderBlock,
}) {
  const s = style || defaultStyles;

  return (
    <div className={s.body}>
      <StructuredText
        data={content}
        renderBlock={({ record }) =>
          renderBlock(s, record, defaultAltForImages) ||
          (customRenderBlock ? customRenderBlock(record) : undefined)
        }
        renderInlineRecord={({ record, transformedMeta }) => {
          switch (record.__typename) {
            case 'BlogPostRecord':
              return (
                <a {...transformedMeta} href={`/blog/${record.slug}`}>
                  {record.title}
                </a>
              );
            case 'ChangelogEntryRecord':
              return (
                <a
                  {...transformedMeta}
                  href={`/product-updates/${record.slug}`}
                >
                  {record.title}
                </a>
              );
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ record, transformedMeta, children }) => {
          switch (record.__typename) {
            case 'BlogPostRecord':
              return (
                <a {...transformedMeta} href={`/blog/${record.slug}`}>
                  {children}
                </a>
              );
            case 'ChangelogEntryRecord':
              return (
                <a
                  {...transformedMeta}
                  href={`/product-updates/${record.slug}`}
                >
                  {children}
                </a>
              );
            default:
              return null;
          }
        }}
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
