import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photoPaletteStorage',
  access: (allow) => ({
    'photos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['Admins']).to(['read', 'delete']),
    ],
  }),
});
