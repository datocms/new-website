import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import s from './style.module.css';

const Plan = ({
  name,
  description,
  price,
  priceKicker,
  priceSubtitle,
  bullets,
}) => (
  <>
    <div className={s.plan}>
      <div className={s.planHeader}>
        <div className={s.planName}>{name}</div>
        <div className={s.planDescription}>{description}</div>
        <div className={s.planPriceContainer}>
          <div className={s.planPriceKicker}>{priceKicker}</div>
          <div className={s.planPrice}>{price}</div>
          <div className={s.planPriceSubtitle}>{priceSubtitle}</div>
        </div>
      </div>
      <div className={s.planIncluded}>What's included?</div>
      <div className={s.planBullets}>{bullets}</div>
    </div>
  </>
);

export default function Pricing() {
  return (
    <Layout>
      <Head>
        <title>Pricing</title>
      </Head>
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
            Save tens of thousands of dollars annually by using DatoCMS headless
            technologies and content infrastructure
          </>
        }
      />
      <div className={s.plans}>
        <Wrapper>
          <div className={s.plansInner}>
            <Plan
              name="Developer"
              description="Perfect for small projects with low&nbsp;traffic"
              price="Free"
              priceSubtitle="No credit card needed"
              bullets={
                <ul>
                  <li>All of our standard features</li>
                  <li>Invite a single collaborator</li>
                  <li>Hard limits on quota</li>
                  <li>Community-based support</li>
                </ul>
              }
            />
            <Plan
              name="Professional"
              description="For larger teams &amp; high volume&nbsp;projects"
              priceKicker="From"
              price="€99"
              priceSubtitle="per project/month"
              bullets={
                <ul>
                  <li>All of our standard features</li>
                  <li>As many collaborators as you want</li>
                  <li>Soft limits on quota</li>
                  <li>Email support (24h response time)</li>
                </ul>
              }
            />
            <Plan
              name="Enterprise"
              description="For companies looking to build a lasting brand and drive growth "
              priceKicker="From"
              price="€1,500"
              priceSubtitle="per month"
              bullets={
                <ul>
                  <li>Private cloud, custom endpoints</li>
                  <li>Service level agreements</li>
                  <li>Custom quota, predictable costs</li>
                  <li>Onboarding, Slack/phone support</li>
                </ul>
              }
            />
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}

// - GraphQL API to fetch content
// - Unlimited plugins
// - Unlimited image transformations
// - AI-based smart image tagging
// - Granular roles and permissions
