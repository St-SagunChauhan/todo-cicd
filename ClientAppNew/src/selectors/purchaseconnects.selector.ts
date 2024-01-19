import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.purchaseConnects,
  (purchaseConnects) => purchaseConnects.loading,
);

export const purchaseReportSelector = createSelector(
  (state: IRootState) => state.purchaseConnects,
  (purchaseConnects) => purchaseConnects?.data,
);

export const purchaseReportError = createSelector(
  (state: IRootState) => state.purchaseConnects,
  (purchaseConnects) => purchaseConnects.msg,
);
