import { generatePaths, generateProps } from 'lib/appQueries';
import { useRouter } from 'next/router';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import PostContent from 'components/PostContent';
import docPageStyles from 'pages/docs/pageStyle.module.css';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import s from 'pages/plugins/i/[...chunks]/style.module.css';
import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import { Image } from 'react-datocms';
import PluginBox, { LogoImage } from 'components/PluginBox';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  Header,
  Back,
  Badge,
} from 'components/PluginToolkit';
import { Copy, Image as FakeImage } from 'components/FakeContent';

export const getStaticPaths = generatePaths('allEnterpriseApps');
export const getStaticProps = generateProps('enterpriseApp');

export default function EnterpriseApp({ page, preview }) {
  const { isFallback } = useRouter();

  return (
    <Layout preview={preview}>
      {!isFallback && <Head>{renderMetaTags(page.seo)}</Head>}

      <Wrapper>
        <div className={s.root}>
          <Back href="/integrations" label="All integrations" />
          <div className={s.split}>
            <div className={s.sidebar}>
              <div className={s.sidebarInner}>
                <PluginBox
                  isFallback={isFallback}
                  title={!isFallback && page.title}
                  image={!isFallback && <LogoImage logo={page.logo} />}
                  description={!isFallback && page.shortDescription}
                  actions={
                    <Button
                      as="a"
                      href="http://localhost:3000/support?topics=business-partnerships/general-requests"
                      target="_blank"
                    >
                      Request activation
                    </Button>
                  }
                />

                <div className={s.info}>
                  <PluginInfo>
                    <Info title="Publisher">
                      <NameWithGravatar
                        email="support@datocms.com"
                        name="DatoCMS"
                      />
                    </Info>
                    <Info title="First released">
                      <FormattedDate date={'2019-03-12'} />
                    </Info>
                  </PluginInfo>
                </div>
              </div>
            </div>
            <div className={s.content}>
              <Header
                isFallback={isFallback}
                title={
                  !isFallback && (
                    <>
                      {page.title} <Badge>Enterprise integration</Badge>
                    </>
                  )
                }
                description={!isFallback && page.description}
              >
                {!isFallback &&
                  page.gallery.map(image => (
                    <Image
                      key={image.id}
                      explicitWidth
                      data={image.responsiveImage}
                    />
                  ))}
              </Header>

              <div className={s.readme}>
                {isFallback ? (
                  <>
                    <Copy />
                    <FakeImage />
                    <Copy />
                  </>
                ) : (
                  <PostContent
                    isFallback={isFallback}
                    content={page && page.content}
                    style={docPageStyles}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
