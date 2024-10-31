import Heading from 'components/Heading';
import Prism from 'components/Prism';
import GithubIcon from 'public/icons/brands/github.svg';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import removeMarkdown from 'remove-markdown';
import slugify from 'utils/slugify';
import s from './style.module.css';

const baseUrl =
  'https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/';

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
    <div className={s.pane}>
      <button
        type="button"
        className={s.expandablePaneButton}
        onClick={() => setOpen((open) => !open)}
      >
        {open ? <TimesIcon /> : <PlusIcon />}
        {label}
      </button>
      {open && <div className={s.expandablePaneContent}>{children}</div>}
    </div>
  );
};

const sortByNameWithNullOnTop = (a, b) => {
  // If both names are null, maintain their original order
  if (!a.name && !b.name) return 0;

  // If a's name is null, it should come first
  if (!a.name) return -1;

  // If b's name is null, it should come first
  if (!b.name) return 1;

  // If neither name is null, use localeCompare for alphabetical sorting
  return a.name.localeCompare(b.name);
};

function mergeUnnamedGroups(groups) {
  const mergedItems = {}; // To collect merged items

  const filteredGroups = groups.filter((group) => {
    // If group has no name and no comment, merge its items
    if (!group.name && !group.comment) {
      Object.assign(mergedItems, group.items); // Merge the items
      return false; // Exclude this group from the final array
    }
    return true; // Keep the group if it has a name or comment
  });

  // If there were any unnamed/uncommented groups, add the merged result as a new group
  if (Object.keys(mergedItems).length > 0) {
    filteredGroups.push({
      items: mergedItems, // Merged items from unnamed/uncommented groups
    });
  }

  return filteredGroups;
}

const PropertyOrMethod = ({ name, propertyOrMethod }) => {
  const [open, setOpen] = useState(false);

  console.log('propertyOrMethod', propertyOrMethod);

  return (
    <div key={name} className={s.hook}>
      <div className={s.hookExpand} onClick={() => setOpen((open) => !open)}>
        {open ? <TimesIcon /> : <PlusIcon />}
      </div>
      <div className={s.hookBody}>
        <button
          type="button"
          className={s.hookName}
          onClick={() => setOpen((open) => !open)}
        >
          <span className={s.hookNameName}>
            ctx.{name}
            {propertyOrMethod.type.startsWith('(') ? '()' : ''}
          </span>
          {!open && propertyOrMethod.comment?.markdownText && (
            <span className={s.hookNameDesc}>
              {removeMarkdown(propertyOrMethod.comment?.markdownText)}
            </span>
          )}
        </button>
        {open && (
          <div className={s.hookDeets}>
            <div className={s.hookDescription}>
              {propertyOrMethod.comment?.markdownText && (
                <Markdown>{propertyOrMethod.comment?.markdownText}</Markdown>
              )}
              <a
                href={`${baseUrl}${propertyOrMethod.location.filePath}#L${propertyOrMethod.location.lineNumber}`}
                target="_blank"
                rel="noreferrer"
                className={s.hookGithub}
              >
                View on Github <GithubIcon />
              </a>
            </div>
            {propertyOrMethod.comment?.example && (
              <Prism code={propertyOrMethod.comment?.example} language="ts" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function capitalize(input) {
  const transformed = input
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
  return transformed.charAt(0).toUpperCase() + transformed.slice(1);
}

function PropertiesOrMethodsGroupPane({ group, nonCollapsible }) {
  const content = (
    <>
      {group.comment?.markdownText && <div>{group.comment?.markdownText}</div>}
      {Object.entries(group.items)
        .filter(
          ([_name, propertyOrMethod]) =>
            !propertyOrMethod.comment?.deprecatedMarkdownText,
        )
        .map(([name, propertyOrMethod]) => (
          <PropertyOrMethod
            key={name}
            name={name}
            propertyOrMethod={propertyOrMethod}
          />
        ))}
    </>
  );

  return nonCollapsible ? (
    content
  ) : (
    <ExpandablePane
      label={group.name ? capitalize(group.name) : 'Properties and methods'}
    >
      {content}
    </ExpandablePane>
  );
}

export default function Hook({
  hook,
  baseCtx,
  selfResizingPluginFrameCtxSizingUtilities,
}) {
  const specific = mergeUnnamedGroups(
    [
      ...(hook.ctxArgument?.additionalProperties || []),
      ...(hook.ctxArgument?.additionalMethods || []),
    ].sort(sortByNameWithNullOnTop),
  );

  const base = mergeUnnamedGroups(
    [
      ...baseCtx.properties,
      ...baseCtx.methods,
      ...(hook.ctxArgument?.type === 'SelfResizingPluginFrameCtx'
        ? [selfResizingPluginFrameCtxSizingUtilities]
        : []),
    ].sort(sortByNameWithNullOnTop),
  );

  return (
    <div key={hook.name}>
      <Heading anchor={hook.name} as="h4">
        <code>{hook.name}()</code>
      </Heading>
      <Markdown>{hook.description}</Markdown>
      {hook.returnType !== 'void' && (
        <>
          <Heading
            anchor={`${hook.name}-context`}
            as="h5"
            className={s.subchapter}
          >
            Return value
          </Heading>
          <p>
            The function must return <code>{hook.returnType}</code>.
          </p>
        </>
      )}
      {hook.ctxArgument && (
        <>
          <Heading
            anchor={`${hook.name}-context-object`}
            as="h5"
            className={s.subchapter}
          >
            Context object
          </Heading>
          <p>
            The following properties and methods are available in the{' '}
            <code>ctx</code> argument:
          </p>

          {specific.length > 0 && (
            <ExpandablePane label="Hook-specific properties and methods">
              <p>
                This hook exposes additional information and operations specific
                to the context in which it operates.
              </p>
              {specific.length > 1 ? (
                specific.map((group) => (
                  <PropertiesOrMethodsGroupPane
                    key={group.name}
                    group={group}
                  />
                ))
              ) : (
                <PropertiesOrMethodsGroupPane
                  group={specific[0]}
                  nonCollapsible
                />
              )}
            </ExpandablePane>
          )}

          <ExpandablePane label="Properties and methods available in every hook">
            <p>
              Every hook available in the Plugin SDK shares the same minumum set
              of properties and methods.
            </p>

            {base.map((group) => (
              <PropertiesOrMethodsGroupPane key={group.name} group={group} />
            ))}
          </ExpandablePane>
        </>
      )}
    </div>
  );
}
