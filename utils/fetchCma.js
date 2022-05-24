import tiny from 'tiny-json-http';
import parser from 'json-schema-ref-parser';
import { stringify } from 'flatted';

const buildEndpointToc = (parentSlug, link) => {
  return {
    slug: link.rel,
    url: `/docs/content-management-api/resources/${parentSlug}/${link.rel}`,
    label: link.title,
    children: [],
  };
};

const buildResourceToc = (resource, schema) => {
  const slug = resource.replace(/_/g, '-');
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

function trimSchema(schema, exceptResourceId) {
  Object.keys(schema.properties).forEach((nthResourceId) => {
    if (exceptResourceId === nthResourceId) {
      return;
    }

    delete schema.properties[nthResourceId].links;
    delete schema.properties[nthResourceId].description;
    delete schema.properties[nthResourceId].definitions.data;
    delete schema.properties[nthResourceId].definitions.attributes;
    delete schema.properties[nthResourceId].definitions.relationships;
    delete schema.properties[nthResourceId].definitions.meta;
  });
}

export default async function buildCmaResources(resourceSlug, linkRel) {
  // const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
  const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';

  const { body: unreferencedSchema } = await tiny.get({ url });

  const completeSchema = await parser.dereference(unreferencedSchema);
  const jobRetrieveLink = completeSchema.properties['job_result'].links.find(
    (link) => link.rel === 'self',
  );
  const toc = buildToc(completeSchema);

  if (!resourceSlug) {
    return stringify({ toc });
  }

  const resourceId = resourceSlug.replace(/\-/g, '_');
  const resources = Object.keys(completeSchema.properties);

  if (!resources.includes(resourceId)) {
    return null;
  }

  trimSchema(completeSchema, resourceId);

  const schema = completeSchema.properties[resourceId];

  if (!linkRel) {
    return stringify({
      toc,
      schema: {
        ...schema,
        id: resourceId,
        attributes: schema.definitions.attributes
          ? schema.definitions.attributes.properties
          : {},
        links: schema.links.map(({ rel, title }) => ({ rel, title })),
      },
    });
  }

  const link = schema.links.find((link) => link.rel === linkRel);

  if (!link) {
    return null;
  }

  return stringify({
    toc,
    jobRetrieveLink,
    schema: {
      ...schema,
      id: resourceId,
      attributes: schema.definitions.attributes
        ? schema.definitions.attributes.properties
        : {},
      links: schema.links.filter((l) => l.rel === linkRel),
    },
  });
}
