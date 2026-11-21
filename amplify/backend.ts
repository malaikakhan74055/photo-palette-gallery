import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { whoami } from './functions/whoami/resource'

const backend = defineBackend({
  auth,
  data,
  storage,
  whoami,
})

// REST API (API Gateway) protected by the Cognito user pool
const apiStack = backend.createStack('rest-api-stack')

const restApi = new RestApi(apiStack, 'RestApi', {
  restApiName: 'photoPaletteRestApi',
  deploy: true,
  deployOptions: { stageName: 'dev' },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
})

const authorizer = new CognitoUserPoolsAuthorizer(
  apiStack,
  'CognitoAuthorizer',
  {
    cognitoUserPools: [backend.auth.resources.userPool],
  },
)

const whoamiIntegration = new LambdaIntegration(backend.whoami.resources.lambda)

const meResource = restApi.root.addResource('me')
meResource.addMethod('GET', whoamiIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer,
})

backend.addOutput({
  custom: {
    API: {
      [restApi.restApiName]: {
        endpoint: restApi.url,
        region: Stack.of(restApi).region,
        apiName: restApi.restApiName,
      },
    },
  },
})
