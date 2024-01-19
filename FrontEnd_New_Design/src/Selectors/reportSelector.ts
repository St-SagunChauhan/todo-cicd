import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isReportLoadingSelector = createSelector(
  (state: IRootState) => state.report,
  (report) => report.loading
);

export const reportSelector = createSelector(
  (state: IRootState) => state.report,
  (report) => report?.data
);

export const reportError = createSelector(
  (state: IRootState) => state.report,
  (report) => report.msg
);
