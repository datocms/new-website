import Sitemapper from 'sitemapper';
const { match, compile } = require('path-to-regexp');
const redirects = require('./redirects');

const liveRedirects = redirects.map((rule) => ({
  ...rule,
  match: match(rule.source),
  toPath: compile(rule.destination),
}));

// const rewrite = (url) =>

async function start() {
  const sitemapper = new Sitemapper();
  sitemapper.timeout = 5000;

  const s1 = await sitemapper.fetch('https://datocms.netlify.com/sitemap.xml');
  const s2Sites = (
    await sitemapper.fetch('https://www.datocms.com/sitemap.xml')
  ).sites.map((x) =>
    x.replace('https://www.datocms.com', '').replace(/\/$/, ''),
  );

  const notFound = s1.sites.filter((url) => {
    let realUrl = url.replace('https://www.datocms.com', '').replace(/\/$/, '');

    const redirect = liveRedirects.find((r) => r.match(realUrl));

    if (redirect) {
      const { params } = redirect.match(realUrl);
      realUrl = redirect.toPath(params);
    }

    return !s2Sites.includes(realUrl);
  });

  console.log(JSON.stringify(notFound, null, 2));
}

start();
