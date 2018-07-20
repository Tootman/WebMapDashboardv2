import React from "react";

import "./index.css";
import { Button, Label, Input } from "reactstrap";
import classnames from "classnames";
import { CSVLink, CSVDownload } from "react-csv";
//import json2csv from "json2csv";
//import ReactFileReader from "react-file-reader";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const csvData = [
	{ lastname: "Tomi" },
	{ firstname: "Raed", email: "rl@smthing.co.com" },
	{ firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
];

const dataSet1 = [
	{
		
		amount: 30000,
		sex: "M",
		is_married: true
	},
	{
		name: "Monika",
		
		sex: "F",
		is_married: false
	},
	{
		name: "John",
		amount: 250000,
		
		is_married: false
	},
	{
		
		sex: "M",
		is_married: true
	}
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

	render() {
		const chkStyle = { textAlign: "center" };
		return (
			<div>
				<p> Save as csv file (with latest related data) </p>
				<CSVLink
					data={this.state.tableData}
					className="btn btn-primary"
				>
					Save as csv file
				</CSVLink>
				<hr/>
				<p>
				<ExcelFile element={<button className="btn btn-primary">Download Data</button>}>
					<ExcelSheet data={dataSet1} name="Employees" >
						<ExcelColumn label="Name" value="name" />
						<ExcelColumn label="Wallet Money" value="amount" />
						<ExcelColumn label="Gender" value="sex" />
						<ExcelColumn
							label="Marital Status"
							value={col =>
								col.is_married ? "Married" : "Single"
							}
						/>
					</ExcelSheet>
				</ExcelFile>
				</p>
			</div>
		);
	}
}

export default SaveCSV;
