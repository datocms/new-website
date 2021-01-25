import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import {
  imageFields,
  reviewFields,
  gqlStaticProps,
  seoMetaTagsFields,
} from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import OtherPersonasPicker from 'components/OtherPersonasPicker';
import DatoIllustration from 'components/DatoIllustration';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import IntegrationsBanner from 'components/IntegrationsBanner';
import Quote from 'components/Quote';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Result from 'components/Result';
import LazyImage from 'components/LazyImage';
import Space from 'components/Space';
import Numbers, { Block as NumbersBlock } from 'components/Numbers';
import Wonderland from 'public/images/logos/wonderland.svg';
import Chillys from 'public/images/logos/chillys.svg';
import MatterSupply from 'public/images/logos/matter-supply.svg';
import styles from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    query {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      integrations: allIntegrations(
        first: 30
        filter: {
          integrationType: {
            in: ["166913", "166915", "166916", "166918", "166919"]
          }
        }
      ) {
        id
        logo {
          url
        }
        squareLogo {
          url
        }
      }
      review(filter: { name: { eq: "Matteo Manzo" } }) {
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
      <Head>
        {renderMetaTags(page.seo)}
        <title>DatoCMS for Developers - Team</title>
      </Head>
      <Hero
        kicker="DatoCMS for Developers"
        title={
          <>
            Your tech stack is literally{' '}
            <Highlight>killing your business</Highlight>
          </>
        }
        subtitle={
          <>
            That’s right. You’re stuck with legacy web technologies that make
            all your websites and apps painfully slow and impossibly hard to
            build, maintain and improve. This needs to stop, now.
          </>
        }
      />

      <Space top={2} bottom={2}>
        <InterstitialTitle style="two">
          Does any of this sound painfully&nbsp;familiar?
        </InterstitialTitle>
      </Space>

      <Flag
        style="bad"
        title={
          <>
            Your website is <FlagHighlight style="bad">slow</FlagHighlight>
          </>
        }
        subtitle="Got the guts to run PageSpeed?"
        image="rock-balloons"
      >
        <p>
          Try to check the performance of your site, we’ll wait. Unoptimized
          images, heavy pages and a shameful overall score? Well, it’s not your
          fault. The web is much harder than it was, and you’re using legacy
          tools that force devs to solve performance issues on their own.
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            Your architecture{' '}
            <FlagHighlight style="bad">doesn't&nbsp;scale</FlagHighlight>
          </>
        }
        subtitle="Can it handle massive spikes and adapt costs in real-time?"
        image="castle"
      >
        <p>
          As long as you’re receiving the usual amount of web traffic, pretty
          much any solution can work. But is your stack capable of handling
          prime-time TV website traffic without becoming completely unusable?
          And if so, what’s the up-front cost you’re paying for that?
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            Your CMS{' '}
            <FlagHighlight style="bad">is&nbsp;not&nbsp;flexible</FlagHighlight>
          </>
        }
        subtitle="Are your editors free to change websites without asking help from devs?"
        image="statue"
      >
        <p>
          It should not be your job to constantly make tiny changes to
          copy/images as asked by marketing/content teams. Yet, to delegate the
          job directly to them, your CMS must be able to enforce strict
          validation rules to editors, and have a fast way to continuously adapt
          the backend to their needs. Is that the case?
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            You're <FlagHighlight style="bad">wasting&nbsp;time</FlagHighlight>
          </>
        }
        subtitle="Are your projects reusing code and good practices?"
        image="cuckoo"
      >
        <p>
          Most enterprises have many teams working on very similar dev projects,
          yet successful approaches learnt from deploying one product need to be
          manually rebuilt in each new product. How efficient is that? Teams
          should have a fast, standardized way of working.
        </p>
      </Flag>

      <TitleStripWithContent title={<>Stop the madness, try&nbsp;headless</>}>
        <DatoIllustration />
      </TitleStripWithContent>

      <Flag
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
          around, without carrying around CMS technical debt. Your content is
          reusable via API across any digital product — websites, apps,
          chatbots, IoT — any technology.
        </p>
      </Flag>

      <Quote review={review} />

      <Flag
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
          presentation-free format with a strict set of validation rules, you’ll
          remove any content bottleneck when shipping new digital projects.
        </p>
      </Flag>

      <IntegrationsBanner
        title={<>Extensible and integrable by&nbsp;design</>}
        bubbles={integrations.map((integration) => (
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
        Being a API-first headless CMS, DatoCMS easily integrates with any
        third-party platform or service. Build your digital products by
        composing the best tools in the market: we offer plugins, webhooks,
        templates and SDKs to get you started in no time.
      </IntegrationsBanner>

      <Flag
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
          From business-critical product pages, to dynamic landing-pages or tiny
          microcopy: we give you all the flexibility you need to model any kind
          of content. And, most importantly, to change it over time.
        </p>
      </Flag>

      <Numbers title="Why you should use DatoCMS">
        <NumbersBlock href="/customers/chillys" title="+134%" logo={Chillys}>
          Mobile conversion rate
        </NumbersBlock>
        <NumbersBlock href="/customers/wonderland" title="6x" logo={Wonderland}>
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
        style="good"
        title={
          <>
            Build products, <FlagHighlight>not infrastructure</FlagHighlight>
          </>
        }
        image="bear-bird"
      >
        <p>
          You’re not the one that should worry about traffic spikes, performance
          or maintenance: our managed global CDN will always ensure that your
          content is accessible, secure, and close to every visitor.
        </p>
      </Flag>

      <TitleStripWithContent
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
            <strong>Arduino</strong> could transition from 26,000 lines of code
            to just 1,200 switching to DatoCMS.
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
            <strong>HashiCorp</strong> was able to drammatically cut down server
            expenses.
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
    </Layout>
  );
}

export default Developers;
