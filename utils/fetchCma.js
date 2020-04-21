import tiny from 'tiny-json-http';
import sortBy from 'sort-by';
import parser from 'json-schema-ref-parser';
import { stringify } from 'flatted/cjs';

const defaultLinksOrder = ['instances', 'self', 'create', 'update', 'destroy'];

const buildEndpointToc = (parentSlug, link) => {
  return {
    slug: link.rel,
    url: `/docs/content-management-api/resources/${parentSlug}/${link.rel}`,
    label: link.title,
    position: defaultLinksOrder.includes(link.rel)
      ? defaultLinksOrder.indexOf(link.rel)
      : 99,
    children: [],
  };
};

const buildToc = (schema) => {
  return Object.entries(schema.properties)
    .map(([resource, resourceSchema]) => {
      const slug = resource.replace(/\_/g, '-');
      const endpoints = resourceSchema.links.filter((l) => !l.private);

      if (endpoints.length === 0) {
        return null;
      }

      return {
        slug,
        url: `/docs/content-management-api/resources/${slug}`,
        label: resourceSchema.title,
        children: endpoints
          .map(buildEndpointToc.bind(null, slug))
          .sort(sortBy('position')),
      };
    })
    .filter((x) => x);
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
      position: defaultLinksOrder.includes(link.rel)
        ? defaultLinksOrder.indexOf(link.rel)
        : 99,
    }))
    .sort(sortBy('position')),
});

export default async function buildCmaResources(resource, endpoint) {
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
    toc: buildToc(schema, resourceId),
    schema: normalizeSchema(resourceId, schema.properties[resourceId]),
    jobRetrieveLink: normalizeSchema(
      'job_result',
      schema.properties['job_result'],
    ).links[0],
  };

  return stringify(result);
}
