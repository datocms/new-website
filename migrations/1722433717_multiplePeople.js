/** @param client { import("@datocms/cli/lib/cma-client-node").Client } */
module.exports = async (client) => {
  console.log('Update existing fields/fieldsets');

  console.log(
    'Update Multiple links field "People" (`people`) in model "\uD83D\uDC81 Customer Story" (`customer_story`)',
  );
  await client.fields.update('AYiVfJ2VTSqY8lXAqiPp_Q', { field_type: 'links' });
  await client.fields.update('AYiVfJ2VTSqY8lXAqiPp_Q', {
    label: 'People',
    api_key: 'people',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['aT1tvicdQxipzFSYwVpX3w'],
      },
    },
    appearance: { addons: [], editor: 'links_embed', parameters: {} },
  });
};
