import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import GenericIntegrationsBanner from 'components/GenericIntegrationsBanner';
import { withDato } from 'lib/datocms';
import Quote from 'components/Quote';
import ProjectSettings from 'components/ProjectSettings';
import FieldSettings from 'components/FieldSettings';
import TranslatedUI from 'components/TranslatedUI';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';

import s from './style.css';

import argentina from 'public/images/flags/argentina.svg';
import australia from 'public/images/flags/australia.svg';
import austria from 'public/images/flags/austria.svg';
import belgium from 'public/images/flags/belgium.svg';
import brazil from 'public/images/flags/brazil.svg';
import canada from 'public/images/flags/canada.svg';
import china from 'public/images/flags/china.svg';
import denmark from 'public/images/flags/denmark.svg';
import england from 'public/images/flags/england.svg';
import finland from 'public/images/flags/finland.svg';
import france from 'public/images/flags/france.svg';
import germany from 'public/images/flags/germany.svg';
import greece from 'public/images/flags/greece.svg';
import ireland from 'public/images/flags/ireland.svg';
import italy from 'public/images/flags/italy.svg';
import mexico from 'public/images/flags/mexico.svg';
import netherlands from 'public/images/flags/netherlands.svg';
import newZealand from 'public/images/flags/new-zealand.svg';
import norway from 'public/images/flags/norway.svg';
import portugal from 'public/images/flags/portugal.svg';
import russia from 'public/images/flags/russia.svg';
import singapore from 'public/images/flags/singapore.svg';
import spain from 'public/images/flags/spain.svg';
import sweden from 'public/images/flags/sweden.svg';
import switzerland from 'public/images/flags/switzerland.svg';
import uk from 'public/images/flags/united-kingdom.svg';
import usa from 'public/images/flags/united-states-of-america.svg';

const icons = {
  argentina,
  australia,
  austria,
  belgium,
  brazil,
  canada,
  china,
  denmark,
  england,
  finland,
  france,
  germany,
  greece,
  ireland,
  italy,
  mexico,
  netherlands,
  newZealand,
  norway,
  portugal,
  russia,
  singapore,
  spain,
  sweden,
  switzerland,
  uk,
  usa,
};

function MultiLanguage() {
  return (
    <Layout>
      <Hero
        over="Multi-language"
        title={
          <>
            Easily localize <Highlight>all&nbsp;your&nbsp;content</Highlight>,
            from&nbsp;start&nbsp;to&nbsp;finish
          </>
        }
        subtitle={
          <>
            Reach your global audience by publishing multiple versions of your
            content in different languages. Select from +400 different locales
            to serve your content to the world.
          </>
        }
      />

      <Flag
        style="good"
        title={
          <>
            Translate your <FlagHighlight>websites and apps</FlagHighlight>
          </>
        }
        image={ProjectSettings}
      >
        <p>
          Add languages you'd like to support and start providing translations.
          Translations are delivered using the same scalable platform.
        </p>
      </Flag>

      <GenericIntegrationsBanner
        title={<>Localize both content&nbsp;and&nbsp;assets</>}
        bubbles={Object.entries(icons).map(([id, Icon]) => (
          <Icon key={id} />
        ))}
      >
        All your content and assets are localizable, including rich text,
        responsive images, geo-points, SEO metadata and especially your URLs.
      </GenericIntegrationsBanner>

      <Flag
        style="good"
        title={
          <>
            Great <FlagHighlight>flexibility and granularity</FlagHighlight>
          </>
        }
        image={FieldSettings}
      >
        <p>
          Specify which types of content need to be translated or not, and in
          which languages, on a per-field level. Feel free to set a field as
          localized, or change settings at any time, with no complex data
          migrations.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>Translated interface</FlagHighlight>
          </>
        }
        image={TranslatedUI}
      >
        <p>
          It’s super important to offer an easy-to-understand editing experience
          to your non-technical editors. That’s why the interface is available
          in English, Spanish, German, French, Italian, Dutch, Russian and
          Turkish (and counting!).
        </p>
      </Flag>
    </Layout>
  );
}

export default withDato(MultiLanguage);
