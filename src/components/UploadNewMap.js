import React from "react";
import { db, auth } from "../firebase/firebase";
import { retriveMapIndex } from "../firebase/db";
import shp from "shpjs";
import "./index.css";
import classnames from "classnames";
import ReactFileReader from "react-file-reader";
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Card,
	Button,
	CardTitle,
	CardText,
	CardBody,
	Container,
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	FormText
} from "reactstrap";

class UploadNewMap extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit= this.handleSubmit.bind(this);
		this.state = {
			mapIndeces: [
				{ name: "Freddy", age: 27 },
				{ name: "Jimmy", age: 25 }
			]
		};
	}

	handleSubmit() {
		this.props.callback()
	}

	render() {
		return (
			<div>
				<h4>Upload the current data as new map on database </h4>
				<Form>
					<FormGroup>
						<Label for="mapName">Map name</Label>
						<Input
							type="text"
							name="mapName"
							id="mapName"
							placeholder="map name"
						/>
					</FormGroup>
					<FormGroup>
						<Label for="example">description</Label>
						<Input
							type="text"
							name="mapDescription"
							id="mapDescription"
							placeholder="map description"
						/>
					</FormGroup>
					<Button color="success"  onClick={this.handleSubmit}>Upload</Button>
				</Form>
			</div>
		);
	}
}

export default UploadNewMap;
