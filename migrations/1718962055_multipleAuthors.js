/** @param client { import("@datocms/cli/lib/cma-client-node").Client } */
module.exports = async (client) => {
  console.log('Update existing fields/fieldsets');

  console.log(
    'Update Multiple links field "Author" (`author`) in model "\uD83D\uDCDD Blog Post" (`blog_post`)',
  );
  await client.fields.update('3805494', { field_type: 'links' });
  await client.fields.update('3805494', {
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['810912'],
      },
      size: { min: 1, max: 10 },
    },
    appearance: { addons: [], editor: 'links_embed', parameters: {} },
  });
};
