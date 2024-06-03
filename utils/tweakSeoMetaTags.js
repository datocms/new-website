const baseUrl =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.BASE_URL;

export function changeDescription(seoMetaTags, newDescription) {
  return seoMetaTags.map((tag) => {
    if (tag.tag !== 'meta') {
      return tag;
    }

    if (
      tag.attributes.name === 'description' ||
      tag.attributes.name === 'twitter:description'
    ) {
      return {
        ...tag,
        attributes: { ...tag.attributes, content: newDescription },
      };
    }

    if (tag.attributes.property === 'og:description') {
      return {
        ...tag,
        attributes: { ...tag.attributes, content: newDescription },
      };
    }

    return tag;
  });
}

export function changeTitle(seoMetaTags, newTitle) {
  return seoMetaTags.map((tag) =>
    tag.tag === 'title'
      ? {
          content: newTitle,
          tag: 'title',
        }
      : tag,
  );
}

export function changeImage(seoMetaTags, newImageUrl) {
  return seoMetaTags
    .filter(
      (tag) =>
        !['og:image:width', 'og:image:height'].includes(
          tag.attributes?.property,
        ),
    )
    .map((tag) =>
      tag.attributes?.property === 'og:image' ||
      tag.attributes?.name === 'twitter:image'
        ? {
            ...tag,
            attributes: {
              ...tag.attributes,
              content: newImageUrl,
            },
          }
        : tag,
    );
}

export function changeImageWithGeneratedDoc(seoMetaTags, title, kicker) {
  return changeImage(seoMetaTags, docPageOgImageUrl(title, kicker));
}

export function docPageOgImageUrl(title, kicker) {
  const params = new URLSearchParams({
    title,
    kicker,
  }).toString();

  return `${baseUrl}/api/og-image/doc-page?${params}`;
}
