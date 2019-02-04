import { client } from "./index";

import { GetUser } from "./GraphQLCalls";

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
