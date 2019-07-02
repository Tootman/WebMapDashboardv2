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
    this.createNewProject = this.createNewProject.bind(this);
    this.appendMapKeyandDescrToProjectMapSet = this.appendMapKeyandDescrToProjectMapSet.bind(
      this
    );
    this.state = {
      mapIndeces: [{ name: "Freddy", age: 27 }, { name: "Jimmy", age: 25 }],
      mapName: "",
      mapDescription: "",
      projectName: "",
      completedResetDate: "",
      projectDescription: "",
      mapSet: [],
      projectId: ""
    };
  }

  handleSubmit(e) {
    this.props.callback(this.state);
    e.preventDefault();

    //console.log("handled:", this.mapName.value)
  }

  appendMapKeyandDescrToProjectMapSet(mapListItem) {
    console.log("appendMapKeyandDescrToProjectMapSet called!", mapListItem);
  }

  uploadNewMap(e) {
    //console.log("uploadNewMap in MapAdmin called!", uploadNewMapState);
    //debugger
    e.preventDefault();

    db.ref(this.props.mapPath)
      .push({ Geo: this.props.geo })
      .then(snap => {
        //console.log("new key " + snap.key);
        return snap.key;
      })
      .then(key => {
        db.ref(this.props.mapIndexPath).push({
          mapID: key,
          name: this.state.mapName,
          description: this.state.mapDescription
        });
        console.log(
          "Pushing:",
          key,
          this.state.mapName,
          this.state.mapDescription
        );
        return key;
      })
      .then(mapKey => {
        console.log("mapkey:", mapKey);
        const mapListItem = {
          mapKey,
          mapDescription: this.state.mapDescription
        };
        this.appendMapKeyandDescrToProjectMapSet(mapListItem);
      })
      .catch(e => {
        console.log("Errrror:", e);
      });
  }

  createNewProject() {
    console.log("createNewProject called!");
    // Project object factory
    const projectOb = {
      name: this.state.projectName,
      description: this.state.projectDescription,
      completedResetDate: this.state.completedResetDate // todo format ??!!
      // dont set mapSet here - instead create node onUploadNewMap if none exists
    };
    // push new project and retrive key
    /*
    const myVar1 = db
      .ref("App/Projects/")
      .push({ prop2: "propval2" })
      .then(snap => {
        console.log("key:", snap.key);
        return "Hello!";
      });
    console.log("myVar1:", myVar1.PromiseValue);
  */

    const newRef = db.ref("App/Projects/").push(projectOb);
    console.log("newRefKey:", newRef.key);
    this.setState({ projectId: this.state.projectId });
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
            Upload map
          </Button>
        </Form>
        <hr />
        <h3>Create new project</h3>
        <Form>
          <FormGroup>
            <Label>Project name</Label>
            <Input
              type="text"
              name="projectName"
              id="projectNameEl"
              placeholder="Project name"
              value={this.state.projectName}
              onChange={e => {
                this.setState({ projectName: e.target.value });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Project description</Label>
            <Input
              type="text"
              name="projectdescription"
              id="projectDescriptionEl"
              placeholder="Project desciption"
              value={this.state.projectDescription}
              onChange={e => {
                this.setState({ projectDescription: e.target.value });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Project completion reset date</Label>
            <Input
              type="text"
              name="completedResetDate"
              id="completedResetDateEl"
              placeholder="10 July 2018"
              value={this.state.completedResetDate}
              onChange={e => {
                this.setState({ completedResetDate: e.target.value });
              }}
            />
          </FormGroup>
          <p>
            <Button color="success" onClick={this.createNewProject}>
              Create new project
            </Button>
          </p>
        </Form>
      </div>
    );
  }
}

export default UploadNewMap;
