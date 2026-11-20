import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';

const client = new CognitoIdentityProviderClient();

// Puts every newly confirmed user into the default group.
export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log('PostConfirmation triggered for user:', event.userName);
  const command = new AdminAddUserToGroupCommand({
    GroupName: env.GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId,
  });
  await client.send(command);
  console.log('Added user to group:', env.GROUP_NAME);
  return event;
};
