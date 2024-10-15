import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Legal from 'components/Legal';
import Link from 'next/link';


export default function LegalPage({ body }) {
  return (
    <Layout>
      <Head noIndex>
        <title>Legal Pages</title>
      </Head>
      <Hero
        kicker="Legal Pages"
        title={
          <>
            <Highlight>Policies</Highlight>
          </>
        }
      />
      <Legal>
        <div>
          <h3>
            The following pages cover our security and policies:
          </h3>
          <ul>
          <li>
          <strong><Link href="/legal/cookie-policy" rel="noopener noreferrer">
            Cookie Policy
          </Link></strong>: <span>Understand our use of cookies and tracking.</span>
        </li>
        <li>
        <strong><Link href="/legal/gdpr" rel="noopener noreferrer">
            GDPR Compliance
          </Link></strong>: <span>Information on how we handle personally identifiable data.</span>
        </li>
        <li>
        <strong><Link href="/legal/privacy-policy" rel="noopener noreferrer">
            Privacy Policy
          </Link></strong>: <span>How we collect and process your data.</span>
        </li>
        <li>
        <strong><Link href="/legal/security" rel="noopener noreferrer">
            Security
          </Link></strong>: <span>Our internal security policies.</span>
        </li>
        <li>
        <strong><Link href="/legal/terms" rel="noopener noreferrer">
            Terms of Service
          </Link></strong>: <span>The terms and conditions for using DatoCMS.</span>
        </li>
      </ul>
          </div>
      </Legal>
    </Layout>
  );
}
