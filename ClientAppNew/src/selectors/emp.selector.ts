import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.emp,
  (emp) => emp.loading,
);

export const empSelector = createSelector(
  (state: IRootState) => state.emp,
  (emp) => emp.data,
);

export const empError = createSelector(
  (state: IRootState) => state.emp,
  (emp) => emp.msg,
);
