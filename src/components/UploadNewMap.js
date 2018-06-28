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
		//this.handleSubmit = this.handleSubmit.bind(this);
		this.uploadNewMap = this.uploadNewMap.bind(this);
		this.state = {
			mapIndeces: [
				{ name: "Freddy", age: 27 },
				{ name: "Jimmy", age: 25 }
			],
			mapName: "",
			mapDescription: ""
		};
	}

	handleSubmit(e) {
		this.props.callback(this.state);
		e.preventDefault();

		//console.log("handled:", this.mapName.value)
	}

	uploadNewMap(e) {
		//console.log("uploadNewMap in MapAdmin called!", uploadNewMapState);
		//debugger
		e.preventDefault();

		db.ref(this.props.mapPath)
			.push(this.props.geo)
			.then(snap => {
				//console.log("new key " + snap.key);
				return snap.key;
			})
			.then(key => {
				debugger
				db.ref(this.props.mapIndexPath)
				.push({
					mapID: key,
					name: this.state.mapName,
					description: this.state.mapDescription
				});
				console.log(
					"Pushing:",	key,this.state.mapName,	this.state.mapDescription
				);
			})
			.catch(e => {
				console.log("Errrror:", e);
			});
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
							value={this.state.mapName}
							onChange={e => {
								this.setState({ mapName: e.target.value });
							}}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="example">description</Label>
						<Input
							type="text"
							name="mapDescription"
							id="mapDescription"
							placeholder="map description"
							ref="mapDescription"
							onChange={e => {
								this.setState({
									mapDescription: e.target.value
								});
							}}
						/>
					</FormGroup>
					<Button
						type="submit"
						value="submit"
						color="success"
						onClick={this.uploadNewMap}
					>
						Upload
					</Button>
				</Form>
			</div>
		);
	}
}

export default UploadNewMap;
