import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Quote from 'components/Quote';
import Head from 'components/Head';
import { renderMetaTags, StructuredText } from 'react-datocms';
import s from './style.module.css';
import {
  imageFields,
  reviewFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import tiny from 'tiny-json-http';
import formatNumber from 'utils/formatNumber';
import InterstitialTitle from 'components/InterstitialTitle';
import Space from 'components/Space';
import cn from 'classnames';
import Link from 'next/link';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import { formatLimit, formatExtra } from 'utils/planLimitsHelpers';
import TitleStripWithContent from 'components/TitleStripWithContent';
import SuccessIcon from 'public/icons/regular/check.svg';
import Bullets from 'components/Bullets';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import AnnouncementIcon from 'public/images/illustrations/marketers.svg';
import { Badge } from 'components/PluginToolkit';
import Tier1 from 'public/images/tiers/tier-1.svg';
import Tier2 from 'public/images/tiers/tier-2.svg';
import Tier3 from 'public/images/tiers/tier-3.svg';
import { handleErrors } from 'lib/datocms';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    body: { data: datoPlans },
  } = await tiny.get({
    url: `https://account-api.datocms.com/account-plans`,
    headers: { accept: 'application/json' },
  });

  const {
    data: { hints, ...others },
  } = await request({
    query: `
      {
        page: pricingPage {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
        }
        faqs: allFaqs {
          id
          question
          answer { value }
        }
        hints: allPricingHints {
          apiId
          name
          description
        }
        review1: review(filter: { name: { eq: "Tore Heimann" } }) {
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
    preview,
  });

  const plan = datoPlans[0];

  return {
    props: {
      ...others,
      preview: preview || false,
      plans: datoPlans.sort(
        (a, b) => a.attributes.monthly_price - b.attributes.monthly_price,
      ),
    },
  };
});

function ReadMore() {
  return (
    <div className={cn(s.planBullet, s.readMore)}>
      <div className={s.readMoreBulletIcon} />
      <Link href="/pricing/compare" passHref>
        <a>Read all the details &raquo;</a>
      </Link>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div className={s.planBullet}>
      <div className={s.planBulletIcon}>
        <SuccessIcon />
      </div>
      {children}
    </div>
  );
}

export default function Pricing({
  page,
  hints,
  plans,
  faqs,
  preview,
  review1,
  review2,
}) {
  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <Hero
        kicker="Future-proof your digital experiences"
        title={
          <>
            Flexible pricing,
            <br />
            <Highlight>ready to scale</Highlight>
          </>
        }
        subtitle={
          <>
            Zero maintenance, zero operations: save tens of thousands of dollars
            annually by using DatoCMS headless technology and
            content&nbsp;infrastructure
          </>
        }
      />

      <Space top={1}>
        <div className={s.plansStrip}>
          <Wrapper>
            <div className={s.plansContainer}>
              <Link href="/partner-program">
                <a className={s.agenciesCta}>
                  <AnnouncementIcon />
                  <span>
                    <strong>Building lots of sites?</strong> Discover our{' '}
                    <mark>Agency Parter Program</mark> &raquo;
                  </span>
                </a>
              </Link>

              <div className={s.plan}>
                <Tier1 className={s.planImage} />
                <div className={s.planName} style={{ color: '#10b6ce' }}>
                  Developer
                </div>
                <div className={s.planDescription}>
                  To test the platform in detail, and for developers working on
                  hobby sites
                </div>

                <div className={s.planPriceContainer}>
                  <span className={s.planPrice}>Free forever</span>

                  <span className={s.planYearlyPrice}>
                    No credit card required
                  </span>
                </div>

                <div className={s.planAction}>
                  <Button
                    block
                    s="invert"
                    as="a"
                    href="https://dashboard.datocms.com/projects/browse/new"
                  >
                    Try for free
                  </Button>
                </div>

                <div className={s.planBullets}>
                  <Bullet>
                    Up to 3 projects with generous quota, but hard limits on
                    resources (file storage, traffic, API calls)
                  </Bullet>
                  <Bullet>
                    Two users per project (one admin + one editor)
                  </Bullet>
                  <Bullet>Community-based support</Bullet>
                  <ReadMore />
                </div>
              </div>

              <div className={s.plan}>
                <Tier2 className={s.planImage} />
                <div className={s.planName} style={{ color: '#ef6424' }}>
                  Professional/Scale
                </div>
                <div className={s.planDescription}>
                  Everything you need — and more – to build professional digital
                  projects
                </div>

                <div className={s.planPriceContainer}>
                  <span className={s.planPricePerMonth}>Start at </span>
                  <span className={s.planPrice}>€{formatNumber(99)}</span>
                  <span className={s.planPricePerMonth}>/month</span>

                  <span className={s.planYearlyPrice}>
                    if paying annually, or{' '}
                    <strong>€{formatNumber(199)}/month</strong>
                  </span>
                </div>

                <div className={s.planAction}>
                  <Button
                    block
                    s="invert"
                    as="a"
                    href="https://dashboard.datocms.com/projects/browse/new"
                  >
                    Try for free
                  </Button>
                </div>

                <div className={s.planBullets}>
                  <Bullet>
                    Extremely generous quota, with soft limits you can exceed
                    and pay-as-you-go
                  </Bullet>
                  <Bullet>
                    10 collaborators included on each project (you can purchase
                    more if needed)
                  </Bullet>
                  <Bullet>
                    Additional projects can be added for as low as €29/month
                  </Bullet>
                  <Bullet>
                    Expanded authoring roles to support most publishing
                    workflows
                  </Bullet>
                  <Bullet>
                    Technical support via email (Mon/Fri, response in 24h)
                  </Bullet>
                  <ReadMore />
                </div>
              </div>

              <div className={s.plan}>
                <Tier3 className={s.planImage} />
                <div className={s.planName} style={{ color: '#8a3e7e' }}>
                  Enterprise
                </div>
                <div className={s.planDescription}>
                  Premium features, high-touch support and advanced compliance
                </div>

                <div className={s.planPriceContainer}>
                  <span className={s.planPrice}>Custom</span>

                  <span className={s.planYearlyPrice}>
                    payable by credit card or wire transfer
                  </span>
                </div>

                <div className={s.planAction}>
                  <Button block s="invert" as="a" href="/contact">
                    Contact us
                  </Button>
                </div>

                <div className={s.planBullets}>
                  <Bullet>Guaranteed support and uptime SLAs</Bullet>
                  <Bullet>
                    SSO, Audit logs and Static webhook IPs for enhanced security
                  </Bullet>
                  <Bullet>
                    Fully customizable roles and tasks for granular workflows,
                    tailored to your specific needs
                  </Bullet>
                  <Bullet>100% White-label platform</Bullet>
                  <Bullet>
                    Support via shared Slack channel, editorial onboarding, plus
                    access to our solution architects
                  </Bullet>
                  <Bullet>
                    Use your your own AWS/GCP bucket and custom domain for
                    assets
                  </Bullet>
                  <Bullet>
                    Options for single-tenant to support your most critical
                    business needs
                  </Bullet>
                  <ReadMore />
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      </Space>
      <Wrapper>
        <div className={s.fullComparison}>
          <Link href="/pricing/compare" passHref>
            <Button p="small" s="invert">
              Compare limits and features in detail <ArrowIcon />
            </Button>
          </Link>
        </div>
      </Wrapper>

      <Space top={2}>
        <Wrapper>
          <div className={s.std}>
            <div className={s.stdTitle}>And included in every plan...</div>
            <div className={s.stdBullets}>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>GraphQL API</div>
                <div className={s.stdBulletDesc}>
                  An understandable description of your API, the power to ask
                  exactly the data you need and powerful developer tools
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>Worldwide CDN</div>
                <div className={s.stdBulletDesc}>
                  Delight your customers with lightning fast responses thanks to
                  our CDN: performant, secure, and close to every customer
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  Granular roles and permissions
                </div>
                <div className={s.stdBulletDesc}>
                  Assign the appropriate roles and permissions to your members,
                  precisely determining what actions they can perform
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>Plugins</div>
                <div className={s.stdBulletDesc}>
                  Easily expand the capabilities of DatoCMS with plugins to
                  handle custom editing needs and 3rd-party integrations
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  Unlimited image transformations
                </div>
                <div className={s.stdBulletDesc}>
                  Optimize, resize, crop, rotate and watermark images on-the-fly
                  simply adding custom parameters to the URL of your images
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  AI-based smart image tagging
                </div>
                <div className={s.stdBulletDesc}>
                  Locate media files quickly using AI-powered tagging and
                  advanced search capabilities, saved filters and asset folders
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </Space>

      <Space top={2}>
        <TitleStripWithContent
          title={<>Enterprises</>}
          subtitle={
            <>
              <p>
                Get dedicated onboarding service, premium technical support,
                private cloud and custom SLAs to gain the assurance your
                enterprise needs. Grows with your needs, from one team or
                business unit to your whole organization.
              </p>
              <div className={s.buttonGroup}>
                <Link href="/enterprise-headless-cms" passHref>
                  <Button p="small" s="invert">
                    Learn more
                  </Button>
                </Link>
                <Link href="/enterprise-headless-cms#form" passHref>
                  <Button p="small">Contact sales</Button>
                </Link>
              </div>
            </>
          }
        >
          <div className={s.enterprise}>
            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Services</div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Guaranteed support SLAs',
                  'High priority support',
                  'Shared Slack channel',
                  'Customer success',
                  'Onboarding services',
                  'Solution Architects',
                ]}
              />
            </div>

            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Governance</div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Single Sign-On',
                  'SCIM v2 user provisioning',
                  'Security reporting',
                  'Platform white-labelling',
                  'User Management API',
                  'Static webhook IPs',
                ]}
              />
            </div>

            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Infrastructure </div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Guaranteed uptime SLAs',
                  'Single-tenant infrastructure',
                  'Multi-region infrastructure',
                  'Audit logs API',
                  'Daily backups',
                  '24/7 monitoring',
                ]}
              />
            </div>
          </div>
        </TitleStripWithContent>
      </Space>

      <Quote review={review1} />

      <Space top={3}>
        <Wrapper>
          <InterstitialTitle>Frequently asked questions</InterstitialTitle>
          <div className={s.faqs}>
            {faqs.map((faq) => (
              <div key={faq.id} className={s.faq}>
                <div className={s.faqQ}>{faq.question}</div>
                <div className={s.faqA}>
                  <StructuredText data={faq.answer} />
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </Space>

      <Space top={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
        />
      </Space>
    </Layout>
  );
}
