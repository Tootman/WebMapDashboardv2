import React from "react";
import { MapAdminTest as MapAdmin } from "./MapAdmin";
import withAuthorization from "./Session/withAuthorization";
import TableView from "./TableView";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
//import renderer from "react-test-renderer";
configure({ adapter: new Adapter() });

const wrapper = shallow(<TableView />);
//console.log("Wrapper:", wrapper);
const instance = wrapper.instance();
//console.log("instance:", instance);
describe("double the number TableView", () => {
  it("should output 6", () => {
    expect(instance.testMethod(3)).toBe(6);
  });
});

//withAuthorization.get.mockResolvedValue("");

const tmaWrapper = shallow(<MapAdmin />);
//console.log("tmaWrapper:", tmaWrapper);
const tmaInstance = tmaWrapper.instance();
//console.log("tmaInstance:", tmaInstance);
describe("double the number", () => {
  it("should output 6", () => {
    expect(tmaInstance.testMethod(3)).toBe(6);
  });
});
