import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import Head from 'components/Head';
import Layout from 'components/Layout';
import SidebarPane from 'components/SidebarPane';
import Space from 'components/Space';
import StickySidebar from 'components/StickySidebar';
import Wrapper from 'components/Wrapper';
import addMinutes from 'date-fns/addMinutes';
import {
  GoogleCalendar,
  ICalendar,
  OutlookCalendar,
  YahooCalendar,
} from 'datebook';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import CompanyIcon from 'public/icons/regular/building.svg';
import CalendarIcon from 'public/icons/regular/calendar-day.svg';
import DurationIcon from 'public/icons/regular/clock.svg';
import DescriptionIcon from 'public/icons/regular/info.svg';
import SpeakersIcon from 'public/icons/regular/user.svg';
import VideoIcon from 'public/icons/regular/video.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image as DatoImage,
  StructuredText,
  renderMetaTags,
} from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';

import s from './style.module.css';

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new
    // function on every render that will cause this effect
    // callback/cleanup to run every render. It's not a big deal
    // but to optimize you can wrap handler in useCallback before
    // passing it into this hook.
    [ref, handler],
  );
}

const AddCalendar = ({ webinar, p, fs, s: otherS }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const onClickOutside = useCallback(() => setOpen(false), [setOpen]);
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  useOnClickOutside(ref, onClickOutside);

  const options = useMemo(
    () => ({
      title: `DatoCMS Webinar: "${webinar.title}"`,
      description: `Link to the webinar: https://www.datocms.com/webinars/${
        webinar.slug
      }\n\n${toPlainText(webinar.description)}`,
      start: new Date(webinar.date),
      end: addMinutes(new Date(webinar.date), webinar.durationMinutes),
    }),
    [
      webinar.title,
      webinar.slug,
      webinar.description,
      webinar.date,
      webinar.durationMinutes,
    ],
  );

  const onOpenIcs = useCallback(() => {
    const icalendar = new ICalendar(options);
    icalendar.download();
  }, [options]);

  return (
    <div className={s.addCalendar}>
      <Button as="a" onClick={onOpen} p={p} fs={fs} s={otherS}>
        Add to your calendar!
      </Button>
      {open && (
        <div className={s.addCalendarMenu} ref={ref}>
          <a className={s.addCalendarOption} href="#" onClick={onOpenIcs}>
            Download iCalendar file (.ics)
          </a>
          <a
            className={s.addCalendarOption}
            target="_blank"
            rel="noreferrer"
            href={new GoogleCalendar(options).render()}
          >
            Add to Google Calendar
          </a>
          <a
            className={s.addCalendarOption}
            target="_blank"
            rel="noreferrer"
            href={new YahooCalendar(options).render()}
          >
            Add to Yahoo! Calendar
          </a>
          <a
            className={s.addCalendarOption}
            target="_blank"
            rel="noreferrer"
            href={new OutlookCalendar(options).render()}
          >
            Add to Outlook Web Calendar
          </a>
        </div>
      )}
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
            imgixParams: { auto: format, w: 780 }
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
              imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }
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

export default function Webinar({ preview, subscription }) {
  const {
    data: { webinar },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview} noCta>
      <Head>{renderMetaTags(webinar._seoMetaTags)}</Head>
      <Wrapper>
        <Space top={2}>
          <div className={s.kicker}>Webinar</div>
        </Space>

        <StickySidebar
          sidebar={
            <>
              <SidebarPane icon={<CalendarIcon />} title="When">
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
                {(!webinar.url || new Date(webinar.date) > new Date()) && (
                  <div className={s.add}>
                    <AddCalendar
                      webinar={webinar}
                      p="small"
                      fs="small"
                      s="invert"
                    />
                  </div>
                )}
                {webinar.url && new Date(webinar.date) <= new Date() && (
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
              </SidebarPane>
              <SidebarPane icon={<DurationIcon />} title="Duration">
                {webinar.durationMinutes} min
              </SidebarPane>
              <SidebarPane icon={<SpeakersIcon />} title="Speakers">
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
                        {[speaker.role, speaker.company]
                          .filter((x) => x)
                          .join(' @ ')}
                      </div>
                    </div>
                  </div>
                ))}
              </SidebarPane>
              <SidebarPane icon={<CompanyIcon />} title="Brought by">
                {webinar.speakers
                  .filter((s) => s.company !== 'DatoCMS')
                  .map((speaker) => (
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
              </SidebarPane>
            </>
          }
        >
          <>
            <div className={s.title}>{webinar.title}</div>
            <DatoImage
              style={{ display: 'block' }}
              className={s.coverImage}
              data={webinar.coverImage.responsiveImage}
            />
            <div className={s.description}>
              <SidebarPane icon={<DescriptionIcon />} title="Topic">
                {<StructuredText data={webinar.description} />}
              </SidebarPane>
            </div>
            <div className={s.action}>
              {(!webinar.url || new Date(webinar.date) > new Date()) && (
                <>
                  <div className={s.actionButton}>
                    <AddCalendar webinar={webinar} s="invert" />
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
              {webinar.url && new Date(webinar.date) <= new Date() && (
                <div className={s.actionButton}>
                  <Button as="a" href={webinar.url} target="_blank">
                    <VideoIcon /> Enter the webinar!
                  </Button>
                </div>
              )}
            </div>
          </>
        </StickySidebar>
      </Wrapper>
    </Layout>
  );
}
