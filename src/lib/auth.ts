import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_96ULZN14A',  // 从你的URL看到的新User Pool ID
  ClientId: '6p193vmdenhm60oe4mgd45dkp1'  // 你的新Client ID
};

const userPool = new CognitoUserPool(poolData);

export const signUp = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email })
    ];
    
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const confirmSignUp = (email: string, code: string) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken()
        });
      },
      onFailure: (err) => {
        reject(err);
      }
    });
  });
};

export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};
