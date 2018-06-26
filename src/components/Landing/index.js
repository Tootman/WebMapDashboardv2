import React from "react";
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
	Col,
	Container
} from "reactstrap";
import classnames from "classnames";

class LandingPage extends React.Component {
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
				<Row>
					<Col md="6">
						<h1>Landing</h1>
						<p>Titkle 1 signed in.</p>
					</Col>
					<Col md="6">
						<h1>Landing</h1>
						<p>The Landing Page</p>
					</Col>
				</Row>
				<div>
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
								Tab1
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
								Moar Tabs
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
								<Col md="4">
									<Card body>
										<CardTitle>
											Special Title Treatment
										</CardTitle>
										<CardText>
											With supporting text below as a
											natural lead-in to additional
											content.
										</CardText>
										<Button>Go somewhere</Button>
									</Card>
								</Col>
								<Col md="4">
									<Card body>
										<CardTitle>
											Special Title Treatment
										</CardTitle>
										<CardText>
											With supporting text below as a
											natural lead-in to additional
											content.
										</CardText>
										<Button>Go somewhere</Button>
									</Card>
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</div>
		);
	}
}

export default LandingPage;