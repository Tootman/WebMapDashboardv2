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
      mapIndeces: [{ name: "Freddy", age: 27 }, { name: "Jimmy", age: 25 }],
      mapName: "",
      mapDescription: "",
      relDataMapHash: "",
      projectHash: ""
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
      </div>
    );
  }
}

export default UploadNewMap;
