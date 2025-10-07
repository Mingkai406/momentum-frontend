export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_uz1r1r',
      userPoolClientId: 'ponkeiq9o9rf448sl2kjbdo9g',
      loginWith: {
        oauth: {
          domain: 'cognito-idp.us-east-1.amazonaws.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/callback', 'https://momentum-frontend-gold.vercel.app/callback'],
          redirectSignOut: ['http://localhost:3000', 'https://momentum-frontend-gold.vercel.app'],
          responseType: 'code'
        }
      }
    }
  }
};
