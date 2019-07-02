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
    //this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRowClick2 = this.handleRowClick2.bind(this);
    this.selectAllRows = this.selectAllRows.bind(this);
    this.selectNoRows = this.selectNoRows.bind(this);
    this.locateFeatureOnMap = this.locateFeatureOnMap.bind(this);
    //this.cancelled = false
    //this.handleFilterUpdate = this.handleFilterUpdate.bind(this)
    //this.reactFilteredTable = this.reactFilteredTable.bind(this);
    //const p = this.props.data[0].properties;

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

  //var keys = {};
  //window.onkeyup = function(e) { keys[e.keyCode] = false; }

  componentWillMount() {
    //console.log("hello from cwm")
    //document.addEventListener("keydown", this._handleKeyDown.bind(this));
    //this.assignRelatedDataToTableData();

    this.setState({
      //newpropertiesList
      //myProps
    });
  }

  /*
    _handleKeyDown = (event) => {
       this.cancelled=true
       console.log("keyDown!")
    }
    */

  /*
	assignRelatedDataToTableData() {
		// fetch latest relatedDataSet for map
		getRelatedData("myKey");
		const myProps = this.state.tableData;
		myProps[0].properties.newPropKey = "myNewPropVal-1";
		myProps[1].properties.newPropKey = "myNewPropVal-2";
	}
	*/

  /*
	componentDidUpdate(){
		console.log("tableInstance (from cdUpdate):", this.tableInstance.getWrappedInstance().getResolvedState().sortedData);
	}
	*/

  componentWillReceiveProps() {
    console.log("receive Props!", Date());
    let p = this.props.data[0].properties; // base the headings on fields in the  1st record

    const col1 = Object.keys(p).find(
      e =>
        e === "name" ||
        e === "Name" ||
        e === "NAME" ||
        e === "Asset" ||
        e === "ASSET" ||
        e === "OBJECTID"
    );
    const col2 = Object.keys(p).find(
      e => e === "description" || e === "DESCRIPTIO"
    );

    const newPropKey = this.state.tableData[0].myNewProp;
    this.setState({
      col1: col1,
      col2: col2,
      tableData: this.props.data
    });
  }

  /*
	handleRowClick(e, handleOriginal, rowInfo, state, instance) {
		//console.log("instance (RowClick):", instance.getResolvedState().sortedData);
		this.props.rowCallback(rowInfo, handleOriginal);
	}
	*/

  testMethod(x) {
    return x* 2;
  }


  handleRowClick2(row) {
    //console.log("instance (RowClick):", instance.getResolvedState().sortedData);
    this.props.rowCallback2(row);
  }

  /*
	myCallback (){
		console.log("callback called!")
		this.cancelled = true
		this.handleFilterUpdate()
		console.log("CallbackDone!")
	}
	*/

  handleFilterUpdate() {
    console.log(
      "tableInstance:",
      this.tableInstance.getWrappedInstance().getResolvedState().sortedData
    );
    this.setState({
      selectedRows: this.tableInstance.getWrappedInstance().getResolvedState()
        .sortedData
    });

    //console.log("start")
    //this.cancelled= false
    //console.log("cancelled:" , this.cancelled)
    /*
	for (let i = 0; i<100000000; i++){
			//console.log(this.cancelled)
			if (this.cancelled == true) {
				console.log("interupted and break!")
				break}
			}
	*/
    //this.cancelled = false
    //console.log("finish", "cancelled:", this.cancelled)
  }

  /*
	handleRowExpanded(newExpanded, index, event) {

		this.setState({
			// we override newExpanded, keeping only current selected row expanded
			expanded: { [index]: !this.state.expanded[index] }
		});
		this.props.activeFeatureLocationCallback(
			index,
			!this.state.expanded[index]
		);
	}
	*/

  showRelated(value) {
    console.log("showRelated clicked!", value);
  }

  selectAllRows() {
    /*
		const selectedRows = this.state.selectedRows
		selectedRows.map(row => {
			//this.state.tableData[row._index].properties.highlightOnMap = true
			const key = this.state.tableData[row._index].properties
			key.highlightOnMap = true
			this.setState({key})
			//row.properties.highlightOnMap = true
		})
		console.log("select AllRows!",)

		  //this.setState({ state: this.state });
		*/
    //console.log("selectAllRows Button!")

    this.props.selectAllRowsCallback(this.state.selectedRows);
  }

  selectNoRows() {
    //const selectedRows = this.state.selectedRows
    /*
		this.state.tableData.map(row => {
			row.properties.highlightOnMap = false
			//row.properties.highlightOnMap = true
		})
		*/
    this.props.selectNoRowsCallback();
    //console.log("select AllRows!",)
  }

  locateFeatureOnMap(featureIndex) {
    //console.log("locateONMap!",e)
    this.props.zoomToFeatureCallback(featureIndex);
  }

  render() {
    return (
      <div>
        <Button onClick={this.selectAllRows}>Select All</Button>
        <Button onClick={this.selectNoRows}>Clear all</Button>
        <TreeTable
          data={this.state.tableData}
          minRows={1}
          showPaginationTop={true}
          showPaginationBottom={false}
          ref={instance => (this.tableInstance = instance)}
          /*
				onExpandedChange={
					(newExpanded, index, event) =>{
						console.log("expandedChanged!")
						console.log("event:",event )
					}
				} */

          onFilteredChange={() => {
            //const { page } = this.tableInstance.getResolvedState()
            // page is the current pageIndex
            //console.log("filteredChanged!", this.tableInstance.getWrappedInstance().getResolvedState().sortedData)
            this.handleFilterUpdate();
            //this.myCallback()
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
              Header: "Condition",
              id: "condition",
              accessor: "properties.condition",
              maxWidth: 100
            },
            {
              Header: "",
              id: "highlightOnMap",
              accessor: "properties.highlightOnMap",
              show: false
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
