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
    console.log("save button called with geoJson:", this.props.geoJson);
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
