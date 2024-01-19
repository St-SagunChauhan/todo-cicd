import IRootState from 'models/IRootState';
import { createSelector } from 'reselect';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.eodReport,
  (eodReport) => eodReport.loading,
);

export const eodReportSelector = createSelector(
  (state: IRootState) => state.eodReport,
  (eodReport) => eodReport.data,
);

export const eodReportError = createSelector(
  (state: IRootState) => state.eodReport,
  (eodReport) => eodReport.msg,
);
