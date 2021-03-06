import React from "react";
import { shallow } from "enzyme";
import {
  UploadMutator,
  uploadStates,
  uploadReducer,
  SUCCESS_STATE,
} from "./UploadMutator";
import * as reduxTransitions from "redux-transitions";
import * as reactRedux from "react-redux";
import { uploadChunk, uploadError, addUploadedFile } from "../../redux/actions";
import { uploadFile } from "../../redux/thunks/uploadFile";

const mockUploadTransition = reduxTransitions.mockTransition(
  uploadStates,
  uploadReducer
);

describe("uploadReducer", () => {
  it("SUCCESS_STATE and empty state should be equal", () => {
    expect(uploadReducer()).toEqual(
      uploadReducer(
        SUCCESS_STATE,
        addUploadedFile({ fileName: "test", fileSize: 99 })
      )
    );
  });
});

describe("UploadMutator", () => {
  let dispatched;
  let wrapper;
  let useTransitionsStub;

  beforeEach(() => {
    dispatched = [];
    jest
      .spyOn(reactRedux, "useDispatch")
      .mockReturnValue((action) => dispatched.push(action));
    useTransitionsStub = jest.spyOn(reduxTransitions, "useTransitions");
  });

  describe("Base transition state", () => {
    beforeEach(() => {
      useTransitionsStub.mockReturnValue({});
      wrapper = shallow(<UploadMutator />);
    });

    it("should match snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should NOT have progress bar", () => {
      expect(wrapper.find("progress").length).toEqual(0);
    });

    it("should have the CTA say 'upload'", () => {
      expect(wrapper.find("button").text()).toContain("upload");
    });

    describe("Clicking the button", () => {
      beforeEach(() => {
        wrapper.find("button").simulate("click");
      });

      it("should dispatch uploadFile", () => {
        expect(dispatched[0].toString()).toEqual(uploadFile().toString());
      });
    });
  });

  describe("Pending transition state with `uploadFile`", () => {
    beforeEach(() => {
      useTransitionsStub.mockReturnValue(mockUploadTransition(uploadFile));
      wrapper = shallow(<UploadMutator />);
    });

    it("should match snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should have a progress bar with correct value", () => {
      expect(wrapper.find("progress").prop("value")).toEqual(0);
    });

    it("should have the CTA say 'uploading'", () => {
      expect(wrapper.find("button").text()).toContain("uploading");
    });

    it("should have the CTA disabled", () => {
      expect(wrapper.find("button").prop("disabled")).toEqual(true);
    });
  });

  describe("Pending transition state with Chunk", () => {
    const chunk = 37;
    beforeEach(() => {
      useTransitionsStub.mockReturnValue(
        mockUploadTransition(uploadChunk(chunk))
      );
      wrapper = shallow(<UploadMutator />);
    });

    it("should match snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should have a progress bar with correct value", () => {
      expect(wrapper.find("progress").prop("value")).toEqual(chunk);
    });

    it("should have the CTA say 'uploading'", () => {
      expect(wrapper.find("button").text()).toContain("uploading");
    });

    it("should have the CTA disabled", () => {
      expect(wrapper.find("button").prop("disabled")).toEqual(true);
    });
  });

  describe("Error transition state", () => {
    const error = "something went wrong";

    beforeEach(() => {
      useTransitionsStub.mockReturnValue(
        mockUploadTransition(uploadError(error))
      );
      wrapper = shallow(<UploadMutator />);
    });

    it("should match snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should NOT have progress bar", () => {
      expect(wrapper.find("progress").length).toEqual(0);
    });

    it("should have the CTA say 'retry'", () => {
      expect(wrapper.find("button").text()).toContain("retry");
    });

    describe("Clicking the button", () => {
      beforeEach(() => {
        wrapper.find("button").simulate("click");
      });

      it("should dispatch uploadFile", () => {
        expect(dispatched[0].toString()).toEqual(uploadFile().toString());
      });
    });
  });
});
