import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import auth from "./Auth";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

function getUri() {
  if (process.env.NODE_ENV === "production") {
    return "https://tour-mapper.herokuapp.com/graphql";
  } else {
    return "http://localhost:4000/graphql";
  }
}

const client = new ApolloClient({
  uri: "https://tour-mapper.herokuapp.com",
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: auth.getIdToken()
      }
    }));
  }
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
