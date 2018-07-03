import React from "react";
import { db, auth } from "../firebase/firebase";

import "./index.css";
import classnames from "classnames";

import { Table } from "reactstrap";

class MetaData extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {}

	render() {
		return (
			<Table striped>
				<tbody>
					{Object.keys(this.props.metaData).map(item => {
						return (
							<tr>
								<td>{item}</td>
								<td>{this.props.metaData[item]}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	}
}

/*
const ListItem = (obj, item) => (
	<tr>
		<td> {item} </td> <td> {obj[item]} </td>
	</tr>
);
*/

export default MetaData;
