import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";
import ReactJson from "react-json-view";
import shp from "shpjs";
import ImportShp from "./ImportShp";
import OpenMap from "./OpenMap";
import SaveShp from "./SaveShp";
import MetaData from "./MetaData";
// import RelatedData from "./RelatedData";
import UploadNewMap from "./UploadNewMap";
import "./index.css";
import testGeoJson from "./testGeoJson";
import TableView from "./TableView";

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
	CircleMarker,
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
		//this.activeFeatureLocationCallback = this.activeFeatureLocationCallback.bind(this);
		this.activeFeatureLocationCallback2 = this.activeFeatureLocationCallback2.bind(
			this
		);
		//this.uploadNewMap = this.uploadNewMap.bind(this);
		this.state = {
			activeTab: "1",
			geoJson: testGeoJson.testGeoJson,
			jsonInfo: this.stripOutCoords(testGeoJson.testGeoJson),
			center: [51.505, -0.09],
			rectangle: [[51.49, -0.08], [51.5, -0.06]],
			mapStyle: { height: "500px", width: "100%" },
			maxZoom: 18,
			minZoom: 10,
			dbMapIndexPath: "App/Mapindex/",
			dbMapPath: "App/Maps/",
			mapId: "",
			mapName: "",
			mapDescription: "",
			metaData: { "no meta data": "" },
			relatedData: { "No related data": "" },
			//activeFeatureLocation: [51.510937, -0.104396], // dummy location
			//activeFeatureOpacity: 0
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

	activeFeatureLocationCallback2(index, expanded) {
		
		let coords = []; // will store the first point of feature

		switch (this.state.geoJson.features[index].geometry.type) {
			case "LineString":
				coords = this.state.geoJson.features[index].geometry
					.coordinates[0];
				break;

			case "Point":
				coords = this.state.geoJson.features[index].geometry
					.coordinates;
				break;

			case "Polygon":
				coords = this.state.geoJson.features[index].geometry
					.coordinates[0][0];
				break;
		}

		this.setState({
			activeFeatureLocation: coords,
			activeFeatureOpacity: expanded ? 1 : 0
		});
		//console.log("coords:",this.state.geoJson.features[index].geometry.coordinates)
	}

	fileToJSON(file) {
		console.log("file:", file);
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
			.then(function(snapshot) {
				// loadOverlayLayer(snapshot.val())  // checks storage then tries downliading file
				//const layerData = snapshot.val()
				//console.log("GeoJson: " + snapshot.val());
				const snap = snapshot.val();
				parent.setState({
					geoJson: snap.Geo,
					jsonInfo: parent.stripOutCoords(snap.Geo),
					metaData: snap.Meta || { "no meta data": "" },
					relatedData: snap.Related || { "no related data": "" }
				});
				parent.mapUpdateToggle();
			});
	}

	componentDidUpdate() {
		// to force rre-rendering map tiles
		const mapRef = this.refs.map.leafletElement;
		mapRef.invalidateSize();
		console.log("didUpdate!");
		this.refs.map.leafletElement.fitBounds(
			this.refs.geoJsonLayer.leafletElement.getBounds()
		);
	}

	OpenMapCallback(mapRef) {
		console.log("mapRef:", mapRef.id);

		this.retrieveMapFromFireBase(mapRef.id);
		this.setState({
			mapId: mapRef.id,
			mapName: mapRef.name,
			mapDescription: mapRef.description
		});
	}

	render() {
		return (
			<Container fluid>
				<h1>Map Admin</h1>
				<Row>
					<Col md="6">
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
									Import
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
									Open
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
									Inspector
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({
										active: this.state.activeTab === "2a"
									})}
									onClick={() => {
										this.toggle("2a");
									}}
								>
									Table
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
									Meta
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({
										active: this.state.activeTab === "3c"
									})}
									onClick={() => {
										this.toggle("3c");
									}}
								>
									Related
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
									Upload
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
										<ReactJson
											src={this.state.jsonInfo}
											enableEdit="false"
											collapsed="false"
											enableClipboard="false"
											enableAdd="false"
											enableDelet="false"
											displayObjectSize="false"
											displayDataTypes="false"
											name="GeoJson"
										/>
										}
									</Col>
								</Row>
							</TabPane>
							<TabPane tabId="2a">
								<TableView
									data={this.state.geoJson.features}
									//activeFeatureLocationCallback={this.activeFeatureLocationCallback2}
								/>
							</TabPane>
							<TabPane tabId="3b">
								<Row>
									<Col md="12">
										<div>
											<h4>Meta data </h4>
											<MetaData
												metaData={this.state.metaData}
											/>
										</div>
									</Col>
								</Row>
							</TabPane>
							<TabPane tabId="3c">
								<Row>
									<Col md="12">
										<div>
											<h4>Related data </h4>
											<ReactJson
												src={this.state.relatedData}
												enableEdit="false"
												collapsed="false"
												enableClipboard="false"
												enableAdd="false"
												enableDelet="false"
												displayObjectSize="false"
												displayDataTypes="false"
												name="Related Data"
											/>
										</div>
									</Col>
								</Row>
							</TabPane>
							<TabPane tabId="4">
								<Row>
									<Col sm="12">
										<SaveShp geoJson={this.state.geoJson} />
									</Col>
								</Row>
							</TabPane>
							<TabPane tabId="5">
								<Row>
									<Col sm="12">
										<UploadNewMap
											callback={this.uploadNewMap}
											geo={this.state.geoJson}
											mapPath={this.state.dbMapPath}
											mapIndexPath={
												this.state.dbMapIndexPath
											}
										/>
									</Col>
								</Row>
							</TabPane>
						</TabContent>
					</Col>
					<Col md="6">
						<h3> {this.state.mapName} </h3>
						<p>{this.state.mapDescription}</p>

						<Map
							className="map"
							ref="map"
							maxZoom={this.state.maxZoom}
							minZoom={this.state.minZoom}
						>
							<TileLayer
								attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>

							<LayerGroup>
								<GeoJSON
									data={this.state.geoJson}
									key={this.state.mapChangeToggle}
									ref="geoJsonLayer"
								/>
							</LayerGroup>
							{/*
							<CircleMarker
								center={[
									this.state.activeFeatureLocation[1],
									this.state.activeFeatureLocation[0]
								]}
								//center = {[ 51.52, -0.11]}
								opacity={this.state.activeFeatureOpacity}
								key={"my234343Key"}
								radius={20}
								color={"red"}
								weight={3}
							/>
						*/}
						</Map>
					</Col>
				</Row>
			</Container>
		);
	}
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(MapAdmin);
