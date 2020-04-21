import { useState } from 'react';
import s from './style.module.css';
import { LanguageConsumer } from 'components/LanguagePicker';
import humps from 'humps';

const types = (t) => (Array.isArray(t) ? t : [t]);

function Properties({ prefix, schema, level }) {
  const required = schema.required || [];

  const content = (
    <>
      {required.map((name) => (
        <JsonSchema
          key={name}
          required
          name={name}
          prefix={prefix}
          schema={schema.properties[name]}
          level={level + 1}
        />
      ))}
      {Object.entries(schema.properties)
        .filter(([name]) => !required.includes(name))
        .map(([name, schema]) => (
          <JsonSchema
            key={name}
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

function Type({ schema }) {
  if (!schema || !schema.type) {
    return null;
  }

  return (
    <span className={s.types}>
      {types(schema.type).map((type, i) => {
        let realType = type;

        if (realType === 'array') {
          realType = schema.items
            ? `array[${types(schema.items.type).join('/')}]`
            : 'array[]';
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
  const dataSchema = schema.properties.data;

  const isArray = dataSchema.type === 'array';
  const resourceSchema = isArray ? dataSchema.items : dataSchema;

  const relationshipTypes = resourceSchema.type
    ? [`${resourceSchema.properties.type.example}.id`]
    : resourceSchema.anyOf.map((s) =>
        types(s.type).includes('null')
          ? 'null'
          : `${s.properties.type.example}.id`,
      );

  return (
    <LanguageConsumer>
      {(language) => (
        <div className={s.schema}>
          <div className={s.header}>
            {language === 'http' && (
              <span className={s.prefix}>relationships.</span>
            )}
            <span className={s.name}>
              {language === 'javascript' ? humps.camelize(name) : name}
            </span>
            {language === 'http' && <span className={s.prefix}>.data.id</span>}
            &nbsp;&nbsp;
            <span className={s.types}>
              {relationshipTypes.map((type, i) => [
                i > 0 && ', ',
                <span className={s.type} key={type}>
                  {isArray ? `array[${type}]` : type}
                </span>,
              ])}
            </span>
            &nbsp;&nbsp;
            {required ? (
              <span className={s.required}>Required</span>
            ) : (
              <span className={s.optional}>Optional</span>
            )}
          </div>
          {schema.description && (
            <div className={s.description}>{schema.description}</div>
          )}
        </div>
      )}
    </LanguageConsumer>
  );
}

function Relationships({ relationships }) {
  const required = relationships.required || [];

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

function JsonSchema({ level = 0, name, prefix, required, schema }) {
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
              &nbsp;&nbsp;
              {required ? (
                <span className={s.required}>Required</span>
              ) : (
                <span className={s.optional}>Optional</span>
              )}
            </div>
          )}
          {schema.description && (
            <div className={s.description}>{schema.description}</div>
          )}
          {types(schema.type).includes('object') &&
            schema.properties &&
            (open ? (
              <>
                <button onClick={() => setOpen(false)}>
                  Hide child parameters
                </button>
                <Properties schema={schema} level={level} />
              </>
            ) : (
              <button onClick={() => setOpen(true)}>
                Show child parameters
              </button>
            ))}
          {types(schema.type).includes('array') &&
            types(schema.items).includes('object') &&
            schema.items.properties &&
            (open ? (
              <>
                <button onClick={() => setOpen(false)}>
                  Hide items parameters
                </button>
                <Properties schema={schema.items} level={level} />
              </>
            ) : (
              <button onClick={() => setOpen(true)}>
                Show items parameters
              </button>
            ))}
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

export function Schema({ title, schema, showId }) {
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
                &nbsp;&nbsp;
                <span className={s.required}>Required</span>
              </div>
              <div className={s.description}>ID of the resource</div>
            </div>
          )}
          {language === 'http' && (
            <div className={s.schema}>
              <div className={s.header}>
                <span className={s.name}>type</span>&nbsp;&nbsp;
                <Type schema={schema.properties.type} />
                &nbsp;&nbsp;
                <span className={s.required}>Required</span>
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
                schema={schema.properties.attributes}
              />
            )}
          {schema.properties.relationships && (
            <Relationships relationships={schema.properties.relationships} />
          )}
        </>
      )}
    </LanguageConsumer>
  );
}
