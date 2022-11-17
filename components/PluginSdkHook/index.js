import Heading from 'components/Heading';
import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';
import GithubIcon from 'public/icons/brands/github.svg';
import removeMarkdown from 'remove-markdown';
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

const ExpandableAttribute = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div key={item.name} className={s.hook}>
      <div className={s.hookExpand} onClick={() => setOpen((open) => !open)}>
        {open ? <TimesIcon /> : <PlusIcon />}
      </div>
      <div className={s.hookBody}>
        <button className={s.hookName} onClick={() => setOpen((open) => !open)}>
          <span className={s.hookNameName}>
            ctx.{item.name}
            {item.type === 'function' ? '()' : ''}
          </span>
          {!open && (
            <span className={s.hookNameDesc}>
              {removeMarkdown(item.description)}
            </span>
          )}
        </button>
        {open && (
          <div className={s.hookDeets}>
            <div className={s.hookDescription}>
              <Markdown>{item.description}</Markdown>
              <a
                href={`${baseUrl}#L${item.lineNumber}`}
                target="_blank"
                rel="noreferrer"
                className={s.hookGithub}
              >
                View on Github <GithubIcon />
              </a>
            </div>
            {item.example && <Prism code={item.example} language="ts" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Hook({ hook }) {
  const ctxAttrs =
    hook.ctx && hook.ctx.map((group) => group.properties || []).flat();

  const ctxProperties =
    ctxAttrs &&
    ctxAttrs
      .filter((i) => i.type !== 'function')
      .sort((a, b) => a.name.localeCompare(b.name));

  const ctxMethods =
    ctxAttrs &&
    ctxAttrs
      .filter((i) => i.type === 'function')
      .sort((a, b) => a.name.localeCompare(b.name));

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
          {hook.returnType.properties ? (
            <>
              <p>
                The function must return{' '}
                {hook.returnType.isArray ? 'an array of objects' : 'an object'}{' '}
                with the following structure:
              </p>
              <ExpandablePane label="structure">
                <div className={s.propertyGroup}>
                  {hook.returnType.properties
                    .sort((a, b) => a.lineNumber - b.lineNumber)
                    .map((item) => (
                      <div key={item.name} className={s.returnValue}>
                        <div className={s.returnValueName}>
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
                        <div className={s.returnValueDescription}>
                          <Markdown>{item.description}</Markdown>
                        </div>
                      </div>
                    ))}
                </div>
              </ExpandablePane>
            </>
          ) : (
            <>
              <p>
                The{' '}
                {hook.returnType.isMaybePromise ? '(optionally async) ' : ' '}
                function must return{' '}
                {hook.returnType.isArray
                  ? `an array of ${hook.returnType.type}`
                  : `a ${hook.returnType.type}`}
                .
              </p>
            </>
          )}
        </>
      )}
      {hook.ctx && (
        <>
          {ctxProperties && ctxProperties.length > 0 && (
            <>
              <Heading
                anchor={`${hook.name}-context-properties`}
                as="h5"
                className={s.subchapter}
              >
                Properties available in context
              </Heading>
              <p>The following information and methods are available:</p>
              {ctxProperties.map((item) => (
                <ExpandableAttribute item={item} key={item.name} />
              ))}
            </>
          )}
          {ctxMethods && ctxMethods.length > 0 && (
            <>
              <Heading
                anchor={`${hook.name}-context-methods`}
                as="h5"
                className={s.subchapter}
              >
                Methods available in context
              </Heading>
              <p>The following information and methods are available:</p>
              {ctxMethods.map((item) => (
                <ExpandableAttribute item={item} key={item.name} />
              ))}
            </>
          )}
        </>
      )}
      {hook.example && <Prism code={hook.example} language="js" />}
    </div>
  );
}
