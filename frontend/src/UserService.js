import gql from "graphql-tag";
import { client } from "./index";

const GetUser = gql`
  mutation {
    createUser {
      id
      name
      email
      tours
      firstName
      lastName
      userIdentifier
      picture
    }
  }
`; // DANATODO: Do I need more information for the tours? Do I even need the tours???

class UserData {
  userData = null;

  async getUserData() {
    if (!this.userData) await this.setUserData();
    return this.userData;
  }

  async setUserData() {
    var mutationPromise = client.mutate({
      mutation: GetUser
    });
    var self = this;
    await mutationPromise.then((res, err) => {
      if (err) console.log("that didn't work");
      else self.userData = res.data.createUser;
    });
  }
}

// Singleton
const userData = new UserData();

export default userData;