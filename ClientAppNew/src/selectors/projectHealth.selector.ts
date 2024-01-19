import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.projectHealth,
  (projectHealth) => projectHealth.loading,
);

export const projectHealthSelector = createSelector(
  (state: IRootState) => state.projectHealth,
  (projectHealth) => projectHealth.data,
);

export const projectHealthError = createSelector(
  (state: IRootState) => state.projectHealth,
  (projectHealth) => projectHealth.msg,
);
