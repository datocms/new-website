import Button from 'components/Button';
import DocDescription from 'components/DocDescription';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import s from 'components/PostContent/style.module.css';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';

import fs from 'node:fs';
import util from 'node:util';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = await readFile(
    'pages/company/job-offers/senior-full-stack-dev/content.md',
    'utf8',
  );

  return {
    props: {
      body,
    },
  };
}

export default function JobOffer({ body }) {
  return (
    <Layout noCta={true}>
      <Head noIndex>
        <title>Remote Senior Full-Stack Developer</title>
      </Head>
      <Space bottom={2}>
        <Hero
          kicker="Job Offer"
          title={
            <>
              Remote Senior <Highlight>Full&#x2011;Stack&nbsp;Dev</Highlight>
            </>
          }
        />
      </Space>
      <Wrapper>
        <div className={s.body}>
          <DocDescription>{body}</DocDescription>
          <Space top={2}>
            <Button
              as="a"
              href="https://forms.datocms.com/form/ZVJLrToTQu2x-srNLLdk9Q"
              p="big"
              fs="big"
              block
            >
              Apply for this position →
            </Button>
          </Space>
        </div>
      </Wrapper>
    </Layout>
  );
}
