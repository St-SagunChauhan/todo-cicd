import IRootState from 'models/IRootState';
import { createSelector } from 'reselect';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.projectDept,
  (projectDept) => projectDept.loading,
);

export const projectDeptSelector = createSelector(
  (state: IRootState) => state.projectDept,
  (projectDept) => projectDept.data,
);

export const projectDeptError = createSelector(
  (state: IRootState) => state.projectDept,
  (projectDept) => projectDept.msg,
);
