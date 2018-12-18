import auth0 from "auth0-js";

class Auth {
  constructor() {

    this.auth0 = new auth0.WebAuth({
      domain: "tour-mapper.auth0.com",
      audience: "https://tour-mapper.auth0.com/userinfo",
      clientID: "LrUWUhZTWmwi0ire5GDCN3F4RUaxJJ62",
      redirectUri: this.getUri() + '/callback',
      responseType: "id_token",
      scope: "openid profile"
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getUri(){
    if (process.env.NODE_ENV === 'production'){
      return 'https://tour-mapper.herokuapp.com'
    }
    else {
      return 'http://localhost:3000'
    }
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);

        resolve();
      });
    });
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // Set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
        returnTo:this.getUri(), 
        clientID: 'LrUWUhZTWmwi0ire5GDCN3F4RUaxJJ62'
    })
  }

  silentAuth(){
      return new Promise((resolve, reject)=>{
          this.auth0.checkSession({}, (err, authResult)=>{
              if (err) return reject(err); 
              this.setSession(authResult);
              resolve(); 
          })
      })
  }
}

// Singleton
const auth0Client = new Auth();

export default auth0Client;
