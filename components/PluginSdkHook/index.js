import Heading from 'components/Heading';
import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';
import GithubIcon from 'public/icons/brands/github.svg';
import { useState } from 'react';
import slugify from 'utils/slugify';
import s from './style.module.css';

const baseUrl =
  'https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/types.ts';

const MarkdownHeading = ({ level, children, node }) => {
  return (
    <Heading
      anchor={slugify(node.children[0].value)}
      as={`h${level}`}
      data-with-anchor
    >
      {children}
    </Heading>
  );
};

const Markdown = ({ children }) => (
  <ReactMarkdown
    components={{
      // eslint-disable-next-line react/display-name
      h2: MarkdownHeading,
      h3: MarkdownHeading,
      h4: MarkdownHeading,
      h5: MarkdownHeading,

      // eslint-disable-next-line react/display-name
      pre: ({ children }) => <>{children}</>,
      // eslint-disable-next-line react/display-name
      code: ({ inline, className, children }) => {
        const match = /language-(\w+)/.exec(className || '');
        return inline ? (
          <code>{children}</code>
        ) : (
          <Prism
            code={String(children).replace(/\n$/, '')}
            language={match ? match[1] : 'unknown'}
            showLineNumbers
          />
        );
      },
    }}
  >
    {children}
  </ReactMarkdown>
);

const ExpandablePane = ({ children, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={s.button} onClick={() => setOpen((open) => !open)}>
        {open ? <TimesIcon /> : <PlusIcon />}
        {open ? `Hide ${label}` : `Show ${label}`}
      </button>
      {open && children}
    </>
  );
};

export default function Hook({ hook }) {
  return (
    <div key={hook.name}>
      <Heading anchor={hook.name} as="h3">
        <code>{hook.name}</code>
      </Heading>
      <Markdown>{hook.description}</Markdown>
      {hook.returnType && (
        <>
          <Heading
            anchor={`${hook.name}-context`}
            as="h5"
            className={s.subchapter}
          >
            Return value
          </Heading>
          <p>
            The function must return{' '}
            {hook.returnType.isArray ? 'an array of objects' : 'an object'} with
            the following structure:
          </p>
          <ExpandablePane label="structure">
            <div className={s.propertyGroup}>
              {hook.returnType.properties
                .sort((a, b) => a.lineNumber - b.lineNumber)
                .map((item) => (
                  <div key={item.name} className={s.hook}>
                    <div className={s.hookName}>
                      <a
                        href={`${baseUrl}#L${item.lineNumber}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                        <GithubIcon />
                      </a>{' '}
                      {item.isOptional ? (
                        <span className={s.optional}>Optional</span>
                      ) : (
                        <span className={s.required}>Required</span>
                      )}
                    </div>
                    <div className={s.hookDescription}>
                      <Markdown>{item.description}</Markdown>
                    </div>
                  </div>
                ))}
            </div>
          </ExpandablePane>
        </>
      )}
      {hook.ctx && (
        <>
          <Heading
            anchor={`${hook.name}-context`}
            as="h5"
            className={s.subchapter}
          >
            Properties/methods available in context
          </Heading>
          <p>The following information and methods are available:</p>
          {hook.ctx.map((group) => {
            const name = group.name
              .replace('AdditionalMethods', 'Methods')
              .replace('AdditionalProperties', 'Properties')
              .replace('Methods', ' methods')
              .replace('Properties', ' properties');

            return (
              <ExpandablePane label={`${name}`} key={name}>
                <div className={s.groupDescription}>
                  <Markdown>{group.description}</Markdown>
                </div>
                <div className={s.propertyGroup}>
                  {(group.properties || []).map((item) => (
                    <div key={item.name} className={s.hook}>
                      <div className={s.hookName}>
                        <a
                          href={`${baseUrl}#L${item.lineNumber}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.name}
                          {item.type === 'function' ? '()' : ''}
                          <GithubIcon />
                        </a>
                      </div>
                      <div className={s.hookDescription}>
                        <Markdown>{item.description}</Markdown>
                      </div>
                      {item.example && (
                        <Prism code={item.example} language="ts" />
                      )}
                    </div>
                  ))}
                </div>
              </ExpandablePane>
            );
          })}
        </>
      )}
      {hook.example && <Prism code={hook.example} language="js" />}
    </div>
  );
}
