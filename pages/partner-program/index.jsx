import AgencyForm from 'components/AgencyForm';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import QuotesCarousel from 'components/QuotesCarousel';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
} from 'lib/datocms';
import Link from 'next/link';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import LazyImage from '../../components/LazyImage';
import s from './style.module.css';

function Benefit({ title, children }) {
  return (
    <div className={s.benefit}>
      <div className={s.benefitTitle}>{title}</div>
      <div className={s.benefitContent}>{children}</div>
    </div>
  );
}

function Step({ title, children }) {
  return (
    <li className={s.step}>
      <div className={s.stepMain}>
        <div className={s.stepTitle}>{title}</div>
        <div className={s.stepContent}>{children}</div>
      </div>
    </li>
  );
}

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  {
    partnersPage {
      highlightedPartners {
        name
        slug
        logo {
          url
        }
      }
    }
    allPartnerTestimonials(first: 10) {
      ...partnerTestimonialFields
      _updatedAt
    }
  }

  ${imageFields}
  ${partnerTestimonialFields}
`);
export default function Agencies({ subscription }) {
  const {
    data: { partnersPage, allPartnerTestimonials },
  } = useQuerySubscription(subscription);

  const quotes = allPartnerTestimonials.filter(
    (quote) => toPlainText(quote.quote).length < 230,
  );

  return (
    <Layout finalCta={false}>
      <Head>
        <title>Special pricing for agencies - DatoCMS</title>
      </Head>

      <Hero
        seoAnalysis={{ keyword: 'agencies', synonyms: '', relatedKeywords: [] }}
        kicker="Partner with DatoCMS"
        title={
          <>
            <Highlight>Agency Partner</Highlight> Program
          </>
        }
        subtitle={
          <>
            We designed our partnership program to help agencies find new
            clients, gain more flexibility, and receive assistance in
            implementing projects with DatoCMS.
          </>
        }
      />

      <Space top={1} bottom={1}>
        <LogosBar
          title="+80 Agency Partners distributed in 45 countries"
          clients={partnersPage.highlightedPartners
            .slice(0, 7)
            .map((partner) => (
              <Link
                href={`/partners/${partner.slug}`}
                key={partner.slug}
                passHref
              >
                <LazyImage src={partner.logo.url} />
              </Link>
            ))}
        />

        <Space top={1} bottom={1}>
          <QuotesCarousel quotes={quotes} animated={true} />
        </Space>
      </Space>

      <TitleStripWithContent
        title={<>Here&apos;s what it means to partner with us</>}
        subtitle={
          <>
            In our partner program, we&apos;ve incorporated all the essential
            elements to support the success of your agency. In addition to
            utilizing DatoCMS, you will receive additional advantages to get the
            most out of our product, and grow as we grow.
          </>
        }
      >
        <div className={s.benefits}>
          <Benefit title={<>💰 Special plans and discounts</>}>
            You get access to customised plans, specifically designed to get you
            started with DatoCMS without any big price jumps/committments. Or,
            if you prefer, a 30% discount on the Professional public plan.
          </Benefit>

          <Benefit title={<>🎁 30% off for your clients</>}>
            Partners can enable special plans — or a 30% discount on the public
            Professional plan — on their customers&apos; accounts.{' '}
            <Link href="/docs/agency-partner-program/partners-dashboard#enabling-special-plans-to-clients">
              Directly from their dashboard
            </Link>
            , autonomously, without having to ask us for anything.
          </Benefit>

          <Benefit
            title={<>🔑 Full-access to all your clients&apos; projects</>}
          >
            Assign your team members a special{' '}
            <Link href="/docs/agency-partner-program/partners-dashboard#developer-and-projects-manager-roles">
              Developer role
            </Link>{' '}
            to give them{' '}
            <Link href="/docs/agency-partner-program/partners-dashboard#automatic-access-to-your-clients-projects">
              access to all projects
            </Link>
            . Even when they reside on a separate account, managed by the end
            customer. And without having to purchase additional collaborator
            seats.
          </Benefit>

          <Benefit title={<>🏆 Partner listing for winning new clients</>}>
            We&apos;ll get you in front of new potential clients by featuring
            your agency (and projects) as part of our{' '}
            <Link href="/partners">Partners page</Link>. Teams in need of
            development resources go there to find the right level of support
            for their projects.
          </Benefit>

          <Benefit title={<>👩‍💼 Dedicated partner account manager</>}>
            Get the most out of DatoCMS: gain access to the constant support of
            our Partner Team to address any questions you (or your customers)
            may have. Participate in webinars specifically dedicated to our
            partners.{' '}
          </Benefit>

          <Benefit title={<>📈 Co-marketing opportunities</>}>
            Our marketing relies on real success stories — and we know that our
            Partners will provide some great ones. We&apos;ll promote your
            projects, <Link href="/customers">create case studies</Link> and
            articles, and feature your logo on our website.
          </Benefit>
        </div>
      </TitleStripWithContent>

      <Space top={4}>
        <InterstitialTitle
          style="two"
          below={
            <Space top={1}>
              Join our Partner Program and start your journey to become a
              certified DatoCMS Partner today.
            </Space>
          }
        >
          The process
        </InterstitialTitle>

        <Wrapper>
          <ol className={s.steps}>
            <Step title="Submit the form">
              Fill in the form below to express your interest in joining the
              program, and tell us a bit about who you are.
            </Step>
            <Step title="Join the webinar">
              Unpack all the details of our program, and the special agency
              plans, by joining one of our weekly webinars.
            </Step>
            <Step title="Complete the enrollment">
              While you can already enjoy the benefits, activate a paid plan and
              fill out your public Partner profile.
            </Step>
            <Step title="Get certified">
              Get listed in our Partners page, utilize the support of our
              partnership and grow your business with DatoCMS.
            </Step>
          </ol>
        </Wrapper>
      </Space>

      <Space top={3}>
        <InterstitialTitle
          kicker="Enroll the Agency Partner Program"
          below={
            <Space top={1}>
              Fill in this form, and we&apos;ll send you a link to join our next
              webinar to learn all the deets of our program. You are one step
              away from unlocking all the benefits!
            </Space>
          }
        >
          Interested? <Highlight>Then let&apos;s talk!</Highlight>
        </InterstitialTitle>
      </Space>

      <div className={s.form}>
        <AgencyForm />
      </div>
    </Layout>
  );
}
