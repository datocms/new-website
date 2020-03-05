import React from 'react';
import sortObject from 'sort-object';
import Heading from 'components/Heading';
import HttpExample from './HttpExample';
import JsExample from './JsExample';
import RubyExample from './RubyExample';
import ReactMarkdown from 'react-markdown';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;
import s from './style.module.css';

export default class ResourceApiMethod extends React.Component {
  renderAttribute(name, schema) {
    let schemaType = schema.type || [];

    if (!Array.isArray(schema.type)) {
      schemaType = [schemaType];
    }

    schemaType = schemaType.filter(type => type && type !== 'null');

    return (
      <tr key={name}>
        <td className={s.attributeLeft}>
          <code className={s.attributeName}>{name}</code>
          <code className={s.attributeType}>
            {schemaType.sort().join(', ')}
          </code>
        </td>
        <td>
          {schema.description && <p>{schema.description}</p>}
          {schema.required && (
            <>
              <p>
                {schema.required
                  .sort()
                  .map(el => <code>{el}</code>)
                  .reduce((acc, curr) => [acc, ', ', curr])}
              </p>
              <div className={s.attributeRequired}>
                These attributes are required
              </div>
            </>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { resource, link, language } = this.props;
    const path = link.href.replace(regexp, ':$1_id');

    return (
      <>
        <Heading as="h3" anchor={link.rel}>
          {link.title}
        </Heading>
        {link.description ? (
          <ReactMarkdown source={link.description} />
        ) : (
          <p>
            To {link.title.toLowerCase()}, send a <code>{link.method}</code>{' '}
            request to the <code>{path}</code> endpoint
            {['POST', 'PUT'].includes(link.method) ? (
              <>
                , passing the resource arguments in the request body. The
                following table contains the list of all the possible arguments,
                along with their type, description and examples values. All the
                arguments marked as required must be present in the request.
              </>
            ) : (
              '.'
            )}
          </p>
        )}

        {link.hrefSchema && (
          <>
            <h6>Arguments</h6>
            <table>
              <tbody>
                {Object.entries(
                  sortObject(link.hrefSchema.properties)
                ).map(([name, schema]) => this.renderAttribute(name, schema))}
              </tbody>
            </table>
          </>
        )}

        {language === 'http' && <HttpExample resource={resource} link={link} />}

        {language === 'javascript' && (
          <JsExample resource={resource} link={link} />
        )}

        {language === 'ruby' && <RubyExample resource={resource} link={link} />}
      </>
    );
  }
}
