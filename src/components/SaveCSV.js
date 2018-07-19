import React from "react";

import "./index.css";
import { Button, Label, Input } from "reactstrap";
import classnames from "classnames";
import { CSVLink, CSVDownload } from "react-csv";
//import json2csv from "json2csv";
//import ReactFileReader from "react-file-reader";

/*
const csvData =[
  ['firstname', 'lastname', 'email'] ,
  ['Ahmed', 'Tomi' , 'ah@smthing.co.com'] ,
  ['Raed', 'Labes' , 'rl@smthing.co.com'] ,
  ['Yezzi','Min l3b', 'ymin@cocococo.com']
];
*/
const csvData = [
	{ lastname: "Tomi" },
	{ firstname: "Raed", email: "rl@smthing.co.com" },
	{ firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
];

class SaveCSV extends React.Component {
	constructor(props) {
		super(props);
		this.handleSaveButton = this.handleSaveButton.bind(this);
		this.state = {
			tableData: this.props.geoJson.features.map(item => {
				return item.properties;
			})
		};
		//this.callback = this.callback.bind(this);
	}

	handleSaveButton() {
		//console.log("save button called with geoJson:", this.props.geoJson);
		//this.saveAsShape(this.props.geoJson, "download_shp");
		debugger;
		try {
			const csv = json2csv.Parser.parse({ csvData });
			console.log(csv);
		} catch (err) {
			console.error(err);
		}
	}

	saveAsCSV(geoJSON, fileName) {
		const options = {};
	}
	componentWillReceiveProps(nextProps) {
		
		this.setState({
			tableData: nextProps.geoJson.features.map(item => {
				return item.properties;
			})
		});
	}

	//window.shpwrite.download(geoJSON, options);
	//shpwrite.download(geoJSON, options);
	//shpwrite.zip(geoJSON)

	render() {
		const chkStyle = { textAlign: "center" };
		return (
			<div>
				<Button onClick={this.handleSaveButton}> Save as csv </Button>
				<p style={chkStyle}>
					<Label check>
						<Input type="checkbox" /> Include related data
					</Label>
				</p>
				<CSVLink data={this.state.tableData}>Download me</CSVLink>
			</div>
		);
	}
}

export default SaveCSV;
