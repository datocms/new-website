import cn from 'classnames';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import Quote from 'components/Quote';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
// import useSWR from 'swr';
import {
  gqlStaticProps,
  imageFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Polestar from 'public/images/logos/polestar.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import { range } from 'range';
import { useEffect, useState } from 'react';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import regression from 'regression';
import wretch from 'wretch';
import s from './style.module.css';

const si = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
];

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

function prettyNumber(num) {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;

  for (i = si.length - 1; i > 0; i -= 1) {
    if (num >= si[i].value) {
      break;
    }
  }

  let number = num / si[i].value;

  return (
    number.toFixed(number < 10 ? 2 : number < 99 ? 1 : 0).replace(rx, '$1') +
    si[i].symbol
  );
}

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      page: aboutPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      members: allTeamMembers {
        name
        role
        avatar {
          responsiveImage(
            imgixParams: { auto: format, w: 400, h: 300, fit: crop }
          ) {
            ...imageFields
          }
        }
      }
      review1: review(filter: { name: { eq: "Marc Ammann" } }) {
        ...reviewFields
      }
      review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
        ...reviewFields
      }
    }

    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

const fetcher = (url) => wretch(url).get().json();

const Chart = ({ data: rawData, children }) => {
  const isDesktop = useMediaQuery('(min-width: 550px)');
  const lineEvery = isDesktop ? 3 : 5;

  if (!rawData) {
    return null;
  }

  const width = 800;
  const height = 350;

  const data = rawData.map((point) => ({
    value: (point.value + 18000.0) * 12,
    date: parseISO(point.date),
  }));

  const coefficients = regression
    .polynomial(
      data.map((point, i) => [i, point.value]),
      { order: 3, precision: 5 },
    )
    .equation.reverse();

  const trend = range(0, data.length + 9).map((x) =>
    coefficients.reduce((sum, coeff, power) => sum + coeff * x ** power, 0),
  );

  const maxValue = Math.max.apply(null, [
    ...data.map((p) => p.value),
    ...trend,
  ]);

  const minValue = Math.min.apply(null, [
    ...data.map((p) => p.value),
    ...trend,
  ]);

  const project = (x, y) => [
    (x * width) / (trend.length - 1),
    height - ((y - minValue) / (maxValue - minValue)) * height,
  ];

  const projectLabel = (x, y) => [
    (x * 100.0) / (trend.length - 1),
    100.0 - ((y - minValue) / (maxValue - minValue)) * 100.0,
  ];

  return (
    <div className={s.chart}>
      <div className={s.chartSvgAround}>
        <svg
          viewBox={`-${width * 0.01} ${height * 0.02} ${width * 1.02} ${
            height * 1.1
          }`}
          className={s.chartSvg}
        >
          <path
            className={s.trendLine}
            d={
              `M 0 ${height} ` +
              trend
                .map((value, i) => `L ${project(i, value).join(' ')}`)
                .join(' ')
            }
          />

          <path
            d={
              `M 0 ${height} ` +
              data
                .map((point, i) => `L ${project(i, point.value).join(' ')}`)
                .join(' ')
            }
          />

          {data.map((point, i) => {
            const up = ((i - data.length + 1) / lineEvery) % 2 === 0;

            const [x1, y1] = project(i, point.value);
            const [x2, y2] = project(
              i,
              point.value + maxValue * (up ? 0.1 : -0.1),
            );

            return (
              (i - data.length + 1) % lineEvery === 0 && (
                <line x1={x1} x2={x2} y1={y1} y2={y2} />
              )
            );
          })}

          {data.map((point, i) => {
            const [x, y] = project(i, point.value);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                data-value={parseInt(point.value)}
              />
            );
          })}
        </svg>

        <div className={s.chartLabels}>
          {data.map((point, i) => {
            const up = ((i - data.length + 1) / lineEvery) % 2 === 0;

            const [x, y] = projectLabel(
              i,
              point.value + maxValue * (up ? 0.1 : -0.1),
            );

            return (
              (i - data.length + 1) % lineEvery === 0 && (
                <div
                  className={s.chartLabelAnchor}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div
                    className={cn(s.chartLabel, {
                      [s.chartLabelUp]: up,
                    })}
                  >
                    <span className={s.chartLabelAnchorDate}>
                      {format(point.date, 'MMM yyyy')}
                      <br />
                    </span>
                    <span className={s.chartLabelAnchorAmountDesktop}>
                      €{parseInt(point.value).toLocaleString()}
                    </span>
                    <span className={s.chartLabelAnchorAmountMobile}>
                      €{prettyNumber(point.value)}
                    </span>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function About({ members, page, review1, review2 }) {
  return (
    <Layout>
      <Head>{renderMetaTags(page.seo)}</Head>
      <Hero
        kicker="Meet our team"
        title={
          <>
            We build tools that work{' '}
            <Highlight>the&nbsp;way&nbsp;you&nbsp;do</Highlight>
          </>
        }
        subtitle="Our mission? Help you create projects that&nbsp;truly&nbsp;feel&nbsp;yours"
      />

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[
            <DeutscheTelekom key="DeutscheTelekom" />,
            <Hashicorp key="Hashicorp" />,
            <Verizon key="Verizon" />,
            <Polestar key="Polestar" />,
            <Vercel key="Vercel" />,
          ]}
        />
      </Space>

      <Flag
        style="good"
        image="team"
        title={
          <>
            Designed by an agency{' '}
            <FlagHighlight>
              with your&nbsp;needs&nbsp;in&nbsp;mind
            </FlagHighlight>
          </>
        }
      >
        <p>
          DatoCMS started in 2015 as an internal tool for our italian{' '}
          <a href="https://www.leanpanda.com/">web agency</a>.{' '}
          <strong>
            We understand the needs of your clients and partners because they
            are just like ours.
          </strong>{' '}
          We know what worries you, because we too choke up the night before
          that deploy.
        </p>
        <p>
          We don’t follow trends and we keep our things simple; we design every
          feature from the practical, real-world needs we see every day in our
          job.
        </p>
        <p>
          Since 2019, DatoCMS is an independent, profitable company with a fully
          dedicated team behind it, committed in giving you the best headless
          CMS in the market.
        </p>
      </Flag>

      <Quote review={review2} />

      <Flag
        style="good"
        image="growing"
        title={
          <>
            Slowly and <FlagHighlight>steadily</FlagHighlight>
          </>
        }
      >
        <p>
          You can call us a bootstrap company, big enough to serve customers all
          over the world, small enough for a Friday evening spritz together.
        </p>
        <p>
          <strong>
            We’re healthy, happy and — excuse our language — profitable.
          </strong>
        </p>
        <p>
          We don’t want venture capital funding. We don’t have an outbound sales
          team. We like dogs more than unicorns, sharing instead of disrupting
          and we’re here to stay. We owe only our best efforts to you and
          ourselves. We&#39;ve put down our roots and we want them to grow.
          Slowly but steadily.
        </p>
      </Flag>

      {/* {data && (
        <Space bottom={3}>
          <Wrapper>
            <InterstitialTitle style="two">An Open Company</InterstitialTitle>
            <p className={s.chartSubtitle}>
              Transparency is one of the core values that guide our work.
              Here&#39;s our annual run rate (ARR), updated in real-time, pulled
              straight from the source.
            </p>
            <Chart data={data.data.recurring_revenue} />
          </Wrapper>
        </Space>
      )} */}

      <Wrapper>
        <div className={s.members}>
          {members.map((member) => (
            <div className={s.member} key={member.name}>
              <DatoImage
                className={s.memberImage}
                data={member.avatar.responsiveImage}
              />
              <div className={s.memberName}>{member.name}</div>
              <div className={s.memberRole}>{member.role}</div>
            </div>
          ))}
        </div>
      </Wrapper>

      <Quote review={review1} />
    </Layout>
  );
}
