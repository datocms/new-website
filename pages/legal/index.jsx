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
              <Link href="/legal/privacy-policy" rel="noopener noreferrer">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/cookie-policy" rel="noopener noreferrer">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/gdpr" rel="noopener noreferrer">
                GDPR Compliance
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" rel="noopener noreferrer">
                Terms of Service
              </Link>
            </li>
          </ul>
          </div>
      </Legal>
    </Layout>
  );
}
