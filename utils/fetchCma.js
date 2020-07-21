import tiny from 'tiny-json-http';
import sortBy from 'sort-by';
import parser from 'json-schema-ref-parser';
import { stringify } from 'flatted/cjs';

const buildEndpointToc = (parentSlug, link) => {
  return {
    slug: link.rel,
    url: `/docs/content-management-api/resources/${parentSlug}/${link.rel}`,
    label: link.title,
    children: [],
  };
};

const buildResourceToc = (resource, schema) => {
  const slug = resource.replace(/\_/g, '-');
  const endpoints = schema.links ? schema.links.filter((l) => !l.private) : [];

  return {
    slug,
    url: `/docs/content-management-api/resources/${slug}`,
    label: schema.title,
    children: endpoints.map(buildEndpointToc.bind(null, slug)),
  };
};

const buildToc = (schema) => {
  const resourcesInsideGroups = [];

  return schema.groups.map((group) => {
    return {
      label: group.title,
      children: group.resources.map((resource) => {
        resourcesInsideGroups.push(resource);
        return buildResourceToc(resource, schema.properties[resource]);
      }),
    };
  });
};

const normalizeSchema = (resource, resourceSchema) => ({
  id: resource,
  ...resourceSchema,
  attributes: resourceSchema.definitions.attributes
    ? resourceSchema.definitions.attributes.properties
    : {},
  links: resourceSchema.links
    .filter((l) => !l.private)
    .map((link) => ({
      ...link,
    })),
});

export default async function buildCmaResources(resource) {
  const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';
  // const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
  const { body: unreferencedSchema } = await tiny.get({ url });

  const schema = await parser.dereference(unreferencedSchema);
  const resources = Object.keys(schema.properties);
  const resourceId = resource && resource.replace(/\-/g, '_');

  if (!resource || !resources.includes(resourceId)) {
    return stringify({
      toc: buildToc(schema),
    });
  }

  const result = {
    toc: buildToc(schema, resourceId),
    schema: normalizeSchema(resourceId, schema.properties[resourceId]),
    jobRetrieveLink: normalizeSchema(
      'job_result',
      schema.properties['job_result'],
    ).links.find((link) => link.rel === 'self'),
  };

  return stringify(result);
}
