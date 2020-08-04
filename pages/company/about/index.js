import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Quote from 'components/Quote';
import Numbers, { Block as NumbersBlock } from 'components/Numbers';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import {
  gqlStaticProps,
  imageFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image } from 'react-datocms';
import gql from 'graphql-tag';
import s from './style.module.css';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import Space from 'components/Space';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      page: aboutPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      members: allTeamMembers {
        bio
        name
        role
        avatar {
          responsiveImage(
            imgixParams: { w: 300, h: 300, fit: facearea, facepad: 5 }
          ) {
            ...imageFields
          }
        }
      }
      review1: review(filter: { id: { eq: "4368320" } }) {
        ...reviewFields
      }
      review2: review(filter: { id: { eq: "4368343" } }) {
        ...reviewFields
      }
    }

    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

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
          DatoCMS started in 2015 as an internal tool of our{' '}
          <a href="https://www.leanpanda.com/">web agency</a> and since then it
          has grown under our loving care to make our customers happy... and
          their customers too.
        </p>
        <p>
          <strong>
            We understand the needs of your clients and partners because they
            are just like ours.
          </strong>{' '}
          We know what worries you because we too choke up the night before that
          deploy.
        </p>
        <p>
          We don’t follow trends and we keep our things simple; we design every
          feature from the practical, real-world needs we see every day in our
          job.
        </p>
      </Flag>
      <Quote review={review1} />

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
          ourselves. We've put down our roots and we want them to grow. Slowly
          but steadily.
        </p>
      </Flag>

      <Quote review={review2} />

      <Numbers title="Why you should use DatoCMS">
        <NumbersBlock title="2.500">Paying customers</NumbersBlock>
        <NumbersBlock title="15%">Monthly growth</NumbersBlock>
        <NumbersBlock title="5M">Records created</NumbersBlock>
        <NumbersBlock title="600M">Monthly API calls</NumbersBlock>
      </Numbers>

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
        />
      </Space>

      <Wrapper>
        <div className={s.members}>
          {members.map((member) => (
            <div className={s.member} key={member.name}>
              <Image
                className={s.memberImage}
                data={member.avatar.responsiveImage}
              />
              <div className={s.memberName}>{member.name}</div>
              <div className={s.memberRole}>{member.role}</div>
            </div>
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
