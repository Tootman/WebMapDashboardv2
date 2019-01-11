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
        <h4>
          Select shape file (or zip of set of shape files), from local drive,
          and import it as GeoJSON based map
        </h4>
        <ReactFileReader
          fileTypes=".zip, .shp, .geojson"
          handleFiles={this.handleFiles}
          multipleFiles={false}
          base64={true}
        >
          <Button className="btn">Upload file</Button>
        </ReactFileReader>
      </div>
    );
  }
}

export default ImportShp;
