import type { APIGatewayProxyHandler } from 'aws-lambda';

// Returns who is calling, based on the Cognito token checked by API Gateway.
export const handler: APIGatewayProxyHandler = async (event) => {
  const claims = event.requestContext.authorizer?.claims ?? {};
  console.log('whoami called by:', claims.email);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      message: 'Hello from the REST API',
      email: claims.email ?? null,
      groups: claims['cognito:groups'] ?? null,
      time: new Date().toISOString(),
    }),
  };
};
