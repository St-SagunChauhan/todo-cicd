import IRootState from 'models/IRootState';
import { createSelector } from 'reselect';

// types

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.empProject,
  (empProject) => empProject.data,
);

export const empProjectSelector = createSelector(
  (state: IRootState) => state.empProject,
  (empProject) => empProject.data,
);

export const empProjectError = createSelector(
  (state: IRootState) => state.empProject,
  (empProject) => empProject.msg,
);
