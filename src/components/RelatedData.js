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
					{Object.keys(this.props.relatedData).map(item => {
						return (
							<tr>
								<td>{item}</td>
								<td>{this.props.relatedData[item][0]}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	}
}



export default MetaData;
