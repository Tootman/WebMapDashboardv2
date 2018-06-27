import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";
import ReactJson from "react-json-view";
import shp from "shpjs";
import ImportShp from "./ImportShp";
import OpenMap from "./OpenMap";
import "./index.css";
import testGeoJson from "./testGeoJson";
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
import { db, auth } from "../firebase/firebase";

// import { slide as Menu } from "react-burger-menu";

class MapAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.fileToJSON = this.fileToJSON.bind(this);
		this.OpenMapCallback = this.OpenMapCallback.bind(this);
		this.state = {
			activeTab: "1",
			geoJson: testGeoJson.testGeoJson,
			jsonInfo: this.stripOutCoords(testGeoJson.testGeoJson),
			center: [51.505, -0.09],
			rectangle: [[51.49, -0.08], [51.5, -0.06]],
			mapStyle: { height: "500px", width: "100%" }
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	mapUpdateToggle() {
		this.setState({
			mapChangeToggle: !this.state.mapChangeToggle
		});
	}

	fileToJSON(file) {
		shp(file)
			.then(geojson => {
				delete geojson.fileName;
				console.log("MyGeoL:", geojson);

				//do something with your geojson
				this.setState({
					geoJson: geojson,
					jsonInfo: this.stripOutCoords(geojson)
				});
				this.mapUpdateToggle();
			})
			.catch(error => {
				console.log("myError:", error);
			});
	}

	stripOutCoords(inJson) {
		// return a copy of GeoJSON with all coords removed

		const jsonCopy = JSON.parse(JSON.stringify(inJson));

		Object.keys(jsonCopy.features).forEach(i => {
			delete jsonCopy.features[i].geometry.coordinates;
			delete jsonCopy.features[i].geometry.bbox;
		});
		return jsonCopy;
	}

	retrieveMapFromFireBase(mapIndex) {
		const nodePath = String("/App/Maps/" + mapIndex);
		const parent = this;
		db.ref(nodePath)
			.once("value")
			.then(
				function(snapshot) {
					// loadOverlayLayer(snapshot.val())  // checks storage then tries downliading file
					//const layerData = snapshot.val()
					//console.log("GeoJson: " + snapshot.val());
					const geo = snapshot.val().Geo
					parent.setState({
						geoJson: geo,
						jsonInfo: parent.stripOutCoords(geo)
					});
					parent.mapUpdateToggle()
				}
				// clear geoLayer data from map
				//  setupGeoLayer (layerData.Geo, layerData.Meta)
				// Map.fitBounds(App.geoLayer.getBounds())
				// set state mapkey to  snapshot.key
			);
	}

	componentDidUpdate() {
		// to force rre-rendering map tiles
		const mapRef = this.refs.map.leafletElement;
		mapRef.invalidateSize();
		console.log("didUpdate!");
	}

	OpenMapCallback(mapRef) {
		console.log("mapRef:", mapRef);
		this.retrieveMapFromFireBase(mapRef);
	}

	render() {
		return (
			<div>
				<h1>Map Admin page</h1>

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
							Import Shpfiles
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
							Open Map
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
								<ImportShp callback={this.fileToJSON} />
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="1b">
						<OpenMap callback={this.OpenMapCallback} />
					</TabPane>
					<TabPane tabId="2">
						<Row>
							<Col sm="12">
								<ReactJson src={this.state.jsonInfo} />
								}
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="3a">
						<Map
							className="map"
							ref="map"
							center={this.state.center}
							zoom={13}
						>
							<TileLayer
								attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>

							<LayerGroup>
								<GeoJSON
									data={this.state.geoJson}
									key={this.state.mapChangeToggle}
								/>
								<LayerGroup />
							</LayerGroup>
						</Map>
					</TabPane>
					<TabPane tabId="3b">
						<Row>
							<Col md="12">
								<div>
									<h4>Meta data </h4>
									<p>Tabular data of map meta data etc</p>
								</div>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="4">
						<Row>
							<Col sm="12">
								<h4>
									Export as set of ShapeFiles to local drive
								</h4>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="5">
						<Row>
							<Col sm="12">
								<h4>
									upload as new map on database (not available
									on DEMO)
								</h4>
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
