import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.masterReport,
  (masterReport) => masterReport.loading,
);

export const masterReportSelector = createSelector(
  (state: IRootState) => state.masterReport,
  (masterReport) => masterReport.data,
);

export const masterReportError = createSelector(
  (state: IRootState) => state.masterReport,
  (masterReport) => masterReport.msg,
);
