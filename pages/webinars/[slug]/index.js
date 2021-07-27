import {
  Image as DatoImage,
  renderMetaTags,
  StructuredText,
  useQuerySubscription,
} from 'react-datocms';
import Head from 'next/head';
import Layout from 'components/Layout';
import Button from 'components/Button';
import addMinutes from 'date-fns/addMinutes';
import FormattedDate from 'components/FormattedDate';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  gqlStaticPaths,
  seoMetaTagsFields,
  gqlStaticPropsWithSubscription,
  imageFields,
} from 'lib/datocms';
import Wrapper from 'components/Wrapper';
import queryString from 'qs';
import CalendarIcon from 'public/icons/regular/calendar-day.svg';
import SpeakersIcon from 'public/icons/regular/user.svg';
import CompanyIcon from 'public/icons/regular/building.svg';
import VideoIcon from 'public/icons/regular/video.svg';
import DescriptionIcon from 'public/icons/regular/info.svg';
import DurationIcon from 'public/icons/regular/clock.svg';

import s from './style.module.css';

export const Info = ({ title, icon, children }) => {
  return (
    <div className={s.block}>
      <div className={s.blockTitle}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
};

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      webinars: allWebinars(first: 100, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'slug',
  ({ webinars }) => webinars.map((p) => p.slug),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query WebinarQuery($slug: String!) {
      webinar(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...seoMetaTagsFields
        }
        date
        durationMinutes
        title
        slug
        url
        coverImage {
          responsiveImage(
            imgixParams: { w: 780 }
          ) {
            ...imageFields
          }
        }
        description {
          value
        }
        speakers {
          name
          company
          role
          companyUrl
          companyDescription
          companyLogo {
            responsiveImage {
              ...imageFields
            }
          }
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

    ${seoMetaTagsFields}
    ${imageFields}
  `,
  {
    requiredKeys: ['webinar'],
  },
);

const gcalDate = (date) =>
  date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z/, 'Z');

export default function Webinar({ preview, subscription }) {
  const {
    data: { webinar },
  } = useQuerySubscription(subscription);

  const calendarLink = `https://www.google.com/calendar/render?${queryString.stringify(
    {
      action: 'TEMPLATE',
      dates: `${gcalDate(new Date(webinar.date))}/${gcalDate(
        addMinutes(new Date(webinar.date), webinar.durationMinutes),
      )}`,
      details: `Link to the webinar: https://www.datocms.com/webinars/${
        webinar.slug
      }\n\n${toPlainText(webinar.description)}`,
      text: `DatoCMS Webinar: "${webinar.title}"`,
    },
  )}`;

  return (
    <Layout preview={preview} noCta>
      <Head>{renderMetaTags(webinar._seoMetaTags)}</Head>
      <Wrapper>
        <div className={s.kicker}>Webinar</div>

        <div className={s.split}>
          <div className={s.content}>
            <div className={s.header}>
              <div className={s.title}>{webinar.title}</div>
              <DatoImage
                style={{ display: 'block' }}
                className={s.coverImage}
                data={webinar.coverImage.responsiveImage}
              />
              <div className={s.description}>
                <Info icon={<DescriptionIcon />} title="Topic">
                  {<StructuredText data={webinar.description} />}
                </Info>
              </div>
              <div className={s.action}>
                {webinar.url && (
                  <div className={s.actionButton}>
                    <Button as="a" href={webinar.url} target="_blank">
                      <VideoIcon /> Enter the webinar!
                    </Button>
                  </div>
                )}
                {!webinar.url && (
                  <>
                    <div className={s.actionButton}>
                      <Button
                        as="a"
                        href={calendarLink}
                        target="_blank"
                        className={s.addToCalendar}
                        s="invert"
                      >
                        Add to your calendar!
                      </Button>
                    </div>
                    <div className={s.actionWhen}>
                      <FormattedDate date={webinar.date} /> —{' '}
                      {new Date(webinar.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short',
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={s.sidebar}>
            <div className={s.sidebarInner}>
              <Info icon={<CalendarIcon />} title="When">
                <div className={s.when}>
                  <FormattedDate date={webinar.date} />
                </div>
                <div className={s.when}>
                  {new Date(webinar.date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </div>
                {!webinar.url && (
                  <div className={s.add}>
                    <Button
                      as="a"
                      href={calendarLink}
                      target="_blank"
                      className={s.addToCalendar}
                      p="small"
                      fs="small"
                      s="invert"
                    >
                      Add to your calendar!
                    </Button>
                  </div>
                )}
                {webinar.url && (
                  <div className={s.add}>
                    <Button
                      as="a"
                      href={webinar.url}
                      className={s.addToCalendar}
                      target="_blank"
                      p="small"
                      fs="small"
                    >
                      <VideoIcon /> Enter the webinar!
                    </Button>
                  </div>
                )}
              </Info>
              <Info icon={<DurationIcon />} title="Duration">
                {webinar.durationMinutes} min
              </Info>
              <Info icon={<SpeakersIcon />} title="Speakers">
                {webinar.speakers.map((speaker) => (
                  <div className={s.speaker} key={speaker.name}>
                    <div className={s.speakerImage}>
                      <DatoImage
                        className={s.avatar}
                        data={speaker.avatar.responsiveImage}
                      />
                    </div>
                    <div>
                      <div className={s.speakerName}>{speaker.name}</div>
                      <div className={s.speakerRole}>
                        {speaker.role} @ {speaker.company}
                      </div>
                    </div>
                  </div>
                ))}
              </Info>
              <Info icon={<CompanyIcon />} title="Brought by">
                {webinar.speakers.map((speaker) => (
                  <div className={s.company} key={speaker.company}>
                    <a
                      href={speaker.companyUrl}
                      target="_blank"
                      className={s.companyImage}
                      rel="noreferrer"
                    >
                      <DatoImage
                        className={s.companyImg}
                        data={speaker.companyLogo.responsiveImage}
                      />
                    </a>
                    <div>
                      <div className={s.companyName}>
                        <a href={speaker.companyUrl}>{speaker.company}</a>
                      </div>

                      <div className={s.companyDescription}>
                        {speaker.companyDescription}
                      </div>
                    </div>
                  </div>
                ))}
              </Info>
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
