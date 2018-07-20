import React from "react";

import shp from "shpjs";
import "./index.css";
import { Button, Label, Input } from "reactstrap";
import classnames from "classnames";
import ReactFileReader from "react-file-reader";
import shpwrite from "shp-write";

class SaveShp extends React.Component {
	constructor(props) {
		super(props);
		this.handleSaveButton = this.handleSaveButton.bind(this);
		//this.callback = this.callback.bind(this);
	}

	handleSaveButton() {
		console.log("save button called with geoJson:", this.props.geoJson);
		this.saveAsShape(this.props.geoJson, "download_shp");
	}

	saveAsShape(geoJSON, fileName) {
		const options = {
			folder: String(fileName + "+related"),
			types: {
				point: "Points",
				polygon: "Polygons",
				line: "Lines"
			}
		};
		console.log("saveShp GeoJSON:", geoJSON);
		console.log("filename:", fileName);

		//window.shpwrite.download(geoJSON, options);
		shpwrite.download(geoJSON, options);
		//shpwrite.zip(geoJSON)
	}

	render() {
		const chkStyle = { textAlign: "center" };
		return (
			<div>
				<p>
					Save current map as zipped shapefile set, (with most recent
					related Data)
				</p>
				<Button
					onClick={this.handleSaveButton}
					color="primary"
				>
					Save as shape File set (zip){" "}
				</Button>
				{/*}
				<p style={chkStyle}>
					<Label check>
						<Input type="checkbox" /> Include related data
					</Label>
				</p>
			*/}
			</div>
		);
	}
}

export default SaveShp;
