import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.weeklyProject,
  (weeklyProject) => weeklyProject.loading,
);

export const weeklyProjectSelector = createSelector(
  (state: IRootState) => state.weeklyProject,
  (weeklyProject) => weeklyProject.data,
);

export const weeklyProjectError = createSelector(
  (state: IRootState) => state.weeklyProject,
  (weeklyProject) => weeklyProject.msg,
);
