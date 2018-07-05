import React from 'react';

import AuthUserContext from '../Session/AuthUserContext';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';
import {
	Row,
	Col,
	Container
} from "reactstrap";

const AccountPage = () =>
  <AuthUserContext.Consumer>
    {authUser =>
      <Container>
      <Row>
        <h1>Account: {authUser.email}</h1>
       </Row>
       <Row>
        <p><PasswordForgetForm /></p>
        </Row>
        <Row>
        <p><PasswordChangeForm /></p>
       </Row>
      </Container>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);