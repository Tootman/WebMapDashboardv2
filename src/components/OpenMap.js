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
	Col
} from "reactstrap";

class OpenMap extends React.Component {
	constructor(props) {
		super(props);
		this.selectMapIndex.bind(this);
		this.state = {
			mapIndeces: [
				{ name: "Freddy", age: 27 },
				{ name: "Jimmy", age: 25 }
			]
		};
	}

	componentWillMount() {
		retriveMapIndex().then(res => {
			console.log("res from OpenMap:", res);
			this.setState({
				mapIndeces: res
			});
		});
	}

	renderMapIndexList() {
		this.state.mapIndeces.map(item => {
			<li> Hello insidr render: </li>;
			console.log("from render: ", item);
		});
	}



	selectMapIndex(e) {
		console.log("selectMapIndex called!", e);
		this.props.callback(e);
	}

	render() {
		return (
			<MapCards
				mapRefs={this.state.mapIndeces}
				mapIndexCallback={this.selectMapIndex.bind(this)}
			/>
		);
	}
}

class MapCards extends React.Component {
	render() {
		const MapCards = this.props.mapRefs.map((item, k) => {
			return (
				<Col
					md="4"
					className="d-flex align-items-stretch justify-content-around"
					key={k}
				>
					<Card body className="bg-info text-white ">
						<CardTitle>{item.name}</CardTitle>
						<article>
							<p>{item.description}</p>
							<p>
								<Button
									className="text-center"
									onClick={() =>
										this.props.mapIndexCallback(item.mapID)
									}
								>
									Open
								</Button>
							</p>
						</article>
					</Card>
				</Col>
			);
		});
		return <Row> {MapCards} </Row>;
	}
}

export default OpenMap;
