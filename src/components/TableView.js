import React from "react";
import ReactJson from "react-json-view";

import "./index.css";
import testGeoJson from "./testGeoJson";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./table-view.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { getRelatedData } from "../firebase/firebase";
import ImageLoader from "react-load-image";

const TreeTable = treeTableHOC(ReactTable);

const Photo = props => {
	return (
		<div>
			<ImageLoader src={props.url}>
				<img style={{width: '100%'}} />
			</ImageLoader>
			The logged in user is {props.url}
		</div>
	);
};

// NOTES - geoJson set in constructor only - so won't add new related data in realtime

class TableView extends React.Component {
	constructor(props) {
		super(props);
		this.handleRowClick = this.handleRowClick.bind(this);
		//const p = this.props.data[0].properties;

		this.state = {
			col1: "default",
			col2: "default",
			col3: "default",
			activeRowCoords: [],
			expanded: {},
			activeRow: null,
			selectedStyle: { backgroundColor: "khaki" },
			unSelectedStyle: { backgroundColor: "gainsboro" },
			tableData: this.props.data
		};
	}

	componentWillMount() {
		//console.log("hello from cwm")
		this.assignRelatedDataToTableData();

		this.setState({
			//newpropertiesList
			//myProps
		});
	}

	assignRelatedDataToTableData() {
		// fetch latest relatedDataSet for map
		getRelatedData("myKey");
		const myProps = this.state.tableData;
		myProps[0].properties.newPropKey = "myNewPropVal-1";
		myProps[1].properties.newPropKey = "myNewPropVal-2";
	}

	componentWillReceiveProps() {
		console.log("receive Props!", Date());
		let p = this.props.data[0].properties; // base the headings on fields in the  1st record

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

		const newPropKey = this.state.tableData[0].myNewProp;
		this.setState({
			col1: col1,
			col2: col2,
			tableData: this.props.data
		});
	}

	handleRowClick(e, handleOriginal, rowInfo, state, instance) {
		this.props.rowCallback(rowInfo, handleOriginal);
	}

	/*
	handleRowExpanded(newExpanded, index, event) {
	
		this.setState({
			// we override newExpanded, keeping only current selected row expanded
			expanded: { [index]: !this.state.expanded[index] }
		});
		this.props.activeFeatureLocationCallback(
			index,
			!this.state.expanded[index]
		);
	}
	*/

	showRelated(value) {
		console.log("showRelated clicked!", value);
	}

	render() {
		return (
			<TreeTable
				data={this.state.tableData}
				minRows={1}
				getTdProps={(state, rowInfo, column, instance) => {
					return {
						style:
							rowInfo && this.state.tableData[rowInfo.index]
								? this.state.tableData[rowInfo.index].properties
										.highlightOnMap
									? this.state.selectedStyle
									: this.state.unSelectedStyle
								: this.state.unSelectedStyle,

						onClick: (e, handleOriginal) => {
							this.handleRowClick(
								e,
								handleOriginal,
								rowInfo,
								state,
								instance
							);
						}
					};
				}}
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

					let photoUrl = row.original.properties['photo'] || "http://placekitten.com/300/150" ;
 
					return (
						<div>
							<Photo url={photoUrl} />
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
					},
					{
						Header: "",
						id: "highlightOnMap",
						accessor: "properties.highlightOnMap",
						show: false
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
