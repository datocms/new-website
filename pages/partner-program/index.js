import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Head from 'components/Head';
import fs from 'fs';
import util from 'util';
import s from './style.module.css';
import ReactMarkdown from 'react-markdown';
import Signature from 'public/images/signature.svg';
import Arrow from 'public/images/illustrations/arrow-sketch-1.svg';
import Textarea from 'react-textarea-autosize';
import { getData } from 'country-list';
import { Form, Field } from 'components/Form';
import { getCookie } from 'utils/cookies';
import Space from 'components/Space';
import InterstitialTitle from 'components/InterstitialTitle';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Link from 'next/link';

const AgencyForm = () => {
  const defaultValues = {
    agencyName: '',
    agencyUrl: '',
    country: '',
    email: getCookie('datoAccountEmail'),

    body: '',
    technologies: '',
    projectsPerQuarter: '',
    needsSalesMaterial: '',
    averagePricePerProject: '',
    additionalInfo: '',
  };

  return (
    <div className={s.form}>
      <Form
        defaultValues={defaultValues}
        submitLabel="Let's have a chat!"
        nativeSubmitForm
        action="https://webhook.frontapp.com/forms/f51dbf7c0379d350b50e/aiwRgx07C0Ix1B7x-Ex6B67cQpfHc9C_8taVomi6wfkt5nrcQIIoChC4AKU90ytYoSIyBXB9iUAzttmGijXse3tNA4LJdiOWwmF--Xbifq0RxMqHExLQKezhuYth"
      >
        <div className={s.formCols}>
          <Field
            name="agencyName"
            label="What's the name of your Agency?"
            placeholder="Acme Inc."
            validations={{ required: 'Required' }}
          />
          <Field
            name="agencyUrl"
            label="Do you have a website?"
            placeholder="https://www.acme.com"
            validations={{ required: 'Required' }}
          />
        </div>

        <div className={s.formCols}>
          <Field
            name="email"
            label="What's your DatoCMS account email?"
            placeholder="info@acme.com"
            validations={{
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i,
                message: 'Invalid email',
              },
            }}
          />

          <Field
            name="country"
            label="Where are you based?"
            validations={{ required: 'Required' }}
            options={getData()
              .map(({ code, name }) => ({
                value: code,
                label: name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </div>

        <Field
          name="body"
          label="Please introduce yourself and your Agency!"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea
              placeholder="The partner program is meant for web agencies only. If you think we should make an exception for you, let us know why!"
              {...field}
            />
          )}
        />

        <Field
          name="needsSalesMaterial"
          label="Would you benefit from some marketing/sales material from us?"
          placeholder="To understand if it's useful to have more documentation in this regard"
          validations={{ required: 'Required' }}
          options={[
            "Yes, that'd be REALLY useful",
            'Probably',
            'Meh, not really',
          ]}
        />

        <Field
          name="technologies"
          label="What technologies are you going to use, together with DatoCMS?"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea
              placeholder="Have you already used the Jamstack before? Which hosting platform, frameworks, etc. do you master?"
              {...field}
            />
          )}
        />

        <Field
          name="projectsPerQuarter"
          label="How many projects a quarter are you planning to do with DatoCMS?"
          placeholder="3-4 new projects every quarter"
          validations={{ required: 'Required' }}
        />

        <Field
          name="averagePricePerProject"
          label="On average, how much are you willing to spend per project for the CMS a month?"
          validations={{ required: 'Required' }}
          render={({ field }) => (
            <Textarea
              placeholder="If you've different kind of packages you're selling, with different price points and resources needed, we want to know them all!"
              {...field}
            />
          )}
        />

        <Field
          name="additionalInfo"
          label="If you have any additional question or concern, please ask!"
          render={({ field }) => (
            <Textarea
              placeholder="Looking forward to chat with you!"
              {...field}
            />
          )}
        />
      </Form>
    </div>
  );
};

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = await readFile('pages/partner-program/letter.md', 'utf8');

  return {
    props: {
      body,
    },
  };
}

export default function Agencies({ body }) {
  return (
    <Layout noCta>
      <Head>
        <title>Special pricing for agencies - DatoCMS</title>
      </Head>

      <Hero
        seoAnalysis={{ keyword: 'agencies', synonyms: '', relatedKeywords: [] }}
        kicker="Agency partner program"
        title={
          <>
            Agencies, we&apos;ve got a special&nbsp;deal{' '}
            <Highlight>for you</Highlight>.
          </>
        }
      />

      <div className={s.letterContainer}>
        <div className={s.elevator}>
          <div className={s.pre}>
            <p>Here&apos;s a letter from us, to you! </p>
            <p>
              Sorry for the length, but we think it might be worth it to know
              each other better 🙏
            </p>

            <Arrow />
          </div>
        </div>

        <div className={s.letter}>
          <ReactMarkdown>{body}</ReactMarkdown>
          <div className={s.signature}>
            <Signature />
            <div>Stefano, and all the DatoCMS team</div>
          </div>
        </div>
      </div>

      <Space top={3}>
        <TitleStripWithContent
          title={
            <>
              Introducing our <Highlight>Agency&nbsp;Partner program</Highlight>
            </>
          }
          subtitle={
            <div className={s.program}>
              <div className={s.programTitle}>
                Benefits and perks, in short:
              </div>
              <div className={s.perks}>
                <div className={s.perk}>
                  <div className={s.perkTitle}>Custom volume pricing</div>
                  <div className={s.perkDescription}>
                    Get a custom plan, tailored upon your needs, capable of
                    scaling with the number of projects, with no up-front
                    investment for you.
                  </div>
                </div>
                <div className={s.perk}>
                  <div className={s.perkTitle}>
                    On-call training time with our engineers
                  </div>
                  <div className={s.perkDescription}>
                    Book up to 2 hours per month with our core engineers, to
                    clear your doubts and help you get the most out of DatoCMS.
                  </div>
                </div>
                <div className={s.perk}>
                  <div className={s.perkTitle}>DatoCMS Partner badge</div>
                  <div className={s.perkDescription}>
                    The DatoCMS Partners badge shows that you have the latest
                    expertise while helping you stand out to clients and the
                    industry.
                  </div>
                </div>
                <div className={s.perk}>
                  <div className={s.perkTitle}>
                    Public listing on our website&apos;s Partners page
                  </div>
                  <div className={s.perkDescription}>
                    Get immediate visibility by showing up in our{' '}
                    <Link href="/partners">
                      <a>Partners catalogue</a>
                    </Link>
                    . Showcase your best DatoCMS projects and plugins to make
                    your profile stand out.
                  </div>
                </div>
                <div className={s.perk}>
                  <div className={s.perkTitle}>
                    Cross-marketing opportunities
                  </div>
                  <div className={s.perkDescription}>
                    Expand your reach, and your business by unlocking
                    co-marketing and co-selling opportunities with DatoCMS.
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Space>

      <Space top={3}>
        <InterstitialTitle
          kicker="Enroll the Agency Partner Program"
          below={
            <Space top={1}>
              Fill in this form, and we&apos;ll setup a quick 15 minutes call to
              know each other and enroll you in the program. You are one step
              away from unlocking all the benefits!
            </Space>
          }
        >
          Interested? <Highlight>Then let&apos;s talk!</Highlight>
        </InterstitialTitle>
      </Space>

      <AgencyForm />
    </Layout>
  );
}
