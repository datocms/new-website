import Sitemapper from 'sitemapper';

async function start() {
  const sitemapper = new Sitemapper();
  sitemapper.timeout = 5000;

  const urls = (
    await sitemapper.fetch('https://datocms.netlify.com/sitemap.xml')
  ).sites.map(x => x.replace('https://www.datocms.com', ''));

  const redirects = urls.map(url => {
    const urlWithSlash = url.endsWith('/') ? url : `${url}/`;

    return {
      source: urlWithSlash,
      destination: urlWithSlash.replace(/\/$/, ''),
    };
  });

  console.log(JSON.stringify(redirects, null, 2));
}

start();
