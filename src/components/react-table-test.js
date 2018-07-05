import React from "react";
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import testData from "./test_data";
// the HOC provides the configuration for the TreeTable
const TreeTable = treeTableHOC(ReactTable);
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			data: testData
		};
	}
	render() {
		const { data } = this.state;
		// now use the new TreeTable component
		return (
			<div>
				<TreeTable
					data={data}
					columns={[
						// we only require the accessor so TreeTable
						// can handle the pivot automatically
						{
							accessor: "state"
						},
						{
							accessor: "post"
						},
						{
							accessor: "city"
						},
						// any other columns we want to display
						{
							accessor: "first_name"
						},
						{
							accessor: "last_name"
						},
						{
							Header: "Address",
							accessor: "address"
						}
					]}
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
							{ Header: "Value", accessor: "value" }
						];
						const rowData = Object.keys(row.original).map(key => {
							return {
								property: key,
								value: row.original[key].toString()
							};
						});
						return (
							<div>
								<ReactTable data={rowData} columns={columns} />
							</div>
						);
					}}
				/>
			</div>
		);
	}
}

render(<App />, document.getElementById("root"));
