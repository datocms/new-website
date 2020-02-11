import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import GraphQlDemo from 'components/GraphQlDemo';
import Wrapper from 'components/Wrapper';
import TitleStripWithContent from 'components/TitleStripWithContent';

import ImgixTransformations from 'components/ImgixTransformations';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';

import s from './style.css';

function GraphQlContentApi() {
  return (
    <Layout>
      <Hero
        over="GraphQL Content API"
        title={
          <>
            GraphQL means <Highlight>superior developer experience</Highlight>
          </>
        }
        subtitle={
          <>
            GraphQL provides a complete and understandable description of the
            data in your API, gives clients the power to ask for exactly what
            they need and nothing more, makes it easier to evolve APIs over
            time, and enables powerful developer tools.
          </>
        }
      />

      <TitleStripWithContent
        title={<>Ask for what you need, get exactly that</>}
        subtitle={
          <>
            Send a GraphQL query to your API and get exactly what you need,
            nothing more and nothing less. GraphQL queries always return
            predictable results. Apps using GraphQL are fast and stable because
            they control the data they get, not the server.
          </>
        }
      >
        <GraphQlDemo />
      </TitleStripWithContent>

      <Flag
        style="good"
        title={
          <>
            Get many resources{' '}
            <FlagHighlight>in&nbsp;a&nbsp;single&nbsp;request</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
        GraphQL queries access not just the properties of one resource but also smoothly follow references between them. While typical REST APIs require loading from multiple URLs, GraphQL APIs get all the data your app needs in a single request. Apps using GraphQL can be quick even on slow mobile network connections.
        </p>
      </Flag>

      <TitleStripWithContent
        title={<>Move faster with powerful developer tools</>}
        subtitle={
          <>
            Know exactly what data you can request from your API without leaving your editor, highlight potential issues before sending a query, and take advantage of improved code intelligence. GraphQL makes it easy to build powerful tools like GraphiQL by leveraging your API’s type system.

          </>
        }
        image={Ill4}
      >
       Ciao
      </TitleStripWithContent>

      <Quote
        quote={
          <>
            With DatoCMS we made the impossibile: we launched a successful
            omnichannel campaign in <Highlight>less than a month</Highlight>.
          </>
        }
        author="Tizio Caio, Chief Marketing Officer @BigshotFirm"
      />
    </Layout>
  );
}

export default GraphQlContentApi;
