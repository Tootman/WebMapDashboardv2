import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";
import ReactJson from "react-json-view";
import shp from "shpjs";
import ImportShp from "./ImportShp";
import OpenMap from "./OpenMap";
import SaveShp from "./SaveShp";
import SaveCSV from "./SaveCSV";
import ExportMarkers from "./ExportMarkers";
import MetaData from "./MetaData";
// import RelatedData from "./RelatedData";
import UploadNewMap from "./UploadNewMap";
import testGeoJson from "./testGeoJson";
import TableView from "./TableView";
import CheckIcon from "./check.svg";
import L from "leaflet";
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
import "./index.css";
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
    this.onEachFeature = this.onEachFeature.bind(this);
    this.onPointToLayer = this.onPointToLayer.bind(this);
    // this.tableRowCallback = this.tableRowCallback.bind(this);
    this.tableRowCallback2 = this.tableRowCallback2.bind(this);
    this.selectAllRowsCallback = this.selectAllRowsCallback.bind(this);
    this.selectNoRowsCallback = this.selectNoRowsCallback.bind(this);
    this.zoomToFeatureCallback = this.zoomToFeatureCallback.bind(this);

    this.state = {
      activeTab: "1",
      geoJson: testGeoJson.testGeoJson,
      jsonInfo: this.stripOutCoords(testGeoJson.testGeoJson),
      center: [51.505, -0.09],
      rectangle: [[51.49, -0.08], [51.5, -0.06]],
      mapStyle: { height: "500px", width: "100%" },
      maxZoom: 22,
      minZoom: 10,
      dbMapIndexPath: "App/Mapindex/",
      dbMapPath: "App/Maps/",
      mapId: "",
      mapName: "",
      mapDescription: "",
      metaData: { "no meta data": "" },
      markers: {},
      relatedData: { "No related data": "" },
      selectedFeatureStyle: {
        // not used
        color: "purple",
        fillColor: "purple",
        markerColor: "purple"
      },
      //activeFeatureLocation: [51.510937, -0.104396], // dummy location
      //activeFeatureOpacity: 0
      activeFeatureIndex: null, // not used?
      //appendLatestRelatedData: false
      newMaploadedLatch: false, //not used
      /*showWorkingSpinner :false,*/
      /*showWorkingSpinnerClassName : 'spinner-not-visible',*/
      statusMessage: "",
      selectedLayers: {}, // indexKey : layer
      relDataMapHash: "" // mapID for map contining related data and markers etc
    };
  }

  testMethod(x) {
    return x * 2;
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  zoomToFeatureCallback(featureIndex) {
    console.log("zoomToFeatureCallback index:", featureIndex);
    const feature = this.refs.geoJsonLayer.leafletElement.getLayers()[
      featureIndex
    ];
    const featureCollection = [];
    featureCollection.push(feature);
    const featureGroup = new L.featureGroup(featureCollection);
    this.refs.map.leafletElement.flyToBounds(
      featureGroup.getBounds(),
      { maxZoom: 20 } // pad not working !!
    );
  }

  appendRelatedDataToFeatureState(featureSet, related) {
    if (related === null || related === undefined) {
      return featureSet; // return straight back as is
    }
    const getLastRelDataItem = RelDataSet => {
      const sortedKeys = Object.keys(RelDataSet).sort();
      const lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
      return lastDataItem;
    };

    const attachRelatedToRecord = (relKey, index, relDataOb) => {
      // creates an ob with set of keys with related properties as their values
      relDataOb[relKey] = getLastRelDataItem(related[relKey]);
    };
    const relDataObject = {};
    Object.keys(related).map((relKey, index) => {
      attachRelatedToRecord(relKey, index, relDataObject);
    });

    const assignPropsToFeature = (feature, featureIndex, relDataObject) => {
      const ObId = String(feature.properties.OBJECTID + feature.geometry.type);
      Object.assign(featureSet[featureIndex].properties, relDataObject[ObId]); // asign related Props to feature
    };
    const updatedFeatureSet = featureSet.map((feature, index) => {
      assignPropsToFeature(feature, index, relDataObject);

      //console.log("updateFeatureSet:", feature, index)
    });
    const featureState = this.state.geoJson; // get a ref to state
    featureState.features = featureSet;
    this.setState(featureState);
  }

  onPointToLayer(feature, latlng) {
    //enable mcircleMarker instead of marker for color coding of points etc

    return L.circleMarker(latlng); // Change marker to circle
    //return L.marker(latlng); // Change the icon to a custom icon
  }

  onEachFeature(layer, feature) {
    //console.log("OEFlayer:", layer, "OEFfeature:", feature);
    const p = layer.properties;

    const popupTitle =
      p.ASSET || p.Asset || p.asset || p.NAME || p.OBJECTID || "";
    //feature.bindPopup(popupContent)

    let popupTableContent = "<table>";

    //Object.keys(p).map(item =>{return ({"name" : myProps[item] })})
    Object.keys(p).forEach(prop => {
      popupTableContent +=
        "<tr>" + "<td>" + prop + "</td><td>" + p[prop] + "</td></tr>";
    });
    popupTableContent += "</table>";
    //console.log ("f,l:", feature,layer)

    feature.bindTooltip(popupTitle);
    feature.bindPopup(popupTableContent);
  }

  mapUpdateToggle() {
    this.setState({
      mapChangeToggle: !this.state.mapChangeToggle
    });

    const mapRef = this.refs.map.leafletElement;
    mapRef.invalidateSize();
    this.refs.map.leafletElement.fitBounds(
      this.refs.geoJsonLayer.leafletElement.getBounds()
    );
    console.log("mapUpdateToggle!");
  }

  mergeNormalizeGeojson(inputs) {
    const types = {
      Point: "geometry",
      MultiPoint: "geometry",
      LineString: "geometry",
      MultiLineString: "geometry",
      Polygon: "geometry",
      MultiPolygon: "geometry",
      GeometryCollection: "geometry",
      Feature: "feature",
      FeatureCollection: "featurecollection"
    };

    function normalize(gj) {
      if (!gj || !gj.type) return null;
      var type = types[gj.type];
      if (!type) return null;
      if (type === "geometry") {
        return {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: gj
            }
          ]
        };
      } else if (type === "feature") {
        return {
          type: "FeatureCollection",
          features: [gj]
        };
      } else if (type === "featurecollection") {
        return gj;
      }
    }

    const output = {
      type: "FeatureCollection",
      features: []
    };
    for (let i = 0; i < inputs.length; i++) {
      let normalized = normalize(inputs[i]);
      for (let j = 0; j < normalized.features.length; j++) {
        output.features.push(normalized.features[j]);
      }
    }
    return output;
  }

  fileToJSON(file, relDataMapHash) {
    console.log("file:", file, "mapHashfromChild:", relDataMapHash);
    shp(file)
      .then(geojson => {
        geojson = this.mergeNormalizeGeojson(Object.values(geojson));
        delete geojson.fileName;
        geojson = this.removeNaNPropertyValues(geojson);
        //console.log("MyGeoL:", geojson)

        //do something with your geojson

        this.setState({
          geoJson: geojson,
          jsonInfo: this.stripOutCoords(geojson),
          relDataMapHash: relDataMapHash
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

  removeNaNPropertyValues(inJson) {
    const jsonCopy = JSON.parse(JSON.stringify(inJson)); // todo - fudge?
    Object.keys(jsonCopy.features).forEach(i => {
      if (jsonCopy.features[i].properties.CONDITION == NaN) {
        jsonCopy.features[i].properties.CONDITION = 0;
      }
      if (jsonCopy.features[i].properties.HEIGHT == NaN) {
        jsonCopy.features[i].properties.HEIGHT = 0;
      }
    });
    return jsonCopy;
  }

  retrieveMapFromFireBase(mapIndex) {
    const nodePath = String("/App/Maps/" + mapIndex);
    const parent = this;
    /*parent.setState({showWorkingSpinner :true}) */
    /*parent.setState({showWorkingSpinnerClassName : 'spinner-is-visible'}) */
    parent.setState({ statusMessage: "loading map ..." });
    db.ref(nodePath)
      .once("value")
      .then(function(snapshot) {
        // loadOverlayLayer(snapshot.val())  // checks storage then tries downliading file
        //const layerData = snapshot.val()
        //console.log("GeoJson: " + snapshot.val());

        const snap = snapshot.val();
        // const geoJson = parent.mergeNormalizeGeojson([snap.Geo[0], snap.Geo[1], snap.Geo[2]])
        let geoJson = null;
        if (!!snap.Geo.features) {
          geoJson = snap.Geo;
        } else if (snap.Geo.constructor == Array) {
          geoJson = parent.mergeNormalizeGeojson(Object.values(snap.Geo));
        }
        parent.setState({
          geoJson: geoJson,
          jsonInfo: parent.stripOutCoords(geoJson),
          metaData: snap.Meta || { "no meta data": "" },
          relatedData: snap.Related || { "no related data": "" },
          markers: snap.Markers
        });
        parent.mapUpdateToggle();

        parent.appendRelatedDataToFeatureState(snap.Geo.features, snap.Related);
        /*parent.setState({showWorkingSpinner :false}) */
        /*parent.setState({showWorkingSpinnerClassName : 'spinner-not-visible'}) */
        parent.setState({ statusMessage: "" });
      });
  }

  componentDidUpdate() {
    // to force re-rendering map tiles
    // .. but only after a map is opened
    /*
        const mapRef = this.refs.map.leafletElement;
        mapRef.invalidateSize();

        this.refs.map.leafletElement.fitBounds(
            this.refs.geoJsonLayer.leafletElement.getBounds()
        );
        */
  }

  OpenMapCallback(mapRef) {
    console.log("mapRef:", mapRef);

    this.retrieveMapFromFireBase(mapRef.id);
    this.setState({
      mapId: mapRef.id,
      mapName: mapRef.name,
      mapDescription: mapRef.description,
      activeTab: "2a"
    });
  }

  selectAllRowsCallback(selectedRows) {
    console.log("MapAdmin selectAllRowsCallback called!", selectedRows);
    this.setState({ statusMessage: "processing ..." });
    let featureCollection = [];
    selectedRows.map(row => {
      const key = this.state.geoJson.features[row._index].properties;
      key.highlightOnMap = true;
      this.setState({ key });
    });
    this.setState({ statusMessage: "" });
  }

  addToSelectedLayers(indexKey, layer) {
    //console.log("set of features: ", featureCollection)
    //var featureGroup = new L.featureGroup(featureCollection);
    /*
        this.refs.map.leafletElement.flyToBounds(
            featureGroup.getBounds()
        );
        */
    //const selectedLayer = this.state.selectedLayers
    //selectedLayer[indexKey] = layer
    //this.setState ({selectedLayer})
  }

  selectNoRowsCallback() {
    this.setState({ statusMessage: "processing ..." });
    this.setState((prevState, props) => {
      console.log("noRowsPrevState:", prevState.geoJson.features[1].properties);
      prevState.geoJson.features.map(row => {
        let key = row.properties;
        key.highlightOnMap = false;
        this.setState({ key });
      });
    });
    this.setState({ statusMessage: "" });
  }

  tableRowCallback2(rowInfo) {
    console.log("tableRowCallback2!", rowInfo);
    //debugger;
    //handleOriginal(); //not working !

    this.setState({
      activeFeatureIndex: rowInfo.index
    });

    // if myProp exists for this feature then flip it, if if doesnt exist, create it
    let highlightOnMap = this.state.geoJson.features[rowInfo.index].properties
      .highlightOnMap;

    if (highlightOnMap === undefined) {
      this.state.geoJson.features[
        rowInfo.index
      ].properties.highlightOnMap = true;
    } else
      this.state.geoJson.features[
        rowInfo.index
      ].properties.highlightOnMap = !this.state.geoJson.features[rowInfo.index]
        .properties.highlightOnMap;

    console.log(
      "feature clicked:",
      this.refs.geoJsonLayer.leafletElement.getLayers()[rowInfo.index]
    );
  }

  /*
  style(feature) {
    const f = feature.properties.highlightOnMap;
    return {
      // the fillColor is adapted from a property which can be changed by the user (segment)

      weight: f ? 8 : 2,
      //stroke-width: to have a constant width on the screen need to adapt with scale
      opacity: f ? 1 : 0.1,
      color: f ? "red" : "blue",
      fillColor: f ? "red" : "blue",
      radius: f ? 6 : 2,
      className: f ? "myClass" : "",
      //dashArray: "3",
      fillOpacity: f ? 1 : 0.03
    };
  }
  */

  style(feature) {
    const f = feature.properties.highlightOnMap;
    return {
      // the fillColor is adapted from a property which can be changed by the user (segment)

      weight: f ? 3 : 3,
      //stroke-width: to have a constant width on the screen need to adapt with scale
      opacity: f ? 0.5 : 0,
      color: f ? "blue" : "blue",
      fillColor: f ? "blue" : "blue",
      radius: f ? 3 : 3,
      className: f ? "myClassx" : "",
      //dashArray: "3",
      fillOpacity: f ? 0.5 : 0
    };
  }

  render() {
    // myAdded line! 24July 2018  - 2nd time
    return (
      <Container fluid>
        <div class="status-message position-fixed">
          {this.state.statusMessage}
        </div>{" "}
        <Row>
          <Col md="6">
            <p>
              {" "}
              <b>{this.state.mapName} </b>{" "}
            </p>{" "}
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
                  Import{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1b"
                  })}
                  onClick={() => {
                    this.toggle("1b");
                  }}
                >
                  Open{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2"
                  })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  Inspector{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2a"
                  })}
                  onClick={() => {
                    this.toggle("2a");
                  }}
                >
                  Table{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "3b"
                  })}
                  onClick={() => {
                    this.toggle("3b");
                  }}
                >
                  Meta{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "3c"
                  })}
                  onClick={() => {
                    this.toggle("3c");
                  }}
                >
                  Related{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "4"
                  })}
                  onClick={() => {
                    this.toggle("4");
                  }}
                >
                  Export{" "}
                </NavLink>{" "}
              </NavItem>{" "}
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "5"
                  })}
                  onClick={() => {
                    this.toggle("5");
                  }}
                >
                  Upload{" "}
                </NavLink>{" "}
              </NavItem>{" "}
            </Nav>{" "}
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1a">
                <Row>
                  <Col sm="12">
                    <ImportShp callback={this.fileToJSON} />{" "}
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
              <TabPane tabId="1b">
                <OpenMap callback={this.OpenMapCallback} />{" "}
              </TabPane>{" "}
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
                    }{" "}
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
              <TabPane tabId="2a">
                <TableView
                  data={this.state.geoJson.features}
                  selectAllRowsCallback={this.selectAllRowsCallback}
                  selectNoRowsCallback={this.selectNoRowsCallback}
                  //activeFeatureLocationCallback={this.activeFeatureLocationCallback2}

                  rowCallback2={this.tableRowCallback2}
                  zoomToFeatureCallback={this.zoomToFeatureCallback}
                />{" "}
              </TabPane>{" "}
              <TabPane tabId="3b">
                <Row>
                  <Col md="12">
                    <div>
                      <h4> Meta data </h4>{" "}
                      <MetaData metaData={this.state.metaData} />{" "}
                    </div>{" "}
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
              <TabPane tabId="3c">
                <Row>
                  <Col md="12">
                    <div>
                      <h4> Related data </h4>{" "}
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
                    </div>{" "}
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
              <TabPane tabId="4">
                <Row>
                  <Col sm="12">
                    <SaveShp geoJson={this.state.geoJson} />{" "}
                    <SaveCSV geoJson={this.state.geoJson} />{" "}
                    <ExportMarkers geoJson={this.state.markers} />
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
              <TabPane tabId="5">
                <Row>
                  <Col sm="12">
                    <UploadNewMap
                      callback={this.uploadNewMap}
                      geo={this.state.geoJson}
                      mapPath={this.state.dbMapPath}
                      mapIndexPath={this.state.dbMapIndexPath}
                    />{" "}
                  </Col>{" "}
                </Row>{" "}
              </TabPane>{" "}
            </TabContent>{" "}
          </Col>{" "}
          <Col md="6">
            <Map
              className="map"
              ref="map"
              maxZoom={this.state.maxZoom}
              minZoom={this.state.minZoom}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFuc2ltbW9ucyIsImEiOiJjamRsc2NieTEwYmxnMnhsN3J5a3FoZ3F1In0.m0ct-AGSmSX2zaCMbXl0-w"
                id="mapbox.light"
                maxZoom={24}
              />{" "}
              <GeoJSON
                data={this.state.geoJson}
                key={this.state.mapChangeToggle}
                ref="geoJsonLayer"
                style={this.style} // works - feature as parameter
                onEachFeature={this.onEachFeature}
                pointToLayer={this.onPointToLayer}
              />
            </Map>{" "}
          </Col>{" "}
        </Row>{" "}
      </Container>
    );
  }
}

const authCondition = authUser => !!authUser;
const MapAdminComponent = withAuthorization(authCondition)(MapAdmin);
const MapAdminTest = MapAdmin;
export { MapAdminComponent, MapAdminTest };
// originally:
//export default withAuthorization(authCondition)(MapAdmin);
// remember to change App/index.js import back to import MapAdmin ...
