import DatoIllustration from 'components/DatoIllustration';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import Numbers, { Block as NumbersBlock } from 'components/Numbers';
import OtherPersonasPicker from 'components/OtherPersonasPicker';
import Quote from 'components/Quote';
import Result from 'components/Result';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import {
  gqlStaticProps,
  imageFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import Chillys from 'public/images/logos/chillys.svg';
import MatterSupply from 'public/images/logos/matter-supply.svg';
import Wonderland from 'public/images/logos/wonderland.svg';
import styles from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    query {
      page: teamPage(filter: { slug: { eq: "best-cms-for-developers" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
      review(filter: { name: { eq: "Guillermo Rauch" } }) {
        ...reviewFields
      }
    }
    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

function Developers({ integrations, preview, page, review }) {
  return (
    <Layout preview={preview}>
      <Head seo={page.seo} slug={page.slug} />
      <Hero
        seoAnalysis={page.yoastAnalysis}
        kicker={page.seoH1}
        title={
          <>
            Your tech stack is literally{' '}
            <Highlight>killing your business</Highlight>
          </>
        }
        subtitle={
          <>
            That’s right. You’re{' '}
            <strong>stuck with legacy web technologies</strong> that make all
            your websites and apps painfully slow and{' '}
            <strong>impossibly hard to build</strong>, maintain and improve.
            This needs to stop, now.
          </>
        }
      />
      <div id="main-content">
        <Space top={2} bottom={2}>
          <InterstitialTitle style="two">
            Does any of this sound painfully&nbsp;familiar?
          </InterstitialTitle>
        </Space>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          style="bad"
          kicker="A CMS should be fast"
          title={
            <>
              Your website is <FlagHighlight style="bad">slow</FlagHighlight>
            </>
          }
          subtitle={
            <>
              Got the guts to run{' '}
              <a
                href="https://developers.google.com/speed/pagespeed/insights/"
                target="_blank"
                rel="noreferrer"
              >
                PageSpeed
              </a>
              ?
            </>
          }
          image="rock-balloons"
        >
          <p>
            <strong>
              Try to check the performance of your site, we’ll wait
            </strong>
            . Unoptimized images, heavy pages and a shameful overall score?
            Well, it’s not your fault. The web is much harder than it was, and
            you’re using legacy tools that force devs to solve performance
            issues on their own. <br /> Find out why DatoCMS is considered one
            of the <strong>best CMS for developers</strong>.
          </p>
        </Flag>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="A CMS should grow with you"
          style="bad"
          title={
            <>
              Your architecture{' '}
              <FlagHighlight style="bad">doesn&apos;t&nbsp;scale</FlagHighlight>
            </>
          }
          subtitle="Can it handle massive spikes and adapt costs in real-time?"
          image="castle"
        >
          <p>
            As long as you’re receiving the usual amount of web traffic, pretty
            much any solution can work. But{' '}
            <strong>
              is your stack capable of handling prime-time TV website traffic
              without becoming completely unusable?
            </strong>{' '}
            And if so, what’s the up-front cost you’re paying for that?
          </p>
        </Flag>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          style="bad"
          kicker="A CMS should be tameable"
          title={
            <>
              Your CMS{' '}
              <FlagHighlight style="bad">
                is&nbsp;not&nbsp;flexible
              </FlagHighlight>
            </>
          }
          subtitle="Are your editors free to change websites without asking help from devs?"
          image="statue"
        >
          <p>
            It should not be your job to constantly make tiny changes to
            copy/images as asked by marketing/content teams. Yet, to delegate
            the job directly to them,{' '}
            <strong>
              your CMS must be able to enforce strict validation rules to
              editors, and have a fast way to continuously adapt the backend to
              their needs
            </strong>
            . Is that the case?
          </p>
        </Flag>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="A CMS should be efficient"
          style="bad"
          title={
            <>
              You&#39;re{' '}
              <FlagHighlight style="bad">wasting&nbsp;time</FlagHighlight>
            </>
          }
          subtitle="Are your projects reusing code and good practices?"
          image="cuckoo"
        >
          <p>
            Most enterprises have many teams working on very similar dev
            projects, yet successful approaches learnt from deploying one
            product need to be manually rebuilt in each new product. How
            efficient is that?{' '}
            <strong>
              Teams should have a fast, standardized way of working.
            </strong>
          </p>
        </Flag>

        <TitleStripWithContent
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS makes developers happy"
          title={<>Stop the madness, try&nbsp;headless</>}
        >
          <DatoIllustration />
        </TitleStripWithContent>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS is composable"
          style="good"
          title={
            <>
              The freedom to use{' '}
              <FlagHighlight>any modern web tool</FlagHighlight>
            </>
          }
          image="people"
        >
          <p>
            React, Vue, Gatsby, Next.js: take advantage of the best frameworks
            around, without carrying around CMS technical debt.{' '}
            <strong>
              Your content is reusable via API across any digital product
            </strong>{' '}
            — websites, apps, chatbots, IoT — any technology.
          </p>
        </Flag>

        <Quote review={review} />

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS is user-friendly"
          style="good"
          title={
            <>
              Content and presentation, <FlagHighlight>decoupled</FlagHighlight>
            </>
          }
          image="zen-garden"
        >
          <p>
            By making your editorial team write content using a structured,
            presentation-free format with a strict set of validation rules,
            <strong>
              you’ll remove any content bottleneck when shipping new digital
              projects
            </strong>
            .
          </p>
        </Flag>

        <IntegrationsBanner
          title={<>Extensible and integrable by&nbsp;design</>}
          bubbles={integrations
            .filter((i) =>
              [
                'ci',
                'static-generator',
                'language',
                'cdn',
                'framework',
              ].includes(i.integrationType.slug),
            )
            .slice(0, 30)
            .map((integration) => (
              <LazyImage
                key={integration.id}
                src={
                  integration.squareLogo
                    ? integration.squareLogo.url
                    : integration.logo.url
                }
              />
            ))}
        >
          Being a API-first <Link href="/">headless CMS</Link>,{' '}
          <strong>
            DatoCMS easily integrates with any third-party platform or service
          </strong>
          . DatoCMS is considered to be the best CMS for developers because it
          offers some of the best tools in the market: plugins, webhooks,
          templates and SDKs to get you started in no time. Check them out on
          our{' '}
          <a
            href="https://github.com/datocms/"
            target="_blank"
            rel="noreferrer"
          >
            official Github page
          </a>
        </IntegrationsBanner>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS is flexible"
          style="good"
          title={
            <>
              All the <FlagHighlight>modelling flexibility</FlagHighlight> you
              need
            </>
          }
          image="fruit"
        >
          <p>
            From business-critical product pages, to dynamic landing-pages or
            tiny microcopy:{' '}
            <strong>
              we give you all the flexibility you need to model any kind of
              content
            </strong>
            . And, most importantly, to change it over time.
          </p>
        </Flag>

        <Numbers title="Why you should use DatoCMS">
          <NumbersBlock href="/customers/chillys" title="+134%" logo={Chillys}>
            Mobile conversion rate
          </NumbersBlock>
          <NumbersBlock
            href="/customers/wonderland"
            title="6x"
            logo={Wonderland}
          >
            Faster loading times
          </NumbersBlock>
          <NumbersBlock
            href="/customers/matter-supply"
            title="0,9s"
            logo={MatterSupply}
          >
            First contentful paint
          </NumbersBlock>
        </Numbers>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS is built by developers for developers"
          style="good"
          title={
            <>
              Build products, <FlagHighlight>not infrastructure</FlagHighlight>
            </>
          }
          image="bear-bird"
        >
          <p>
            You’re not the one that should worry about traffic spikes,
            performance or maintenance:{' '}
            <strong>
              our managed global CDN will always ensure that your content is
              accessible, secure, and close
            </strong>{' '}
            to every visitor.
          </p>
        </Flag>

        <TitleStripWithContent
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS dev experience empowers all team"
          title={
            <>
              A technology investment that doubles performace and dev team
              productivity
            </>
          }
        >
          <div className={styles.grid}>
            <Result
              number="-92,5%"
              label={
                <>
                  <Highlight style="good">lines of code</Highlight>
                </>
              }
            >
              <strong>Arduino</strong> could transition from 26,000 lines of
              code to just 1,200 switching to DatoCMS.
            </Result>
            <Result
              number="-79%"
              href="/customers/hashicorp"
              label={
                <>
                  in <Highlight style="good">operational costs</Highlight>
                </>
              }
            >
              <strong>HashiCorp</strong> was able to drammatically cut down
              server expenses.
            </Result>
            <Result
              number="0,9s"
              href="/customers/matter-supply"
              label={
                <>
                  in <Highlight style="good">loading times</Highlight>
                </>
              }
            >
              <strong>Matter Supply</strong> was able to scale to 200k views/day
              without sacrificing speed and reliability.
            </Result>
          </div>
        </TitleStripWithContent>

        <OtherPersonasPicker
          title="Not just for developers"
          currentPersonas="developers"
        />
      </div>
    </Layout>
  );
}

export default Developers;
