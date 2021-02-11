import { useState } from 'react';
import s from './style.module.css';
import { LanguageConsumer } from 'components/LanguagePicker';
import humps from 'humps';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';

const toArray = (t) => (Array.isArray(t) ? t : [t]);

const Button = ({ children, label, open, onToggle }) => (
  <>
    <button className={s.button} onClick={() => onToggle((open) => !open)}>
      {open ? <TimesIcon /> : <PlusIcon />}
      {open ? `Hide ${label}` : `Show ${label}`}
    </button>
    {open && children}
  </>
);

function PatternProperties({ prefix, schema, level, hideRequiredOptional }) {
  const content = (
    <>
      {Object.entries(schema.patternProperties).map(([keyPattern, schema]) => {
        let name = keyPattern;

        if (keyPattern.startsWith('^(?<languagecode>')) {
          keyPattern = '<locale>';
        }

        return (
          <JsonSchema
            key={keyPattern}
            required
            hideRequiredOptional={hideRequiredOptional}
            name={keyPattern}
            prefix={prefix}
            schema={schema}
            level={level + 1}
          />
        );
      })}
    </>
  );

  return level >= 1 ? <div className={s.properties}>{content}</div> : content;
}

export function Properties({
  prefix,
  schema,
  level,
  groupIsRequired,
  hideRequiredOptional,
}) {
  const required = groupIsRequired ? schema.required || [] : [];

  const content = (
    <>
      {required.map((name) => (
        <JsonSchema
          key={name}
          required
          hideRequiredOptional={hideRequiredOptional}
          name={name}
          prefix={prefix}
          schema={schema.properties[name]}
          level={level + 1}
        />
      ))}
      {Object.entries(schema.properties)
        .filter(
          ([name, schema]) =>
            !required.includes(name) &&
            !schema.deprecated &&
            !schema.hideFromDocs,
        )
        .map(([name, schema]) => (
          <JsonSchema
            key={name}
            hideRequiredOptional={hideRequiredOptional}
            name={name}
            prefix={prefix}
            schema={schema}
            level={level + 1}
          />
        ))}
    </>
  );

  return level >= 1 ? <div className={s.properties}>{content}</div> : content;
}

function Deprecated({ prefix, schema, level, hideRequiredOptional }) {
  const required = schema.required || [];

  const deprecated = Object.entries(schema.properties).filter(
    ([name, schema]) => !required.includes(name) && schema.deprecated,
  );

  if (deprecated.length == 0) {
    return null;
  }

  return (
    <>
      <div className={s.deprecatedTitle}>Deprecated</div>
      {deprecated.map(([name, schema]) => (
        <JsonSchema
          key={name}
          hideRequiredOptional={hideRequiredOptional}
          name={name}
          prefix={prefix}
          schema={schema}
          level={level + 1}
        />
      ))}
    </>
  );
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
                <ReactMarkdown source={description[value]} />
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

function Relationship({ name, schema, required, hideRequiredOptional }) {
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
            {(language === 'http' || multipleRelationshipsPossible) && (
              <span className={s.prefix}>relationships.</span>
            )}
            <span className={s.name}>
              {language === 'javascript' ? humps.camelize(name) : name}
            </span>
            {language === 'http' && <span className={s.prefix}>.data</span>}
            &nbsp;&nbsp;
            {language === 'http' || multipleRelationshipsPossible ? (
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
            {!hideRequiredOptional && (
              <>
                &nbsp;&nbsp;
                {required ? (
                  <span className={s.required}>Required</span>
                ) : (
                  <span className={s.optional}>Optional</span>
                )}
              </>
            )}
          </div>
          {schema.description && (
            <div className={s.description}>
              <ReactMarkdown source={schema.description} />
            </div>
          )}
        </div>
      )}
    </LanguageConsumer>
  );
}

function Relationships({
  relationships,
  groupIsRequired,
  hideRequiredOptional,
}) {
  const required = groupIsRequired ? relationships.required || [] : [];

  return (
    <>
      {required.map((name) => (
        <Relationship
          key={name}
          required
          hideRequiredOptional={hideRequiredOptional}
          name={name}
          schema={relationships.properties[name]}
        />
      ))}
      {Object.entries(relationships.properties)
        .filter(([name]) => !required.includes(name))
        .map(([name, schema]) => (
          <Relationship
            key={name}
            name={name}
            schema={schema}
            hideRequiredOptional={hideRequiredOptional}
          />
        ))}
    </>
  );
}

