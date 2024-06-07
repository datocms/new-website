/** @param client { import("@datocms/cli/lib/cma-client-node").Client } */
module.exports = async (client) => {
  console.log('Creating new fields/fieldsets');

  console.log(
    'Create Single-line string field "Type" (`starter_type`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.create('810910', {
    id: 'B6XWuz03Rr6aAKWn6JlgWw',
    label: 'Type',
    field_type: 'string',
    api_key: 'starter_type',
    validators: {
      required: {},
      enum: { values: ['fully_fledged', 'tech_starter', 'community'] },
    },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Fully fledged', value: 'fully_fledged' },
          { hint: '', label: 'Tech starter kit', value: 'tech_starter' },
          { hint: '', label: 'Community', value: 'community' },
        ],
      },
    },
    default_value: '',
  });

  console.log('Destroy fields in existing models/block models');

  console.log(
    'Delete Boolean field "Full-fledged" (`full_fledged`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.destroy('VjcILCBCRYi9xhBaaserYg');

  console.log('Update existing fields/fieldsets');

  console.log(
    'Update Single-line string field "Type" (`starter_type`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.update('B6XWuz03Rr6aAKWn6JlgWw', { position: 1 });

  console.log(
    'Update Boolean field "Show in dashboard" (`show_in_dashboard`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.update('ZhxdnAxwTQ2HMjJHv5OjTQ', { position: 3 });

  console.log(
    'Update fieldset "SEO" in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fieldsets.update('284174', { position: 20 });

  console.log('Fill-in `starter_type` field...');
  for await (const starter of client.items.listPagedIterator({
    filter: { type: 'template_demo' },
    version: 'current',
  })) {
    await client.items.update(starter, {
      starter_type: starter.recommended ? 'fully_fledged' : 'community',
    });
    if (starter.meta.status === 'published') {
      await client.items.publish(starter);
    }
  }

  console.log(
    'Delete Boolean field "Reccomended?" (`reccomended`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.destroy('11680614');

  console.log(
    'Delete Boolean field "Show in dashboard?" (`show_in_dashboard`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.destroy('ZhxdnAxwTQ2HMjJHv5OjTQ');
};
