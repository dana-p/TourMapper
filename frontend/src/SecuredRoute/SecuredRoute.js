import React from "react";
import { Route } from "react-router-dom";
import auth0Client from "../Auth";
import Loading from "../Loading";

function SecuredRoute(props) {
  const { component: Component, path, checkingSession } = props;
  return (
    <Route
      path={path}
      render={() => {
        // Check if token is saved
        if (checkingSession) return <Loading />;

        // Check if user is authenticated before showing page
        if (!auth0Client.isAuthenticated()) {
          auth0Client.signIn();
          return <div />;
        }
        return <Component />;
      }}
    />
  );
}

export default SecuredRoute;
