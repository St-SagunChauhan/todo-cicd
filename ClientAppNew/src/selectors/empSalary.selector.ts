import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.empSalary,
  (empSalary) => empSalary.loading,
);

export const empSalarySelector = createSelector(
  (state: IRootState) => state.empSalary,
  (empSalary) => empSalary.data,
);

export const empSalaryError = createSelector(
  (state: IRootState) => state.empSalary,
  (empSalary) => empSalary.msg,
);
