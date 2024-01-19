import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.empProject,
    (empProject) => empProject.loading
);

export const empProjectSelector = createSelector(
    (state: IRootState) => state.empProject,
    (empProject) => empProject?.data
);

export const empProjectError = createSelector(
    (state: IRootState) => state.empProject,
    (empProject) => empProject.msg
);