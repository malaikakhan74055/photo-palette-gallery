import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photoPaletteStorage',
  access: (allow) => ({
    'photos/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.groups(['Users']).to(['read', 'write', 'delete']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
  }),
});
