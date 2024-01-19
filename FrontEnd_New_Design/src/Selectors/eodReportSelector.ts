import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.eodReport,
    (eodReport) => eodReport.loading
);

export const eodReportSelector = createSelector(
    (state: IRootState) => state.eodReport,
    (eodReport) => eodReport?.data
);

export const eodReportError = createSelector(
    (state: IRootState) => state.eodReport,
    (eodReport) => eodReport.msg
);