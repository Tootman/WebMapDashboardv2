import React from "react";

import "./index.css";
import { Button, Label, Input } from "reactstrap";
import classnames from "classnames";
import ReactFileReader from "react-file-reader";

class ExportMarkers extends React.Component {
  constructor(props) {
    super(props);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    //this.callback = this.callback.bind(this);
  }

  handleSaveButton() {
    //console.log("save button called with geoJson:", this.props.geoJson);
    //const markerObset = this.props.geoJson;
    //const featureArray = markerObset.map(markerOb => {
    //  return Object.values(markerOb)[0];
    //});

    const download = (content, fileName, contentType) => {
      console.log("download!");
      const a = document.createElement("a");
      const contentText = JSON.stringify(content);
      const file = new Blob([contentText], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    };

    const featureArray = Object.values(this.props.geoJson);
    console.log("Marker Array:", featureArray);
    const featureCollection = {};
    featureCollection.type = "FeatureCollection";
    featureCollection.features = featureArray;
    download(featureCollection, "myMarkers.json", "text/plain");

    //this.saveAsShape(this.props.geoJson, "download_shp");
  }

  exportMarkersAsGeoJSON(geoJSON) {
    console.log("exportMarkersAsGeoJSON!");
  }

  render() {
    const chkStyle = { textAlign: "center" };
    return (
      <div>
        <p>Export Markers as a GeoJSON featureCollection</p>
        <Button onClick={this.handleSaveButton} color="primary">
          Export Markers
        </Button>
      </div>
    );
  }
}

export default ExportMarkers;
