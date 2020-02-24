import React from 'react';
import sortObject from 'sort-object';
import Tabs, { Tab } from 'components/Tabs';
import HttpExample from './HttpExample';
import JsExample from './JsExample';
import RubyExample from './RubyExample';
import ReactMarkdown from 'react-markdown';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

export default class ResourceApiMethod extends React.Component {
  renderAttribute(name, schema) {
    let schemaType = schema.type || [];

    if (!Array.isArray(schema.type)) {
      schemaType = [schemaType];
    }

    schemaType = schemaType.filter(type => type && type !== 'null');

    return (
      <tr key={name}>
        <td className={s['attribute-left']}>
          <code className={s['attribute-name']}>{name}</code>
          <code className={s['attribute-type']}>
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
              <div className={s['attribute-required']}>
                These attributes are required
              </div>
            </>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { resource, link } = this.props;
    const path = link.href.replace(regexp, ':$1_id');

    return (
      <>
        <h3 id={link.rel}>
          {link.title}
        </h3>
        {link.description ? (
          <ReactMarkdown source={link.description} />
        ) : (
          <p>
            To {link.title.toLowerCase()}, send a <code>{link.method}</code>{' '}
            request to the <code>{path}</code> endpoint
            {['POST', 'PUT'].includes(link.method) &&
              ', passing the resource arguments in the request body'}
            . The following table contains the list of all the possible
            arguments, along with their type, description and examples values.
            All the arguments marked as required must be present in the request.
          </p>
        )}

        {link.hrefSchema && (
          <>
            <h6>Arguments</h6>
            <table className="ResourceAttributes">
              <tbody>
                {Object.entries(sortObject(link.hrefSchema.properties)).map(
                  ([name, schema]) => this.renderAttribute(name, schema),
                )}
              </tbody>
            </table>
          </>
        )}

        <Tabs>
          <Tab title="HTTP example">
            <HttpExample resource={resource} link={link} />
          </Tab>
          <Tab title="Javascript example">
            <JsExample resource={resource} link={link} />
          </Tab>
          <Tab title="Ruby example">
            <RubyExample resource={resource} link={link} />
          </Tab>
        </Tabs>
      </>
    );
  }
}
