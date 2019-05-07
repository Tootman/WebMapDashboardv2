import React from "react";

import shp from "shpjs";
import "./index.css";
import { Button } from "reactstrap";
import classnames from "classnames";
import ReactFileReader from "react-file-reader";

class ImportShp extends React.Component {
  constructor(props) {
    super(props);
    this.handleFiles = this.handleFiles.bind(this);
    //this.callback = this.callback.bind(this);
  }

  handleFiles(inFile) {
    const myFile = inFile.fileList[0];
    const fileExt = myFile.name
      .split(".")
      .pop()
      .toLowerCase();
    switch (fileExt) {
      case "shp":
      case "zip":
        //code block
        console.log("shp!");
        const fileReader = new FileReader();
        fileReader.addEventListener("load", event => {
          const textFile = event.target;
          this.props.callback(textFile.result);
        });
        fileReader.readAsArrayBuffer(myFile);
        console.log("file:", myFile);
        break;
      case "geojson":
      //code block
      default:
      //code block
    }
  }

  render() {
    return (
      <div>
        <h4>Import shp</h4>
        <ReactFileReader
          fileTypes=".zip, .shp, .geojson"
          handleFiles={this.handleFiles}
          multipleFiles={false}
          base64={true}
        >
          <ul>
            <li>create QGIS project from shp file set</li>
            <li>
              copy desired features into new layers - splitting up selection etc
              if necessary
            </li>
            <li>Rename 'ASSETS' or 'assets' fields in each shp to 'Assets' </li>
            <li>Zip up</li>
            <li>Click upload etc </li>
          </ul>
          <Button color="primary">Upload zipped shp files</Button>
        </ReactFileReader>
      </div>
    );
  }
}

export default ImportShp;
