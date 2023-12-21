import Button from 'components/Button';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import SidebarPane from 'components/SidebarPane';
import Space from 'components/Space';
import StickySidebar from 'components/StickySidebar';
import VideoPlayer from 'components/VideoPlayer';
import Wrapper from 'components/Wrapper';
import Zoomable from 'components/Zoomable';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import CameraIcon from 'public/icons/regular/camera.svg';
import DescriptionIcon from 'public/icons/regular/info.svg';
import LaptopIcon from 'public/icons/regular/laptop-code.svg';
import BrowserIcon from 'public/icons/regular/link.svg';
import TagIcon from 'public/icons/regular/tag.svg';
import UsersIcon from 'public/icons/regular/users.svg';
import { Image, StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

const Gallery = ({ screens }) =>
  screens.map((screen) => (
    <div key={screen.id} className={s.shotWrapper}>
      <Zoomable
        content={
          screen.zoomableResponsiveImage &&
          screen.width > 900 && <Image data={screen.zoomableResponsiveImage} />
        }
      >
        <Image className={s.shot} data={screen.responsiveImage} />
      </Zoomable>
      <div className={s.shotTitle}>{screen.title}</div>
    </div>
  ));

export const getStaticPaths = async () => {
  const { data } = await request({
    query: `
      query {
        projects: allShowcaseProjects(first: 100, orderBy: _firstPublishedAt_DESC) {
          slug
          partner { slug }
        }
      }
    `,
  });

  return {
    fallback: 'blocking',
    paths: data.projects.map((project) => ({
      params: { projectSlug: project.slug, partnerSlug: project.partner.slug },
    })),
  };
};

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query ShowCaseQuery($projectSlug: String!) {
      project: showcaseProject(filter: { slug: { eq: $projectSlug } }) {
        _seoMetaTags {
          ...seoMetaTagsFields
        }
        partner {
          name
          slug
          logo { url }
          shortDescription { value }
        }
        name
        slug
        projectUrl
        headline { value }
        inDepthExplanation { value }
        technologies {
          name
          logo {
            url
          }
        }
        areasOfExpertise {
          name
        }
        mainImage {
          responsiveImage(
            imgixParams: { auto: format, w: 1200 }
          ) {
            ...imageFields
          }
        }
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
        projectScreenshots {
          id
          title
          width
          responsiveImage(
            imgixParams: { auto: format, w: 900 }
          ) {
            ...imageFields
          }
          zoomableResponsiveImage: responsiveImage(imgixParams: { auto: format, w: 1500, fit: max }) {
            ...imageFields
          }
        }
        datocmsScreenshots {
          id
          title
          width
          responsiveImage(
            imgixParams: { auto: format, w: 900 }
          ) {
            ...imageFields
          }
          zoomableResponsiveImage: responsiveImage(imgixParams: { auto: format, w: 1500, fit: max }) {
            ...imageFields
          }
        }
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  { revalidate: 60 * 10 },
);

export default function PartnerPage({ preview, subscription }) {
  const {
    data: { project },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(project._seoMetaTags)}
        <title>
          {project.name} | {project.partner.name} | DatoCMS Partners
        </title>
        <meta name="description" content={toPlainText(project.headline)} />
      </Head>
      <InterstitialTitle
        style="one"
        kicker="Projects showcase"
        bigSubtitle
        subtitle={<StructuredText data={project.headline} />}
        below={
          <>
            <div className={s.madeByHead}>
              Made by{' '}
              <Link href={`/partners/${project.partner.slug}`}>
                <a>{project.partner.name}</a>
              </Link>
            </div>
            {project.projectUrl && (
              <div className={s.action}>
                <div className={s.actionButton}>
                  <Button as="a" href={project.projectUrl} target="_blank">
                    <BrowserIcon /> Visit project
                  </Button>
                </div>
              </div>
            )}
          </>
        }
      >
        {project.name}
      </InterstitialTitle>
      <Wrapper>
        <Space bottom={2}>
          {project.video?.video ? (
            <div className={s.mainImage}>
              <VideoPlayer
                controls
                src={project.video.video.streamingUrl}
                poster={`${project.video.video.thumbnailUrl}?width=1200&time=2`}
              />
            </div>
          ) : (
            <Image
              className={s.mainImage}
              data={project.mainImage.responsiveImage}
            />
          )}
        </Space>

        <StickySidebar
          width={400}
          sidebar={
            <>
              <SidebarPane icon={<DescriptionIcon />} title="About the project">
                <div className={s.description}>
                  <StructuredText data={project.inDepthExplanation} />
                </div>
              </SidebarPane>
              <div className={s.description}>
                <SidebarPane icon={<UsersIcon />} title="Made by">
                  <div className={s.madeBy}>
                    <div className={s.madeByImage}>
                      <Link href={`/partners/${project.partner.slug}`}>
                        <a>
                          <LazyImage
                            className={s.madeByLogo}
                            alt={project.partner.name + ' logo'}
                            src={project.partner.logo.url}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className={s.madeByDescription}>
                      {toPlainText(project.partner.shortDescription)}
                    </div>
                    <Link href={`/partners/${project.partner.slug}`}>
                      <a className={s.madeByLink}>View profile &raquo;</a>
                    </Link>
                  </div>
                </SidebarPane>
              </div>
              <SidebarPane icon={<TagIcon />} title="Tags">
                <div className={s.tagList}>
                  {[...project.areasOfExpertise, ...project.technologies].map(
                    (item) => (
                      <div key={item.slug} className={s.tag}>
                        {item.name}
                      </div>
                    ),
                  )}
                </div>
              </SidebarPane>
            </>
          }
        >
          <>
            <SidebarPane
              icon={<CameraIcon />}
              title="Project shots"
              separateMoreFromContent
            >
              <Gallery screens={project.projectScreenshots} />
            </SidebarPane>
            <Space top={1}>
              <SidebarPane
                icon={<LaptopIcon />}
                title="Backend shots"
                separateMoreFromContent
              >
                <Gallery screens={project.datocmsScreenshots} />
              </SidebarPane>
            </Space>
          </>
        </StickySidebar>
      </Wrapper>
    </Layout>
  );
}
