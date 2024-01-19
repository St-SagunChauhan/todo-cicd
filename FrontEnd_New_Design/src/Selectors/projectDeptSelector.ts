import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.projectDept,
    (projectDept) => projectDept.loading
);

export const projectDeptSelector = createSelector(
    (state: IRootState) => state.projectDept,
    (projectDept) => projectDept?.data
);

export const projectDeptError = createSelector(
    (state: IRootState) => state.projectDept,
    (projectDept) => projectDept.msg
);