import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight, { highlightStructuredText } from 'components/Highlight';
import Head from 'components/Head';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import InterstitialTitle from 'components/InterstitialTitle';
import AgencyForm from 'components/AgencyForm';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Link from 'next/link';
import LogosBar from 'components/LogosBar';
import LazyImage from '../../components/LazyImage';
import { gqlStaticPropsWithSubscription, imageFields } from 'lib/datocms';
import { useQuerySubscription, Image as DatoImage } from 'react-datocms';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';

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
        ...partner
      }
    }
    allPartners(first: 100) {
      name
      slug
      quotes {
        id
        quote {
          value
        }
        role
        name
        image {
          responsiveImage(
            imgixParams: {
              w: 300
              h: 300
              fit: crop
              crop: faces
              auto: format
            }
          ) {
            ...imageFields
          }
        }
        _updatedAt
      }
    }
  }

  ${imageFields}

  fragment partner on PartnerRecord {
    name
    slug
    logo {
      url
    }
  }
`);
export default function Agencies({ subscription }) {
  const {
    data: { partnersPage, allPartners },
  } = useQuerySubscription(subscription);

  const quotes = allPartners.flatMap((partner) =>
    partner.quotes
      .filter((quote) => toPlainText(quote.quote).length < 230)
      .map((quote) => ({ ...quote, partner })),
  );

  return (
    <Layout noCta>
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
          clients={partnersPage.highlightedPartners.map((partner) => (
            <Link
              href={`/partners/${partner.slug}`}
              key={partner.slug}
              passHref
            >
              <LazyImage src={partner.logo.url} />
            </Link>
          ))}
        />

        <div className={s.quotes}>
          <div className={s.quotesInner}>
            {quotes.map((quote) => {
              return (
                <Link href={`/partners/${quote.partner.slug}`} key={quote.id}>
                  <a className={s.root}>
                    <div className={s.quote}>
                      {highlightStructuredText(quote.quote)}
                    </div>
                    <div className={s.content}>
                      <DatoImage
                        className={s.image}
                        data={quote.image.responsiveImage}
                      />
                      {quote.link ? (
                        <Link href={quote.link}>
                          <a className={s.authorRole}>
                            <div className={s.name}>{quote.name}</div>
                            <div className={s.role}>{quote.role}</div>
                          </a>
                        </Link>
                      ) : (
                        <div className={s.authorRole}>
                          <div className={s.name}>{quote.name}</div>
                          <div className={s.role}>{quote.role}</div>
                          <div className={s.role}>{quote.partner.name}</div>
                        </div>
                      )}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
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
