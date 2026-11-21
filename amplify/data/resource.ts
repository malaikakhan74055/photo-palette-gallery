import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Palette: a
    .model({
      name: a.string().required(),
      colors: a.string().array().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['Admins']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
