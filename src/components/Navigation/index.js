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
      <Navbar color="dark" dark expand="md">

        <NavbarToggler onClick={this.toggle} />
       <Link class="navbar-brand"  to={routes.LANDING} >WebMap</Link>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <li class="nav-item">
              <Link className="nav-link" to={routes.MAPADMIN}>
              Map Admin
              </Link>

            </li>
            <li className="nav-item">
               <Link className="nav-link" to={routes.ACCOUNT}>
                Account
              </Link>
            </li>
          
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
            <li>
              <SignOutButton />
            </li>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

class NavigationNonAuth extends React.Component {
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
      <Navbar color="dark" dark expand="md">
    
    {/*}   
       <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><Link to={routes.DJSPAGE}>DJS page</Link></li>
    <li><Link to={routes.MAPADMIN}>MapAdmin</Link></li>
    <li><SignOutButton /></li>
  </ul>
*/}
        <NavbarToggler onClick={this.toggle} />
        <Link class="navbar-brand"  to={routes.LANDING} >WebMap</Link>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <li className="nav-item">
              <Link className="nav-link" to={routes.LANDING}   >
                Landing
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={routes.DEMOMAP}   >
                Demo map
              </Link>
            </li>
             <li className="nav-item">
              <Link className="nav-link" to={routes.SIGN_IN}>
                SignIn
              </Link>
            </li>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
