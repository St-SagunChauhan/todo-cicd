import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.bidReports,
    (bidReports) => bidReports.loading
);

export const bidReportsSelector = createSelector(
    (state: IRootState) => state.bidReports,
    (bidReports) => bidReports.data
);

export const bidReportsError = createSelector(
    (state: IRootState) => state.bidReports,
    (bidReports) => bidReports.msg
);