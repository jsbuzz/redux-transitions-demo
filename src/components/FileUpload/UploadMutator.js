import React from "react";
import { useDispatch } from "react-redux";
import { useTransitions } from "redux-transitions";
import {
  UPLOAD_CHUNK,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
} from "../../redux/actions";
import { uploadFile } from "../../redux/thunks/uploadFile";

export const PENDING_STATE = "pending";
export const SUCCESS_STATE = "success";
export const FAILURE_STATE = "failure";

export const uploadStates = {
  [PENDING_STATE]: [uploadFile, UPLOAD_CHUNK],
  [SUCCESS_STATE]: UPLOAD_SUCCESS,
  [FAILURE_STATE]: UPLOAD_FAILURE,
};

export const uploadReducer = (
  state = SUCCESS_STATE,
  { error, percentage } = {}
) => ({
  isUploading: state === PENDING_STATE,
  uploadError: state === FAILURE_STATE && error,
  uploadPercentage: percentage || 0,
});

// this component only relies on Transition state
// @transitionState
// @dispatcher
export const UploadMutator = () => {
  const dispatch = useDispatch();

  const { isUploading, uploadPercentage, uploadError } = useTransitions(
    uploadStates,
    uploadReducer
  );

  return (
    <>
      <button disabled={isUploading} onClick={() => dispatch(uploadFile())}>
        {isUploading ? "uploading..." : uploadError ? "retry" : "upload"}
      </button>
      {isUploading && (
        <progress id="file" max="100" value={uploadPercentage}>
          {uploadPercentage}% done
        </progress>
      )}
      {uploadError && (
        <span className="upload-error">
          Error while uploading: {uploadError}
        </span>
      )}
    </>
  );
};
