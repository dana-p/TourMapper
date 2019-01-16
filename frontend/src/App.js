import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import "./App.css";
import NavBar from "./NavBar/NavBar";
import Tours from "./Tours/Tours";
import Tour from "./Tour/Tour";
import Callback from "./Callback";
import SecuredRoute from "./SecuredRoute/SecuredRoute";
import NewTour from "./NewTour/NewTour";
import auth0Client from "./Auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkingSession: true
    };
  }

  async componentDidMount() {
    // This is only reached when user is authenticating
    if (this.props.location.pathname === "/callback") {
      this.setState({
        checkingSession: false
      });
      return;
    }
    // Try to authenticate on refresh
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }

    this.setState({
      checkingSession: false
    });
  }

  render() {
    return (
      <div>
        <NavBar />
        <Route exact path="/" component={Tours} />
        <Route exact path="/tour/:tourId" component={Tour} />
        <Route exact path="/callback" component={Callback} />
        <SecuredRoute
          path="/new-tour"
          checkingSession={this.state.checkingSession}
          component={NewTour}
        />
      </div>
    );
  }
}

export default withRouter(App);
