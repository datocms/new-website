import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import GraphQlDemo from 'components/GraphQlDemo';
import Wrapper from 'components/Wrapper';
import TitleStripWithContent from 'components/TitleStripWithContent';
import VideoPlayer from 'components/VideoPlayer';

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
        <GraphQlDemo height={11}>
          {async (typer, setResult) => {
            typer.insert('{\n  blogPost {}\n}');
            typer.moveTo(-3);

            await typer.wait(1000);

            typer.insert('\n');
            typer.insert('\n  ', { moveCursor: false });
            typer.indent(2);
            await typer.type('title');
            setResult({ blogPost: { title: 'Awesome post!' } });

            await typer.wait(800);
            typer.insert('\n');
            typer.indent(2);

            await typer.type('coverImage {');
            typer.insert('}', { moveCursor: false });
            await typer.wait(300);
            typer.insert('\n');
            typer.insert('\n    ', { moveCursor: false });
            typer.indent(3);
            await typer.wait(150);
            await typer.type('url');
            setResult({
              blogPost: {
                title: 'Awesome post!',
                coverImage: { url: 'https://datocms-assets.com/cover.png' },
              },
            });
            await typer.wait(1000);

            await typer.moveTo(6, { animate: true });

            await typer.type('\n');
            typer.indent(2);

            await typer.type('author {');
            typer.insert('}', { moveCursor: false });
            await typer.wait(300);
            typer.insert('\n');
            typer.indent(3);
            typer.insert('\n    ', { moveCursor: false });
            await typer.wait(150);
            await typer.type('name');
            setResult({
              blogPost: {
                title: 'Awesome post!',
                coverImage: { url: 'https://datocms-assets.com/cover.png' },
                author: { name: 'Mark Smith' },
              },
            });
            await typer.wait(2000);

            await typer.typeBackspace(12);
            await typer.deleteForward(6);
            await typer.typeBackspace(55);
            await typer.deleteForward(3);

            typer.reset();
          }}
        </GraphQlDemo>
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

      <TitleStripWithContent
        title={<>Move faster with powerful developer tools</>}
        subtitle={
          <>
            Know exactly what data you can request from your API without leaving
            your editor, highlight potential issues before sending a query, and
            take advantage of improved code intelligence. GraphQL makes it easy
            to build powerful tools like GraphiQL by leveraging your API’s type
            system.
          </>
        }
        image={Ill4}
      >
        <div className={s.video}>
          <VideoPlayer url="https://stream.mux.com/dRjI3lukuQDwksXF1sgLQ7Kj4GbAFzUq.m3u8" />
        </div>
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

      <TitleStripWithContent
        title={<>Get many resources in a single request</>}
        subtitle={
          <>
            GraphQL queries access not just the properties of one resource but
            also smoothly follow references between them. While typical REST
            APIs require loading from multiple URLs, GraphQL APIs get all the
            data your app needs in a single request. Apps using GraphQL can be
            quick even on slow mobile network connections.
          </>
        }
      >
        <GraphQlDemo height={12}>
          {async (typer, setResult) => {
            typer.insert('{\n  \n}');
            typer.moveTo(-2);
            await typer.wait(1000);

            await typer.wait(300);
            await typer.type('allProducts(first: 10) {');
            typer.insert('\n  }', { moveCursor: false });

            typer.insert('\n');
            typer.indent(2);
            await typer.type('title');

            setResult({
              allProducts: [
                {
                  title: 'Y.A.S. Teddy Jacket',
                },
                {
                  title: 'Vintage inspired puffer gilet',
                },
              ],
            });

            await typer.wait(500);

            typer.insert('\n');
            typer.indent(2);
            await typer.type('relatedProducts {');
            typer.insert('\n    }', { moveCursor: false });
            typer.insert('\n');
            typer.indent(3);
            await typer.wait(300);

            await typer.type('slug');
            setResult({
              allProducts: [
                {
                  title: 'Y.A.S. Teddy Jacket',
                  relatedProducts: [{ slug: 'belted-wrap-coat' }],
                },
                {
                  title: 'Vintage inspired puffer gilet',
                  relatedProducts: [{ slug: 'denim-gilet' }],
                },
              ],
            });
            await typer.wait(800);

            await typer.typeBackspace(12);
            await typer.deleteForward(6);
            await typer.typeBackspace(16);

            setResult({
              allProducts: [
                {
                  title: 'Y.A.S. Teddy Jacket',
                },
                {
                  title: 'Vintage inspired puffer gilet',
                },
              ],
            });

            await typer.wait(500);

            await typer.type('categories {');
            typer.insert('\n    }', { moveCursor: false });
            typer.insert('\n');
            typer.indent(3);
            await typer.wait(500);

            await typer.type('title');
            setResult({
              allProducts: [
                {
                  title: 'Y.A.S. Teddy Jacket',
                  categories: [{ title: 'Jackets & Coats' }],
                },
                {
                  title: 'Vintage inspired puffer gilet',
                  categories: [{ title: 'Gilets' }],
                },
              ],
            });
            await typer.wait(1000);

            await typer.typeBackspace(12);
            await typer.deleteForward(6);
            await typer.typeBackspace(16);
            await typer.typeBackspace(12);
            await typer.deleteForward(4);
            await typer.typeBackspace(23);

            typer.reset();
          }}
        </GraphQlDemo>
      </TitleStripWithContent>
    </Layout>
  );
}

export default GraphQlContentApi;
