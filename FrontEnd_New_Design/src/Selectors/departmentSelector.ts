import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.dept,
    (dept) => dept
);

export const deptSelector = createSelector(
    (state: IRootState) => state.dept,
    (dept) => dept?.data
);

export const departmentError = createSelector(
    (state: IRootState) => state.dept,
    (dept) => dept.msg
);