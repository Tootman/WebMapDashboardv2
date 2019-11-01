import React from "react";
import ReactJson from "react-json-view";

import "./index.css";
import testGeoJson from "./testGeoJson";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./table-view.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { getRelatedData } from "../firebase/firebase";
import ImageLoader from "react-load-image";
import { Button, Row } from "reactstrap";

const TreeTable = treeTableHOC(ReactTable);

const Photo = props => {
  return (
    <div>
      <ImageLoader src={props.url}>
        <img style={{ width: "100%" }} />
      </ImageLoader>
      The logged in user is {props.url}
    </div>
  );
};

// NOTES - geoJson set in constructor only - so won't add new related data in realtime

class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowClick2 = this.handleRowClick2.bind(this);
    this.selectAllRows = this.selectAllRows.bind(this);
    this.selectNoRows = this.selectNoRows.bind(this);
    this.locateFeatureOnMap = this.locateFeatureOnMap.bind(this);
    this.state = {
      col1: "default",
      col2: "default",
      col3: "default",
      activeRowCoords: [],
      expanded: {},
      activeRow: null,
      selectedStyle: { backgroundColor: "khaki" },
      unSelectedStyle: { backgroundColor: "gainsboro" },
      tableData: this.props.data,
      selectedRows: []
    };
  }

  componentWillMount() {
    this.setState({});
  }

  componentWillReceiveProps() {
    console.log("receive Props!", Date());
    let p = this.props.data[0].properties; // base the headings on fields in the  1st record

    const col1 = Object.keys(p).find(
      e =>
        e === "name" ||
        e === "Name" ||
        e === "NAME" ||
        e === "Asset" ||
        e === "ASSET"
    );

    const col2 = Object.keys(p).find(
      e => e === "description" || e === "Descriptio" || e === "DESCRIPTIO"
      //e => e === "comments"
    );

    const col4 = Object.keys(p).find(
      e => e === "comments"
      //e => e === "comments"
    );

    // how does this work ?
    const newPropKey = this.state.tableData[0].myNewProp;
    this.setState({
      col1: col1,
      col2: col2,
      col4: col4,
      tableData: this.props.data
    });
  }

  testMethod(x) {
    return x * 2;
  }

  handleRowClick2(row) {
    this.props.rowCallback2(row);
  }

  handleFilterUpdate() {
    console.log(
      "tableInstance:",
      this.tableInstance.getWrappedInstance().getResolvedState().sortedData
    );
    this.setState({
      selectedRows: this.tableInstance.getWrappedInstance().getResolvedState()
        .sortedData
    });
  }

  showRelated(value) {
    console.log("showRelated clicked!", value);
  }

  selectAllRows() {
    this.props.selectAllRowsCallback(this.state.selectedRows);
  }

  selectNoRows() {
    this.props.selectNoRowsCallback();
  }

  locateFeatureOnMap(featureIndex) {
    this.props.zoomToFeatureCallback(featureIndex);
  }

  render() {
    return (
      <div>
        <Button onClick={this.selectAllRows}>Update map</Button>
        <Button onClick={this.selectNoRows}>Clear map</Button>
        <TreeTable
          data={this.state.tableData}
          minRows={1}
          showPaginationTop={true}
          showPaginationBottom={false}
          ref={instance => (this.tableInstance = instance)}
          onFilteredChange={() => {
            this.handleFilterUpdate();
          }}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              style:
                rowInfo && this.state.tableData[rowInfo.index]
                  ? this.state.tableData[rowInfo.index].properties
                      .highlightOnMap
                    ? this.state.selectedStyle
                    : this.state.unSelectedStyle
                  : this.state.unSelectedStyle
            };
          }}
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
              {
                Header: "Value",
                accessor: "value"
              }
            ];

            const rowData = Object.keys(row.original.properties).map(key => {
              return {
                property: key,
                value: row.original.properties[key].toString()
              };
            });

            let photoUrl =
              row.original.properties["photo"] ||
              "http://placekitten.com/300/150";

            return (
              <div>
                <Row>
                  <Button
                    color="primary"
                    size="sm"
                    className="col-sm-3"
                    onClick={e => {
                      this.locateFeatureOnMap(row.index);
                    }}
                  >
                    Fly to
                  </Button>
                  <Button
                    color="info"
                    size="sm"
                    className="col-sm-3 offset-sm-1"
                    onClick={e => {
                      this.handleRowClick2(row);
                    }}
                  >
                    Show / Hide
                  </Button>
                </Row>
                <Photo url={photoUrl} />
                <ReactTable data={rowData} columns={columns} minRows={1} />
              </div>
            );
          }}
          columns={[
            {
              Header: this.state.col1,
              accessor: "properties." + this.state.col1
            },
            {
              Header: this.state.col2,
              accessor: "properties." + this.state.col2,
              maxWidth: 100
            },
            {
              Header: "Original Condition",
              id: "condition",
              accessor: "properties.Condition",
              maxWidth: 100
            },
            {
              Header: "",
              id: "highlightOnMap",
              accessor: "properties.highlightOnMap",
              show: false
            },
            {
              Header: "Latest condition",
              id: "updatedCondition",
              accessor: "properties.condition",
              show: true
            },
            {
              Header: "Latest comment",
              id: "latestComment",
              accessor: "properties.comments",
              show: true
            }
          ]}
          defaultPageSize="5"
          className="-striped -highlight"
          collapseOnDataChange={false}
          filterable
          showPageJump={false}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            return String(row[id])
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          }}
        />
      </div>
    );
  }
}

export default TableView;
