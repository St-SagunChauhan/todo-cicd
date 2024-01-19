import IRootState from 'models/IRootState';
import { createSelector } from 'reselect';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.projectBilling,
  (projectBilling) => projectBilling.loading,
);

export const projectBillingSelector = createSelector(
  (state: IRootState) => state.projectBilling,
  (projectBilling) => projectBilling.data,
);

export const projectBillingError = createSelector(
  (state: IRootState) => state.projectBilling,
  (projectBilling) => projectBilling.msg,
);
