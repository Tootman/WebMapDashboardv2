import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import withAuthentication from "../Session/withAuthentication";
import * as routes from "../../constants/routes";
import Djspage from "../Djspage";
import { MapAdminComponent as MapAdmin } from "../MapAdmin";
import DemoMap from "../demomap";
import "./index.css";

const App = () => (
  <Router>
    <div className="app">
      <Navigation />
      <hr />
      <Route exact path={routes.LANDING} component={() => <LandingPage />} />
      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
      <Route
        exact
        path={routes.PASSWORD_FORGET}
        component={() => <PasswordForgetPage />}
      />
      <Route exact path={routes.HOME} component={() => <HomePage />} />
      <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
      <Route exact path={routes.DJSPAGE} component={() => <Djspage />} />
      <Route exact path={routes.MAPADMIN} component={() => <MapAdmin />} />
      <Route exact path={routes.DEMOMAP} component={() => <DemoMap />} />
    </div>
  </Router>
);

export default withAuthentication(App);
