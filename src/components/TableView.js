import React from "react";
import ReactJson from "react-json-view";

import "./index.css";
import testGeoJson from "./testGeoJson";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";

// import { slide as Menu } from "react-burger-menu";

const TreeTable = treeTableHOC(ReactTable);

class TableView extends React.Component {
	constructor(props) {
		super(props);
		//this.uploadNewMap = this.uploadNewMap.bind(this);
		const p = this.props.data[0].properties;
		this.state = {
			//col1: this.props.data.properties.name ||  this.props.data.Name || this.props.data.Asset || this.props.data.DESCRIPTIO || this.props.OBJECTID
			//col1 : "name"
			col1: "default",
			col2: "default",
			col3: "default"
		};
	}

	/*
	componentWillMount() {
		/*
		let p = this.props.data[0].properties;
		this.setState = {
			//col1: this.props.data.properties.name ||  this.props.data.Name || this.props.data.Asset || this.props.data.DESCRIPTIO || this.props.OBJECTID
			//col1 : "name"
			col1: x => {
				if ("name" in p) {
					return "name";
				}
				if ("Asset" in p) {
					return "Asset";
				}
				if ("NAME" in p) {
					return "NAME";
				}
			}
		};
		debugger
		
	}
*/

	componentWillReceiveProps() {
		console.log("receive Props!", Date());
		let p = this.props.data[0].properties;

		const col1 = Object.keys(p).find(
			e =>
				e === "name" ||
				e === "Name" ||
				e === "NAME" ||
				e === "OBJECTID" ||
				e === "Asset" ||
				e === "ASSET"
		);
		const col2 = Object.keys(p).find(
			e => e === "description" || e === "DESCRIPTIO"
		);
		this.setState({
			//col1: this.props.data.properties.name ||  this.props.data.Name || this.props.data.Asset || this.props.data.DESCRIPTIO || this.props.OBJECTID
			//col1 : "name"
			col1: col1,
			col2: col2
		});
		console.log("New props:", this.props);
		console.log("this.state.col1:", this.state.col1);
	}

	render() {
		return (
			<TreeTable
				//data={this.state.geoJson.features}
				data={this.props.data}
				SubComponent={row => {
					// a SubComponent just for the final detail

					const columns = [
						{
							Header: "Property",
							accessor: "property",
							style: {
								backgroundColor: "#DDD",
								textAlign: "right"
							}
						},
						{
							Header: "Value",
							accessor: "value"
						}
					];
					const rowData = Object.keys(row.original.properties).map(
						key => {
							return {
								property: key,
								value: row.original.properties[key].toString()
							};
						}
					);
					return (
						<div>
							<ReactTable
								data={rowData}
								columns={columns}
								minRows={1}
								showPagination={false}
							/>
						</div>
					);
				}}
				columns={[
					{
						Header: this.state.col1,
						accessor: "properties." + this.state.col1
					},
					{
						Header: this.state.col2,
						accessor: "properties." + this.state.col2
					},
					{
						Header: "Condition",
						id: "condition",
						accessor: "properties.condition"
					}
				]}
				defaultPageSize="5"
				className="-striped -highlight"
				filterable
				defaultFilterMethod={(filter, row, column) => {
					const id = filter.pivotId || filter.id;
					return row[id] !== undefined
						? String(row[id])
								.toLowerCase()
								.includes(filter.value.toLowerCase())
						: true;
				}}
			/>
		);
	}
}

export default TableView;
