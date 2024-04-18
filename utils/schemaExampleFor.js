export default function schemaExampleFor(schema, pagination = true) {
  if (!schema) {
    return null;
  }

  if (Array.isArray(schema)) {
    return schemaExampleFor(schema[0], pagination);
  }

  if (
    'deprecated' in schema ||
    'hideFromDocs' in schema ||
    'hideFromExample' in schema
  ) {
    return;
  }

  if ('example' in schema) {
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

    const propertiesToGenerate = schema.required ? schema.required : [];

    return propertiesToGenerate.reduce((acc, property) => {
      if (!pagination && property.match(/^page/)) {
        return acc;
      }

      if (
        'deprecated' in schema.properties[property] ||
        'hideFromDocs' in schema.properties[property] ||
        'hideFromExample' in schema.properties[property]
      ) {
        return acc;
      }

      return Object.assign({}, acc, {
        [property]: schemaExampleFor(schema.properties[property]),
      });
    }, {});
  }
  if (type === 'array') {
    if (!schema.items) {
      return [];
    }
    if (schema.items.oneOf) {
      return schema.items.oneOf.map((s) => schemaExampleFor(s));
    }
    return [schemaExampleFor(schema.items)];
  }
  if (type === 'string') {
    if (schema.format === 'date-time') {
      return '2020-04-21T07:57:11.124Z';
    }
    if (schema.enum) {
      return schema.enum[0];
    }
    return '';
  }
  if (type === 'boolean') {
    return true;
  }
  if (type === 'integer') {
    return 20;
  }
  if (type === 'number') {
    return 0.5;
  }
  if (type === 'null') {
    return null;
  }
  throw new Error(`Don't know how to manage ${type} type!`);
}
