---
title: Making offline backups
excerpt: Learn how you can export content from DatoCMS to make full daily offline backups.
---

Higher tiers of DatoCMS offer the ability to generate nightly copies of your
content to your own Amazon S3 buckets, but even if you're on lower plans
making offline backups is extremely easy.

Here's a quick example script that uses our [Content Management API](/docs/content-management-api/) to dump every record
into a `records.json` file, and locally downloads every asset.

You can then add this script into a cron-job and store the result in a S3 bucket:

```js
const SiteClient = require('datocms-client').SiteClient;
const fs = require('fs');
const path = require('path');
const request = require('request');

const client = new SiteClient('YOUR-API-TOKEN');

console.log('Downloading records...');

client.items.all({}, { allPages: true })
.then(response => {
  fs.writeFileSync('records.json', JSON.stringify(response, null, 2));
})
.then(() => {
  return client.site.find();
})
.then((site) => {
  client.uploads.all({}, { allPages: true })
  .then(uploads => {
    return uploads.reduce((chain, upload) => {
      return chain.then(() => {
        return new Promise((resolve) => {
          const imageUrl = 'https://' + site.imgixHost + upload.path;
          console.log(`Downloading ${imageUrl}...`);

          const stream = fs.createWriteStream('./' + path.basename(upload.path));
          stream.on('close', resolve);
          request(imageUrl).pipe(stream);
        });
      });
    }, Promise.resolve());
  });
});

console.log('Done!');
```
