import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import AuthUserContext from "../Session/AuthUserContext";
import SignOutButton from "../SignOut";
import * as routes from "../../constants/routes";
import AppContext from "../Session/AppContext";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
  </AuthUserContext.Consumer>
);

class NavigationAuth extends React.Component {
  /*
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><Link to={routes.DJSPAGE}>DJS page</Link></li>
    <li><Link to={routes.MAPADMIN}>MapAdmin</Link></li>
    <li><SignOutButton /></li>
   
  </ul>
  */

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href={process.env.PUBLIC_URL + "/"}>WebMap</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href={process.env.PUBLIC_URL + "/MapAdmin"}>
               Map Admin
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={process.env.PUBLIC_URL + "/User"}>User</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Tools
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  href={process.env.PUBLIC_URL + "/ImportShapeFile"}
                >
                  Import ShapeFile
                </DropdownItem>
                <DropdownItem
                  href={process.env.PUBLIC_URL + "/ExportShapeFile"}
                >
                  Export Shapefile
                </DropdownItem>
                <DropdownItem href={process.env.PUBLIC_URL + "/UploadNewMap"}>
                  Upload new map to Cloud
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href={process.env.PUBLIC_URL + "/Help"}>
                  {" "}
                  Help{" "}
                </DropdownItem>
                <DropdownItem href="/gettingStarted">
                  Getting started
                </DropdownItem>
                <DropdownItem href={process.env.PUBLIC_URL + "/ORCLInfo"}>
                  More info on ORCL
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={routes.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </li>
    <li>
      <Link to={routes.DJSPAGE}>DJS page</Link>
    </li>
    <li>
      <Link to={routes.MAPADMIN}>MapAdmin</Link>
    </li>
  </ul>
);

export default Navigation;
