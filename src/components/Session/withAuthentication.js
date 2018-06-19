import React from "react";

import AuthUserContext from "./AuthUserContext";
import { firebase } from "../../firebase";

const withAuthentication = Component =>
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        myVar: "init Hello!",
        age: 26,
        email: "",

        onEmailChange: e =>
          this.setState({
            email: e.target.value
          }),

        onSendForm: e => {
          console.log("Send form  called!", e.target.value.state.age);
        }
      };
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState(() => ({ authUser }))
          : this.setState(() => ({ authUser: null }));
      });
    }

    render() {
      const { authUser, myVar } = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
        
          <Component />
        </AuthUserContext.Provider>
      );
    }
  };

export default withAuthentication;
