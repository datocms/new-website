import { useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import * as components from 'datocms-react-ui';
import PlusIcon from 'public/icons/regular/plus.svg';
import ChevronDownIcon from 'public/icons/regular/chevron-down.svg';
import Prism from 'components/Prism';
import Tabs, { Tab } from 'components/Tabs';

import 'datocms-react-ui/styles.css';
import s from './style.module.css';

const StateManager = ({ initial, children }) => {
  const [value, setValue] = useState(initial);

  return children(value, setValue);
};

const reactUiComponents = {
  ...components,
  PlusIcon,
  ChevronDownIcon,
  StateManager,
};

const ReactUiExample = ({ example }) => {
  return (
    <div className={s['ReactUiExample']}>
      <Tabs>
        <Tab title="Preview">
          <div className={s['ReactUiExample__live']}>
            <div className={s['ReactUiExample__live__container']}>
              <MDXRemote
                {...example.serialized}
                scope={{
                  ctx: {
                    mode: 'renderPage',
                    bodyPadding: [0, 0, 0, 0],
                    theme: {
                      primaryColor: 'rgb(226, 87, 87)',
                      accentColor: 'rgb(75, 199, 216)',
                      semiTransparentAccentColor: 'rgb(75, 199, 216, 0.1)',
                      lightColor: 'rgb(229, 249, 252)',
                      darkColor: 'rgb(80, 50, 83)',
                    },
                  },
                }}
                components={reactUiComponents}
              />
            </div>
          </div>
        </Tab>
        <Tab title="Code">
          <Prism code={example.code} language="javascript" />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ReactUiExample;
