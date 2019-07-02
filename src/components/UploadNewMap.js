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
    this.uploadNewBlankMapForRelData = this.uploadNewBlankMapForRelData.bind(
      this
    );
    this.state = {
      mapIndeces: [{ name: "Freddy", age: 27 }, { name: "Jimmy", age: 25 }],
      mapName: "",
      mapDescription: "",
      relDataMapHash: "",
      projectHash: "",
      projectName: "",
      projectCompletedResetDate: "",
      projectDescription: "",
      projectMapSet: []
    };
  }

  handleSubmit(e) {
    this.props.callback(this.state);
    e.preventDefault();

    //console.log("handled:", this.mapName.value)
  }

  handleRelDataMapHashChange = event => {
    this.setState({ relDataMapHash: event.target.value });
  };

  handleProjectHashChange = event => {
    this.setState({ projectHash: event.target.value });
  };

  uploadNewMap(e) {
    e.preventDefault();
    console.log("relPathToPush:", this.state.relDataMapHash);
    const config = { relDataMapHash: this.state.relDataMapHash };
    db.ref(this.props.mapPath)
      .push({ Geo: this.props.geo, config: config })
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
          "Pushing to mapIndex:",
          key,
          this.state.mapName,
          this.state.mapDescription
        );
        return key;
      })
      .then(key => {
        const refPath = `App/Projects/${this.state.projectHash}/mapSet`;
        const refChild = db.ref(refPath).child(key);
        refChild.set(this.state.mapDescription);
        //db.ref(`App/projects/${this.state.projectHash}/mapSet`).push(key);
        console.log("Pushing to project:", this.state.projectHash);
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
      completedResetDate: this.state.projectCompletedResetDate // todo format ??!!
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
    this.setState({ projectHash: newRef.key });
    this.uploadNewBlankMapForRelData(newRef.key);
  }

  uploadNewBlankMapForRelData(relDataMapHash) {
    const myOb = {
      config: {
        relDataMapHash: ""
      }
    };
    const newRef = db.ref("App/Maps/").push(myOb);
    console.log("newRefKey:", newRef.key);

    console.log("rel setting:", `App/Maps/${newRef.key}/config/relDataMapHash`);
    db.ref(`App/Maps/${newRef.key}/config/relDataMapHash`).set(newRef.key);
    this.setState ({relDataMapHash:newRef.key})
  }

  render() {
    return (
      <div>
        <h4>Upload the current data as new map on database </h4>
        <p>
        Upload the map to an existing project (copy and paste map hash and relDataMap hash).</p>
        <p>Or add to a new map - by creating a new project (below), which populates mapHash and relDataMap hass with
        newly created entries.
        </p>
        <Form>
          <FormGroup>
            <Label for="mapName">Map name</Label>
            <Input
              type="text"
              name="mapName"
              id="mapName"
              placeholder="eg Cranford"
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
              placeholder="eg Cranford ward"
              ref="mapDescription"
              onChange={e => {
                this.setState({
                  mapDescription: e.target.value
                });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="relDataMapHash">
              Related Data Map Hash (firebase ID)
            </Label>
            <Input
              placeholder="eg -KTSvfg56tE8"
              id="relDataMapHash"
              value={this.state.relDataMapHash}
              onChange={this.handleRelDataMapHashChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="projectHash">Project hash (firebase ID)</Label>
            <Input
              placeholder="eg -L3TSvfrg6754e"
              id="projectHash"
              value={this.state.projectHash}
              onChange={this.handleProjectHashChange}
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
        <hr />
        <h3>Create new project</h3>
        <p>
        Create a project name, description and set a reset Date (for any related data)
        then upload maps against that project
        </p>
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
              value={this.state.projectCompletedResetDate}
              onChange={e => {
                this.setState({ projectCompletedResetDate: e.target.value });
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
