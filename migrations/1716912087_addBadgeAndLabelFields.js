/** @param client { import("@datocms/cli/lib/cma-client-node").Client } */
module.exports = async (client) => {
  console.log('Create new models/block models');

  console.log('Create model "\u2728 Badge" (`badge`)');
  await client.itemTypes.create(
    {
      id: 'ViekJq7wTlmlB-9xmNQnzw',
      name: '\u2728 Badge',
      api_key: 'badge',
      collection_appearance: 'table',
      inverse_relationships_enabled: false,
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'd7QN-ZPmRSGpk6F1L9TBVA',
    },
  );

  console.log('Creating new fields/fieldsets');

  console.log(
    'Create Single-line string field "Name" (`name`) in model "\u2728 Badge" (`badge`)',
  );
  await client.fields.create('ViekJq7wTlmlB-9xmNQnzw', {
    id: 'H_dxTPNpSbCwcH7-wUdZ9A',
    label: 'Name',
    field_type: 'string',
    api_key: 'name',
    validators: { required: {}, length: { min: 0, max: 20 } },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false },
    },
    default_value: '',
  });

  console.log(
    'Create Single-line string field "Emoji" (`emoji`) in model "\u2728 Badge" (`badge`)',
  );
  await client.fields.create('ViekJq7wTlmlB-9xmNQnzw', {
    id: 'G2cgpCveQ760WHjZAoRPBw',
    label: 'Emoji',
    field_type: 'string',
    api_key: 'emoji',
    validators: { required: {}, length: { min: 0, max: 2 } },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false },
    },
    default_value: '',
  });

  console.log(
    'Create Single link field "Badge" (`badge`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.create('810910', {
    id: 'AztvqIpPSAmR5AR822Xfuw',
    label: 'Badge',
    field_type: 'link',
    api_key: 'badge',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['ViekJq7wTlmlB-9xmNQnzw'],
      },
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} },
  });

  console.log(
    'Create Single-line string field "Label" (`label`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.create('810910', {
    id: 'E-8l5WFJS2mz6s1eyeSlww',
    label: 'Label',
    field_type: 'string',
    api_key: 'label',
    validators: { length: { min: 0, max: 20 } },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false },
    },
    default_value: '',
  });

  console.log('Update existing fields/fieldsets');

  console.log(
    'Update Single link field "Badge" (`badge`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.update('AztvqIpPSAmR5AR822Xfuw', { position: 3 });

  console.log(
    'Update Single-line string field "Label" (`label`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.update('E-8l5WFJS2mz6s1eyeSlww', { position: 4 });

  console.log(
    'Update Slug field "Code" (`code`) in model "\uD83C\uDF89 Starter Project" (`template_demo`)',
  );
  await client.fields.update('3805735', { position: 1 });

  console.log('Finalize models/block models');

  console.log('Update model "\u2728 Badge" (`badge`)');
  await client.itemTypes.update('ViekJq7wTlmlB-9xmNQnzw', {
    title_field: { id: 'H_dxTPNpSbCwcH7-wUdZ9A', type: 'field' },
  });

  console.log('Manage menu items');

  console.log('Create menu item "\u2728 Badge"');
  await client.menuItems.create({
    id: 'IXg9QyD-QKGgHNCc1iW8_Q',
    label: '\u2728 Badge',
    item_type: { id: 'ViekJq7wTlmlB-9xmNQnzw', type: 'item_type' },
  });

  console.log('Manage schema menu items');

  console.log(
    'Update model schema menu item for model "\u2728 Badge" (`badge`)',
  );
  await client.schemaMenuItems.update('d7QN-ZPmRSGpk6F1L9TBVA', {
    position: 0,
    parent: { id: 'EYSg5f1yTyazsKiloVhy6A', type: 'schema_menu_item' },
  });

  console.log(
    'Update model schema menu item "\uD83E\uDDD1\u200D\uD83D\uDCBB Tech Partners"',
  );
  await client.schemaMenuItems.update('YkYijh97Qqy7lM9I6-eyWw', {
    position: 31,
  });

  console.log('Update model schema menu item "Blog"');
  await client.schemaMenuItems.update('DQbbc4BdQqmSTw6R2kbssg', {
    position: 6,
  });

  console.log('Update model schema menu item "Product updates"');
  await client.schemaMenuItems.update('K566OISlTWeWf2D7TGTgSQ', {
    position: 9,
  });

  console.log('Update model schema menu item "Marketplace"');
  await client.schemaMenuItems.update('EYSg5f1yTyazsKiloVhy6A', {
    position: 32,
  });

  console.log('Update model schema menu item "Success stories"');
  await client.schemaMenuItems.update('Lgkm6VGjTG6nAvlwfjGXPw', {
    position: 5,
  });

  console.log('Update model schema menu item "About page"');
  await client.schemaMenuItems.update('Cgq0SMW5RJmf5ESiOMhhrA', {
    position: 7,
  });

  console.log('Update block schema menu item "Blog and Docs"');
  await client.schemaMenuItems.update('f6WUX53NQaGnMIUZR5oR9Q', {
    position: 15,
  });

  console.log(
    'Update block schema menu item for block model "\uD83C\uDF05 Image" (`image`)',
  );
  await client.schemaMenuItems.update('RubCaBHgQeqtTltERyQ6nQ', {
    position: 13,
  });

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCF9 Video" (`internal_video`)',
  );
  await client.schemaMenuItems.update('cNyKXs9oR-KW-8wRxbmH4A', {
    position: 14,
  });

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCF9 YouTube/Vimeo embed" (`video`)',
  );
  await client.schemaMenuItems.update('TxHTSyghR0SwIzFraNnK1g', {
    position: 15,
  });

  console.log('Update model schema menu item "In-app Announcements"');
  await client.schemaMenuItems.update('Hk7gOCIfSue2P5ykFysBnw', {
    position: 8,
  });

  console.log('Update model schema menu item "Academy"');
  await client.schemaMenuItems.update('YX44cuOyQDet-c_dvmh9AA', {
    position: 10,
  });

  console.log('Update block schema menu item "Landing page"');
  await client.schemaMenuItems.update('SncAKty9Tmm3jjzkb3f6CA', {
    position: 34,
  });

  console.log('Update block schema menu item "Plugins"');
  await client.schemaMenuItems.update('DVmHQbFaTsy8BsnukQbilQ', {
    position: 35,
  });

  console.log('Update block schema menu item "Success Story"');
  await client.schemaMenuItems.update('d9GlMCJJTyiDDnayC7K67w', {
    position: 36,
  });

  console.log('Update block schema menu item "Support area"');
  await client.schemaMenuItems.update('TorsAxM3Qm6ZXHiy8NLYag', {
    position: 37,
  });

  console.log('Update model schema menu item "Support"');
  await client.schemaMenuItems.update('fn-VthW0SfeFkFFjSIXkQw', {
    position: 33,
  });

  console.log('Update model schema menu item "Other"');
  await client.schemaMenuItems.update('CE3IKvNvSfG-KwypZUGVxA', {
    position: 40,
  });

  console.log('Update model schema menu item "DatoCMS vs"');
  await client.schemaMenuItems.update('alSoq73DTOCoc5VpeDKDzg', {
    position: 39,
  });

  console.log('Update block schema menu item "Product Comparison"');
  await client.schemaMenuItems.update('dfR4ZCSpRryC2E9VCdD_Bw', {
    position: 41,
  });

  console.log('Update block schema menu item "Marketing Pages"');
  await client.schemaMenuItems.update('Mw-efacVQO2pAK-89B8Ijg', {
    position: 42,
  });

  console.log(
    'Update model schema menu item for model "\uD83D\uDCF0 How to DatoCMS Index" (`how_to_datocms_index`)',
  );
  await client.schemaMenuItems.update('YC6y9SvsSjKtmYMmVtVIoQ', {
    position: 43,
  });

  console.log('Update model schema menu item "Partner Program"');
  await client.schemaMenuItems.update('a4GEqu8QRyS4cyWY2K3oyw', {
    position: 30,
  });

  console.log('Update model schema menu item "Pricing"');
  await client.schemaMenuItems.update('Z-UIOBnpQYSiGvC6BBd-qA', {
    position: 28,
  });

  console.log('Update model schema menu item "Docs"');
  await client.schemaMenuItems.update('KKEzicAKSoaYQcaSYFRS5g', {
    position: 17,
  });

  console.log('Update model schema menu item "Dictionaries"');
  await client.schemaMenuItems.update('Lc3WERr8SKy_v3Hj8Itj6w', {
    position: 29,
  });

  console.log('Update model schema menu item "\uD83D\uDC04 User Guides"');
  await client.schemaMenuItems.update('LAtbiqIRTQ2niaPdQPUBSA', {
    position: 16,
  });
};
