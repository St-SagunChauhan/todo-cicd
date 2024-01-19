import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingWeeklyBilling = createSelector(
  (state: IRootState) => state.weeklyBilling,
  (weeklyBilling) => weeklyBilling.loading,
);

export const weeklyBillingSelector = createSelector(
  (state: IRootState) => state.weeklyBilling,
  (weeklyBilling) => weeklyBilling.data,
);

export const weeklyBillingError = createSelector(
  (state: IRootState) => state.weeklyBilling,
  (weeklyBilling) => weeklyBilling.msg,
);
