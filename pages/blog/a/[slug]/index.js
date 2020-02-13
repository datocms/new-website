import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image, renderMetaTags } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import gql from 'graphql-tag';
import InterstitialTitle from 'components/InterstitialTitle';
import Head from 'next/head';
import VideoPlayer from 'components/VideoPlayer';
import SmartMarkdown from 'components/SmartMarkdown';
import ImageFigure from 'components/ImageFigure';
import s from './style.css';
import ResponsiveEmbed from 'react-responsive-embed';

export const unstable_getStaticPaths = gqlStaticPaths(
  gql`
    query {
      posts: allBlogPosts(first: 15, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map(p => p.slug),
);

export const unstable_getStaticProps = gqlStaticProps(
  gql`
    query ArticleQuery($slug: String!) {
      post: blogPost(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        title
        content {
          ... on TextRecord {
            id
            _modelApiKey
            text(markdown: true)
          }
          ... on ImageRecord {
            id
            _modelApiKey
            image {
              format
              width
              responsiveImage(imgixParams: { w: 810 }) {
                ...imageFields
              }
              url
            }
          }
          ... on VideoRecord {
            id
            _modelApiKey
            video {
              url
              title
              provider
              width
              height
              providerUid
            }
          }
          ... on InternalVideoRecord {
            id
            _modelApiKey
            autoplay
            loop
            thumbTimeSeconds
            video {
              title
              width
              height
              video {
                duration
                streamingUrl
                thumbnailUrl
              }
            }
          }
          ... on QuoteRecord {
            id
            _modelApiKey
            quote(markdown: true)
            author
          }
          ... on QuestionAnswerRecord {
            id
            _modelApiKey
            question(markdown: true)
            answer(markdown: true)
          }
        }
        _firstPublishedAt
        author {
          name
          avatar {
            responsiveImage(
              imgixParams: { w: 50, h: 50, fit: crop, crop: faces }
            ) {
              ...imageFields
            }
          }
        }
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
);

export default function Article({ post }) {
  return (
    <Layout>
      <Head>
        {renderMetaTags(post._seoMetaTags)}
        <meta
          property="article:published_time"
          content={new Date(post._firstPublishedAt).toISOString()}
        />
      </Head>
      <Wrapper>
        <div className={s.root}>
          <InterstitialTitle kicker="The DatoCMS Blog" style="two">
            {post.title}
          </InterstitialTitle>

          <div className={s.info}>
            <Image className={s.avatar} data={post.author.avatar.responsiveImage} />
            Posted on <FormattedDate date={post._firstPublishedAt} /> by{' '}
            {post.author.name}
          </div>

          <div className={s.body}>
            {post.content.map(block => (
              <React.Fragment key={block.id}>
                {block._modelApiKey === 'text' && (
                  <div className={s.text}>
                    <SmartMarkdown>
                      {block.text}
                    </SmartMarkdown>
                  </div>
                )}
                {block._modelApiKey === 'internal_video' && (
                  <figure>
                    <VideoPlayer
                      controls
                      autoplay={block.autoplay}
                      autoload
                      aspectRatio={`${block.video.width}:${block.video.height}`}
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
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
