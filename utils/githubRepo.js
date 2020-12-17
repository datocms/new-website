export function githubRepoToManifest(repo) {
  const parts = repo.split(':');

  if (parts.length === 1) {
    parts.push('master');
  }

  return `https://raw.githubusercontent.com/${parts.join('/')}/datocms.json`;
}

export function githubRepoToUrl(repo) {
  const parts = repo.split(':');

  if (parts.length === 1) {
    return `https://github.com/${repo}`;
  }

  return `https://github.com/${parts.join('/tree/')}`;
}
