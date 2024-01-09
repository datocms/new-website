import { LanguageConsumer } from 'components/LanguagePicker';
import Link from 'next/link';
import InfoCircleIcon from 'public/icons/regular/info-circle.svg';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';
import React, { createContext, useContext, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import s from './style.module.css';

const DefinitionContext = createContext(false);

const toArray = (t) => (Array.isArray(t) ? t : [t]);

const ExpandablePane = ({ children, label, open, onToggle }) => (
  <>
    <button className={s.button} onClick={() => onToggle((open) => !open)}>
      {open ? <TimesIcon /> : <PlusIcon />}
      {open ? `Hide ${label}` : `Show ${label}`}
    </button>
    {open && children}
  </>
);

function JsonSchemaObjectWithPatternProperties({ prefix, schema, depth }) {
  const content = (
    <>
      {Object.entries(schema.patternProperties).map(([keyPattern, schema]) => {
        let name = keyPattern;

        if (keyPattern.startsWith('^(?<languagecode>')) {
          keyPattern = '<locale>';
        }

        return (
          <JsonSchemaProperty
            key={keyPattern}
            required
            name={keyPattern}
            prefix={prefix}
            schema={schema}
            depth={depth + 1}
          />
        );
      })}
    </>
  );

  return depth >= 1 ? <div className={s.properties}>{content}</div> : content;
}

export function JsonSchemaObject({
  prefix,
  schema,
  depth,
  objectIsOptional,
  showProperties = 'all',
}) {
  const isDefinition = useContext(DefinitionContext);

  // in definitions all properties are always required, and
  // objectIsOptional is always false (that is, responses are all
  // with the same format). So in an endpoint schema it is important
  // to show deprecated properties that are required, while they can
  // be hidden in definitions

  // but even if in definitions required properties are not important,
  // (they all are), we want to use it to sort properties

  const required = objectIsOptional ? [] : schema.required || [];

  const allProperties = Object.keys(schema.properties).filter((name) => {
    const property = schema.properties[name];
    return !property.hideFromDocs;
  });

  const requiredProperties = required.filter((name) => {
    const property = schema.properties[name];

    if (property.hideFromDocs) {
      return false;
    }

    if (!isDefinition) {
      return true;
    }

    return !property.deprecated;
  });

  const optionalProperties = [];
  const deprecatedProperties = [];

  allProperties.forEach((name) => {
    if (requiredProperties.includes(name)) {
      return;
    }

    const property = schema.properties[name];

    if (property.deprecated) {
      deprecatedProperties.push(name);
    } else {
      optionalProperties.push(name);
    }
  });

  const [isOpen, setOpen] = useState(false);

  const content = (
    <>
      {['all', 'requiredAndOptional'].includes(showProperties) &&
        [...requiredProperties, ...optionalProperties].map((name) => {
          const property = schema.properties[name];

          return (
            <JsonSchemaProperty
              key={name}
              required={requiredProperties.includes(name)}
              name={name}
              prefix={prefix}
              schema={property}
              depth={depth + 1}
            />
          );
        })}
      {['all', 'deprecated'].includes(showProperties) &&
        deprecatedProperties.length > 0 && (
          <div className={s.deprecatedBlock}>
            <ExpandablePane
              label="deprecated"
              onToggle={() => setOpen((x) => !x)}
              open={isOpen}
            >
              <div className={s.deprecatedBlockInner}>
                {deprecatedProperties.map((name) => {
                  const property = schema.properties[name];

                  return (
                    <JsonSchemaProperty
                      key={name}
                      name={name}
                      prefix={prefix}
                      schema={property}
                      depth={depth + 1}
                    />
                  );
                })}
              </div>
            </ExpandablePane>
          </div>
        )}
    </>
  );

  return depth >= 1 ? <div className={s.properties}>{content}</div> : content;
}

function Enum({ values, description }) {
  return (
    <div className={s.properties}>
      {values
        .filter((x) => !!x)
        .map((value) => (
          <div key={value} className={s.schema}>
            <div className={s.header}>
              <span className={s.name}>{value}</span>
            </div>
            {description && description[value] && (
              <div className={s.description}>
                <ReactMarkdown>{description[value]}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

function Type({ schema }) {
  if (!schema || !schema.type) {
    return null;
  }

  return (
    <span className={s.types}>
      {toArray(schema.type).map((type, i) => {
        let realType = type;

        if (type === 'string' && schema.format) {
          realType = schema.format;
        }

        if (type === 'string' && schema.enum) {
          realType = 'enum';
        }

        if (type === 'string' && schema.const) {
          realType = `"${schema.const}"`;
        }

        if (realType === 'array') {
          realType =
            schema.items && schema.items.type
              ? `Array<${toArray(schema.items.type).join('/')}>`
              : 'Array';
        }

        return [
          i > 0 && ', ',
          <span className={s.type} key={type}>
            {realType}
          </span>,
        ];
      })}
    </span>
  );
}

function Relationship({ name, schema, required }) {
  const isDefinition = useContext(DefinitionContext);
  const dataSchema = schema.properties.data;

  const isArray = dataSchema.type === 'array';
  const resourceSchema = isArray ? dataSchema.items : dataSchema;

  const relationshipTypes = resourceSchema.type
    ? [resourceSchema.properties.type.example]
    : resourceSchema.anyOf.map((s) =>
        toArray(s.type).includes('null') ? 'null' : s.properties.type.example,
      );

  const multipleRelationshipsPossible =
    relationshipTypes.filter((t) => t !== 'null').length > 1;

  return (
    <LanguageConsumer>
      {(language) => (
        <div className={s.schema}>
          <div className={s.header}>
            {language === 'http' && (
              <span className={s.prefix}>relationships.</span>
            )}
            <span className={s.name}>{name}</span>
            {language === 'http' && <span className={s.prefix}>.data</span>}
            {!isDefinition && (
              <>
                &nbsp;&nbsp;
                {required ? (
                  <span className={s.required}>Required</span>
                ) : (
                  <span className={s.optional}>Optional</span>
                )}
                &nbsp;&nbsp;
              </>
            )}
            {['http', 'javascript'].includes(language) ||
            multipleRelationshipsPossible ? (
              <span className={s.types}>
                {isArray && (
                  <>
                    <span className={s.type}>Array</span> of{' '}
                  </>
                )}
                {relationshipTypes.map((type, i) => {
                  const url = `/docs/content-management-api/resources/${type}`;

                  return (
                    <React.Fragment key={type}>
                      {i > 0 && ', '}
                      {type === 'null' ? (
                        <span className={s.type}>null</span>
                      ) : (
                        <span className={s.type}>
                          {'{ type: "'}
                          {type}
                          {'", id: '}
                          <Link href={url}>
                            <a>{type}.id</a>
                          </Link>
                          {' }'}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </span>
            ) : (
              <span className={s.types}>
                {relationshipTypes.map((type, i) => {
                  const url = `/docs/content-management-api/resources/${type}`;

                  return (
                    <React.Fragment key={type}>
                      {i > 0 && ', '}
                      {type === 'null' ? (
                        <span className={s.type}>null</span>
                      ) : (
                        <Link href={url}>
                          <a className={s.type}>
                            {isArray ? `Array<${type}.id>` : `${type}.id`}
                          </a>
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </span>
            )}
            {schema.deprecated && (
              <>
                &nbsp;&nbsp;
                <span className={s.required}>Deprecated</span>
              </>
            )}
          </div>
          {schema.description && (
            <div className={s.description}>
              <ReactMarkdown>{schema.description}</ReactMarkdown>
            </div>
          )}
          {schema.deprecated && (
            <div className={s.deprecatedDescription}>
              <ReactMarkdown>{schema.deprecated}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </LanguageConsumer>
  );
}

function Relationships({ relationships, objectIsOptional }) {
  const required = objectIsOptional ? [] : relationships.required || [];

  return (
    <>
      {required.map((name) => (
        <Relationship
          key={name}
          required
          name={name}
          schema={relationships.properties[name]}
        />
      ))}
      {Object.entries(relationships.properties)
        .filter(([name]) => !required.includes(name))
        .map(([name, schema]) => (
          <Relationship key={name} name={name} schema={schema} />
        ))}
    </>
  );
}

export function JsonSchemaProperty({
  depth = 0,
  name,
  prefix,
  required,
  schema,
}) {
  const [open, setOpen] = useState(false);
  const isDefinition = useContext(DefinitionContext);

  return (
    <LanguageConsumer>
      {(language) => (
        <div className={s.schema}>
          {name && (
            <div className={s.header}>
              {prefix && <span className={s.prefix}>{prefix}</span>}
              <span className={s.name}>{name}</span>
              {schema.deprecated && (
                <>
                  &nbsp;&nbsp;
                  <span className={s.required}>Deprecated</span>
                </>
              )}
              {!isDefinition && (
                <>
                  &nbsp;&nbsp;
                  {required ? (
                    <span className={s.required}>Required</span>
                  ) : (
                    <span className={s.optional}>Optional</span>
                  )}
                </>
              )}
              &nbsp;&nbsp;
              <Type schema={schema} />
              {
                // The plural "examples" will array.join these: [true,false] -> "true,false"
                schema.examples && schema.examples.length ? (
                  <>
                    &nbsp;&nbsp;<span className={s.example}>Examples: </span>
                    {schema.examples.map((ex, i) => [
                      i > 0 && ', ',
                      <span className={s.type} key={i}>
                        {JSON.stringify(ex)}
                      </span>,
                    ])}
                  </>
                ) : // The singular example will just JSON stringify: [true, false] -> [true, false]
                schema.example ? (
                  <>
                    &nbsp;&nbsp;<span className={s.example}>Example: </span>
                    <span className={s.type}>
                      {JSON.stringify(schema.example)}
                    </span>
                  </>
                ) : null
              }
            </div>
          )}
          {schema.description && (
            <div className={s.description}>
              <ReactMarkdown>{schema.description}</ReactMarkdown>
            </div>
          )}
          {schema.deprecated && (
            <div className={s.deprecatedDescription}>
              <ReactMarkdown>{schema.deprecated}</ReactMarkdown>
            </div>
          )}
          {toArray(schema.type).includes('object') && schema.properties && (
            <ExpandablePane
              open={open}
              label="object format"
              onToggle={setOpen}
            >
              <JsonSchemaObject schema={schema} depth={depth} />
            </ExpandablePane>
          )}
          {toArray(schema.type).includes('object') && schema.patternProperties && (
            <ExpandablePane
              open={open}
              label="object format"
              onToggle={setOpen}
            >
              <JsonSchemaObjectWithPatternProperties
                schema={schema}
                depth={depth}
              />
            </ExpandablePane>
          )}
          {schema.enum && (
            <>
              <ExpandablePane
                open={open}
                onToggle={setOpen}
                label="enum values"
              >
                <Enum
                  values={schema.enum}
                  description={schema.enumDescription}
                />
              </ExpandablePane>
            </>
          )}
          {toArray(schema.type).includes('array') &&
            schema.items &&
            schema.items.type === 'object' &&
            schema.items.properties && (
              <ExpandablePane
                open={open}
                onToggle={setOpen}
                label="objects format inside array"
              >
                <JsonSchemaObject schema={schema.items} depth={depth} />
              </ExpandablePane>
            )}
        </div>
      )}
    </LanguageConsumer>
  );
}

export function HrefSchema({ schema }) {
  if (!schema.properties) {
    return null;
  }

  return (
    <>
      <h2>Query parameters</h2>
      <div>
        <JsonSchemaObject depth={0} schema={schema} />
      </div>
    </>
  );
}

export function Definition(props) {
  return (
    <DefinitionContext.Provider value={true}>
      <Schema {...props} />
    </DefinitionContext.Provider>
  );
}

export function Schema({ title, optional, schema, showId }) {
  const isDefinition = useContext(DefinitionContext);

  return (
    <LanguageConsumer>
      {(language) => (
        <>
          <h2>{title}</h2>
          {optional && (
            <div className={s.optionalSchema}>
              <InfoCircleIcon /> For this endpoint, the body is not required and
              can be entirely omitted
            </div>
          )}
          {(language === 'http' || showId) && schema.properties.id && (
            <div className={s.schema}>
              <div className={s.header}>
                <span className={s.name}>id</span>&nbsp;&nbsp;
                <Type schema={schema.properties.id} />
                {!isDefinition && (
                  <>
                    &nbsp;&nbsp;
                    {schema.required.includes('id') ? (
                      <span className={s.required}>Required</span>
                    ) : (
                      <span className={s.optional}>Optional</span>
                    )}
                  </>
                )}
              </div>
              <div className={s.description}>
                {schema.properties.id.description}
              </div>
            </div>
          )}
          {(language === 'http' ||
            (language === 'javascript' && isDefinition)) && (
            <div className={s.schema}>
              <div className={s.header}>
                <span className={s.name}>type</span>&nbsp;&nbsp;
                <Type schema={schema.properties.type} />
                {!isDefinition && (
                  <>
                    &nbsp;&nbsp;
                    {schema.required.includes('type') ? (
                      <span className={s.required}>Required</span>
                    ) : (
                      <span className={s.optional}>Optional</span>
                    )}
                  </>
                )}
              </div>
              <div className={s.description}>
                Must be exactly{' '}
                <code>&quot;{schema.properties.type.example}&quot;</code>
                {schema.properties.type.description && (
                  <p>{schema.properties.type.description}</p>
                )}
              </div>
            </div>
          )}
          {schema.properties.attributes &&
            schema.properties.attributes.properties && (
              <JsonSchemaObject
                depth={0}
                prefix={language === 'http' ? 'attributes.' : null}
                objectIsOptional={!schema.required.includes('attributes')}
                showProperties="requiredAndOptional"
                schema={schema.properties.attributes}
              />
            )}
          {schema.properties.meta && schema.properties.meta.properties && (
            <JsonSchemaObject
              depth={0}
              prefix="meta."
              objectIsOptional={!schema.required.includes('meta')}
              schema={schema.properties.meta}
            />
          )}
          {schema.properties.relationships && (
            <Relationships
              objectIsOptional={!schema.required.includes('relationships')}
              relationships={schema.properties.relationships}
            />
          )}
          {schema.properties.attributes &&
            schema.properties.attributes.properties && (
              <JsonSchemaObject
                depth={0}
                prefix={language === 'http' ? 'attributes.' : null}
                objectIsOptional={!schema.required.includes('attributes')}
                showProperties="deprecated"
                schema={schema.properties.attributes}
              />
            )}
        </>
      )}
    </LanguageConsumer>
  );
}
