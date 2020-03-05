import sortObject from 'sort-object';
import Heading from 'components/Heading';

import s from './style.module.css';

function joinAnd(a, and = 'and') {
  if (a.length === 1) {
    return a[0];
  }

  return `${a.slice(0, -1).join(', ')} ${and} ${a.slice(-1)}`;
}

export default class ResourceAttributes extends React.Component {
  renderAttribute(name, schema) {
    let schemaType = schema.type || [];

    if (!Array.isArray(schema.type)) {
      schemaType = [schemaType];
    }

    const isOptional = schemaType.find(t => t === 'null');

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
          {schema.description && (
            <>
              <div>{schema.description}</div>
              {!isOptional && (
                <div className={s.attributeRequired}>
                  This attribute is required
                </div>
              )}
            </>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { resource } = this.props;
    const links = resource.links.map(l => l.title);

    if (!resource.attributes || Object.keys(resource.attributes).length === 0) {
      return null;
    }

    return (
      <>
        <Heading as="h3" anchor="attributes">
          Attributes
        </Heading>
        <p>
          A {resource.title} object is returned as part of the response body of
          each successful {joinAnd(links, 'or')} API call. The following table
          contains the list of all its fields along with their type, description
          and example values.
        </p>
        <table>
          <tbody>
            {Object.entries(
              sortObject(resource.attributes)
            ).map(([name, schema]) => this.renderAttribute(name, schema))}
          </tbody>
        </table>
      </>
    );
  }
}
