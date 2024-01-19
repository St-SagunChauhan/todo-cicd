import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.connect,
    (connect) => connect.loading
);

export const connectSelector = createSelector(
    (state: IRootState) => state.connect,
    (connect) => connect?.data
);

export const connectError = createSelector(
    (state: IRootState) => state.connect,
    (connect) => connect.msg
);