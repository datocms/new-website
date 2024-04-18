// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://cdn.jsdelivr.net/npm/datocms-plugin-sdk';

function findChildrenById(manifest, id) {
  return manifest.children.find((child) => child.id === id);
}

function findFirstTag(signature, tagName) {
  if (!signature.comment || !signature.comment.blockTags) {
    return null;
  }

  const tagNode = signature.comment.blockTags.find(
    (tag) => tag.tag === tagName,
  );

  if (!tagNode) {
    return null;
  }

  return tagNode.content.map((chunk) => chunk.text).join('');
}

function findExample(signature) {
  const example = findFirstTag(signature, '@example');

  if (!example) {
    return null;
  }

  const lines = example
    .split(/\n/)
    .filter((l, i, all) => l.length !== 0 || (i !== 0 && i !== all.length - 1));

  const spacesPerLine = lines.map((line) => {
    const spaces = line.match(/^\s*/);
    return spaces ? spaces[0].length : 0;
  });

  const commonIndentation = Math.min(...spacesPerLine);

  const pruned = lines
    .map((line) => line.substring(commonIndentation))
    .join('\n');

  return pruned.match(/```[a-z]*\n([\s\S]*?)\n```/)[1].trim();
}

function addFinalPeriod(text) {
  if (['!', '.'].includes(text[text.length - 1])) {
    return text;
  }

  return `${text}.`;
}

function findShortText(signature) {
  return (
    (signature.comment &&
      addFinalPeriod(
        signature.comment.summary.map((chunk) => chunk.text).join(''),
      )) ||
    null
  );
}

function findReturnType(manifest, signature, extraInfo = {}) {
  if (signature.type === 'reference') {
    return findReturnType(
      manifest,
      findChildrenById(manifest, signature.id),
      extraInfo,
    );
  }

  if (signature.type.type === 'intrinsic' && signature.type.name === 'void') {
    return null;
  }

  if (signature.type === 'intrinsic' && signature.name === 'boolean') {
    return {
      type: 'boolean',
      ...extraInfo,
    };
  }

  if (signature.type.type === 'array') {
    return findReturnType(manifest, signature.type.elementType, {
      isArray: true,
    });
  }

  if (signature.type === 'array') {
    return findReturnType(manifest, signature.elementType, {
      isArray: true,
    });
  }

  if (signature.type === 'union') {
    if (
      signature.types.length === 2 &&
      signature.types.some((t) => t.type === 'intrinsic' && t.name === 'void')
    ) {
      return findReturnType(
        manifest,
        signature.types.find(
          (t) => t.type !== 'intrinsic' || t.name !== 'void',
        ),
        { ...extraInfo, isNullable: true },
      );
    }

    return null;
  }

  if (signature.type.type === 'union') {
    if (
      signature.type.types.length === 2 &&
      signature.type.types.some(
        (t) => t.type === 'intrinsic' && t.name === 'void',
      )
    ) {
      return findReturnType(
        manifest,
        signature.type.types.find(
          (t) => t.type !== 'intrinsic' || t.name !== 'void',
        ),
        { ...extraInfo, isNullable: true },
      );
    }

    return null;
  }

  if (signature.type.type === 'reflection') {
    return {
      ...extraInfo,
      properties: signature.type.declaration.children.map((child) => {
        return {
          name: child.name,
          description: findShortText(child),
          example: findExample(child),
          isOptional: child.flags.isOptional || false,
          lineNumber: child.sources[0].line,
        };
      }),
    };
  }

  if (
    signature.type.type === 'reference' &&
    signature.type.name === 'MaybePromise'
  ) {
    return findReturnType(manifest, signature.type.typeArguments[0], {
      ...extraInfo,
      isMaybePromise: true,
    });
  }

  throw new Error(`unknown signature ${JSON.stringify(signature)}`);
}

function buildCtx(manifest, definition) {
  if (definition.type.type === 'intersection') {
    let result = [];

    for (const elementInIntersection of definition.type.types) {
      if (elementInIntersection.type === 'reference') {
        const innerDefinition = findChildrenById(
          manifest,
          elementInIntersection.id,
        );
        result = [...result, buildCtx(manifest, innerDefinition)];
      }
    }

    return result.flat().filter((x) => x);
  }

  if (definition.type.type === 'reflection') {
    const properties = definition.type.declaration.children.filter(
      (child) =>
        !['mode', 'getSettings', 'setHeight', 'bodyPadding'].includes(
          child.name,
        ),
    );

    if (properties.length === 0) {
      return null;
    }

    return {
      name: definition.name,
      description: findShortText(definition),
      properties: properties.map((child) => {
        if (child.type?.declaration?.signatures) {
          child.signatures = child.type.declaration.signatures;
        }

        if (child.signatures) {
          const signature = child.signatures[0];
          return {
            name: child.name,
            type: 'function',
            description: findShortText(signature),
            example: findExample(signature),
            group: definition.name,
            lineNumber: child.sources[0].line,
          };
        }

        return {
          name: child.name,
          type: 'property',
          description: findShortText(child),
          example: findExample(child),
          groupDescription: findShortText(definition),
          group: definition.name,
          lineNumber: child.sources[0].line,
        };
      }),
    };
  }

  if (definition.type.type === 'reference') {
    const innerDefinition = findChildrenById(manifest, definition.type.id);

    return buildCtx(manifest, innerDefinition);
  }

  throw new Error('fuck');
}

export async function fetchPluginSdkHooks() {
  const response = await fetch(`${baseUrl}/types.json`);
  const manifest = await response.json();

  const connectParameters = manifest.children.find(
    (child) => child.name === 'FullConnectParameters',
  );

  const hooks = connectParameters.type.declaration.children;

  const result = hooks.map((hook) => {
    const signature = hook.signatures
      ? hook.signatures[0]
      : hook.type.declaration.signatures[0];

    const ctxParameter = signature.parameters.find((p) => p.name === 'ctx');
    const ctx = ctxParameter
      ? buildCtx(
          manifest,
          findChildrenById(manifest, ctxParameter.type.id),
        ).sort((a, b) => a.name.localeCompare(b.name))
      : null;

    return {
      name: hook.name,
      description: findShortText(signature),
      example: findExample(signature),
      groups:
        findFirstTag(signature, '@tag')
          ?.trim()
          ?.split(/\s*,\s*/) || [],
      ctx,
      returnType: findReturnType(manifest, signature),
      lineNumber: hook.sources[0].line,
    };
  });

  return result;
}