export function JsonSchema({
  level = 0,
  name,
  prefix,
  required,
  hideRequiredOptional,
  schema,
}) {
  const [open, setOpen] = useState(false);

  return (
    <LanguageConsumer>
      {(language) => (
        <div className={s.schema}>
          {name && (
            <div className={s.header}>
              {prefix && <span className={s.prefix}>{prefix}</span>}
              <span className={s.name}>
                {language === 'javascript' ? humps.camelize(name) : name}
              </span>
              &nbsp;&nbsp;
              <Type schema={schema} />
              {schema.deprecated && (
                <>
                  &nbsp;&nbsp;
                  <span className={s.required}>Deprecated</span>
                </>
              )}
              {!hideRequiredOptional && (
                <>
                  &nbsp;&nbsp;
                  {required ? (
                    <span className={s.required}>Required</span>
                  ) : (
                    <span className={s.optional}>Optional</span>
                  )}
                </>
              )}
            </div>
          )}
          {schema.description && (
            <div className={s.description}>
              <ReactMarkdown source={schema.description} />
            </div>
          )}
          {schema.deprecated && (
            <div className={s.deprecatedDescription}>
              <ReactMarkdown source={schema.deprecated} />
            </div>
          )}
          {toArray(schema.type).includes('object') && schema.properties && (
            <Button open={open} label="object format" onToggle={setOpen}>
              <Properties
                schema={schema}
                level={level}
                hideRequiredOptional={hideRequiredOptional}
              />
            </Button>
          )}
          {toArray(schema.type).includes('object') && schema.patternProperties && (
            <Button open={open} label="object format" onToggle={setOpen}>
              <PatternProperties
                schema={schema}
                level={level}
                hideRequiredOptional={hideRequiredOptional}
              />
            </Button>
          )}
          {schema.enum && (
            <>
              <Button open={open} onToggle={setOpen} label="enum values">
                <Enum
                  values={schema.enum}
                  description={schema.enumDescription}
                />
              </Button>
            </>
          )}
          {toArray(schema.type).includes('array') &&
            schema.items.type === 'object' &&
            schema.items.properties && (
              <Button
                open={open}
                onToggle={setOpen}
                label="objects format inside array"
              >
                <Properties
                  schema={schema.items}
                  level={level}
                  hideRequiredOptional={hideRequiredOptional}
                />
              </Button>
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
      <h6>Query parameters</h6>
      <div>
        <Properties level={0} schema={schema} />
      </div>
    </>
  );
}

export function Schema({ title, schema, showId, hideRequiredOptional }) {
  return (
    <LanguageConsumer>
      {(language) => (
        <>
          <h6>{title}</h6>
          {(language === 'http' || showId) && schema.properties.id && (
            <div className={s.schema}>
              <div className={s.header}>
                <span className={s.name}>id</span>&nbsp;&nbsp;
                <Type schema={schema.properties.id} />
              </div>
              <div className={s.description}>
                {schema.properties.id.description}
              </div>
            </div>
          )}
          {language === 'http' && (
            <div className={s.schema}>
              <div className={s.header}>
                <span className={s.name}>type</span>&nbsp;&nbsp;
                <Type schema={schema.properties.type} />
              </div>
              <div className={s.description}>
                Must be exactly <code>"{schema.properties.type.example}"</code>
              </div>
            </div>
          )}
          {schema.properties.attributes &&
            schema.properties.attributes.properties && (
              <Properties
                level={0}
                prefix={language === 'http' ? 'attributes.' : null}
                groupIsRequired={schema.required.includes('attributes')}
                hideRequiredOptional={hideRequiredOptional}
                schema={schema.properties.attributes}
              />
            )}
          {schema.properties.meta && schema.properties.meta.properties && (
            <Properties
              level={0}
              prefix="meta."
              groupIsRequired={schema.required.includes('meta')}
              hideRequiredOptional={hideRequiredOptional}
              schema={schema.properties.meta}
            />
          )}
          {schema.properties.relationships && (
            <Relationships
              groupIsRequired={schema.required.includes('relationships')}
              relationships={schema.properties.relationships}
              hideRequiredOptional={hideRequiredOptional}
            />
          )}
          {schema.properties.attributes &&
            schema.properties.attributes.properties && (
              <Deprecated
                level={0}
                prefix={language === 'http' ? 'attributes.' : null}
                hideRequiredOptional={hideRequiredOptional}
                schema={schema.properties.attributes}
              />
            )}
        </>
      )}
    </LanguageConsumer>
  );
}
