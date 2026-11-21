import { defineFunction } from '@aws-amplify/backend'

export const whoami = defineFunction({
  name: 'whoami',
  entry: './handler.ts',
})
