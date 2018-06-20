import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";
import ReactJson from "react-json-view";
import './index.css';
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
import classnames from "classnames";
import testGeoJson from "./testGeoJson";
import {
	Circle,
	FeatureGroup,
	LayerGroup,
	GeoJSON,
	Map,
	Popup,
	Rectangle,
	TileLayer
} from "react-leaflet";

// import { slide as Menu } from "react-burger-menu";

class MapAdmin extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: "1",
			geoJson: testGeoJson,
			center: [51.505, -0.09],
			rectangle: [[51.49, -0.08], [51.5, -0.06]]
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
							Import
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
							Data Viewer
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
							Map
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "4"
							})}
							onClick={() => {
								this.toggle("4");
							}}
						>
							Export
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
								<ReactJson src={this.state.geoJson} />
								}
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="3">
						<Map className="map" center={this.state.center} zoom={13}>
							<TileLayer
								attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>

							<LayerGroup>
								<GeoJSON data={this.state.geoJson.testGeoJson} />
								<LayerGroup />
							</LayerGroup>

							<FeatureGroup color="purple">
								<Popup>Popup in FeatureGroup</Popup>
								<Circle center={[51.51, -0.06]} radius={200} />
								<Rectangle bounds={this.state.rectangle} />
							</FeatureGroup>
						</Map>
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(MapAdmin);
