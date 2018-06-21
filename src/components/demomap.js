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

class DemoMap extends React.Component {
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


	componentDidUpdate(){
        const mapRef = this.refs.map.leafletElement;
        mapRef.invalidateSize()
        console.log("didUpdate!")
    }

	render() {
		return (
			<div>
				<h1>Map Admin DEMO page</h1>

				<Nav tabs>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "1a"
							})}
							onClick={() => {
								this.toggle("1a");
							}}
						>
							Import from shp
						</NavLink>
					</NavItem>
						<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "1b"
							})}
							onClick={() => {
								this.toggle("1b");
							}}
						>
							Open from datase
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
								active: this.state.activeTab === "3a"
							})}
							onClick={() => {
								this.toggle("3a");
							}}
						>
							Map View
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "3b"
							})}
							onClick={() => {
								this.toggle("3b");
							}}
						>
							Meta Data
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
						<NavItem>
						<NavLink
							className={classnames({
								active: this.state.activeTab === "5"
							})}
							onClick={() => {
								this.toggle("5");
							}}
						>
							Export as new map on database
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1a">
						<Row>
							<Col sm="12">
								<h4>Select shape file (or zip of set of shape files), from local drive, 
									and import it as GeoJSON based map
								</h4>
							</Col>
						</Row>
					</TabPane>
						<TabPane tabId="1b">
						<Row>
							<Col sm="12">
								<h4>Open an existing map from the database (Not enabled on demo)
								</h4>
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
					<TabPane tabId="3a">
						<Map className="map" ref="map" center={this.state.center} zoom={13}>
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
					<TabPane tabId="3b">
						<Row>
							<Col sm="12">
								<h4>Map meta data as a table (or maybe an another Tree View if contains nested data)</h4>
								
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="4">
						<Row>
							<Col sm="12">
								<h4>Export as set of ShapeFiles  to local drive</h4>
								
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="5">
						<Row>
							<Col sm="12">
								<h4>upload as new map on database (not available on DEMO)</h4>
								
							</Col>
						</Row>
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

export default DemoMap;
