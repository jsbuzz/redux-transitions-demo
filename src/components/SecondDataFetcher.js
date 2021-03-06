import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePendingState } from "redux-transitions";
import { FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS } from "../redux/actions";
import { fetchData } from "../redux/thunks/fetchData";

const dataSelector = (store) => store.data.data;

export const SecondDataFetcher = () => {
  const dispatch = useDispatch();
  const fetchMessage = "click to fetch data";
  const data = useSelector(dataSelector) || fetchMessage;
  const [isFetching, fetchError] = usePendingState({
    pending: fetchData,
    success: FETCH_DATA_SUCCESS,
    failure: FETCH_DATA_FAILURE,
  });

  return (
    <div className="data-fetcher">
      <pre>
        {`
        const data = useSelector(dataSelector) || fetchMessage;
        const [isFetching, fetchError] = usePendingState({
          fetch: fetchData,
          success: FETCH_DATA_SUCCESS,
          failure: FETCH_DATA_FAILURE,
        });
        {(isFetching && "fetching...") || fetchError?.error || data}
      `}
      </pre>
      <button disabled={isFetching} onClick={() => dispatch(fetchData(500))}>
        Fetch
      </button>
      {(isFetching && "fetching...") || fetchError?.error || data}
    </div>
  );
};
