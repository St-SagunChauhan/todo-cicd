import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.leave,
    (leave) => leave.loading
);

export const leaveSelector = createSelector(
    (state: IRootState) => state.leave,
    (leave) => leave?.data
);

export const leaveError = createSelector(
    (state: IRootState) => state.leave,
    (leave) => leave.msg
);