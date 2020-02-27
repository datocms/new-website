import tiny from 'tiny-json-http';
const sortBy = require('sort-by');
const parser = require('json-schema-ref-parser');
const { stringify } = require('flatted/cjs');
import tiny from 'tiny-json-http';

const defaultLinksOrder = ['instances', 'self', 'create', 'update', 'destroy'];

const buildToc = schema => {
  return Object.entries(schema.properties)
    .map(([resource, resourceSchema]) => {
      return {
        slug: resource.replace(/\_/g, '-'),
        url: `/docs/content-management-api/r/${resource.replace(/\_/g, '-')}`,
        label: resourceSchema.title,
        position: resourceSchema.position || 99,
        links: resourceSchema.links.filter(l => !l.private),
      };
    })
    .filter(resource => resource.links.length > 0)
    .sort(sortBy('position'))
    .map(({ url, slug, label }) => ({ url, slug, label }));
};

const normalizeSchema = (resource, resourceSchema) => ({
  id: resource,
  ...resourceSchema,
  attributes: resourceSchema.definitions.attributes
    ? resourceSchema.definitions.attributes.properties
    : {},
  links: resourceSchema.links
    .filter(l => !l.private)
    .map(link => ({
      ...link,
      position: defaultLinksOrder.includes(link.rel)
        ? defaultLinksOrder.indexOf(link.rel)
        : 99,
    }))
    .sort(sortBy('position')),
});

module.exports = async function buildCmaResources(resource) {
  const { body: unreferencedSchema } = await tiny.get({
    url: 'https://site-api.datocms.com/docs/site-api-hyperschema.json',
  });

  const schema = await parser.dereference(unreferencedSchema);
  const resources = Object.keys(schema.properties);
  const resourceId = resource && resource.replace(/\-/g, '_');

  if (!resource || !resources.includes(resourceId)) {
    return stringify({
      toc: buildToc(schema),
    });
  }

  const result = {
    toc: buildToc(schema),
    schema: normalizeSchema(resourceId, schema.properties[resourceId]),
  };

  return stringify(result);
};
