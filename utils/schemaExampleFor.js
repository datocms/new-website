export default function schemaExampleFor(schema, pagination = true) {
  if (!schema) {
    return null;
  }

  if (
    schema.hasOwnProperty('deprecated') ||
    schema.hasOwnProperty('hideFromDocs')
  ) {
    return;
  }

  if (schema.hasOwnProperty('example')) {
    return schema.example;
  }

  if (schema.anyOf) {
    return schemaExampleFor(schema.anyOf[0]);
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== 'null') || schema.type[0]
    : schema.type;

  if (type === 'object') {
    if (schema.oneOf) {
      return schemaExampleFor(schema.oneOf[0]);
    }

    if (!schema.properties) {
      return {};
    }

    return Object.keys(schema.properties).reduce((acc, property) => {
      if (!pagination && property.match(/^page/)) {
        return acc;
      }
      return Object.assign({}, acc, {
        [property]: schemaExampleFor(schema.properties[property]),
      });
    }, {});
  } else if (type === 'array') {
    if (!schema.items) {
      return [];
    }
    if (schema.items.oneOf) {
      return schema.items.oneOf.map((s) => schemaExampleFor(s));
    }
    return [schemaExampleFor(schema.items)];
  } else if (type === 'string') {
    if (schema.format === 'date-time') {
      return '2020-04-21T07:57:11.124Z';
    }
    if (schema.enum) {
      return schema.enum[0];
    }
    return '';
  } else if (type === 'boolean') {
    return true;
  } else if (type === 'integer') {
    return 20;
  } else if (type === 'null') {
    return null;
  } else {
    throw new Error(`Don't know how to manage ${type} type!`);
  }
}
