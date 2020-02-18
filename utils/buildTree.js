import fs from 'fs';
import util from 'util';
import frontMatter from 'front-matter';

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

export default async function buildTree(list, parentPrefix = 'docs/') {
  const prefixes = list
    .map(item => item.replace(parentPrefix, '').split('/', 1)[0])
    .filter(unique);

  const result = [];

  for (let prefix of prefixes) {
    const newPrefix = `${parentPrefix}${prefix}/`;
    const children = list.filter(item => item.startsWith(newPrefix));
    const formattedChildren = await buildTree(children, newPrefix);

    let title;

    if (formattedChildren.length === 0) {
      const body = await util.promisify(fs.readFile)(`${parentPrefix}${prefix}`, 'utf8');
      let data = frontMatter(body);
      if (data && data.attributes && data.attributes.copyFrom) {
        const srcBody = await util.promisify(fs.readFile)(`docs/${data.attributes.copyFrom}`, 'utf8');
        data = frontMatter(srcBody);
      }
      title = data && data.attributes && data.attributes.title;
    } else {
      title = prefix;
    }

    result.push({
      title,
      slug: prefix,
      children: formattedChildren,
    });
  }

  return result;
};