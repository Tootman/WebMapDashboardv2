import React from "react";
import ReactJson from "react-json-view";

import "./index.css";
import testGeoJson from "./testGeoJson";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./table-view.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";

// import { slide as Menu } from "react-burger-menu";

const TreeTable = treeTableHOC(ReactTable);

class TableView extends React.Component {
	constructor(props) {
		super(props);
		//this.uploadNewMap = this.uploadNewMap.bind(this);
		//this.featureSelected = this.featureSelected.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		const p = this.props.data[0].properties;
		this.state = {
			//col1: this.props.data.properties.name ||  this.props.data.Name || this.props.data.Asset || this.props.data.DESCRIPTIO || this.props.OBJECTID
			//col1 : "name"
			col1: "default",
			col2: "default",
			col3: "default",
			activeRowCoords: [],
			expanded: {},
			activeRow: null,
			selectedStyle: { backgroundColor: "khaki" },
			unSelectedStyle: { backgroundColor: "gainsboro" }
		};
	}

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

	handleRowClick(e, handleOriginal, rowInfo, state, instance) {
		//debugger
		//console.log("handleRowClick!:", rowInfo);
		this.props.rowCallback(rowInfo, handleOriginal);
		//handleOriginal();
		//this.setState({
		//	activeRow : rowInfo.index
		//})
	}

	handleRowExpanded(newExpanded, index, event) {
		//debugger;
		this.setState({
			// we override newExpanded, keeping only current selected row expanded
			expanded: { [index]: !this.state.expanded[index] }
		});
		this.props.activeFeatureLocationCallback(
			index,
			!this.state.expanded[index]
		);
	}

	showRelated(value){
		console.log("showRelated clicked!", value)
	}

	render() {
		return (
			<TreeTable
				//data={this.state.geoJson.features}
				data={this.props.data}
				//expanded={this.state.expanded}
				//onExpandedChange={(newExpanded, index, event) => this.handleRowExpanded(newExpanded, index, event)}

				/*
				getTrProps={(state, rowInfo, column) => {
					
					return {
						style: {
							color: "blue"
						}
					};
				}}
				*/

				minRows={1}
				getTdProps={(state, rowInfo, column, instance) => {
					return {
						/*
						onClick: (e, this.handleOriginal) => {
							console.log("It was in this row:", rowInfo);
							if (handleOriginal) {
								handleOriginal();
							}
						}
						*/

						/*
						style: {
							backgroundColor: (rowInfo && this.props.data[rowInfo.index]) ? (((this.props.data[(rowInfo.index)].properties.highlightOnMap) )? 'yellow' : "lightGrey") : 'lightGrey'
						},
						*/

						//className:  ((rowInfo && this.props.data[rowInfo.index]) ? (((this.props.data[(rowInfo.index)].properties.highlightOnMap) )? 'Hello' : "lightGrey") : 'lightGrey'),

						style:
							rowInfo && this.props.data[rowInfo.index]
								? this.props.data[rowInfo.index].properties
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

							/*
							// toggle "hello" class on row - but not working as index is rel to top row of current page
							let selectedClassName  = "rt-tr-group hello";
							const unselectedClassName = "rt-tr-group"
							const el = e.target.parentElement.parentElement
							el.className =  el.className.includes("hello") ? unselectedClassName : selectedClassName
							*/
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
					},
					{
						Header: "",
						id: "highlightOnMap",
						accessor: "properties.highlightOnMap",
						show: false
					},
					
				
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
