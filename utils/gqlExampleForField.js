import humps from 'humps';

export const camelize = (name) => {
  if (name.startsWith('_')) {
    return `_${humps.camelize(name)}`;
  }

  return humps.camelize(name);
};

const exampleForType = (queryFieldName, field) => {
  let exampleData = '';
  const type = field.input_type;

  if (type === 'item_id' || type === 'upload_id') {
    exampleData = '"123"';
  } else if (type === 'boolean') {
    return 'true';
  } else if (type === 'string') {
    exampleData = '"bike"';
  } else if (type === 'enum') {
    exampleData = field.values[0];
  } else if (type === 'float') {
    exampleData = '19.99';
  } else if (type === 'integer') {
    exampleData = '3';
  } else if (type === 'date_time') {
    exampleData = '"2018-02-13T14:30:00+00:00"';
  } else if (type === 'date') {
    exampleData = '"2018-02-13"';
  } else if (queryFieldName === 'matches' || queryFieldName === 'not_matches') {
    exampleData = '{ pattern: "bi(cycl|k)e", caseSensitive: false }';
  } else if (queryFieldName === 'near') {
    exampleData = '{ latitude: 40.73, longitude: -73.93, radius: 10 }';
  } else {
    exampleData = type;
  }
  if (field.array) {
    return `[${exampleData}]`;
  }

  return exampleData;
};

const isMetaField = (fieldName) => {
  return (
    fieldName.startsWith('_') ||
    ['id', 'parent', 'position'].includes(fieldName)
  );
};

const nicerFieldName = (fieldName) => {
  let nicerFieldName = `${camelize(fieldName)}`;
  if (!isMetaField(fieldName)) nicerFieldName += 'Field';
  return nicerFieldName;
};

export default function exampleForField(fieldName, queryFieldName, field) {
  let filter = `${camelize(queryFieldName)}: ${exampleForType(
    queryFieldName,
    field,
  )}`;

  if (filter.length > 30) {
    return `query {
  allProducts(
    filter: {
      ${nicerFieldName(fieldName)}: {
        ${filter}
      }
    }
  ) {
    title
  }
}`;
  }

  return `query {
  allProducts(filter: { ${nicerFieldName(fieldName)}: { ${filter} } }) {
    title
  }
}`;
}
