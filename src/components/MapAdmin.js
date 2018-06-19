import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Card,
	Button,
	CardTitle,
	CardText,
	Row,
	Col
} from "reactstrap";
import classnames from 'classnames';

class MapAdmin extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: "1"
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		return (
			<div>
				<h1>Map Admin page</h1>
				<Nav tabs>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "1"
							})}
							onClick={() => {
								this.toggle("1");
							}}
						>
							Import Map
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "2"
							})}
							onClick={() => {
								this.toggle("2");
							}}
						>
							Data inspector
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "3"
							})}
							onClick={() => {
								this.toggle("3");
							}}
						>
							Map View
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
						<Row>
							<Col sm="12">
								<h4>Tab 1 Contents</h4>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="2">
						<Row>
							<Col sm="12">
								<Card body>
									<CardTitle>
										Data inspector
									</CardTitle>
									<CardText>
										This will show collapsable tree View of Assets/Attributes.
										Bellow it (or on sep tab - will be related Data)
									</CardText>
									<Button>Go somewhere</Button>
								</Card>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="3">
						<Row>
							<Col sm="12">
								<Card body>
									<CardTitle>
										Map view
									</CardTitle>
									<CardText>
										this will display the leaflet map
									</CardText>
									<Button>Go somewhere</Button>
								</Card>
							</Col>
						</Row>
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(MapAdmin);
