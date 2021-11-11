import tiny from 'tiny-json-http';

function assert(object) {
  if (object === undefined || object === null) {
    throw new Error('Missing object!');
  }

  return object;
}

function findChildrenById(id) {
  return manifest.children.find((child) => child.id === id);
}

function findExample(signature) {
  return (
    signature.comment &&
    signature.comment.tags &&
    signature.comment.tags[0].text.trim()
  );
}

function findShortText(signature) {
  return signature.comment && signature.comment.shortText;
}

function buildCtx(definitionId) {
  const definition = findChildrenById(definitionId);

  if (!definition) {
    console.log('fuck', definitionId);
  }

  if (definition.type.type === 'intersection') {
    let result = [];

    definition.type.types.forEach((elementInIntersection) => {
      if (elementInIntersection.type === 'reference') {
        result = [...result, ...buildCtx(elementInIntersection.id)];
      }
    });

    return result;
  }

  if (definition.type.type === 'reflection') {
    return definition.type.declaration.children
      .filter((child) => !['mode', 'getSettings'].includes(child.name))
      .map((child) => {
        if (child.signatures) {
          const signature = child.signatures[0];

          return {
            name: signature.name,
            type: 'function',
            description: findShortText(signature),
            example: findExample(signature),
          };
        }

        return {
          name: child.name,
          type: 'property',
          description: findShortText(child),
          example: findExample(child),
        };
      });
  }

  throw new Error('fuck');
}

export async function fetchPluginSdkHooks() {
  const { body: manifest } = await tiny.get({
    url: 'https://unpkg.com/datocms-plugins-sdk@0.2.0-alpha.35/types.json',
  });

  const connectParameters = manifest.children.find(
    (child) => child.name === 'FullConnectParameters',
  );
  assert(connectParameters);

  const hooks = connectParameters.type.declaration.children;
  assert(hooks);

  return hooks.map((hook) => {
    const signature = hook.signatures[0];
    const ctxParameter = signature.parameters.find((p) => p.name === 'ctx');
    const ctx = ctxParameter ? buildCtx(ctxParameter.type.id) : null;

    return {
      name: signature.name,
      description: findShortText(signature),
      example: findExample(signature),
      ctx,
    };
  });
}
