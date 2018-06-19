import React from "react";
import AuthUserContext from "./Session/AuthUserContext";
import withAuthorization from "./Session/withAuthorization";

class Djspage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			myData : "",
			myProp : "props.myProp"
		}

	}

	
	onDataChange = e => {
		this.setState({ [e.target.name]: e.target.value });
		console.log("onChange Input called!");
	};

	render() {
		return (
			<div>
				<h1>Dan page</h1>
				<p>Dans custom page</p>
				<p>Props from main page: {this.props.myProp} </p>
				<AuthUserContext.Consumer>
					{context => (
						<div>
							<hr />
							<h3> Stuff inside Context.Consuber </h3>
							<p>m inside the consumer!{context.myVar}</p>
							<p>Another element {context.age} </p>
							<input
								type="text"
								name="myData"
								// value= {this.state.myData}
								onChange={e => this.onDataChange(e)}
							/>
							<button
								value={{ name: "freddy" }}
								//onClick={e => context.sendForm(e)}
								onClick={e => context.onSendForm(e)}
								submit
							>
								{" "}
								Submit data
							</button>
						</div>
					)}
				</AuthUserContext.Consumer>
				<hr />
			</div>
		);
	}
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(Djspage);
