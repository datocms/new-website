import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Head from 'components/Head';
import Highlight from 'components/Highlight';
import Quote from 'components/Quote';
import EnterpriseStrip, { Point } from 'components/EnterpriseStrip';
import LogosBar from 'components/LogosBar';
import Wrapper from 'components/Wrapper';
import TalkWithUs from 'components/TalkWithUs';
import {
  gqlStaticProps,
  seoMetaTagsFields,
  reviewFields,
  imageFields,
} from 'lib/datocms';
import { renderMetaTags } from 'react-datocms';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Result from 'components/Result';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import Oberlo from 'public/images/logos/new/oberlo.svg';
import Nhs from 'public/images/logos/new/nhs.svg';
import LittleCaesars from 'public/images/logos/new/little-caesars.svg';
import Mit from 'public/images/logos/new/mit.svg';
import Afsp from 'public/images/logos/new/afsp.svg';
import Harrys from 'public/images/logos/new/harrys.svg';

import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      page: teamPage(filter: { slug: { eq: "enterprise-headless-cms" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review1: review(filter: { name: { eq: "Dan Barak" } }) {
        ...reviewFields
      }
      review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function Enterprise({ page, review1, review2 }) {
  return (
    <Layout>
      <Head seo={page.seo} slug={page.slug} />
      <Hero
        seoAnalysis={page.yoastAnalysis}
        kicker={page.seoH1}
        title={
          <>
            Enterprise&nbsp;grade <Highlight>content infrastructure</Highlight>
          </>
        }
        subtitle={
          <>
            Get{' '}
            <strong>
              dedicated onboarding service, premium technical support, private
              cloud and custom SLAs
            </strong>{' '}
            to gain the assurance your enterprise needs.
          </>
        }
      />

      <div id="main-content">
        <LogosBar
          title={
            <>
              We power experiences for{' '}
              <strong>some of the most renowned brands</strong>
            </>
          }
          clients={[
            DeutscheTelekom,
            Hashicorp,
            Verizon,
            Nike,
            Vercel,
            Linkedin,
            Oberlo,
            Nhs,
            LittleCaesars,
            Mit,
            Afsp,
            Harrys,
          ]}
        />

        <EnterpriseStrip
          kicker={page.yoastAnalysis.keyword}
          title="Extend your team with support that works with you"
          description=<p>
            Our <strong>dedicated solution engineers</strong> will consult you
            on the best way to integrate Dato headless CMS into enterprise
            digital products and workflows. Full support 24h guaranteed.
          </p>
        >
          <Point
            title="Shared Slack channel"
            description="Involve the whole team with a dedicated Slack channel."
          />
          <Point
            title="Onboarding Services"
            description="Add a DatoCMS integration expert to your project to help you jumpstart your architecture and get running faster."
          />
          <Point
            title="Guaranteed SLA"
            description="We can tailor a solution to your specific use case, with dedicated priority, 24/7 support, and real-time scaling"
          />
        </EnterpriseStrip>

        <Quote review={review2} />

        <EnterpriseStrip
          kicker={page.yoastAnalysis.relatedKeywords[0].keyword}
          title="Full accountability and governance control"
          description=<p>
            <strong>Dato headless CMS empowers your business.</strong> Enable
            your team to automate workflows, manage user permissions, stay
            compliant with data security regulations, and scale your enterprise.
          </p>
        >
          <Point
            title="Granular roles and permissions"
            description="Assign the appropriate roles and permissions to your team members, precisely determining what actions they can perform."
          />
          <Point
            title="Audit logs"
            description="Capture every login and action in the system. Detailed, filterable, exportable, and accessible via API."
          />
          <Point
            title="Live sync backups"
            description="Store all the data, versioned, in your company Amazon AWS account."
          />
        </EnterpriseStrip>

        <Quote review={review1} />

        <EnterpriseStrip
          kicker="Safest CMS for enterprise"
          title="Robust data security, privacy and compliance"
          description=<p>
            <strong>Security</strong> is something we take very seriously.
            DatoCMS customers rely on us to provide{' '}
            <strong>top-notch security features</strong> and tools that ensure
            their data is safe and remains secure.
          </p>
        >
          <Point
            title="Two Factor Authentication"
            description="Secure logging in to your account with two layers of auth."
          />
          <Point
            title="Single Sign-On"
            description="Manage access to DatoCMS through your preferred identity provider."
          />
          <Point
            title="ISO 27001 and GDPR Compliance"
            description="We have a GDPR DPA and our data centers are ISO 27001, SOC 1 and SOC 2 compliant."
          />
        </EnterpriseStrip>

        <div className={s.talkWithUs}>
          <Wrapper>
            <a id="form" className={s.anchor} />
            <div className={s.talkWithUsInner}>
              <div className={s.talkWithUsIntro}>
                <div className={s.talkWithUsTitle}>Talk with us</div>
                <div className={s.talkWithUsDescription}>
                  <p>
                    <strong>Quick and efficient support</strong> is essential
                    for an enterprise headless CMS. Enterprise accounts are put
                    on a fast-lane when it comes to provide help, feature
                    requests and fixes of any kind.{' '}
                    <strong>
                      Our experts are available in a number of ways
                    </strong>
                    , any time that you need us.
                  </p>
                </div>
              </div>
              <TalkWithUs contactFormType="sales" issueType="enterprise" />
            </div>
          </Wrapper>
        </div>

        <TitleStripWithContent
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS dev experience empowers all team"
          title={
            <>
              A technology investment that doubles performaces and productivity
            </>
          }
        >
          <div className={s.grid}>
            <Result
              number="38k"
              href="/customers/oberlo"
              label={
                <>
                  total <Highlight style="good">migrated assets</Highlight>
                </>
              }
            >
              <strong>Oberlo</strong> was able to switch to DatoCMS painlessly,
              offering blinding speed and an intuitive editing process.
            </Result>
            <Result
              number="2TB"
              href="/customers/hashicorp"
              label={
                <>
                  of <Highlight style="good">traffic per month</Highlight>
                </>
              }
            >
              <strong>HashiCorp</strong> needed a flexible and secure CMS to
              manage its ever-expanding multi-site structure.
            </Result>
            <Result
              number="35k"
              label={
                <>
                  <Highlight style="good">users</Highlight>
                </>
              }
            >
              <strong>Vercel</strong> hosted its{' '}
              <a
                href="https://nextjs.org/conf/jun21"
                target="_blank"
                rel="noreferrer"
              >
                Next.js international conference
              </a>{' '}
              on DatoCMS.
            </Result>
          </div>
        </TitleStripWithContent>
      </div>
    </Layout>
  );
}

export default Enterprise;
